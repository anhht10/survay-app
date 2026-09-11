export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || '',
  APK_URL: import.meta.env.VITE_APK_URL || '/downloads/app-release.apk',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  ENABLE_SYNC_LOGS: import.meta.env.VITE_ENABLE_SYNC_LOGS !== 'false',
  IS_MOCK_MODE: !import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL.trim() === ''
};

