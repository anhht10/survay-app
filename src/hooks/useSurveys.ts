import { useState, useEffect, useCallback } from 'react';
import { Survey } from '../types/survey';
import { surveyRepository } from '../db/surveyRepository';
import { seedInitialDataIfNeeded } from '../db/database';

export interface SurveyWithStats extends Survey {
  responseCount: number;
}

export function useSurveys() {
  const [surveys, setSurveys] = useState<SurveyWithStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSurveys = useCallback(async () => {
    try {
      setLoading(true);
      await seedInitialDataIfNeeded();
      const rawList = await surveyRepository.getAll();

      // Đính kèm số lượng response cho từng survey
      const listWithStats: SurveyWithStats[] = await Promise.all(
        rawList.map(async (s) => {
          const count = await surveyRepository.getResponseCount(s.id);
          return { ...s, responseCount: count };
        })
      );

      setSurveys(listWithStats);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi tải danh sách khảo sát';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSurveys();
  }, [loadSurveys]);

  const deleteSurvey = async (id: string) => {
    await surveyRepository.delete(id);
    await loadSurveys();
  };

  const duplicateSurvey = async (id: string) => {
    const dup = await surveyRepository.duplicate(id);
    await loadSurveys();
    return dup;
  };

  const publishSurvey = async (id: string) => {
    await surveyRepository.publish(id);
    await loadSurveys();
  };

  return {
    surveys,
    loading,
    error,
    reload: loadSurveys,
    deleteSurvey,
    duplicateSurvey,
    publishSurvey
  };
}

