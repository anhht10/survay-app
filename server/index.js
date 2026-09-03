import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Xác định đường dẫn thư mục hiện tại của file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Nạp .env từ thư mục server/ và từ thư mục root của dự án
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import responseRoutes from './routes/responseRoutes.js';
import surveyRoutes from './routes/surveyRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối cơ sở dữ liệu MongoDB
connectDB();

// Đăng ký các Route API
app.use('/api/responses', responseRoutes);
app.use('/api/surveys', surveyRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Survey PWA Backend (MongoDB)',
    time: new Date().toISOString()
  });
});

// Endpoint dự phòng tương thích ngược action-based (/api/exec)
app.post('/api/exec', async (req, res, next) => {
  const action = req.body?.action;
  if (action === 'submitResponse') {
    req.url = '/';
    return responseRoutes(req, res, next);
  } else if (action === 'saveSurvey' || action === 'getSurveys' || action === 'getSurvey') {
    req.url = '/';
    return surveyRoutes(req, res, next);
  }
  res.status(400).json({ success: false, message: 'Action không hợp lệ' });
});

// Root route
app.get('/', (_req, res) => {
  res.send('Server Survey PWA MongoDB đang hoạt động tại cổng ' + PORT);
});

app.listen(PORT, () => {
  console.log(`🚀 [Server] Survey Backend MongoDB đang chạy tại http://localhost:${PORT}`);
  console.log(`📡 [API] Endpoint phản hồi: http://localhost:${PORT}/api/responses`);
  console.log(`📡 [API] Endpoint khảo sát: http://localhost:${PORT}/api/surveys`);
});
