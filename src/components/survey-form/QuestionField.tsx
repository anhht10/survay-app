import React from 'react';
import { Question } from '../../types/survey';
import { TextInput } from './inputs/TextInput';
import { LongTextInput } from './inputs/LongTextInput';
import { SingleChoiceInput } from './inputs/SingleChoiceInput';
import { MultipleChoiceInput } from './inputs/MultipleChoiceInput';
import { NumberInput } from './inputs/NumberInput';
import { RatingInput } from './inputs/RatingInput';
import { YesNoInput } from './inputs/YesNoInput';
import { AlertCircle } from 'lucide-react';

interface QuestionFieldProps {
  question: Question;
  index: number;
  value: unknown;
  error?: string;
  onChange: (val: unknown) => void;
  disabled?: boolean;
}

export const QuestionField: React.FC<QuestionFieldProps> = ({
  question,
  index,
  value,
  error,
  onChange,
  disabled = false
}) => {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <TextInput
            question={question}
            value={value as string}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case 'long_text':
        return (
          <LongTextInput
            question={question}
            value={value as string}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case 'single_choice':
        return (
          <SingleChoiceInput
            question={question}
            value={value as string}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case 'multiple_choice':
        return (
          <MultipleChoiceInput
            question={question}
            value={value as string[]}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case 'number':
        return (
          <NumberInput
            question={question}
            value={value as number}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case 'rating':
        return (
          <RatingInput
            question={question}
            value={value as number}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case 'yes_no':
        return (
          <YesNoInput
            question={question}
            value={value as boolean}
            onChange={onChange}
            disabled={disabled}
          />
        );
      default:
        return <p className="text-sm text-slate-500">Loại câu hỏi không được hỗ trợ.</p>;
    }
  };

  return (
    <div
      id={`question-card-${question.id}`}
      className={`bg-white rounded-2xl p-5 border transition-all duration-200 ${
        error
          ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
          : 'border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      {/* Title & Required Badge */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2">
          <label className="text-base font-bold text-slate-900 leading-snug">
            <span className="text-blue-600 font-extrabold mr-1.5">{index + 1}.</span>
            {question.title}
            {question.required && (
              <span className="text-rose-600 font-bold ml-1" title="Bắt buộc">*</span>
            )}
          </label>
        </div>

        {question.description && (
          <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      {/* Input component */}
      <div className="mt-4">{renderInput()}</div>

      {/* Inline Error */}
      {error && (
        <div className="mt-3 flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-rose-600 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

