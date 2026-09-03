import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/common/Header';
import { NetworkBanner } from './components/common/NetworkBanner';
import { TestPanelModal } from './components/common/TestPanelModal';
import { DashboardPage } from './pages/DashboardPage';
import { SurveyBuilderPage } from './pages/SurveyBuilderPage';
import { SurveyPreviewPage } from './pages/SurveyPreviewPage';
import { PublicSurveyPage } from './pages/PublicSurveyPage';
import { ResponsesPage } from './pages/ResponsesPage';
import { useSync } from './hooks/useSync';
import { syncManager } from './services/sync/syncManager';
import { seedInitialDataIfNeeded } from './db/database';

type ViewMode = 'dashboard' | 'builder' | 'preview' | 'public_survey' | 'responses';

export const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [activeSurveyId, setActiveSurveyId] = useState<string | undefined>();
  const [filterSurveyId, setFilterSurveyId] = useState<string | undefined>();
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);

  const { stats, syncNow, reload: reloadSyncStats } = useSync();

  // Khởi động: Kích hoạt đồng bộ các phản hồi chưa gửi khi mở App (App Startup)
  useEffect(() => {
    seedInitialDataIfNeeded();
    syncManager.syncPendingResponses();
  }, []);

  // Xử lý Hash Routing để hỗ trợ link trực tiếp (ví dụ: #/s/:surveyId hoặc #/responses)
  const parseRouteFromHash = useCallback(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/s/')) {
      const id = hash.replace('#/s/', '');
      if (id) {
        setActiveSurveyId(id);
        setView('public_survey');
        return;
      }
    }
    if (hash === '#/responses') {
      setView('responses');
      return;
    }
    if (hash === '#/new') {
      setActiveSurveyId(undefined);
      setView('builder');
      return;
    }
    if (hash === '#/surveys' || hash === '' || hash === '#/') {
      setView('dashboard');
      return;
    }
  }, []);

  useEffect(() => {
    parseRouteFromHash();
    window.addEventListener('hashchange', parseRouteFromHash);
    return () => window.removeEventListener('hashchange', parseRouteFromHash);
  }, [parseRouteFromHash]);

  // Điều hướng chuyển trang
  const navigateTo = (newView: ViewMode, surveyId?: string) => {
    setActiveSurveyId(surveyId);
    setView(newView);

    if (newView === 'public_survey' && surveyId) {
      window.location.hash = `#/s/${surveyId}`;
    } else if (newView === 'responses') {
      window.location.hash = '#/responses';
    } else if (newView === 'builder') {
      window.location.hash = '#/new';
    } else {
      window.location.hash = '#/surveys';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeaderTab = (tab: 'surveys' | 'responses' | 'new') => {
    if (tab === 'surveys') navigateTo('dashboard');
    else if (tab === 'responses') navigateTo('responses');
    else if (tab === 'new') navigateTo('builder');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Ẩn Header tiêu chuẩn nếu đang trong chế độ làm khảo sát công khai (để tối ưu không gian mobile) */}
      {view !== 'public_survey' && (
        <Header
          activeTab={view === 'dashboard' ? 'surveys' : view === 'responses' ? 'responses' : 'new'}
          onSelectTab={handleHeaderTab}
          onOpenTestModal={() => setIsTestModalOpen(true)}
        />
      )}

      {/* Banner thông báo trạng thái mạng và hàng đợi Pending */}
      <NetworkBanner
        pendingCount={stats.pending}
        onSyncNow={syncNow}
      />

      {/* Nội dung View chính */}
      <div className="flex-1">
        {view === 'dashboard' && (
          <DashboardPage
            onCreateNew={() => navigateTo('builder')}
            onEditSurvey={(id) => navigateTo('builder', id)}
            onPreviewSurvey={(id) => navigateTo('preview', id)}
            onOpenPublicSurvey={(id) => navigateTo('public_survey', id)}
            onViewResponses={(surveyId) => {
              setFilterSurveyId(surveyId);
              navigateTo('responses');
            }}
          />
        )}

        {view === 'builder' && (
          <SurveyBuilderPage
            surveyId={activeSurveyId}
            onBack={() => navigateTo('dashboard')}
            onPreview={(id) => navigateTo('preview', id)}
            onSaved={(id) => setActiveSurveyId(id)}
          />
        )}

        {view === 'preview' && activeSurveyId && (
          <SurveyPreviewPage
            surveyId={activeSurveyId}
            onBack={() => navigateTo('dashboard')}
            onOpenLive={() => navigateTo('public_survey', activeSurveyId)}
          />
        )}

        {view === 'public_survey' && activeSurveyId && (
          <PublicSurveyPage
            surveyId={activeSurveyId}
            onBack={() => navigateTo('dashboard')}
            onGoToResponses={() => navigateTo('responses')}
          />
        )}

        {view === 'responses' && (
          <ResponsesPage
            filterSurveyId={filterSurveyId}
            onClearFilterSurveyId={() => setFilterSurveyId(undefined)}
          />
        )}
      </div>

      {/* Modal Bảng Kiểm Thử Offline & Sync */}
      <TestPanelModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onRefreshData={reloadSyncStats}
      />
    </div>
  );
};

export default App;

