import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Đảm bảo luôn tìm đúng file .env dù chạy từ thư mục root hay thư mục server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Nạp file .env từ server/ và từ root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/survey_db';

  console.log('[MongoDB] Đang kết nối tới URI:', uri);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Timeout sau 5 giây nếu không kết nối được
    });
    console.log(`[MongoDB] Kết nối cơ sở dữ liệu thành công: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Lỗi kết nối cơ sở dữ liệu: ${error.message}`);
    console.log('👉 Gợi ý: Hãy đảm bảo dịch vụ MongoDB (mongod / Compass) đã được bật trên máy tính của bạn, hoặc cấu hình chuỗi MONGODB_URI trong server/.env tới MongoDB Atlas.');
  }
}
