import mongoose from 'mongoose';

const QuestionOptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        'text',
        'long_text',
        'single_choice',
        'multiple_choice',
        'number',
        'rating',
        'yes_no'
      ]
    },
    title: { type: String, required: true },
    description: { type: String },
    required: { type: Boolean, default: false },
    options: [QuestionOptionSchema],
    order: { type: Number, default: 1 },
    min: { type: Number },
    max: { type: Number },
    placeholder: { type: String }
  },
  { _id: false }
);

const SurveySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    version: { type: Number, default: 1 },
    questions: [QuestionSchema]
  },
  {
    timestamps: true
  }
);

export const Survey = mongoose.model('Survey', SurveySchema);

