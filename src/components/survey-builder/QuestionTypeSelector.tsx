import React from 'react';
import { QuestionType } from '../../types/survey';
import {
  Type,
  AlignLeft,
  CheckCircle2,
  CheckSquare,
  Hash,
  Star,
  ToggleLeft,
  Camera,
  MapPin
} from 'lucide-react';

interface QuestionTypeSelectorProps {
  selectedType: QuestionType;
  onSelect: (type: QuestionType) => void;
}

interface TypeItem {
  type: QuestionType;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  selectedType,
  onSelect
}) => {
  const typeList: TypeItem[] = [
    {
      type: 'text',
      label: 'Văn bản ngắn',
      desc: '1 dòng: Tên, email, số điện thoại...',
      icon: <Type className="w-5 h-5" />
    },
    {
      type: 'long_text',
      label: 'Văn bản dài',
      desc: 'Nhiều dòng: Ý kiến, đóng góp, mô tả...',
      icon: <AlignLeft className="w-5 h-5" />
    },
    {
      type: 'single_choice',
      label: 'Một lựa chọn (Radio)',
      desc: 'Chọn 1 đáp án duy nhất trong danh sách',
      icon: <CheckCircle2 className="w-5 h-5" />
    },
    {
      type: 'multiple_choice',
      label: 'Nhiều lựa chọn (Checkbox)',
      desc: 'Chọn 1 hoặc nhiều đáp án cùng lúc',
      icon: <CheckSquare className="w-5 h-5" />
    },
    {
      type: 'number',
      label: 'Số lượng',
      desc: 'Tuổi, số lượng, thang số có min/max',
      icon: <Hash className="w-5 h-5" />
    },
    {
      type: 'rating',
      label: 'Đánh giá sao',
      desc: 'Thang điểm từ 1 đến 5 sao trực quan',
      icon: <Star className="w-5 h-5" />
    },
    {
      type: 'yes_no',
      label: 'Có / Không',
      desc: 'Nút chọn nhanh 2 trạng thái Có / Không',
      icon: <ToggleLeft className="w-5 h-5" />
    },
    {
      type: 'image',
      label: 'Chụp ảnh hiện trường',
      desc: 'Chụp ảnh thực tế từ camera thiết bị',
      icon: <Camera className="w-5 h-5" />
    },
    {
      type: 'location',
      label: 'Tọa độ GPS',
      desc: 'Lấy vị trí GPS chính xác từ vệ tinh',
      icon: <MapPin className="w-5 h-5" />
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {typeList.map((item) => {
        const isSelected = selectedType === item.type;
        return (
          <button
            key={item.type}
            type="button"
            onClick={() => onSelect(item.type)}
            className={`flex items-start space-x-3 p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
              isSelected
                ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500 shadow-sm'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-bold leading-snug">{item.label}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">{item.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

