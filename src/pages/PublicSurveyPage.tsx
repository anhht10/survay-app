import React, { useState, useEffect } from 'react';
import { Survey } from '../types/survey';
import { surveyRepository } from '../db/surveyRepository';
import { useSurveyForm } from '../hooks/useSurveyForm';
import { QuestionField } from '../components/survey-form/QuestionField';
import { SubmitSuccessModal } from '../components/survey-form/SubmitSuccessModal';
import { Button } from '../components/common/Button';
import { ArrowLeft, Send, Sparkles, CheckCircle2, Download } from 'lucide-react';
import { seedInitialDataIfNeeded } from '../db/database';
import { responseRepository } from '../db/responseRepository';
import { getDeviceId } from '../services/storage/device';
import { SurveyResponse } from '../types/response';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

interface PublicSurveyPageProps {
  surveyId: string;
  onBack: () => void;
  onGoToResponses?: () => void;
}

export const PublicSurveyPage: React.FC<PublicSurveyPageProps> = ({
  surveyId,
  onBack,
  onGoToResponses
}) => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [latestResponse, setLatestResponse] = useState<SurveyResponse | undefined>();
  const { canInstall, install } = useInstallPrompt();

  useEffect(() => {
    async function load() {
      await seedInitialDataIfNeeded();
      const data = await surveyRepository.getById(surveyId);
      setSurvey(data || null);
      if (data) {
        setLatestResponse(await responseRepository.getLatestBySurveyIdAndDeviceId(data.id, getDeviceId()));
      }
      setLoading(false);
    }
    load();
  }, [surveyId]);

  const {
    answersMap,
    errors,
    isSubmitting,
    submitResult,
    setAnswer,
    handleSubmit,
    resetForm
  } = useSurveyForm(survey);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-slate-500 text-sm">
        Đang nạp dữ liệu khảo sát...
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Không tìm thấy bài khảo sát</h3>
        <p className="text-sm text-slate-500 mb-6">
          Khảo sát có thể đã bị xóa hoặc đường dẫn không chính xác.
        </p>
        <Button variant="outline" onClick={onBack}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  // Tính toán tiến độ hoàn thành
  const answeredCount = Object.keys(answersMap).filter((k) => {
    const val = answersMap[k];
    return val !== undefined && val !== null && val !== '' && (!Array.isArray(val) || val.length > 0);
  }).length;
  const progressPercent = survey.questions.length > 0 ? Math.round((answeredCount / survey.questions.length) * 100) : 0;
  const hasCompleted = !!latestResponse || !!submitResult?.submitted;

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Top Mobile Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Thoát</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            {canInstall && (
              <button
                onClick={install}
                title="Cài SurveyApp vào thiết bị"
                aria-label="Cài SurveyApp vào thiết bị"
                className="inline-flex min-h-[36px] items-center gap-1 rounded-xl bg-blue-600 px-2.5 text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Cài ứng dụng</span>
              </button>
            )}
            <span>Tiến độ:</span>
            <span className="font-bold text-blue-600">
              {answeredCount}/{survey.questions.length} câu
            </span>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full h-1 bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 pt-5 space-y-4">
        {/* Survey Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
          <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>PHIẾU KHẢO SÁT CHÍNH THỨC</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {survey.title}
          </h1>
          {survey.description && (
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {survey.description}
            </p>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Phiên bản: v{survey.version}</span>
            <span className="flex items-center space-x-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Hỗ trợ ngoại tuyến 100%</span>
            </span>
          </div>
        </div>

        {hasCompleted && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div className="text-sm">
              <p className="font-bold">Bạn đã hoàn thành khảo sát này trên thiết bị</p>
              <p className="mt-1 text-emerald-800">
                {latestResponse
                  ? `Đã thực hiện lúc ${new Date(latestResponse.createdAt).toLocaleString('vi-VN')}. Bạn có thể điền lại nếu muốn cập nhật câu trả lời.`
                  : 'Câu trả lời vừa được lưu trên thiết bị và sẽ được đồng bộ khi có Internet.'}
              </p>
            </div>
          </div>
        )}

        {/* Question Fields */}
        <div className="space-y-4">
          {survey.questions.map((q, idx) => (
            <QuestionField
              key={q.id}
              question={q}
              index={idx}
              value={answersMap[q.id]}
              error={errors[q.id]}
              onChange={(val) => setAnswer(q.id, val)}
              disabled={isSubmitting}
            />
          ))}
        </div>

        {/* Sticky Mobile Submit Bar at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-20">
          <div className="max-w-xl mx-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-blue-500/20 text-base font-bold"
              icon={<Send className="w-5 h-5" />}
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              GỬI KHẢO SÁT / APPLY
            </Button>
          </div>
        </div>
      </main>

      {/* Success Modal (Online / Offline) */}
      <SubmitSuccessModal
        isOpen={!!submitResult?.submitted}
        isOffline={!!submitResult?.isOffline}
        responseId={submitResult?.responseId || ''}
        onContinue={() => {
          resetForm();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoHome={onGoToResponses || onBack}
      />
    </div>
  );
};

