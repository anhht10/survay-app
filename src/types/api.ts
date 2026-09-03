import { SurveyResponse } from './response';
import { Survey } from './survey';

export type SubmitStatus = 'synced' | 'already_exists' | 'failed';

export interface SubmitResponseResult {
  success: boolean;
  responseId: string;
  status: SubmitStatus;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface SyncSurveyResult {
  success: boolean;
  surveyId: string;
  version: number;
  message?: string;
}

export interface SurveyApi {
  getSurveys(): Promise<Survey[]>;
  getSurvey(id: string): Promise<Survey | null>;
  saveSurvey(survey: Survey): Promise<SyncSurveyResult>;
  submitResponse(response: SurveyResponse): Promise<SubmitResponseResult>;
}

