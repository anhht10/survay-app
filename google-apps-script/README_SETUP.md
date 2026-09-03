# Hướng dẫn Cài đặt Backend Google Apps Script & Google Sheets

Tài liệu này hướng dẫn từng bước để thiết lập Google Sheets và triển khai Google Apps Script làm Backend phục vụ lưu trữ dữ liệu khảo sát từ ứng dụng PWA.

---

## BƯỚC 1: Tạo Google Spreadsheet mới

1. Truy cập [Google Sheets](https://sheets.new) trên trình duyệt của bạn.
2. Đổi tên bảng tính thành: `Database - Hệ Thống Khảo Sát PWA` (hoặc tên tùy thích).
3. Bạn **không cần phải tự tạo sheet hay gõ cột thủ công**, script sẽ tự động tạo đủ 4 bảng:
   * `Surveys`
   * `Questions`
   * `Responses`
   * `Answers`
   với đầy đủ tiêu đề cột và định dạng màu sắc đẹp mắt khi chạy lần đầu.

---

## BƯỚC 2: Mở Trình chỉnh sửa Apps Script

1. Trên menu của Google Sheets, chọn **Tiện ích mở rộng (Extensions)** → **Apps Script**.
2. Một tab mới sẽ mở ra trình soạn thảo mã Apps Script.
3. Đổi tên dự án từ *Dự án không có tiêu đề* thành `Survey Backend API`.

---

## BƯỚC 3: Dán Mã Nguồn

1. Xóa toàn bộ nội dung mặc định trong file `Code.gs`.
2. Mở file [google-apps-script/Code.gs](file:///e:/DaNenTang/Survay/google-apps-script/Code.gs) trong dự án này, copy toàn bộ nội dung và dán vào `Code.gs` trên Apps Script.
3. Nhấn tổ hợp phím **Ctrl + S** (hoặc nhấn biểu tượng Đĩa mềm) để lưu lại mã nguồn.

---

## BƯỚC 4: Triển khai thành Web App (Deploy)

1. Nhấn nút **Triển khai (Deploy)** ở góc trên bên phải → Chọn **Tùy chọn triển khai mới (New deployment)**.
2. Nhấn vào biểu tượng Bánh răng (Chọn loại / Select type) → Chọn **Ứng dụng web (Web app)**.
3. Điền các thông số:
   * **Mô tả (Description)**: `Survey API v1`
   * **Thực thi dưới dạng (Execute as)**: `Tôi (Tài khoản Google của bạn / Me)`
   * **Ai có quyền truy cập (Who has access)**: **`Bất kỳ ai (Anyone)`** *(BẮT BUỘC chọn "Anyone" để ứng dụng PWA trên điện thoại có thể gửi dữ liệu lên mà không bị chặn xác thực Google)*.
4. Nhấn **Triển khai (Deploy)**.
5. Nếu Google hiển thị hộp thoại yêu cầu cấp quyền truy cập:
   * Nhấn **Ủy quyền truy cập (Authorize access)**.
   * Chọn tài khoản Google của bạn.
   * Nhấn **Nâng cao (Advanced)** → Nhấn vào liên kết **Đi tới Survey Backend API (không an toàn) / Go to ... (unsafe)**.
   * Nhấn **Cho phép (Allow)**.
6. Sau khi triển khai xong, Google sẽ cung cấp cho bạn một đường dẫn dạng:
   ```text
   https://script.google.com/macros/s/AKfycbxAbCdEfGhIjKlMnOpQrStUvWxYz/exec
   ```
7. Nhấn nút **Sao chép (Copy)** để lưu lại URL Ứng dụng web này.

---

## BƯỚC 5: Cấu hình vào Ứng dụng PWA Frontend

1. Mở file `.env` ở thư mục gốc của dự án `Survay/`.
2. Dán URL vừa copy vào biến `VITE_API_URL`:
   ```env
   VITE_API_URL=https://script.google.com/macros/s/AKfycbxAbCdEfGhIjKlMnOpQrStUvWxYz/exec
   ```
3. Chạy lại dự án:
   ```bash
   npm run dev
   ```
4. Giờ đây, mọi bài khảo sát và câu trả lời điền từ ứng dụng PWA (cả khi online lẫn sau khi offline có mạng trở lại) sẽ được đồng bộ trực tiếp vào 4 sheets trên Google Spreadsheet của bạn!

---

## Cấu trúc 4 Sheets trên Google Spreadsheet

### 1. Sheet `Surveys`
| Cột | Ý nghĩa |
|---|---|
| `survey_id` | ID định danh khảo sát |
| `title` | Tiêu đề bài khảo sát |
| `description` | Mô tả mục đích khảo sát |
| `status` | Trạng thái (draft, published, archived) |
| `version` | Phiên bản khảo sát (1, 2, 3...) |
| `created_at` | Thời điểm tạo |
| `updated_at` | Thời điểm cập nhật cuối cùng |

### 2. Sheet `Questions`
| Cột | Ý nghĩa |
|---|---|
| `question_id` | ID câu hỏi |
| `survey_id` | ID bài khảo sát chứa câu hỏi |
| `survey_version` | Phiên bản khảo sát khi tạo câu hỏi |
| `type` | Loại (text, long_text, single_choice, multiple_choice, number, rating, yes_no) |
| `title` | Nội dung câu hỏi |
| `description` | Hướng dẫn thêm |
| `required` | Bắt buộc (TRUE / FALSE) |
| `options` | JSON danh sách lựa chọn (nếu có) |
| `order` | Thứ tự sắp xếp câu hỏi |

### 3. Sheet `Responses`
| Cột | Ý nghĩa |
|---|---|
| `response_id` | **Idempotency Key (UUID v4)** chống trùng lặp dữ liệu |
| `survey_id` | ID khảo sát được trả lời |
| `survey_version` | Phiên bản khảo sát tại thời điểm người dùng làm bài |
| `created_at` | Thời điểm người dùng ấn Apply trên điện thoại |
| `received_at` | Thời điểm server nhận và lưu thành công |
| `device_id` | Mã định danh thiết bị gửi bài |

### 4. Sheet `Answers`
| Cột | Ý nghĩa |
|---|---|
| `response_id` | ID phản hồi liên kết |
| `question_id` | ID câu hỏi liên kết |
| `value` | Nội dung câu trả lời của người dùng |

