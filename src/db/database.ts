import Dexie, { type EntityTable } from 'dexie';
import { Survey } from '../types/survey';
import { SurveyResponse, SyncQueueItem } from '../types/response';
import { DANANG_ENVIRONMENT_SURVEY, DANANG_ENVIRONMENT_SURVEY_ID } from '../data/danangSurvey';

export class SurveyDatabase extends Dexie {
  surveys!: EntityTable<Survey, 'id'>;
  responses!: EntityTable<SurveyResponse, 'id'>;
  syncQueue!: EntityTable<SyncQueueItem, 'id'>;

  constructor() {
    super('SurveyOfflineDB');

    this.version(1).stores({
      surveys: 'id, status, version, createdAt, updatedAt',
      responses: 'id, surveyId, syncStatus, createdAt, updatedAt, syncAttempts',
      syncQueue: 'id, responseId, status, createdAt, lastAttemptAt'
    });
  }
}

export const db = new SurveyDatabase();

/**
 * Khởi tạo dữ liệu mẫu và LUÔN ĐẢM BẢO bộ câu hỏi Môi Trường Đà Nẵng có sẵn ở client (Offline & Online)
 */
export async function seedInitialDataIfNeeded(): Promise<void> {
  try {
    // 1. Luôn đảm bảo bộ câu hỏi Khảo sát Môi trường Đà Nẵng (27 câu) có sẵn trong IndexedDB
    const existingDaNang = await db.surveys.get(DANANG_ENVIRONMENT_SURVEY_ID);
    if (!existingDaNang) {
      await db.surveys.put(DANANG_ENVIRONMENT_SURVEY);
    }

    // 2. Nếu database chưa từng có khảo sát nào, thêm cả khảo sát demo
    const count = await db.surveys.count();
    if (count <= 1) {
      const existingDemo = await db.surveys.get('survey-customer-feedback-demo');
      if (!existingDemo) {
        const defaultSurvey: Survey = {
          id: 'survey-customer-feedback-demo',
          title: 'Khảo sát Trải nghiệm Khách hàng 2026 (Demo)',
          description: 'Khảo sát ngắn đánh giá trải nghiệm và tính năng offline.',
          status: 'published',
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          questions: [
            {
              id: 'q1_name',
              type: 'text',
              title: 'Họ và tên của bạn?',
              required: true,
              order: 1,
              placeholder: 'Ví dụ: Nguyễn Văn An'
            },
            {
              id: 'q2_satisfaction',
              type: 'yes_no',
              title: 'Bạn có hài lòng với tính năng hoạt động offline không?',
              required: true,
              order: 2
            },
            {
              id: 'q3_rating',
              type: 'rating',
              title: 'Đánh giá ứng dụng PWA?',
              required: true,
              order: 3
            }
          ]
        };
        await db.surveys.put(defaultSurvey);
      }
    }
  } catch (error) {
    console.error('Lỗi khởi tạo dữ liệu ban đầu trong IndexedDB:', error);
  }
}
