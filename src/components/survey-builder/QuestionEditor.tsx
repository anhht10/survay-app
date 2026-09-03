import React, { useState } from 'react';
import { Question, QuestionType, QuestionOption } from '../../types/survey';
import { QuestionTypeSelector } from './QuestionTypeSelector';
import { Button } from '../common/Button';
import { generateUUID } from '../../utils/uuid';
import { Plus, Trash2, Check, AlertCircle } from 'lucide-react';

interface QuestionEditorProps {
  initialQuestion?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  initialQuestion,
  onSave,
  onCancel
}) => {
  const [type, setType] = useState<QuestionType>(initialQuestion?.type || 'text');
  const [title, setTitle] = useState<string>(initialQuestion?.title || '');
  const [description, setDescription] = useState<string>(initialQuestion?.description || '');
  const [required, setRequired] = useState<boolean>(initialQuestion?.required ?? true);
  const [placeholder, setPlaceholder] = useState<string>(initialQuestion?.placeholder || '');
  const [min, setMin] = useState<number | undefined>(initialQuestion?.min);
  const [max, setMax] = useState<number | undefined>(initialQuestion?.max);

  const [options, setOptions] = useState<QuestionOption[]>(
    initialQuestion?.options && initialQuestion.options.length > 0
      ? initialQuestion.options
      : [
          { id: generateUUID(), label: 'Lựa chọn 1', value: 'Lựa chọn 1' },
          { id: generateUUID(), label: 'Lựa chọn 2', value: 'Lựa chọn 2' }
        ]
  );

  const [error, setError] = useState<string | null>(null);

  const handleAddOption = () => {
    const nextIdx = options.length + 1;
    setOptions([
      ...options,
      { id: generateUUID(), label: `Lựa chọn ${nextIdx}`, value: `Lựa chọn ${nextIdx}` }
    ]);
  };

  const handleUpdateOption = (id: string, label: string) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, label, value: label } : opt))
    );
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 1) {
      alert('Cần có ít nhất 1 lựa chọn.');
      return;
    }
    setOptions(options.filter((opt) => opt.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề câu hỏi.');
      return;
    }

    if ((type === 'single_choice' || type === 'multiple_choice') && options.length === 0) {
      setError('Vui lòng thêm ít nhất một lựa chọn.');
      return;
    }

    const questionToSave: Question = {
      id: initialQuestion?.id || generateUUID(),
      type,
      title: title.trim(),
      description: description.trim() || undefined,
      required,
      order: initialQuestion?.order || 1,
      options: type === 'single_choice' || type === 'multiple_choice' ? options : undefined,
      placeholder: placeholder.trim() || undefined,
      min: type === 'number' ? min : undefined,
      max: type === 'number' ? max : undefined
    };

    onSave(questionToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Chọn Loại Câu Hỏi */}
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-2">
          Chọn loại câu hỏi
        </label>
        <QuestionTypeSelector selectedType={type} onSelect={setType} />
      </div>

      {/* Tiêu đề câu hỏi */}
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-1.5">
          Tiêu đề câu hỏi <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          placeholder="Ví dụ: Bạn hài lòng nhất với điểm nào của dịch vụ?"
          className="w-full px-4 py-3 min-h-[48px] rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
        />
      </div>

      {/* Mô tả phụ */}
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-1.5">
          Mô tả / Hướng dẫn thêm (Không bắt buộc)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ví dụ: Có thể chọn nhiều đáp án hoặc ghi chú ngắn..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Cấu hình Options nếu là Single / Multiple Choice */}
      {(type === 'single_choice' || type === 'multiple_choice') && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">Danh sách các đáp án:</span>
            <button
              type="button"
              onClick={handleAddOption}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm đáp án</span>
            </button>
          </div>

          <div className="space-y-2">
            {options.map((opt, idx) => (
              <div key={opt.id} className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-400 w-5 text-center">{idx + 1}.</span>
                <input
                  type="text"
                  value={opt.label}
                  onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
                  placeholder={`Tên đáp án ${idx + 1}`}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(opt.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cấu hình Number min/max */}
      {type === 'number' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Giá trị nhỏ nhất (Min)</label>
            <input
              type="number"
              value={min ?? ''}
              onChange={(e) => setMin(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ví dụ: 0"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Giá trị lớn nhất (Max)</label>
            <input
              type="number"
              value={max ?? ''}
              onChange={(e) => setMax(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ví dụ: 100"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
            />
          </div>
        </div>
      )}

      {/* Placeholder cấu hình cho text / long_text */}
      {(type === 'text' || type === 'long_text') && (
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Gợi ý mờ (Placeholder)</label>
          <input
            type="text"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            placeholder="Ví dụ: Nhập tại đây..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
          />
        </div>
      )}

      {/* Bắt buộc trả lời (Required switch) */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100">
        <div>
          <p className="text-sm font-bold text-slate-800">Câu hỏi bắt buộc</p>
          <p className="text-xs text-slate-500">Người làm khảo sát phải trả lời câu hỏi này</p>
        </div>
        <button
          type="button"
          onClick={() => setRequired(!required)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
            required ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
          }`}
        >
          <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
        </button>
      </div>

      {error && (
        <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Nút thao tác */}
      <div className="flex items-center space-x-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel} className="flex-1">
          Hủy bỏ
        </Button>
        <Button variant="primary" type="submit" icon={<Check className="w-4 h-4" />} className="flex-1">
          Lưu câu hỏi
        </Button>
      </div>
    </form>
  );
};

