export const BACKOFF_INTERVALS_MS = [
  5 * 1000,      // 1st retry: 5s
  15 * 1000,     // 2nd retry: 15s
  30 * 1000,     // 3rd retry: 30s
  60 * 1000,     // 4th retry: 60s
  5 * 60 * 1000  // 5th retry: 5m
];

export const MAX_AUTO_RETRY_ATTEMPTS = 5;

export const DEFAULT_REQUEST_TIMEOUT_MS = 15000;

export const QUESTION_TYPES_META: Record<string, { label: string; icon: string; description: string }> = {
  text: {
    label: 'Văn bản ngắn',
    icon: 'Type',
    description: 'Nhập câu trả lời ngắn 1 dòng (tên, chức vụ, email...)'
  },
  long_text: {
    label: 'Văn bản dài',
    icon: 'AlignLeft',
    description: 'Nhập ý kiến, nhận xét nhiều dòng'
  },
  single_choice: {
    label: 'Một lựa chọn (Radio)',
    icon: 'CheckCircle2',
    description: 'Chọn duy nhất 1 trong các đáp án có sẵn'
  },
  multiple_choice: {
    label: 'Nhiều lựa chọn (Checkbox)',
    icon: 'CheckSquare',
    description: 'Chọn 1 hoặc nhiều đáp án cùng lúc'
  },
  number: {
    label: 'Số lượng / Con số',
    icon: 'Hash',
    description: 'Nhập tuổi, số lượng, doanh thu, thang điểm số'
  },
  rating: {
    label: 'Đánh giá Sao (Rating)',
    icon: 'Star',
    description: 'Thang điểm từ 1 đến 5 sao'
  },
  yes_no: {
    label: 'Có / Không (Yes / No)',
    icon: 'ToggleLeft',
    description: 'Lựa chọn nhanh Có hoặc Không'
  }
};

