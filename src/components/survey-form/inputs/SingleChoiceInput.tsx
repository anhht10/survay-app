import React from 'react';
import { Question } from '../../../types/survey';

interface SingleChoiceInputProps {
  question: Question;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const SingleChoiceInput: React.FC<SingleChoiceInputProps> = ({
  question,
  value,
  onChange,
  disabled = false
}) => {
  const options = question.options || [];

  return (
    <div className="space-y-2.5">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <label
            key={opt.id}
            className={`flex items-center space-x-3 px-4 py-3.5 min-h-[50px] rounded-xl border cursor-pointer select-none transition-all active:scale-[0.99] ${
              isSelected
                ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-medium shadow-sm ring-1 ring-blue-500'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
          >
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-400 bg-white'
              }`}
            >
              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <input
              type="radio"
              name={`question_${question.id}`}
              value={opt.value}
              checked={isSelected}
              onChange={() => onChange(opt.value)}
              disabled={disabled}
              className="sr-only"
            />
            <span className="text-base flex-1">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
};

