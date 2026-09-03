import { Question, Survey } from '../types/survey';
import { Answer } from '../types/response';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>; // questionId -> error message
}

export function validateQuestionAnswer(question: Question, value: unknown): string | null {
  const isValueEmpty =
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

  if (question.required && isValueEmpty) {
    return 'Vui lòng hoàn thành câu hỏi bắt buộc này.';
  }

  if (!isValueEmpty) {
    if (question.type === 'number') {
      const num = Number(value);
      if (isNaN(num)) {
        return 'Vui lòng nhập một số hợp lệ.';
      }
      if (question.min !== undefined && num < question.min) {
        return `Giá trị nhỏ nhất cho phép là ${question.min}.`;
      }
      if (question.max !== undefined && num > question.max) {
        return `Giá trị lớn nhất cho phép là ${question.max}.`;
      }
    }

    if (question.type === 'rating') {
      const rate = Number(value);
      if (isNaN(rate) || rate < 1 || rate > 5) {
        return 'Đánh giá phải từ 1 đến 5 sao.';
      }
    }
  }

  return null;
}

export function validateSurveyAnswers(
  survey: Survey,
  answersMap: Record<string, unknown>
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const question of survey.questions) {
    const val = answersMap[question.id];
    const error = validateQuestionAnswer(question, val);
    if (error) {
      errors[question.id] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function answersMapToArray(answersMap: Record<string, unknown>): Answer[] {
  return Object.entries(answersMap)
    .filter(([_, val]) => val !== undefined && val !== null && val !== '')
    .map(([questionId, value]) => ({
      questionId,
      value: value as string | number | boolean | string[]
    }));
}

