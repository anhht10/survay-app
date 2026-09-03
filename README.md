# Ứng Dụng Khảo Sát Mobile-First & Offline-First PWA

> **Progressive Web App (PWA)** chuyên dụng cho thiết bị di động, hoạt động bền bỉ trong điều kiện không có Internet (Offline-First), đảm bảo **Zero Data Loss (Tuyệt đối không mất dữ liệu)**, tự động đồng bộ hóa lên **Google Apps Script** và lưu trữ trong **Google Sheets** khi kết nối mạng phục hồi.

---

## 🌟 Tính Năng Nổi Bật

1. **Mobile-First Design**:
   - Thiết kế ưu tiên tối đa cho màn hình điện thoại di động (touch targets ≥ 44px, khoảng cách thoáng, bố cục trực quan).
   - Tối ưu thao tác một tay, cuộn mượt mà, hỗ trợ bàn phím số chuyên dụng cho các câu hỏi nhập số.
2. **Offline-First Chuẩn Mực**:
   - Khởi chạy và mở app hoàn toàn ngoại tuyến nhờ **Service Worker Cache** và **PWA Manifest**.
   - Lưu trữ toàn bộ câu trả lời cục bộ vào **IndexedDB (Dexie.js)** trước khi thực hiện network request (`UI → IndexedDB → Sync Manager → Server`).
   - Tuyệt đối không mất dữ liệu ngay cả khi người dùng tắt trình duyệt hoặc khởi động lại máy ngay sau khi nhấn "Apply".
3. **Cơ Chế Đồng Bộ Tự Động & Chống Trùng Lặp (Idempotency)**:
   - Tự động kích hoạt đồng bộ khi thiết bị bắt được sự kiện `window.addEventListener('online')`, khi khởi động ứng dụng (App startup), hoặc theo chu kỳ ngầm.
   - Cơ chế **Exponential Backoff Retry**: Tự động thử lại với độ trễ tăng dần (`5s`, `15s`, `30s`, `60s`, `300s`).
   - Sử dụng **UUID v4 (`responseId`)** làm **Idempotency Key**: Đảm bảo an toàn tuyệt đối, gửi lại nhiều lần không bao giờ tạo dòng dữ liệu trùng lặp trong Google Sheets.
4. **Hỗ Trợ Đầy Đủ 7 Loại Câu Hỏi**:
   - **Văn bản ngắn (Text)**
   - **Văn bản dài (Long Text / Textarea)**
   - **Một lựa chọn (Single Choice / Radio)**
   - **Nhiều lựa chọn (Multiple Choice / Checkbox)**
   - **Con số (Number - có Min/Max)**
   - **Đánh giá sao (Rating 1-5 sao)**
   - **Có / Không (Yes / No)**
   - Thiết kế dạng module dễ dàng mở rộng thêm Date, Time, Email, GPS, Signature...
5. **Bộ Công Cụ Quản Trị (Admin Builder & Response Manager)**:
   - Tạo, chỉnh sửa, nhân bản, xuất bản và xóa khảo sát.
   - Hỗ trợ **Survey Versioning (`version`)**: Tự động tăng phiên bản khi sửa câu hỏi, giúp dữ liệu phản hồi cũ luôn liên kết đúng cấu trúc câu hỏi tại thời điểm trả lời.
   - Bảng quản lý phản hồi thời gian thực với các bộ lọc trạng thái: *Tất cả*, *Chờ gửi (Pending)*, *Đang sync (Syncing)*, *Đã gửi (Synced)*, *Thất bại (Failed)*.
   - Nút kích hoạt thủ công: **"Đồng bộ ngay"** và **"Thử lại tất cả"**.
6. **Bảng Điều Khiển Kiểm Thử Tích Hợp (Offline & Sync Test Lab)**:
   - Nút Lab tích hợp sẵn trên thanh Header để giả lập lỗi Server 500, kiểm thử Idempotency gửi trùng lặp, và hướng dẫn test offline trực tiếp.

---

## 🏗️ Kiến Trúc Hệ Thống

