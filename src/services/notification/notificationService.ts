import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export class NotificationService {
  private static isInitialized = false;

  /**
   * Khởi tạo kênh thông báo và yêu cầu quyền trên Android
   */
  public static async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (Capacitor.isNativePlatform()) {
        // Tạo Notification Channel trên Android với độ ưu tiên cao
        await LocalNotifications.createChannel({
          id: 'sync_channel',
          name: 'Đồng bộ khảo sát',
          description: 'Thông báo khi phiếu khảo sát được đồng bộ thành công',
          importance: 4, // High importance (hiển thị popup trên đầu màn hình)
          visibility: 1,
          vibration: true
        });

        // Xin quyền thông báo (bắt buộc từ Android 13+)
        const perm = await LocalNotifications.checkPermissions();
        if (perm.display !== 'granted') {
          await LocalNotifications.requestPermissions();
        }

        // Khởi tạo Push Notifications nếu cần
        try {
          const pushPerm = await PushNotifications.checkPermissions();
          if (pushPerm.receive !== 'granted') {
            await PushNotifications.requestPermissions();
          }
        } catch (e) {
          console.warn('PushNotifications không khả dụng hoặc chưa cấu hình FCM:', e);
        }
      } else {
        // Môi trường Web / PWA: Xin quyền Notification API chuẩn của trình duyệt
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'default') {
            await Notification.requestPermission();
          }
        }
      }

      this.isInitialized = true;
    } catch (error) {
      console.warn('Lỗi khi khởi tạo NotificationService:', error);
    }
  }

  /**
   * Bắn thông báo khi quá trình đồng bộ thành công (Sync Success Alert)
   * @param count Số lượng phiếu khảo sát vừa được đồng bộ thành công
   */
  public static async notifySyncSuccess(count: number): Promise<void> {
    if (count <= 0) return;

    await this.init();

    const title = 'Đồng bộ thành công! 🚀';
    const body =
      count === 1
        ? 'Một phiếu khảo sát hiện trường đã được gửi an toàn lên hệ thống.'
        : `Đã gửi thành công ${count} phiếu khảo sát hiện trường lên hệ thống.`;

    try {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Math.floor(Date.now() % 1000000),
              title,
              body,
              channelId: 'sync_channel',
              schedule: { at: new Date(Date.now() + 200) }, // Kích hoạt ngay lập tức
              smallIcon: 'ic_launcher_round',
              sound: undefined
            }
          ]
        });
      } else {
        // Fallback Web Notification
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/icon-192.png'
          });
        }
      }
    } catch (err) {
      console.warn('Không thể gửi thông báo sync success:', err);
    }
  }
}

