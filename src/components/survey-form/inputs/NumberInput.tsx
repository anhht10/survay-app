import React from 'react';
import { Question } from '../../../types/survey';

interface NumberInputProps {
  question: Question;
  value: number | string;
  onChange: (val: number | string) => void;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  question,
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="numeric"
        value={value !== undefined && value !== null ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        min={question.min}
        max={question.max}
        disabled={disabled}
        placeholder={question.placeholder || 'Nhập con số...'}
        className="w-full px-4 py-3 min-h-[48px] rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base font-mono transition-all disabled:bg-slate-100"
      />
      {(question.min !== undefined || question.max !== undefined) && (
        <p className="mt-1.5 text-xs text-slate-500">
          Giới hạn: {question.min !== undefined ? `Từ ${question.min}` : ''}
          {question.min !== undefined && question.max !== undefined ? ' - ' : ''}
          {question.max !== undefined ? `Đến ${question.max}` : ''}
        </p>
      )}
    </div>
  );
};

