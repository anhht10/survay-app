import React, { useState } from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import { WifiOff, RefreshCw, Plus, FileText, CheckSquare, HelpCircle, Download, Smartphone } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { ENV } from '../../config/env';
import { Modal } from './Modal';

interface HeaderProps {
  activeTab: 'surveys' | 'responses' | 'new';
  onSelectTab: (tab: 'surveys' | 'responses' | 'new') => void;
  onOpenTestModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenTestModal
}) => {
  const { isOnline, isSyncing } = useNetworkStatus();
  const { canInstall, install } = useInstallPrompt();
  const hasApkDownload = ENV.APK_URL.trim().length > 0;
  const isNativeApp = Capacitor.isNativePlatform();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleInstallPwa = async () => {
    setIsDownloadModalOpen(false);
    await install();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div 
          onClick={() => onSelectTab('surveys')} 
          className="flex items-center space-x-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">SurveyApp</h1>
            <p className="text-[11px] font-medium text-slate-500 leading-none">Mobile & Offline First</p>
          </div>
        </div>

        {/* Network & Action Status */}
        <div className="flex items-center space-x-2">
          {/* Status Indicator Pill */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              !isOnline
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                : isSyncing
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {!isOnline ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline</span>
              </>
            ) : isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang sync</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                <span className="relative">Online</span>
              </>
            )}
          </div>

          {/* Download chooser button */}
          {!isNativeApp && (hasApkDownload || canInstall) && (
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              title="Tải xuống"
              aria-label="Tải xuống"
              className="inline-flex items-center gap-1.5 min-h-[36px] rounded-xl bg-slate-900 px-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Tải xuống</span>
            </button>
          )}

          {/* Test Lab Button */}
          {onOpenTestModal && (
            <button
              onClick={onOpenTestModal}
              title="Mở bảng điều khiển kiểm thử Offline & Sync"
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="max-w-2xl mx-auto px-4 flex border-t border-slate-100 text-sm font-medium">
        <button
          onClick={() => onSelectTab('surveys')}
          className={`flex-1 py-2.5 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'surveys'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Khảo sát</span>
        </button>

        <button
          onClick={() => onSelectTab('responses')}
          className={`flex-1 py-2.5 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'responses'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Phản hồi</span>
        </button>

        <button
          onClick={() => onSelectTab('new')}
          className={`flex-1 py-2.5 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'new'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Tạo mới</span>
        </button>
      </div>

      <Modal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        title="Chọn bản tải xuống"
        maxWidth="sm"
      >
        <div className="space-y-3">
          {hasApkDownload && (
            <a
              href={ENV.APK_URL}
              download
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsDownloadModalOpen(false)}
              className="w-full flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left transition-colors hover:bg-slate-50"
            >
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">Tải APK</p>
                <p className="text-sm text-slate-500">File cài đặt Android để cài trực tiếp lên máy</p>
              </div>
            </a>
          )}

          {canInstall && (
            <button
              onClick={handleInstallPwa}
              className="w-full flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-left transition-colors hover:bg-blue-100"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-blue-900">Cài bản web</p>
                <p className="text-sm text-blue-700">Cài app web vào màn hình chính của thiết bị</p>
              </div>
            </button>
          )}
        </div>
      </Modal>
    </header>
  );
};
