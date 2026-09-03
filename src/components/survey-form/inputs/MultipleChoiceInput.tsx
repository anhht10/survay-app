import React from 'react';
import { Question } from '../../../types/survey';
import { Check } from 'lucide-react';

interface MultipleChoiceInputProps {
  question: Question;
  value: string[];
  onChange: (val: string[]) => void;
  disabled?: boolean;
}

export const MultipleChoiceInput: React.FC<MultipleChoiceInputProps> = ({
  question,
  value = [],
  onChange,
  disabled = false
}) => {
  const options = question.options || [];
  const selectedList = Array.isArray(value) ? value : [];

  const handleToggle = (optionValue: string) => {
    if (selectedList.includes(optionValue)) {
      onChange(selectedList.filter((v) => v !== optionValue));
    } else {
      onChange([...selectedList, optionValue]);
    }
  };

  return (
    <div className="space-y-2.5">
      {options.map((opt) => {
        const isSelected = selectedList.includes(opt.value);
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
              className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-400 bg-white'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <input
              type="checkbox"
              name={`question_${question.id}`}
              value={opt.value}
              checked={isSelected}
              onChange={() => handleToggle(opt.value)}
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

