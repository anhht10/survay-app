import React from 'react';
import { Question } from '../../../types/survey';
import { Star } from 'lucide-react';

interface RatingInputProps {
  question: Question;
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const RatingInput: React.FC<RatingInputProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const currentRating = Number(value) || 0;

  return (
    <div className="flex flex-col items-center sm:items-start py-2">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= currentRating;
          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onChange(star)}
              className="p-2 min-h-[48px] min-w-[48px] rounded-2xl flex items-center justify-center transition-transform active:scale-90 hover:bg-amber-50 focus:outline-none"
            >
              <Star
                className={`w-9 h-9 transition-colors ${
                  isFilled
                    ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                    : 'text-slate-300 hover:text-amber-200'
                }`}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-xs font-semibold text-slate-500">
        {currentRating > 0 ? (
          <span className="text-amber-600 font-bold">
            {currentRating} / 5 Sao {currentRating === 5 ? '🤩 Tuyệt vời!' : currentRating >= 4 ? '😊 Hài lòng' : currentRating === 3 ? '😐 Bình thường' : '😞 Cần cải thiện'}
          </span>
        ) : (
          <span>Chạm vào ngôi sao để đánh giá</span>
        )}
      </div>
    </div>
  );
};

