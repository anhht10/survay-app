import { SurveyApi, SubmitResponseResult, SyncSurveyResult } from '../../types/api';
import { SurveyResponse } from '../../types/response';
import { Survey } from '../../types/survey';
import { ENV } from '../../config/env';
import { postWithTimeout, getWithTimeout } from './client';

// Giả lập database server khi chạy Mock Mode
const MOCK_SERVER_RESPONSES = new Set<string>();

export const surveyApi: SurveyApi = {
  async submitResponse(response: SurveyResponse): Promise<SubmitResponseResult> {
    // 1. Khi đã cấu hình URL Server (Node.js MongoDB hoặc Google Apps Script)
    if (!ENV.IS_MOCK_MODE && ENV.API_URL) {
      const baseUrl = ENV.API_URL.replace(/\/+$/, '');

      // Nếu là Google Apps Script endpoint (/exec)
      if (baseUrl.endsWith('/exec')) {
        const payload = {
          action: 'submitResponse',
          responseId: response.id,
          surveyId: response.surveyId,
          surveyVersion: response.surveyVersion,
          answers: response.answers,
          createdAt: response.createdAt,
          deviceId: response.deviceId
        };
        return await postWithTimeout<SubmitResponseResult>(baseUrl, payload);
      }

      // Nếu là Node.js + Express MongoDB Server (/api/responses)
      const submitUrl = baseUrl.endsWith('/responses') ? baseUrl : `${baseUrl}/responses`;
      const payload = {
        id: response.id,
        responseId: response.id,
        surveyId: response.surveyId,
        surveyTitle: response.surveyTitle,
        surveyVersion: response.surveyVersion,
        answers: response.answers,
        createdAt: response.createdAt,
        deviceId: response.deviceId
      };

      const result = await postWithTimeout<SubmitResponseResult>(submitUrl, payload);
      return result;
    }

    // 2. Mock mode (Dành cho việc test nhanh offline/online khi chưa bật server)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Kiểm tra cờ giả lập lỗi 500 nếu người dùng bật trong test panel
    if (sessionStorage.getItem('TEST_SIMULATE_SERVER_500') === 'true') {
      throw new Error('Giả lập lỗi máy chủ 500 (Test Server Error)');
    }

    // Kiểm tra Idempotency key
    if (MOCK_SERVER_RESPONSES.has(response.id)) {
      return {
        success: true,
        responseId: response.id,
        status: 'already_exists',
        message: 'Khảo sát đã tồn tại trên hệ thống (Idempotency Handled)'
      };
    }

    MOCK_SERVER_RESPONSES.add(response.id);

    return {
      success: true,
      responseId: response.id,
      status: 'synced',
      message: 'Đồng bộ lên máy chủ thành công'
    };
  },

  async saveSurvey(survey: Survey): Promise<SyncSurveyResult> {
    if (!ENV.IS_MOCK_MODE && ENV.API_URL) {
      const baseUrl = ENV.API_URL.replace(/\/+$/, '');

      if (baseUrl.endsWith('/exec')) {
        const payload = { action: 'saveSurvey', survey };
        return await postWithTimeout<SyncSurveyResult>(baseUrl, payload);
      }

      const surveyUrl = baseUrl.endsWith('/surveys') ? baseUrl : `${baseUrl}/surveys`;
      return await postWithTimeout<SyncSurveyResult>(surveyUrl, { survey });
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      surveyId: survey.id,
      version: survey.version,
      message: 'Khảo sát đã được lưu lên server'
    };
  },

  async getSurveys(): Promise<Survey[]> {
    if (!ENV.IS_MOCK_MODE && ENV.API_URL) {
      const baseUrl = ENV.API_URL.replace(/\/+$/, '');

      if (baseUrl.endsWith('/exec')) {
        const res = await postWithTimeout<{ surveys: Survey[] }>(baseUrl, { action: 'getSurveys' });
        return res.surveys || [];
      }

      const surveyUrl = baseUrl.endsWith('/surveys') ? baseUrl : `${baseUrl}/surveys`;
      const res = await getWithTimeout<{ success: boolean; surveys: Survey[] }>(surveyUrl);
      return res.surveys || [];
    }
    return [];
  },

  async getSurvey(id: string): Promise<Survey | null> {
    if (!ENV.IS_MOCK_MODE && ENV.API_URL) {
      const baseUrl = ENV.API_URL.replace(/\/+$/, '');

      if (baseUrl.endsWith('/exec')) {
        const res = await postWithTimeout<{ survey: Survey | null }>(baseUrl, {
          action: 'getSurvey',
          surveyId: id
        });
        return res.survey;
      }

      const surveyUrl = `${baseUrl.endsWith('/surveys') ? baseUrl : `${baseUrl}/surveys`}/${id}`;
      const res = await getWithTimeout<{ success: boolean; survey: Survey | null }>(surveyUrl);
      return res.survey || null;
    }
    return null;
  }
};