```text
               Mobile Browser / Thiết bị di động
                              │
                              ▼
                      React PWA Client
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
       ▼                      ▼                      ▼
  Giao diện &            IndexedDB            Service Worker
Survey Builder          (Dexie.js)              (Workbox)
(Form Validation)      (Storage chính)       (Offline App Shell)
       │                      │
       │                      │
       └──────────────► 1. Save Local First
                              │ (responseId = UUID v4)
                              │ (status = 'pending')
                              ▼
                         Sync Manager
                              │
              ┌───────────────┴───────────────┐
              │                               │
        [Có Internet]                   [Mất mạng / Lỗi]
              │                               │
              ▼                               ▼
       POST /exec                       Giữ nguyên trong
 (Kèm Idempotency Key)                     IndexedDB
              │                               │
              ▼                         Đợi sự kiện 'online'
      Google Apps Script               hoặc Exponential Backoff
              │                               │
              ▼                               ▼
      Google Spreadsheet               Tự động kích hoạt
 (Surveys, Questions,                 Sync Manager gửi lại
  Responses, Answers)
```

---

## 📁 Cấu Trúc Thư Mục

```text
Survay/
├── .env.example                       # Mẫu cấu hình môi trường
├── .env                               # File cấu hình biến môi trường
├── index.html                         # Mobile-first meta viewport & PWA header
├── package.json                       # Dependencies & Scripts
├── tsconfig.json                      # Cấu hình TypeScript Strict Mode
├── vite.config.ts                     # Cấu hình Vite & VitePWA (Service Worker)
├── tailwind.config.js                 # Cấu hình giao diện Tailwind
├── public/                            # Static assets, favicon, icon PWA
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   └── maskable-icon-512.png
├── google-apps-script/
│   ├── Code.gs                        # Mã nguồn Backend Google Apps Script Web App
│   ├── appsscript.json                # Manifest cấu hình quyền của Google Script
│   └── README_SETUP.md                # Hướng dẫn chi tiết tạo Sheets và Deploy
├── src/
│   ├── App.tsx                        # Root App với Hash Routing & Network Banner
│   ├── main.tsx                       # Entry point React & đăng ký Service Worker
│   ├── index.css                      # Tailwind base & hiệu ứng chuyển động
│   ├── config/
│   │   ├── env.ts                     # Cấu hình biến môi trường & chế độ Mock
│   │   └── constants.ts               # Hằng số Backoff delays, retry limits
│   ├── types/
│   │   ├── survey.ts                  # Types cho Survey, Question, QuestionType
│   │   ├── response.ts                # Types cho SurveyResponse, Answer, SyncStatus
│   │   └── api.ts                     # Types cho API requests / responses
│   ├── db/
│   │   ├── database.ts                # Khởi tạo Dexie DB & Seeding dữ liệu mẫu
│   │   ├── surveyRepository.ts        # Repository quản lý Surveys trong IndexedDB
│   │   └── responseRepository.ts      # Repository quản lý Responses trong IndexedDB
│   ├── services/
│   │   ├── storage/
│   │   │   └── device.ts              # Quản lý Device ID định danh thiết bị
│   │   ├── sync/
│   │   │   ├── networkDetector.ts     # Lắng nghe trạng thái online/offline thực tế
│   │   │   └── syncManager.ts         # Quản lý hàng đợi, Mutex lock, Backoff Retry
│   │   └── api/
│   │       ├── client.ts              # Fetch client có timeout & xử lý CORS
│   │       └── surveyApi.ts           # API Service kết nối Google Apps Script
│   ├── hooks/
│   │   ├── useNetworkStatus.ts        # Hook reactive trạng thái mạng
│   │   ├── useSurveys.ts              # Hook CRUD surveys
│   │   ├── useSurveyForm.ts           # Hook điền form, validate, offline-first submit
│   │   └── useSync.ts                 # Hook quản lý danh sách phản hồi & đồng bộ
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx             # Header mobile kèm network pill
│   │   │   ├── NetworkBanner.tsx      # Thanh thông báo Offline / Syncing
│   │   │   ├── Button.tsx             # Nút bấm touch-friendly (≥ 44px)
│   │   │   ├── Modal.tsx              # Hộp thoại bottom-sheet
│   │   │   ├── LoadingSpinner.tsx     # Spinner tải dữ liệu
│   │   │   └── TestPanelModal.tsx     # Bảng kiểm thử Offline & Sync Lab
│   │   ├── survey-builder/
│   │   │   ├── QuestionEditor.tsx     # Modal soạn thảo câu hỏi
│   │   │   ├── QuestionList.tsx       # Danh sách câu hỏi, sắp xếp, nhân bản
│   │   │   └── QuestionTypeSelector.tsx # Lựa chọn 7 loại câu hỏi
│   │   ├── survey-form/
│   │   │   ├── QuestionField.tsx      # Khung câu hỏi, hiển thị lỗi inline
│   │   │   ├── SubmitSuccessModal.tsx # Thông báo thành công online / offline
│   │   │   └── inputs/                # 7 input component tối ưu mobile
│   │   │       ├── TextInput.tsx
│   │   │       ├── LongTextInput.tsx
│   │   │       ├── SingleChoiceInput.tsx
│   │   │       ├── MultipleChoiceInput.tsx
│   │   │       ├── NumberInput.tsx
│   │   │       ├── RatingInput.tsx
│   │   │       └── YesNoInput.tsx
│   │   └── responses/
│   │       ├── ResponseCard.tsx       # Thẻ chi tiết câu trả lời
│   │       └── SyncStatusBadge.tsx    # Huy hiệu trạng thái đồng bộ
│   ├── pages/
│   │   ├── DashboardPage.tsx          # Quản lý danh sách khảo sát
│   │   ├── SurveyBuilderPage.tsx      # Trình tạo & chỉnh sửa khảo sát
│   │   ├── SurveyPreviewPage.tsx      # Xem trước giao diện điện thoại
│   │   ├── PublicSurveyPage.tsx       # Trang làm khảo sát công khai (/s/:id)
│   │   └── ResponsesPage.tsx          # Trang quản lý câu trả lời & đồng bộ
│   └── utils/
│       ├── uuid.ts                    # Sinh UUID v4 chuẩn RFC4122
│       ├── validation.ts              # Kiểm tra tính hợp lệ của câu trả lời
│       └── formatters.ts              # Định dạng ngày giờ và hiển thị
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Yêu Cầu Môi Trường
- **Node.js**: Phiên bản 18 trở lên (Khuyến nghị 20+)
- **NPM**: Phiên bản 9 trở lên

### 1. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### 2. Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```
Trình duyệt sẽ mở ứng dụng tại địa chỉ: `http://localhost:5173`.
> **Lưu ý:** Ứng dụng đã tích hợp sẵn dữ liệu mẫu *"Khảo sát Trải nghiệm Khách hàng 2026"* và chế độ **Local Mock API**. Bạn có thể test ngay lập tức các tính năng Offline, Submit, Retry mà chưa cần cài Google Sheet ngay!

