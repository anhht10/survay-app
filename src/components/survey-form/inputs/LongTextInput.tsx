import React from 'react';
import { Question } from '../../../types/survey';

interface LongTextInputProps {
  question: Question;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const LongTextInput: React.FC<LongTextInputProps> = ({
  question,
  value,
  onChange,
  disabled = false
}) => {
  return (
    <textarea
      rows={4}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={question.placeholder || 'Nhập ý kiến chi tiết của bạn tại đây...'}
      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all resize-y min-h-[100px] disabled:bg-slate-100"
    />
  );
};

