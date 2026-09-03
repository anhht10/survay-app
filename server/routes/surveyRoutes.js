import express from 'express';
import { Survey } from '../models/Survey.js';

const router = express.Router();

/**
 * GET /api/surveys
 * Lấy danh sách khảo sát từ MongoDB
 */
router.get('/', async (_req, res) => {
  try {
    const surveys = await Survey.find().sort({ updatedAt: -1 });
    return res.json({ success: true, surveys });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/surveys/:id
 * Lấy chi tiết khảo sát theo id
 */
router.get('/:id', async (req, res) => {
  try {
    const survey = await Survey.findOne({ id: req.params.id });
    if (!survey) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khảo sát' });
    }
    return res.json({ success: true, survey });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/surveys
 * Tạo hoặc cập nhật khảo sát trên MongoDB (Upsert)
 */
router.post('/', async (req, res) => {
  try {
    const surveyData = req.body.survey || req.body;
    if (!surveyData || !surveyData.id) {
      return res.status(400).json({ success: false, message: 'Dữ liệu khảo sát thiếu ID' });
    }

    const updated = await Survey.findOneAndUpdate(
      { id: surveyData.id },
      surveyData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({
      success: true,
      surveyId: updated.id,
      version: updated.version,
      message: 'Khảo sát đã được lưu vào MongoDB'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/surveys/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await Survey.deleteOne({ id: req.params.id });
    return res.json({ success: true, message: 'Đã xóa khảo sát thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

