import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export interface PhotoResult {
  dataUrl: string;
  format: string;
}

export class CameraService {
  /**
   * Chụp ảnh từ camera hoặc thư viện
   * Sử dụng @capacitor/camera trên thiết bị thật, fallback file picker trên trình duyệt web
   */
  public static async capturePhoto(source: CameraSource = CameraSource.Prompt): Promise<PhotoResult | null> {
    try {
      if (Capacitor.isNativePlatform()) {
        const photo = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source
        });

        if (photo.dataUrl) {
          return {
            dataUrl: photo.dataUrl,
            format: photo.format
          };
        }
        return null;
      } else {
        // Fallback cho môi trường web / PWA
        return await this.captureWebFallback();
      }
    } catch (error: unknown) {
      // Người dùng hủy chụp hoặc từ chối quyền
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('User cancelled') || errorMsg.includes('cancelled')) {
        return null;
      }
      console.warn('Lỗi khi chụp ảnh bằng Camera plugin, chuyển sang fallback:', error);
      return await this.captureWebFallback();
    }
  }

  /**
   * Fallback chọn ảnh qua HTML5 <input type="file" capture> trên web
   */
  private static captureWebFallback(): Promise<PhotoResult | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.setAttribute('capture', 'environment'); // Ưu tiên camera sau trên mobile web

      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            dataUrl: reader.result as string,
            format: file.type.replace('image/', '') || 'jpeg'
          });
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      };

      input.click();
    });
  }
}

