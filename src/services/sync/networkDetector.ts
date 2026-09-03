type NetworkListener = (isOnline: boolean) => void;

class NetworkDetector {
  private isOnlineState: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Set<NetworkListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  private handleOnline = () => {
    this.isOnlineState = true;
    this.notify();
  };

  private handleOffline = () => {
    this.isOnlineState = false;
    this.notify();
  };

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.isOnlineState);
      } catch (err) {
        console.error('Lỗi khi gọi listener trạng thái mạng:', err);
      }
    }
  }

  public isOnline(): boolean {
    return this.isOnlineState;
  }

  public subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    // Gọi ngay lần đầu với trạng thái hiện tại
    listener(this.isOnlineState);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Kiểm tra kết nối mạng thực tế qua ping
   */
  public async verifyRealConnectivity(): Promise<boolean> {
    if (!navigator.onLine) return false;
    try {
      // Dùng fetch với cache no-store để kiểm tra internet
      const response = await fetch('/favicon.svg?t=' + Date.now(), {
        method: 'HEAD',
        cache: 'no-store'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const networkDetector = new NetworkDetector();

