import React from 'react';
import { Question } from '../../types/survey';
import { QUESTION_TYPES_META } from '../../config/constants';
import { ArrowUp, ArrowDown, Copy, Trash2, Edit3, Plus } from 'lucide-react';
import { Button } from '../common/Button';

interface QuestionListProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddNew: () => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAddNew
}) => {
  if (questions.length === 0) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50">
        <p className="text-sm font-semibold text-slate-600 mb-1">Chưa có câu hỏi nào</p>
        <p className="text-xs text-slate-400 mb-4">Nhấn nút bên dưới để tạo câu hỏi đầu tiên</p>
        <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />} onClick={onAddNew}>
          Thêm câu hỏi mới
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((q, idx) => {
        const meta = QUESTION_TYPES_META[q.type] || { label: q.type };
        return (
          <div
            key={q.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col gap-3 transition-all hover:border-slate-300"
          >
            {/* Top row: Title and type badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                    Câu {idx + 1}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {meta.label}
                  </span>
                  {q.required && (
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600">
                      Bắt buộc
                    </span>
                  )}
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {q.title}
                </h4>
                {q.description && (
                  <p className="text-xs text-slate-500 mt-0.5">{q.description}</p>
                )}
              </div>
            </div>

            {/* Bottom row: Action controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {/* Sắp xếp vị trí */}
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => onMoveUp(idx)}
                  title="Di chuyển lên"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === questions.length - 1}
                  onClick={() => onMoveDown(idx)}
                  title="Di chuyển xuống"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              {/* Các nút thao tác */}
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => onDuplicate(q.id)}
                  title="Nhân bản câu hỏi"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(q)}
                  title="Chỉnh sửa câu hỏi"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(q.id)}
                  title="Xóa câu hỏi"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="pt-2">
        <Button
          variant="outline"
          size="md"
          className="w-full border-dashed border-2 py-3"
          icon={<Plus className="w-4 h-4" />}
          onClick={onAddNew}
        >
          Thêm câu hỏi tiếp theo
        </Button>
      </div>
    </div>
  );
};