### 3. Khởi chạy Backend MongoDB (Node.js Express + Mongoose)
Dự án đã tích hợp sẵn backend Express kết nối MongoDB tại thư mục `server/`.

#### Bước 3.1: Cài đặt và cấu hình MongoDB
1. Đảm bảo dịch vụ MongoDB (mongod / MongoDB Compass / Docker) đang chạy trên máy của bạn tại cổng mặc định `27017` (hoặc sử dụng chuỗi kết nối MongoDB Atlas Cloud).
2. Kiểm tra file `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/survey_db
   ```
   *(Nếu dùng MongoDB Atlas Cloud, chỉ cần thay `MONGODB_URI=mongodb+srv://...`)*

#### Bước 3.2: Khởi động Server Backend
Từ thư mục gốc dự án, chạy lệnh:
```bash
npm run server
```
hoặc chạy với chế độ tự động reload khi sửa code:
```bash
npm run server:dev
```
Server sẽ khởi chạy tại `http://localhost:5000` và tự động kết nối với MongoDB!

#### Bước 3.3: Cấu hình Frontend kết nối Server MongoDB
Kiểm tra file `.env` ở thư mục gốc của frontend:
```env
VITE_API_URL=http://localhost:5000/api
```
Giờ đây mọi phản hồi khi submit (hoặc sau khi offline có mạng lại) sẽ được tự động đồng bộ trực tiếp vào Collection `responses` và `surveys` trên MongoDB!

