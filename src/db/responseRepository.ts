import { db } from './database';
import { SurveyResponse, SyncStatus } from '../types/response';

export interface ResponseStats {
  total: number;
  pending: number;
  syncing: number;
  synced: number;
  failed: number;
}

export interface ResponseRepository {
  save(response: SurveyResponse): Promise<void>;
  getById(id: string): Promise<SurveyResponse | undefined>;
  getAll(): Promise<SurveyResponse[]>;
  getBySurveyId(surveyId: string): Promise<SurveyResponse[]>;
  getLatestBySurveyIdAndDeviceId(surveyId: string, deviceId: string): Promise<SurveyResponse | undefined>;
  getByStatus(status: SyncStatus): Promise<SurveyResponse[]>;
  getPendingAndFailed(): Promise<SurveyResponse[]>;
  markSyncing(id: string): Promise<void>;
  markSynced(id: string): Promise<void>;
  markFailed(id: string, errorMessage: string): Promise<void>;
  resetForRetry(id: string): Promise<void>;
  delete(id: string): Promise<void>;
  getStats(): Promise<ResponseStats>;
}

export const responseRepository: ResponseRepository = {
  async save(response: SurveyResponse): Promise<void> {
    await db.responses.put(response);
  },

  async getById(id: string): Promise<SurveyResponse | undefined> {
    return await db.responses.get(id);
  },

  async getAll(): Promise<SurveyResponse[]> {
    return await db.responses.orderBy('createdAt').reverse().toArray();
  },

  async getBySurveyId(surveyId: string): Promise<SurveyResponse[]> {
    return await db.responses.where('surveyId').equals(surveyId).reverse().sortBy('createdAt');
  },

  async getLatestBySurveyIdAndDeviceId(surveyId: string, deviceId: string): Promise<SurveyResponse | undefined> {
    const responses = await db.responses.where('surveyId').equals(surveyId).toArray();
    return responses
      .filter(response => response.deviceId === deviceId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  },

  async getByStatus(status: SyncStatus): Promise<SurveyResponse[]> {
    return await db.responses.where('syncStatus').equals(status).reverse().sortBy('createdAt');
  },

  async getPendingAndFailed(): Promise<SurveyResponse[]> {
    const all = await db.responses.toArray();
    return all.filter(r => r.syncStatus === 'pending' || r.syncStatus === 'failed');
  },

  async markSyncing(id: string): Promise<void> {
    await db.responses.update(id, {
      syncStatus: 'syncing',
      lastSyncAttempt: new Date().toISOString()
    });
  },

  async markSynced(id: string): Promise<void> {
    await db.responses.update(id, {
      syncStatus: 'synced',
      syncError: undefined,
      updatedAt: new Date().toISOString()
    });
  },

  async markFailed(id: string, errorMessage: string): Promise<void> {
    const existing = await db.responses.get(id);
    const attempts = (existing?.syncAttempts || 0) + 1;

    await db.responses.update(id, {
      syncStatus: 'failed',
      syncAttempts: attempts,
      syncError: errorMessage,
      lastSyncAttempt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  },

  async resetForRetry(id: string): Promise<void> {
    await db.responses.update(id, {
      syncStatus: 'pending',
      syncError: undefined,
      updatedAt: new Date().toISOString()
    });
  },

  async delete(id: string): Promise<void> {
    await db.responses.delete(id);
  },

  async getStats(): Promise<ResponseStats> {
    const all = await db.responses.toArray();
    const stats: ResponseStats = {
      total: all.length,
      pending: 0,
      syncing: 0,
      synced: 0,
      failed: 0
    };

    for (const r of all) {
      if (r.syncStatus in stats) {
        stats[r.syncStatus as keyof ResponseStats]++;
      }
    }

    return stats;
  }
};

