import React from 'react';
import { CheckCircle2, WifiOff, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface SubmitSuccessModalProps {
  isOpen: boolean;
  isOffline: boolean;
  responseId: string;
  onContinue: () => void;
  onGoHome: () => void;
}

export const SubmitSuccessModal: React.FC<SubmitSuccessModalProps> = ({
  isOpen,
  isOffline,
  responseId,
  onContinue,
  onGoHome
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm animate-fadeIn" />

      {/* Content Card */}
      <div className="relative bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-center animate-scaleUp">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-inner">
          {isOffline ? (
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <WifiOff className="w-8 h-8 stroke-[2.5]" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
          {isOffline ? '✓ Khảo sát đã được lưu an toàn' : '✓ Gửi khảo sát thành công!'}
        </h3>

        {/* Message */}
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
          {isOffline
            ? 'Thiết bị của bạn hiện đang offline. Toàn bộ câu trả lời đã được lưu trữ an toàn trong bộ nhớ máy (IndexedDB) và sẽ tự động gửi lên server ngay khi có Internet.'
            : 'Cảm ơn bạn đã dành thời gian trả lời. Toàn bộ câu trả lời của bạn đã được ghi nhận và đồng bộ trực tiếp lên hệ thống.'}
        </p>

        {/* Audit ID */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 text-left">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Mã phản hồi (ID):</p>
          <p className="text-xs font-mono text-slate-700 break-all select-all font-medium mt-0.5">
            {responseId}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Trạng thái:{' '}
            <span className={`font-semibold ${isOffline ? 'text-amber-600' : 'text-emerald-600'}`}>
              {isOffline ? 'Đang chờ đồng bộ (Pending)' : 'Đã đồng bộ (Synced)'}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <Button variant="primary" size="lg" className="w-full" onClick={onGoHome}>
            <span>Về trang chủ</span>
          </Button>

          <Button
            variant="outline"
            size="md"
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={onContinue}
          >
            <span>Điền lại khảo sát này</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

