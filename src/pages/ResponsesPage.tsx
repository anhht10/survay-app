import React, { useState } from 'react';
import { useSync } from '../hooks/useSync';
import { SyncStatus } from '../types/response';
import { ResponseCard } from '../components/responses/ResponseCard';
import { Button } from '../components/common/Button';
import {
  RefreshCw,
  RotateCw,
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ResponsesPageProps {
  filterSurveyId?: string;
  onClearFilterSurveyId?: () => void;
}

export const ResponsesPage: React.FC<ResponsesPageProps> = ({
  filterSurveyId,
  onClearFilterSurveyId
}) => {
  const {
    responses,
    stats,
    isSyncing,
    loading,
    reload,
    syncNow,
    retryFailed,
    deleteResponse
  } = useSync();

  const [activeTab, setActiveTab] = useState<SyncStatus | 'all'>('all');

  // Lọc theo status và surveyId (nếu có)
  const filteredList = responses.filter((r) => {
    if (filterSurveyId && r.surveyId !== filterSurveyId) return false;
    if (activeTab === 'all') return true;
    return r.syncStatus === activeTab;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Phản Hồi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Xem và kiểm soát trạng thái đồng bộ lên Google Sheets
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={reload}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
          >
            Làm mới
          </Button>

          <Button
            variant="primary"
            size="sm"
            isLoading={isSyncing}
            onClick={syncNow}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Đồng bộ ngay
          </Button>
        </div>
      </div>

      {/* Filter by Survey notice */}
      {filterSurveyId && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-blue-900">
          <span>
            Đang lọc phản hồi cho khảo sát ID: <strong className="font-mono">{filterSurveyId.slice(0, 8)}...</strong>
          </span>
          {onClearFilterSurveyId && (
            <button
              onClick={onClearFilterSurveyId}
              className="font-bold underline hover:text-blue-700"
            >
              Xem tất cả khảo sát
            </button>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tất cả ({stats.total})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Chờ gửi ({stats.pending})</span>
        </button>

        <button
          onClick={() => setActiveTab('syncing')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'syncing'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Đang sync ({stats.syncing})</span>
        </button>

        <button
          onClick={() => setActiveTab('synced')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'synced'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Đã gửi ({stats.synced})</span>
        </button>

        <button
          onClick={() => setActiveTab('failed')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'failed'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Thất bại ({stats.failed})</span>
        </button>
      </div>

      {/* Failed items retry alert banner */}
      {stats.failed > 0 && (
        <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-medium text-rose-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>Có <strong>{stats.failed}</strong> câu trả lời bị gián đoạn khi đồng bộ.</span>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={retryFailed}
            icon={<RotateCw className="w-3.5 h-3.5" />}
          >
            Thử lại tất cả
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center text-slate-500 text-sm">
          Đang nạp lịch sử phản hồi...
        </div>
      )}

      {/* Empty List */}
      {!loading && filteredList.length === 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Không tìm thấy phản hồi nào
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {activeTab === 'all'
              ? 'Hãy mở một khảo sát và thực hiện làm bài để xem dữ liệu lưu trữ tại đây.'
              : `Hiện không có mục nào ở trạng thái "${activeTab}".`}
          </p>
        </div>
      )}

      {/* Cards List */}
      {!loading && filteredList.length > 0 && (
        <div className="space-y-3">
          {filteredList.map((response) => (
            <ResponseCard
              key={response.id}
              response={response}
              onDelete={deleteResponse}
              onReload={reload}
            />
          ))}
        </div>
      )}
    </div>
  );
};
