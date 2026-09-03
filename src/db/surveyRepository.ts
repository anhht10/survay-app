import { db } from './database';
import { Survey } from '../types/survey';
import { generateUUID } from '../utils/uuid';
import { DANANG_ENVIRONMENT_SURVEY_ID } from '../data/danangSurvey';

export interface SurveyRepository {
  getAll(): Promise<Survey[]>;
  getById(id: string): Promise<Survey | undefined>;
  save(survey: Survey): Promise<void>;
  delete(id: string): Promise<void>;
  duplicate(id: string): Promise<Survey>;
  publish(id: string): Promise<void>;
  getResponseCount(surveyId: string): Promise<number>;
}

export const surveyRepository: SurveyRepository = {
  async getAll(): Promise<Survey[]> {
    const list = await db.surveys.orderBy('updatedAt').reverse().toArray();
    // Luôn ưu tiên hiển thị Khảo sát Môi trường Đà Nẵng lên vị trí đầu tiên
    return list.sort((a, b) => {
      if (a.id === DANANG_ENVIRONMENT_SURVEY_ID) return -1;
      if (b.id === DANANG_ENVIRONMENT_SURVEY_ID) return 1;
      return 0;
    });
  },

  async getById(id: string): Promise<Survey | undefined> {
    return await db.surveys.get(id);
  },

  async save(survey: Survey): Promise<void> {
    const existing = await db.surveys.get(survey.id);
    const now = new Date().toISOString();

    if (existing) {
      // Nếu đã từng publish và có thay đổi câu hỏi, tăng version lên
      const isVersionBumpNeeded =
        existing.status === 'published' &&
        JSON.stringify(existing.questions) !== JSON.stringify(survey.questions);

      const updatedSurvey: Survey = {
        ...survey,
        version: isVersionBumpNeeded ? existing.version + 1 : existing.version,
        updatedAt: now
      };
      await db.surveys.put(updatedSurvey);
    } else {
      const newSurvey: Survey = {
        ...survey,
        createdAt: survey.createdAt || now,
        updatedAt: now
      };
      await db.surveys.put(newSurvey);
    }
  },

  async delete(id: string): Promise<void> {
    await db.surveys.delete(id);
  },

  async duplicate(id: string): Promise<Survey> {
    const original = await db.surveys.get(id);
    if (!original) throw new Error('Không tìm thấy khảo sát để nhân bản');

    const now = new Date().toISOString();
    const duplicated: Survey = {
      ...original,
      id: generateUUID(),
      title: `${original.title} (Bản sao)`,
      status: 'draft',
      version: 1,
      createdAt: now,
      updatedAt: now,
      questions: original.questions.map(q => ({
        ...q,
        id: generateUUID()
      }))
    };

    await db.surveys.add(duplicated);
    return duplicated;
  },

  async publish(id: string): Promise<void> {
    const survey = await db.surveys.get(id);
    if (!survey) throw new Error('Không tìm thấy khảo sát');

    await db.surveys.update(id, {
      status: 'published',
      updatedAt: new Date().toISOString()
    });
  },

  async getResponseCount(surveyId: string): Promise<number> {
    return await db.responses.where('surveyId').equals(surveyId).count();
  }
};
