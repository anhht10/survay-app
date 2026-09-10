export type QuestionType =
  | 'text'
  | 'long_text'
  | 'single_choice'
  | 'multiple_choice'
  | 'number'
  | 'rating'
  | 'yes_no'
  | 'image'
  | 'location';

export type SurveyStatus = 'draft' | 'published' | 'archived';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  order: number;
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: SurveyStatus;
  version: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

