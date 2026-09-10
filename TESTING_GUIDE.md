# HƯỚNG DẪN BUILD SIGNED APK & KIỂM THỬ THỰC ĐỊA TRÊN THIẾT BỊ ANDROID THẬT

Tài liệu này cung cấp toàn bộ quy trình:
1. Đóng gói mã nguồn & Đồng bộ sang Capacitor Android.
2. Build file **Signed APK** (APK đã ký số).
3. Cài đặt và kiểm thử 4 tính năng thực địa cốt lõi trên **điện thoại Android thật**:
   - **Offline Capture** (Lưu trữ ngoại tuyến không mất dữ liệu).
   - **Camera Plugin** (Chụp ảnh hiện trường bằng camera phần cứng).
   - **GPS Geolocation** (Bắt tọa độ vệ tinh độ chính xác cao).
   - **Sync-on-Reconnect & Push/Local Notification** (Tự động đồng bộ và bắn thông báo khi có mạng trở lại).

---

## 🛠️ BƯỚC 1: Build Mã Nguồn & Đồng Bộ Capacitor

Tại thư mục gốc dự án (`e:\DaNenTang\survay-app`), chạy lệnh:

```powershell
npm run build
npx cap sync
```
*(Hoặc dùng lệnh rút gọn đã cấu hình sẵn trong package.json: `npm run cap:build`)*

Lệnh này sẽ:
- Biên dịch TypeScript strict mode và đóng gói các component React vào thư mục `dist/`.
- Tự động copy web assets và cấu hình 4 plugins (`@capacitor/camera`, `@capacitor/geolocation`, `@capacitor/local-notifications`, `@capacitor/push-notifications`) sang thư mục `android/`.

---

## 📦 BƯỚC 2: Build Signed APK (Xuất File APK Đã Ký Số)

Dự án đã được tạo sẵn file Keystore chuẩn PKCS12 tại:
- **Đường dẫn**: `android/app/release-key.jks`
- **Alias**: `survey-key`
- **Mật khẩu Keystore**: `123456`
- **Mật khẩu Key**: `123456`
- **Cấu hình tự động**: Đã khai báo trong `android/app/build.gradle` (`signingConfigs.release`).

### Cách 1: Sử dụng Android Studio (Khuyến nghị)
1. Mở **Android Studio**.
2. Chọn **Open** (Mở dự án) → Trỏ đến thư mục `e:\DaNenTang\survay-app\android`.
3. Đợi Android Studio đồng bộ Gradle xong (Gradle Sync Finished).
4. Trên thanh menu trên cùng, chọn:
   **Build** → **Generate Signed Bundle / APK...**
5. Chọn tùy chọn **APK** → Bấm **Next**.
6. Điền thông tin khóa đã tạo:
   - **Key store path**: Trỏ đến file `android/app/release-key.jks`
   - **Key store password**: `123456`
   - **Key alias**: `survey-key`
   - **Key password**: `123456`
7. Bấm **Next** → Tích chọn **release** → Bấm **Create / Finish**.
8. File APK đã ký số sẽ xuất hiện tại:
   `android/app/release/app-release.apk` (hoặc `android/app/build/outputs/apk/release/app-release.apk`).

---

### Cách 2: Build Trực Tiếp Bằng Dòng Lệnh (Gradle CLI)
Nếu máy bạn đã cấu hình biến môi trường `JAVA_HOME` trỏ tới JDK 17 hoặc 21 (hoặc thư mục `jbr` của Android Studio):

```powershell
# Trỏ JAVA_HOME tới JDK của Android Studio (nếu chưa set)
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"

# Di chuyển vào thư mục android và build release APK
cd android
.\gradlew.bat assembleRelease
```

File APK sẽ được tạo tại:
`android/app/build/outputs/apk/release/app-release-unsigned.apk` hoặc `app-release.apk`.

---

## 📱 BƯỚC 3: Cài Đặt Lên Điện Thoại Android Thật

1. **Bật chế độ Nhà phát triển (Developer Options) trên điện thoại**:
   - Vào *Cài đặt* → *Thông tin điện thoại* → Chạm liên tục 7 lần vào *Số hiệu bản dựng (Build Number)*.
   - Vào *Tùy chọn cho nhà phát triển* → Bật **Gỡ lỗi USB (USB Debugging)**.
2. **Cài đặt APK**:
   - **Cách A (Qua cáp USB & ADB)**:
     ```powershell
     adb install android/app/build/outputs/apk/release/app-release.apk
     ```
   - **Cách B (Không cần cáp)**: Copy file `app-release.apk` qua Google Drive, Zalo, Telegram hoặc thẻ nhớ vào điện thoại, sau đó mở file trên điện thoại và chọn **Cài đặt** (Cho phép cài đặt từ nguồn không xác định).

---

