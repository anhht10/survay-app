import { useState, useCallback } from 'react';
import { Survey } from '../types/survey';
import { SurveyResponse } from '../types/response';
import { validateSurveyAnswers, answersMapToArray } from '../utils/validation';
import { generateUUID } from '../utils/uuid';
import { responseRepository } from '../db/responseRepository';
import { networkDetector } from '../services/sync/networkDetector';
import { syncManager } from '../services/sync/syncManager';
import { getDeviceId } from '../services/storage/device';

export interface SubmitResultState {
  submitted: boolean;
  isOffline: boolean;
  responseId: string;
}

export function useSurveyForm(survey: Survey | null) {
  const [answersMap, setAnswersMap] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<SubmitResultState | null>(null);

  const setAnswer = useCallback((questionId: string, value: unknown) => {
    setAnswersMap((prev) => ({
      ...prev,
      [questionId]: value
    }));

    // Xóa lỗi ngay khi người dùng bắt đầu nhập / chọn lại
    setErrors((prev) => {
      if (prev[questionId]) {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      }
      return prev;
    });
  }, []);

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    if (!survey) return false;

    // BƯỚC 1: Validate toàn bộ form
    const validation = validateSurveyAnswers(survey, answersMap);
    if (!validation.isValid) {
      setErrors(validation.errors);

      // Tự động cuộn đến câu hỏi lỗi đầu tiên để người dùng dễ nhận biết
      const firstErrorId = Object.keys(validation.errors)[0];
      const elem = document.getElementById(`question-card-${firstErrorId}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    setIsSubmitting(true);

    try {
      // BƯỚC 2: Tạo responseId duy nhất bằng UUID v4
      const responseId = generateUUID();
      const now = new Date().toISOString();
      const deviceId = getDeviceId();
      const formattedAnswers = answersMapToArray(answersMap);

      const responsePayload: SurveyResponse = {
        id: responseId,
        surveyId: survey.id,
        surveyTitle: survey.title,
        surveyVersion: survey.version,
        answers: formattedAnswers,
        createdAt: now,
        updatedAt: now,
        syncStatus: 'pending',
        syncAttempts: 0,
        deviceId
      };

      // BƯỚC 3: LƯU VÀO INDEXEDDB TRƯỚC (BẮT BUỘC để đảm bảo Zero Data Loss)
      await responseRepository.save(responsePayload);

      // BƯỚC 4: Kiểm tra trạng thái mạng
      const isOnline = networkDetector.isOnline();

      if (isOnline) {
        // Nếu online: Kích hoạt sync ngay lập tức ngầm
        syncManager.syncResponse(responseId).catch((err) => {
          console.warn('Lỗi khi kích hoạt sync ngay:', err);
        });

        setSubmitResult({
          submitted: true,
          isOffline: false,
          responseId
        });
      } else {
        // Nếu offline: Giữ trạng thái pending, hiển thị thông báo offline thân thiện
        setSubmitResult({
          submitted: true,
          isOffline: true,
          responseId
        });
      }

      return true;
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu phản hồi:', error);
      alert('Đã xảy ra lỗi khi lưu khảo sát vào bộ nhớ máy. Vui lòng thử lại!');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [survey, answersMap]);

  const resetForm = useCallback(() => {
    setAnswersMap({});
    setErrors({});
    setSubmitResult(null);
  }, []);

  return {
    answersMap,
    errors,
    isSubmitting,
    submitResult,
    setAnswer,
    handleSubmit,
    resetForm
  };
}

