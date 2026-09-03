import { responseRepository } from '../../db/responseRepository';
import { surveyApi } from '../api/surveyApi';
import { networkDetector } from './networkDetector';
import { BACKOFF_INTERVALS_MS, MAX_AUTO_RETRY_ATTEMPTS } from '../../config/constants';
import { ENV } from '../../config/env';

type SyncListener = (syncing: boolean, message?: string) => void;

class SyncManager {
  private isSyncing: boolean = false;
  private listeners: Set<SyncListener> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Tự động lắng nghe sự kiện khi có mạng trở lại
    networkDetector.subscribe((isOnline) => {
      if (isOnline) {
        this.log('Thiết bị đã kết nối mạng. Bắt đầu tự động đồng bộ...');
        this.syncPendingResponses();
      }
    });

    // Lắng nghe sự kiện Background Sync nếu Service Worker hỗ trợ
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_REQUESTED') {
          this.log('Nhận tín hiệu Background Sync từ Service Worker');
          this.syncPendingResponses();
        }
      });
    }

    // Thiết lập timer định kỳ quét sync ngầm khi online (mỗi 20 giây)
    this.startPeriodicSync(20000);
  }

  private log(message: string, data?: unknown) {
    if (ENV.ENABLE_SYNC_LOGS) {
      if (data) {
        console.log(`[SyncManager] ${message}`, data);
      } else {
        console.log(`[SyncManager] ${message}`);
      }
    }
  }

  private notify(syncing: boolean, message?: string) {
    for (const listener of this.listeners) {
      try {
        listener(syncing, message);
      } catch (e) {
        console.error('Lỗi khi notify sync listener:', e);
      }
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.isSyncing);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getIsSyncing(): boolean {
    return this.isSyncing;
  }

  public startPeriodicSync(intervalMs: number = 20000) {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (networkDetector.isOnline() && !this.isSyncing) {
        this.syncPendingResponses();
      }
    }, intervalMs);
  }

  /**
   * Tính toán thời gian backoff dựa trên số lần thử
   */
  private getBackoffDelay(attempts: number): number {
    const index = Math.min(Math.max(attempts - 1, 0), BACKOFF_INTERVALS_MS.length - 1);
    return BACKOFF_INTERVALS_MS[index];
  }

  /**
   * Đồng bộ toàn bộ các response đang pending hoặc failed đủ điều kiện retry
   * @param forceAll Nếu true, bỏ qua backoff interval và max retry limit (dùng khi bấm "Sync Now" thủ công)
   */
  public async syncPendingResponses(forceAll: boolean = false): Promise<void> {
    if (this.isSyncing) {
      this.log('Quá trình đồng bộ đang chạy, bỏ qua request trùng lặp (Concurrency Lock)');
      return;
    }

    if (!networkDetector.isOnline()) {
      this.log('Thiết bị đang offline. Hoãn quá trình đồng bộ.');
      return;
    }

    this.isSyncing = true;
    this.notify(true, 'Đang chuẩn bị đồng bộ dữ liệu...');

    try {
      const candidates = await responseRepository.getPendingAndFailed();

      if (candidates.length === 0) {
        this.log('Không có câu trả lời nào cần đồng bộ.');
        this.isSyncing = false;
        this.notify(false);
        return;
      }

      this.log(`Tìm thấy ${candidates.length} phản hồi cần kiểm tra đồng bộ.`);

      const now = Date.now();

      for (const response of candidates) {
        // Kiểm tra điều kiện Backoff nếu là lần retry tự động
        if (!forceAll && response.syncStatus === 'failed') {
          if (response.syncAttempts >= MAX_AUTO_RETRY_ATTEMPTS) {
            this.log(`Bỏ qua response ${response.id}: đã vượt quá ${MAX_AUTO_RETRY_ATTEMPTS} lần thử tự động.`);
            continue;
          }

          if (response.lastSyncAttempt) {
            const lastAttemptTime = new Date(response.lastSyncAttempt).getTime();
            const delay = this.getBackoffDelay(response.syncAttempts);
            if (now - lastAttemptTime < delay) {
              this.log(`Bỏ qua response ${response.id}: chưa đến thời gian backoff retry (${Math.round((delay - (now - lastAttemptTime))/1000)}s còn lại)`);
              continue;
            }
          }
        }

        // Tiến hành sync từng response
        await this.syncSingleResponse(response.id);
      }
    } catch (err) {
      this.log('Lỗi không mong muốn trong syncPendingResponses:', err);
    } finally {
      this.isSyncing = false;
      this.notify(false);
    }
  }

  /**
   * Đồng bộ một response cụ thể theo responseId
   */
  public async syncResponse(responseId: string): Promise<boolean> {
    if (!networkDetector.isOnline()) {
      this.log(`Không thể sync response ${responseId}: Thiết bị đang offline.`);
      return false;
    }

    return await this.syncSingleResponse(responseId);
  }

  /**
   * Thử lại toàn bộ các response bị failed thủ công
   */
  public async retryFailedResponses(): Promise<void> {
    const failedList = await responseRepository.getByStatus('failed');
    for (const r of failedList) {
      await responseRepository.resetForRetry(r.id);
    }
    await this.syncPendingResponses(true);
  }

  /**
   * Thực hiện sync cho 1 response duy nhất (xử lý trạng thái và lưu IndexedDB)
   */
  private async syncSingleResponse(responseId: string): Promise<boolean> {
    const response = await responseRepository.getById(responseId);
    if (!response) return false;

    try {
      this.log(`Bắt đầu đồng bộ phản hồi: ${response.id} (Lần thử: ${response.syncAttempts + 1})`);
      this.notify(true, `Đang gửi phản hồi ${response.id.slice(0, 8)}...`);

      // 1. Đánh dấu đang đồng bộ
      await responseRepository.markSyncing(response.id);

      // 2. Gửi dữ liệu lên API
      const result = await surveyApi.submitResponse(response);

      // 3. Xử lý phản hồi từ server
      if (result.status === 'synced' || result.status === 'already_exists') {
        this.log(`Đồng bộ thành công phản hồi: ${response.id} (Trạng thái: ${result.status})`);
        await responseRepository.markSynced(response.id);
        return true;
      } else {
        const errorMsg = result.error?.message || 'Server từ chối nhận phản hồi';
        this.log(`Đồng bộ thất bại phản hồi ${response.id}: ${errorMsg}`);
        await responseRepository.markFailed(response.id, errorMsg);
        return false;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi kết nối khi gửi dữ liệu';
      this.log(`Lỗi ngoại lệ khi đồng bộ phản hồi ${response.id}: ${errorMessage}`);
      await responseRepository.markFailed(response.id, errorMessage);
      return false;
    }
  }
}

export const syncManager = new SyncManager();
