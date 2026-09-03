import React, { useState, useEffect } from 'react';
import { Survey } from '../types/survey';
import { surveyRepository } from '../db/surveyRepository';
import { QuestionField } from '../components/survey-form/QuestionField';
import { Button } from '../components/common/Button';
import { ArrowLeft, Smartphone, Check } from 'lucide-react';

interface SurveyPreviewPageProps {
  surveyId: string;
  onBack: () => void;
  onOpenLive: () => void;
}

export const SurveyPreviewPage: React.FC<SurveyPreviewPageProps> = ({
  surveyId,
  onBack,
  onOpenLive
}) => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [mockAnswers, setMockAnswers] = useState<Record<string, unknown>>({});

  useEffect(() => {
    async function load() {
      const data = await surveyRepository.getById(surveyId);
      setSurvey(data || null);
    }
    load();
  }, [surveyId]);

  if (!survey) {
    return <div className="text-center py-12 text-slate-500">Đang nạp dữ liệu...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:flex items-center space-x-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Chế độ Xem Trước (Preview)</span>
          </span>
          <Button variant="primary" size="sm" onClick={onOpenLive}>
            Mở làm bài thật
          </Button>
        </div>
      </div>

      {/* Simulated Device Container */}
      <div className="bg-slate-100 p-2 sm:p-6 rounded-[2.5rem] border border-slate-300 shadow-inner max-w-lg mx-auto">
        <div className="bg-white rounded-[2rem] p-5 sm:p-6 shadow-md border border-slate-200 space-y-5">
          {/* Header Preview */}
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
              Bản xem trước
            </span>
            <h2 className="text-xl font-black text-slate-900 leading-snug mt-1">
              {survey.title}
            </h2>
            {survey.description && (
              <p className="text-xs text-slate-600 mt-1">{survey.description}</p>
            )}
          </div>

          {/* Question List Preview */}
          <div className="space-y-4">
            {survey.questions.map((q, idx) => (
              <QuestionField
                key={q.id}
                question={q}
                index={idx}
                value={mockAnswers[q.id]}
                onChange={(val) => setMockAnswers({ ...mockAnswers, [q.id]: val })}
              />
            ))}
          </div>

          {/* Submit simulation */}
          <div className="pt-3 border-t border-slate-100">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              icon={<Check className="w-4 h-4" />}
              onClick={() => alert('Đây là chế độ xem trước! Nhấn "Mở làm bài thật" để điền và ghi nhận dữ liệu.')}
            >
              Thử nghiệm gửi (Preview)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

