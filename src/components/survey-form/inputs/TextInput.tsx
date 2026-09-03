import React from 'react';
import { Question } from '../../../types/survey';

interface TextInputProps {
  question: Question;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  question,
  value,
  onChange,
  disabled = false
}) => {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={question.placeholder || 'Nhập câu trả lời của bạn...'}
      className="w-full px-4 py-3 min-h-[48px] rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all disabled:bg-slate-100"
    />
  );
};

