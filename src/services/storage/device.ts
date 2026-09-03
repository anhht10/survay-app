import { generateUUID } from '../../utils/uuid';

const DEVICE_ID_KEY = 'survey_app_device_id';

export function getDeviceId(): string {
  try {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = `dev-${generateUUID()}`;
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  } catch {
    return 'dev-browser-storage-unavailable';
  }
}

