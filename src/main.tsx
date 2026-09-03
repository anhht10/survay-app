import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Đăng ký Service Worker tự động cập nhật
registerSW({
  onNeedRefresh() {
    console.log('[PWA] Phiên bản mới đã sẵn sàng');
  },
  onOfflineReady() {
    console.log('[PWA] Ứng dụng đã sẵn sàng hoạt động ngoại tuyến (Offline Ready)');
  },
  onRegistered(r) {
    console.log('[PWA] Service Worker đã được kích hoạt thành công:', r);
  },
  onRegisterError(error) {
    console.error('[PWA] Lỗi đăng ký Service Worker:', error);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
