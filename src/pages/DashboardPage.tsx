import React from 'react';
import { useSurveys, SurveyWithStats } from '../hooks/useSurveys';
import { Button } from '../components/common/Button';
import { formatDate } from '../utils/formatters';
import {
  Plus,
  Edit3,
  Eye,
  Send,
  Copy,
  Trash2,
  FileCheck,
  CheckCircle2,
  Clock,
  Archive,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface DashboardPageProps {
  onCreateNew: () => void;
  onEditSurvey: (id: string) => void;
  onPreviewSurvey: (id: string) => void;
  onOpenPublicSurvey: (id: string) => void;
  onViewResponses: (surveyId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onCreateNew,
  onEditSurvey,
  onPreviewSurvey,
  onOpenPublicSurvey,
  onViewResponses
}) => {
  const { surveys, loading, deleteSurvey, duplicateSurvey, publishSurvey } = useSurveys();

  const getStatusBadge = (status: SurveyWithStats['status']) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đã xuất bản (Published)</span>
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Bản nháp (Draft)</span>
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Archive className="w-3.5 h-3.5 text-amber-600" />
            <span>Lưu trữ (Archived)</span>
          </span>
        );
    }
  };

  const handleDelete = async (survey: SurveyWithStats) => {
    if (confirm(`Bạn có chắc chắn muốn xóa khảo sát "${survey.title}" không?`)) {
      await deleteSurvey(survey.id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Khảo Sát
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tạo, chỉnh sửa và chia sẻ khảo sát hoạt động ngoại tuyến
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={onCreateNew}
        >
          <span className="hidden sm:inline">Tạo khảo sát mới</span>
          <span className="sm:hidden">Tạo mới</span>
        </Button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center text-slate-500 text-sm">
          Đang nạp danh sách khảo sát từ bộ nhớ...
        </div>
      )}

      {/* Empty State */}
      {!loading && surveys.length === 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <FileCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Chưa có khảo sát nào</h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-5 max-w-sm mx-auto">
            Bắt đầu tạo bài khảo sát đầu tiên của bạn để thu thập câu trả lời cả khi có mạng lẫn offline.
          </p>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={onCreateNew}>
            Tạo khảo sát ngay
          </Button>
        </div>
      )}

      {/* Survey Cards List */}
      {!loading && surveys.length > 0 && (
        <div className="space-y-4">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm p-5 transition-all"
            >
              {/* Card Header: Badges & Version */}
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center space-x-2">
                  {getStatusBadge(survey.status)}
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    v{survey.version}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Cập nhật: {formatDate(survey.updatedAt)}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {survey.title}
              </h3>
              {survey.description && (
                <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {survey.description}
                </p>
              )}

              {/* Stats: Questions & Responses */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center space-x-4">
                  <span>
                    <strong>{survey.questions.length}</strong> câu hỏi
                  </span>
                  <button
                    onClick={() => onViewResponses(survey.id)}
                    className="flex items-center space-x-1 text-blue-600 font-semibold hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{survey.responseCount} câu trả lời</span>
                  </button>
                </div>

                {survey.status === 'draft' ? (
                  <button
                    onClick={() => publishSurvey(survey.id)}
                    className="flex items-center space-x-1 text-emerald-700 font-bold hover:underline"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Xuất bản</span>
                  </button>
                ) : (
                  <span className="text-emerald-600 font-semibold text-xs">Sẵn sàng nhận bài</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1 flex-wrap">
                {/* Primary direct fill survey link */}
                <Button
                  variant="primary"
                  size="sm"
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                  onClick={() => onOpenPublicSurvey(survey.id)}
                >
                  Làm khảo sát
                </Button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onPreviewSurvey(survey.id)}
                    title="Xem trước khảo sát"
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditSurvey(survey.id)}
                    title="Chỉnh sửa khảo sát"
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicateSurvey(survey.id)}
                    title="Nhân bản khảo sát"
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(survey)}
                    title="Xóa khảo sát"
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