## 🧪 BƯỚC 4: Kịch Bản Kiểm Thử Thực Địa (Field Test Scenarios)

### ✈️ Kịch Bản 1: Kiểm Thử Chụp Ảnh & Bắt GPS Ngoại Tuyến (Offline Field Capture)

1. Trên điện thoại Android, vuốt thanh cài đặt nhanh xuống và **Bật Chế độ Máy Bay (Airplane Mode)** (Tắt hoàn toàn Wi-Fi và Dữ liệu di động 4G/5G).
2. Mở ứng dụng **Field Survey**.
3. Tại màn hình chính, bấm **"Làm bài khảo sát"** (hoặc chọn khảo sát *Môi Trường Đà Nẵng*).
4. Điền các câu hỏi trắc nghiệm, sau đó cuộn xuống **Phần 7: Ghi Nhận Thực Địa**:
   - **Thử nghiệm Camera Plugin**:
     - Bấm nút **"Mở máy ảnh / Chụp ngay"**.
     - Thiết bị sẽ yêu cầu cấp quyền Camera (chọn *Khi dùng ứng dụng*).
     - Giao diện camera native của điện thoại xuất hiện. Chụp 1 bức ảnh hiện trường thực tế.
     - Sau khi chụp, ảnh thumbnail hiển thị ngay trên phiếu khảo sát với dấu tick xanh *"Ảnh đã được lưu cục bộ"*. Bấm vào ảnh để xem chế độ phóng to toàn màn hình.
   - **Thử nghiệm GPS Geolocation Plugin**:
     - Bấm nút **"Lấy tọa độ GPS hiện tại"**.
     - Thiết bị yêu cầu quyền vị trí (chọn *Chính xác / Khi dùng ứng dụng*).
     - Ứng dụng kết nối chip GPS và hiển thị: **Vĩ độ**, **Kinh độ**, **Sai số (±X mét)**.
     - Nút *"Xem trên Google Maps"* sẵn sàng để kiểm tra tọa độ.
5. Cuộn xuống cuối trang và bấm nút **"GỬI KHẢO SÁT / APPLY"**.
6. **Kết Quả Mong Đợi**:
   - Hộp thoại thông báo xuất hiện: *"✓ Khảo sát đã được lưu an toàn trên máy. Thiết bị đang ngoại tuyến..."*.
   - Chuyển sang tab **"Phản hồi"**: Phiếu khảo sát vừa làm xuất hiện với huy hiệu màu vàng **"Chờ gửi (Pending)"**.
   - Bấm xem chi tiết: Cả ảnh chụp hiện trường và tọa độ GPS đều được hiển thị đầy đủ, nguyên vẹn 100% (Zero Data Loss).

---

### 🌐 Kịch Bản 2: Tự Động Đồng Bộ Khi Có Mạng Lại & Bắn Thông Báo (Sync-on-Reconnect & Notification)

1. Tiếp tục từ Kịch bản 1 (đang có ít nhất 1 phiếu khảo sát ở trạng thái `pending`).
2. Trên điện thoại, **Tắt Chế độ Máy Bay** (Bật lại kết nối Wi-Fi hoặc 4G).
3. Giữ ứng dụng mở hoặc chuyển qua lại giữa các tab.
4. **Kết Quả Mong Đợi**:
   - Ứng dụng ngay lập tức phát hiện kết nối mạng được phục hồi qua `NetworkDetector`.
   - `SyncManager` tự động chạy quy trình đồng bộ ngầm: Badge trạng thái chuyển từ `Pending` → `Đang sync` → `Đã gửi (Synced)` (Màu xanh lá).
   - **Native Notification Xuất Hiện**:
     - Trên thanh thông báo đỉnh màn hình điện thoại Android xuất hiện banner:
       > 🔔 **Đồng bộ thành công! 🚀**
       > *Một phiếu khảo sát hiện trường đã được gửi an toàn lên hệ thống.*
     - Có âm thanh hoặc rung thông báo của hệ thống Android.
   - Dữ liệu ảnh Base64 và tọa độ GPS được chuyển giao an toàn lên server.

---

### 🔄 Kịch Bản 3: Thử Nghiệm Tắt Ứng Dụng Đột Ngột (Crash / Process Kill Resilience)

1. Tắt mạng (Offline).
2. Điền khảo sát, chụp ảnh, lấy GPS, nhấn **APPLY**.
3. Ngay khi thông báo thành công xuất hiện, vuốt đóng ứng dụng khỏi danh sách đa nhiệm (Kill app process).
4. Mở lại ứng dụng:
   - Vào tab **Phản hồi**: Toàn bộ dữ liệu phiếu khảo sát, ảnh chụp và vị trí GPS vẫn còn nguyên vẹn nhờ kiến trúc IndexedDB bền vững.
5. Bật mạng lại: Ứng dụng tự động đồng bộ và bắn thông báo thành công như bình thường.

