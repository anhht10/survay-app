export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface Answer {
  questionId: string;
  value: string | number | boolean | string[];
}

export interface SurveyResponse {
  id: string; // UUID v4 (idempotency key)
  surveyId: string;
  surveyTitle?: string;
  surveyVersion: number;
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  syncAttempts: number;
  lastSyncAttempt?: string;
  syncError?: string;
  deviceId?: string;
}

export interface SyncQueueItem {
  id: string;
  responseId: string;
  createdAt: string;
  attempts: number;
  status: SyncStatus;
  lastAttemptAt?: string;
  error?: string;
}

