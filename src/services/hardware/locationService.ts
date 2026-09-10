import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  timestamp: number;
}

export class LocationService {
  /**
   * Lấy vị trí GPS hiện tại với độ chính xác cao
   * Sử dụng @capacitor/geolocation trên Android native, fallback sang browser navigator.geolocation
   */
  public static async getCurrentLocation(): Promise<LocationCoordinates> {
    try {
      if (Capacitor.isNativePlatform()) {
        // Kiểm tra và xin quyền truy cập vị trí nếu cần
        const permStatus = await Geolocation.checkPermissions();
        if (permStatus.location !== 'granted') {
          const req = await Geolocation.requestPermissions();
          if (req.location !== 'granted') {
            throw new Error('Ứng dụng chưa được cấp quyền truy cập vị trí (GPS).');
          }
        }

        const position: Position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000
        });

        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          altitude: position.coords.altitude,
          timestamp: position.timestamp
        };
      } else {
        // Fallback cho trình duyệt Web
        return await this.getWebLocationFallback();
      }
    } catch (error: unknown) {
      console.warn('Lỗi khi lấy vị trí bằng Geolocation plugin, thử Web fallback:', error);
      return await this.getWebLocationFallback();
    }
  }

  /**
   * Fallback lấy vị trí qua API navigator.geolocation chuẩn của trình duyệt
   */
  private static getWebLocationFallback(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Thiết bị hoặc trình duyệt không hỗ trợ định vị GPS.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            altitude: pos.coords.altitude,
            timestamp: pos.timestamp
          });
        },
        (err) => {
          let message = 'Không thể lấy được vị trí GPS.';
          if (err.code === 1) message = 'Quyền truy cập vị trí bị từ chối.';
          else if (err.code === 2) message = 'Không thể xác định vị trí vệ tinh.';
          else if (err.code === 3) message = 'Thời gian chờ lấy vị trí GPS quá lâu.';
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        }
      );
    });
  }
}

