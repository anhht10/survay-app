import React from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

interface NetworkBannerProps {
  pendingCount?: number;
  onSyncNow?: () => void;
}

export const NetworkBanner: React.FC<NetworkBannerProps> = ({
  pendingCount = 0,
  onSyncNow
}) => {
  const { isOnline, isSyncing, syncMessage } = useNetworkStatus();

  // Khi đang offline
  if (!isOnline) {
    return (
      <div className="bg-rose-600 text-white px-4 py-2.5 shadow-sm text-xs sm:text-sm font-medium transition-all">
        <div className="max-w-2xl mx-auto flex items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 flex-shrink-0 animate-bounce" />
            <span>
              <strong>Bạn đang Offline:</strong> Dữ liệu làm bài được lưu an toàn trên máy và tự động gửi lên Google Sheets khi có mạng trở lại.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Khi đang sync
  if (isSyncing) {
    return (
      <div className="bg-blue-600 text-white px-4 py-2 shadow-sm text-xs sm:text-sm font-medium transition-all">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin" />
            <span>{syncMessage || 'Đang tự động đồng bộ dữ liệu lên máy chủ...'}</span>
          </div>
        </div>
      </div>
    );
  }

  // Khi online nhưng có phản hồi đang chờ đồng bộ
  if (pendingCount > 0) {
    return (
      <div className="bg-amber-500 text-white px-4 py-2 shadow-sm text-xs sm:text-sm font-medium transition-all">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Có <strong>{pendingCount}</strong> khảo sát đang chờ đồng bộ lên Google Sheets.</span>
          </div>
          {onSyncNow && (
            <button
              onClick={onSyncNow}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
            >
              Đồng bộ ngay
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

