import React, { useState } from 'react';
import { Question } from '../../../types/survey';
import { LocationService, LocationCoordinates } from '../../../services/hardware/locationService';
import { MapPin, RefreshCw, ExternalLink, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface LocationInputProps {
  question: Question;
  value: string; // JSON string hoặc chuỗi tọa độ
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Parse location từ value string
  let parsedLocation: LocationCoordinates | null = null;
  if (value) {
    try {
      parsedLocation = JSON.parse(value);
    } catch {
      // Nếu là chuỗi "lat, lng" thông thường
      const parts = value.split(',').map((s) => parseFloat(s.trim()));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        parsedLocation = {
          latitude: parts[0],
          longitude: parts[1],
          accuracy: 0,
          timestamp: Date.now()
        };
      }
    }
  }

  const handleGetLocation = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const coords = await LocationService.getCurrentLocation();
      onChange(JSON.stringify(coords));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể lấy được vị trí GPS.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (disabled) return;
    onChange('');
    setError(null);
  };

  return (
    <div className="space-y-3">
      {/* Chưa có tọa độ */}
      {!parsedLocation ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <h5 className="text-sm font-bold text-slate-800 mb-1">Xác định vị trí thực địa (GPS)</h5>
          <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
            Sử dụng chip GPS vệ tinh của thiết bị để lưu lại tọa độ điểm khảo sát chính xác.
          </p>

          <button
            type="button"
            onClick={handleGetLocation}
            disabled={disabled || isLoading}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-sm hover:bg-emerald-700 active:scale-95 disabled:opacity-50 transition-all min-h-[44px]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang kết nối GPS vệ tinh...</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                <span>Lấy tọa độ GPS hiện tại</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-3 flex items-center justify-center space-x-1.5 text-xs font-semibold text-rose-600">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        /* Đã có tọa độ GPS */
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="flex items-center space-x-1.5 font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã xác định tọa độ GPS vệ tinh</span>
            </span>
            {parsedLocation.accuracy > 0 && (
              <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md font-mono text-[11px]">
                Sai số ±{parsedLocation.accuracy}m
              </span>
            )}
          </div>

          {/* Chi tiết tọa độ */}
          <div className="grid grid-cols-2 gap-2 bg-white rounded-xl p-3 border border-emerald-100 text-xs shadow-2xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Vĩ độ (Latitude)</span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                {parsedLocation.latitude.toFixed(6)}°
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Kinh độ (Longitude)</span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                {parsedLocation.longitude.toFixed(6)}°
              </span>
            </div>
          </div>

          {/* Links & Actions */}
          <div className="mt-3 flex items-center space-x-2">
            <a
              href={`https://www.google.com/maps?q=${parsedLocation.latitude},${parsedLocation.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-semibold transition-colors min-h-[40px]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem trên Google Maps</span>
            </a>

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={disabled || isLoading}
              title="Lấy lại tọa độ"
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors min-h-[40px]"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              title="Xóa tọa độ"
              className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors min-h-[40px]"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

