import React, { useState } from 'react';
import { Question } from '../../../types/survey';
import { CameraService } from '../../../services/hardware/cameraService';
import { Camera, RefreshCw, Trash2, CheckCircle2, ZoomIn } from 'lucide-react';

interface ImageInputProps {
  question: Question;
  value: string; // Base64 data URL
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  const handleCapture = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    try {
      const result = await CameraService.capturePhoto();
      if (result?.dataUrl) {
        onChange(result.dataUrl);
      }
    } catch (err) {
      console.error('Lỗi khi thao tác chụp ảnh:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (disabled) return;
    onChange('');
  };

  return (
    <div className="space-y-3">
      {/* Chưa có ảnh */}
      {!value ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Camera className="w-6 h-6" />
          </div>
          <h5 className="text-sm font-bold text-slate-800 mb-1">Chụp ảnh hiện trường</h5>
          <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
            Sử dụng camera thiết bị để chụp hình ảnh thực tế phục vụ báo cáo khảo sát.
          </p>

          <button
            type="button"
            onClick={handleCapture}
            disabled={disabled || isLoading}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-sm hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all min-h-[44px]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang mở máy ảnh...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Mở máy ảnh / Chụp ngay</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Đã có ảnh chụp */
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="flex items-center space-x-1.5 font-bold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ảnh đã được lưu cục bộ</span>
            </span>
            <span className="text-slate-400">Định dạng Base64</span>
          </div>

          <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-72 flex items-center justify-center">
            <img
              src={value}
              alt="Ảnh hiện trường"
              className="max-h-72 w-full object-contain rounded-xl"
            />
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white space-x-2 transition-opacity"
            >
              <ZoomIn className="w-5 h-5" />
              <span className="text-xs font-semibold">Xem kích thước đầy đủ</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCapture}
              disabled={disabled || isLoading}
              className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold active:scale-95 transition-all min-h-[40px]"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Chụp lại ảnh khác</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="flex items-center justify-center space-x-1 py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold active:scale-95 transition-all min-h-[40px]"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa ảnh</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Zoom Fullscreen */}
      {isPreviewModalOpen && (
        <div
          onClick={() => setIsPreviewModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden p-2">
            <img
              src={value}
              alt="Ảnh phóng to"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 text-xs font-bold hover:bg-black/80"
            >
              Đóng (✕)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
