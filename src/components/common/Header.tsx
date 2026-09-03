import React from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import { WifiOff, RefreshCw, Plus, FileText, CheckSquare, HelpCircle, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: 'surveys' | 'responses' | 'new';
  onSelectTab: (tab: 'surveys' | 'responses' | 'new') => void;
  onOpenTestModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenTestModal
}) => {
  const { isOnline, isSyncing } = useNetworkStatus();
  const { canInstall, install } = useInstallPrompt();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div 
          onClick={() => onSelectTab('surveys')} 
          className="flex items-center space-x-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">SurveyApp</h1>
            <p className="text-[11px] font-medium text-slate-500 leading-none">Mobile & Offline First</p>
          </div>
        </div>

        {/* Network & Action Status */}
        <div className="flex items-center space-x-2">
          {/* Status Indicator Pill */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              !isOnline
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                : isSyncing
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {!isOnline ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline</span>
              </>
            ) : isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang sync</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                <span className="relative">Online</span>
              </>
            )}
          </div>

          {/* Test Lab Button */}
          {canInstall && (
            <button
              onClick={install}
              title="Cài SurveyApp vào thiết bị"
              aria-label="Cài SurveyApp vào thiết bị"
              className="inline-flex items-center gap-1.5 min-h-[36px] rounded-xl bg-blue-600 px-3 text-xs font-bold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Cài ứng dụng</span>
            </button>
          )}

          {/* Test Lab Button */}
          {onOpenTestModal && (
            <button
              onClick={onOpenTestModal}
              title="Mở bảng điều khiển kiểm thử Offline & Sync"
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="max-w-2xl mx-auto px-4 flex border-t border-slate-100 text-sm font-medium">
        <button
          onClick={() => onSelectTab('surveys')}
          className={`flex-1 py-2.5 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'surveys'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Khảo sát</span>
        </button>

        <button
          onClick={() => onSelectTab('responses')}
          className={`flex-1 py-2.5 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'responses'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Phản hồi</span>
        </button>

        <button
          onClick={() => onSelectTab('new')}
          className={`flex-1 py-2.5 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'new'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Tạo mới</span>
        </button>
      </div>
    </header>
  );
};
