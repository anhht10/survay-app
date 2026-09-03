import express from 'express';
import { Response } from '../models/Response.js';

const router = express.Router();

/**
 * POST /api/responses
 * Nhận và lưu phản hồi khảo sát với cơ chế Idempotency chống trùng lặp
 */
router.post('/', async (req, res) => {
  try {
    const {
      id,
      responseId,
      surveyId,
      surveyTitle,
      surveyVersion,
      answers,
      createdAt,
      deviceId
    } = req.body;

    const targetId = responseId || id;

    if (!targetId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_ID',
          message: 'Thiếu responseId (UUID v4) duy nhất của phản hồi'
        }
      });
    }

    // 1. KIỂM TRA IDEMPOTENCY KEY TRONG MONGODB
    const existing = await Response.findOne({ id: targetId });
    if (existing) {
      console.log(`[MongoDB] Nhận request trùng lặp cho responseId: ${targetId} -> Trả về already_exists`);
      return res.status(200).json({
        success: true,
        responseId: targetId,
        status: 'already_exists',
        message: 'Phản hồi đã được lưu trước đó trên MongoDB (Idempotency Handled)'
      });
    }

    // 2. TẠO MỚI NẾU CHƯA CÓ
    const newResponse = await Response.create({
      id: targetId,
      surveyId,
      surveyTitle,
      surveyVersion: Number(surveyVersion) || 1,
      answers: answers || [],
      deviceId: deviceId || 'unknown',
      clientCreatedAt: createdAt ? new Date(createdAt) : new Date(),
      receivedAt: new Date()
    });

    console.log(`[MongoDB] Đã lưu thành công phản hồi mới vào MongoDB: ${targetId}`);

    return res.status(201).json({
      success: true,
      responseId: targetId,
      status: 'synced',
      message: 'Đã lưu phản hồi vào MongoDB thành công',
      data: newResponse
    });
  } catch (error) {
    console.error('[MongoDB] Lỗi khi lưu phản hồi:', error);

    // Bắt lỗi trùng duplicate key E11000 nếu có race condition trong cùng 1 tick
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        responseId: req.body.responseId || req.body.id,
        status: 'already_exists',
        message: 'Phản hồi đã được lưu trước đó (Race-Condition Handled)'
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Lỗi hệ thống khi lưu vào MongoDB'
      }
    });
  }
});

/**
 * GET /api/responses
 * Lấy danh sách phản hồi từ MongoDB
 */
router.get('/', async (req, res) => {
  try {
    const { surveyId } = req.query;
    const filter = surveyId ? { surveyId } : {};
    const list = await Response.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/responses/:id
 * Lấy chi tiết 1 phản hồi
 */
router.get('/:id', async (req, res) => {
  try {
    const response = await Response.findOne({ id: req.params.id });
    if (!response) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phản hồi' });
    }
    return res.json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

