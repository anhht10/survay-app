import React, { useState } from 'react';
import { SurveyResponse } from '../../types/response';
import { SyncStatusBadge } from './SyncStatusBadge';
import { formatDate, formatAnswerValue } from '../../utils/formatters';
import { Trash2, ChevronDown, ChevronUp, RotateCw } from 'lucide-react';
import { syncManager } from '../../services/sync/syncManager';

interface ResponseCardProps {
  response: SurveyResponse;
  onDelete: (id: string) => void;
  onReload: () => void;
}

export const ResponseCard: React.FC<ResponseCardProps> = ({
  response,
  onDelete,
  onReload
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const handleRetrySingle = async () => {
    setIsRetrying(true);
    await syncManager.syncResponse(response.id);
    setIsRetrying(false);
    onReload();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 transition-all">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
            <SyncStatusBadge status={response.syncStatus} attempts={response.syncAttempts} />
            <span className="text-xs text-slate-500 font-mono">
              v{response.surveyVersion}
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-900 leading-snug">
            {response.surveyTitle || `Khảo sát ${response.surveyId.slice(0, 8)}`}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Thời gian: {formatDate(response.createdAt)}
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center space-x-1">
          {response.syncStatus === 'failed' && (
            <button
              onClick={handleRetrySingle}
              disabled={isRetrying}
              title="Thử đồng bộ lại phản hồi này"
              className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 active:scale-95 transition-all"
            >
              <RotateCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            </button>
          )}
          <button
            onClick={() => onDelete(response.id)}
            title="Xóa phản hồi"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sync Error Notice if any */}
      {response.syncError && (
        <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          <span className="font-bold">Lỗi đồng bộ:</span> {response.syncError}
          {response.lastSyncAttempt && (
            <p className="text-[11px] text-rose-500 mt-0.5">
              Lần thử gần nhất: {formatDate(response.lastSyncAttempt)}
            </p>
          )}
        </div>
      )}

      {/* Answer count & Toggle button */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Đã trả lời {response.answers.length} câu hỏi</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 font-semibold text-blue-600 hover:text-blue-700"
        >
          <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết câu trả lời'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Answers List */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="text-[11px] font-mono text-slate-400 mb-1">
            Mã ID: {response.id}
          </div>
          {response.answers.map((ans, idx) => (
            <div key={idx} className="bg-slate-50 p-2.5 rounded-xl">
              <span className="font-bold text-slate-700 block mb-0.5">
                Câu hỏi {ans.questionId}:
              </span>
              <span className="text-slate-900 font-medium whitespace-pre-wrap">
                {formatAnswerValue(ans.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

