import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed }
  },
  { _id: false }
);

const ResponseSchema = new mongoose.Schema(
  {
    // responseId từ client làm Khóa Idempotency chống trùng lặp duy nhất
    id: { type: String, required: true, unique: true, index: true },
    surveyId: { type: String, required: true, index: true },
    surveyTitle: { type: String },
    surveyVersion: { type: Number, required: true, default: 1 },
    answers: [AnswerSchema],
    deviceId: { type: String },
    clientCreatedAt: { type: Date },
    receivedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

export const Response = mongoose.model('Response', ResponseSchema);

