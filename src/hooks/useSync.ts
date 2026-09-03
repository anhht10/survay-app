import { useState, useEffect, useCallback } from 'react';
import { SurveyResponse, SyncStatus } from '../types/response';
import { responseRepository, ResponseStats } from '../db/responseRepository';
import { syncManager } from '../services/sync/syncManager';

export function useSync() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [stats, setStats] = useState<ResponseStats>({
    total: 0,
    pending: 0,
    syncing: 0,
    synced: 0,
    failed: 0
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(syncManager.getIsSyncing());
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      const allResponses = await responseRepository.getAll();
      const currentStats = await responseRepository.getStats();
      setResponses(allResponses);
      setStats(currentStats);
    } catch (e) {
      console.error('Lỗi khi nạp dữ liệu phản hồi:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Lắng nghe khi quá trình sync thay đổi
    const unsub = syncManager.subscribe((syncing) => {
      setIsSyncing(syncing);
      // Khi vừa kết thúc hoặc đang sync, cập nhật lại data hiển thị
      loadData();
    });

    return () => {
      unsub();
    };
  }, [loadData]);

  const syncNow = async () => {
    await syncManager.syncPendingResponses(true);
    await loadData();
  };

  const retryFailed = async () => {
    await syncManager.retryFailedResponses();
    await loadData();
  };

  const deleteResponse = async (id: string) => {
    await responseRepository.delete(id);
    await loadData();
  };

  const filterByStatus = (status: SyncStatus | 'all') => {
    if (status === 'all') return responses;
    return responses.filter((r) => r.syncStatus === status);
  };

  return {
    responses,
    stats,
    isSyncing,
    loading,
    reload: loadData,
    syncNow,
    retryFailed,
    deleteResponse,
    filterByStatus
  };
}