---

### (Tùy chọn) Sử dụng Google Apps Script & Google Sheets
Nếu bạn vẫn muốn đồng bộ lên Google Sheets thay vì MongoDB:
1. Mở file [google-apps-script/Code.gs](file:///e:/DaNenTang/Survay/google-apps-script/Code.gs) dán vào Apps Script của Google Sheets.
2. Deploy thành Web App (chọn quyền Anyone).
3. Đổi `VITE_API_URL=https://script.google.com/macros/s/.../exec` trong file `.env`.
*(Xem hướng dẫn chi tiết từng thao tác có hình minh họa tại [google-apps-script/README_SETUP.md](file:///e:/DaNenTang/Survay/google-apps-script/README_SETUP.md))*

### 4. Build sản phẩm (Production Build)
```bash
npm run build
```
Lệnh này sẽ biên dịch mã TypeScript strict mode, tối ưu hóa bundle và tạo Service Worker Workbox vào thư mục `dist/`.

### 5. Xem trước bản Production (Preview PWA)
```bash
npm run preview
```

---

## ☁️ Hướng Dẫn Triển Khai Lên Vercel & Netlify

### Triển khai lên Vercel
1. Đẩy mã nguồn lên kho chứa GitHub / GitLab.
2. Truy cập [vercel.com](https://vercel.com) → Chọn **Add New Project**.
3. Chọn kho chứa GitHub vừa tạo.
4. Tại mục **Environment Variables**, thêm biến:
   - Key: `VITE_API_URL`
   - Value: `URL Web App Google Apps Script của bạn`
5. Nhấn **Deploy**. Vercel sẽ tự động build và cấp chứng chỉ HTTPS (bắt buộc để PWA hoạt động và cho phép cài đặt vào màn hình chính).

### Triển khai lên Netlify
1. Truy cập [netlify.com](https://netlify.com) → Chọn **Add new site** → **Import an existing project**.
2. Thiết lập:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Tại phần **Site configuration** → **Environment variables**, thêm `VITE_API_URL`.
4. Nhấn **Deploy site**.

---

## 🧪 Hướng Dẫn Kiểm Thử 6 Kịch Bản (Test Scenarios)

Bạn có thể dễ dàng kiểm thử toàn bộ 6 kịch bản theo yêu cầu của dự án:

### Test 1: Gửi khảo sát khi Offline (Offline Submit)
1. Mở DevTools (**F12**) → Chuyển sang tab **Network** → Chọn chế độ **Offline** (hoặc ngắt Wifi/mạng của máy tính).
2. Nhấn **"Làm khảo sát"** trên giao diện.
3. Điền đầy đủ câu trả lời và nhấn nút **"GỬI KHẢO SÁT / APPLY"**.
4. **Kết quả mong đợi**:
   - Ứng dụng hiển thị thông báo thân thiện: *"✓ Khảo sát đã được lưu an toàn. Thiết bị hiện đang offline..."*.
   - Mở tab **Phản hồi** (hoặc DevTools → Application → IndexedDB → `SurveyOfflineDB` → `responses`): Phản hồi được lưu trữ thành công với trạng thái `syncStatus = "pending"` và `syncAttempts = 0`.

### Test 2: Tự động gửi khi có Internet trở lại (Auto Sync)
1. Sau khi hoàn thành Test 1 (đang có phản hồi ở trạng thái `pending`).
2. Trên DevTools tab **Network**, chuyển từ **Offline** về lại **No throttling (Online)** (hoặc bật lại Wifi).
3. **Kết quả mong đợi**:
   - Ứng dụng tự động bắt sự kiện `online`.
   - `SyncManager` ngay lập tức kích hoạt đồng bộ: Badge chuyển từ `pending` → `syncing` → `synced`.
   - Nếu đã cấu hình Google Sheets, dòng dữ liệu xuất hiện ngay trong sheet `Responses` và `Answers`.

### Test 3: Xử lý lỗi máy chủ 500 & Exponential Backoff Retry
1. Nhấn vào biểu tượng **Trợ giúp / Lab (?)** ở góc phải Header để mở *Bảng Kiểm Thử Offline & Sync Lab*.
2. Bật công tắc **"Giả lập lỗi Server 500"**.
3. Điền khảo sát và nhấn **"GỬI KHẢO SÁT / APPLY"**.
4. **Kết quả mong đợi**:
   - Dữ liệu cục bộ vẫn được giữ nguyên vẹn 100% trong IndexedDB (Zero Data Loss).
   - Trạng thái phản hồi chuyển thành `failed` kèm thông báo lỗi cụ thể.
   - Số lần thử (`syncAttempts`) tăng lên và áp dụng độ trễ tăng dần (5s, 15s, 30s, 60s, 300s).
   - Người dùng có thể nhấn nút **"Thử lại tất cả"** hoặc **"Đồng bộ ngay"** tại trang Phản hồi để gửi lại thủ công.

### Test 4: Chống trùng lặp dữ liệu (Idempotency)
1. Trong *Bảng Kiểm Thử Offline & Sync Lab*, nhấn nút **"Chạy thử nghiệm Idempotency"**.
2. Hệ thống sẽ gửi liên tiếp 2 request mang cùng một `responseId` UUID v4 lên server:
   - Lần 1: Server ghi nhận thành công và trả về `status: "synced"`.
   - Lần 2: Server phát hiện `responseId` đã tồn tại trong sheet `Responses`, không ghi thêm dòng mới, trả về `status: "already_exists"`.
3. Client đánh dấu thành công mà không bị nhân bản dữ liệu trên Google Sheets.

### Test 5: Đóng ứng dụng ngay sau khi nhấn Apply
1. Tắt mạng (Offline).
2. Điền khảo sát, nhấn **Apply**.
3. Ngay khi hộp thoại thông báo xuất hiện, **tắt hẳn tab trình duyệt** hoặc nhấn Ctrl+W.
4. Mở lại trình duyệt và vào lại địa chỉ ứng dụng → Chọn tab **Phản hồi**.
5. **Kết quả mong đợi**: Câu trả lời vẫn tồn tại nguyên vẹn trong IndexedDB, không hề bị mất dữ liệu.

### Test 6: Reload ứng dụng khi đang Offline (PWA Shell Caching)
1. Chạy `npm run preview` hoặc deploy lên HTTPS.
2. Tắt toàn bộ kết nối Internet.
3. Nhấn **F5 (Reload)** trang web.
4. **Kết quả mong đợi**: Ứng dụng PWA vẫn tải lên mượt mà và hoạt động bình thường nhờ Service Worker cache tĩnh.

---

## 🔒 Cam Kết Không Mất Dữ Liệu (Zero Data Loss Guarantee)

Ứng dụng tuân thủ nghiêm ngặt nguyên tắc cốt lõi:
> **"Dữ liệu cục bộ (IndexedDB) là nguồn chân lý (Source of Truth) cho đến khi Server phản hồi xác nhận đồng bộ thành công."**

* Hệ thống **không bao giờ** gửi trực tiếp lên mạng rồi mới lưu.
* Hệ thống **không bao giờ** xóa bản ghi cục bộ nếu chưa nhận được `synced` hoặc `already_exists` từ Google Apps Script.
* Mọi phản hồi đều được gắn UUID v4 duy nhất ngay từ thời điểm tạo trên máy khách, bảo vệ toàn vẹn dữ liệu trong mọi điều kiện mạng chập chờn hoặc mất kết nối đột ngột.

