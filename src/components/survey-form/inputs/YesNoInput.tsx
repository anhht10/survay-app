import React from 'react';
import { Question } from '../../../types/survey';
import { Check, X } from 'lucide-react';

interface YesNoInputProps {
  question: Question;
  value: boolean | null | undefined;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

export const YesNoInput: React.FC<YesNoInputProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Option: CÓ */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(true)}
        className={`flex items-center justify-center space-x-2.5 py-3.5 px-4 min-h-[50px] rounded-2xl border font-semibold text-base transition-all active:scale-[0.98] ${
          value === true
            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500 shadow-sm'
            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
        } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            value === true ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
        <span>Có / Hài lòng</span>
      </button>

      {/* Option: KHÔNG */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(false)}
        className={`flex items-center justify-center space-x-2.5 py-3.5 px-4 min-h-[50px] rounded-2xl border font-semibold text-base transition-all active:scale-[0.98] ${
          value === false
            ? 'border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-500 shadow-sm'
            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
        } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            value === false ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400'
          }`}
        >
          <X className="w-4 h-4 stroke-[3]" />
        </div>
        <span>Không</span>
      </button>
    </div>
  );
};

