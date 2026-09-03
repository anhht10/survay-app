import React from 'react';
import { SyncStatus } from '../../types/response';
import { CheckCircle2, Clock, RefreshCw, AlertCircle } from 'lucide-react';

interface SyncStatusBadgeProps {
  status: SyncStatus;
  attempts?: number;
}

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({ status, attempts = 0 }) => {
  switch (status) {
    case 'synced':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Đã đồng bộ</span>
        </span>
      );
    case 'syncing':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
          <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          <span>Đang đồng bộ</span>
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Chờ đồng bộ</span>
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Lỗi sync {attempts > 0 ? `(${attempts} lần)` : ''}</span>
        </span>
      );
    default:
      return null;
  }
};

