import React, { useState, useEffect } from 'react';
import { Survey, Question, SurveyStatus } from '../types/survey';
import { surveyRepository } from '../db/surveyRepository';
import { QuestionList } from '../components/survey-builder/QuestionList';
import { QuestionEditor } from '../components/survey-builder/QuestionEditor';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { generateUUID } from '../utils/uuid';
import { ArrowLeft, Save, Send, Eye, Check } from 'lucide-react';

interface SurveyBuilderPageProps {
  surveyId?: string;
  onBack: () => void;
  onPreview: (id: string) => void;
  onSaved: (id: string) => void;
}

export const SurveyBuilderPage: React.FC<SurveyBuilderPageProps> = ({
  surveyId,
  onBack,
  onPreview,
  onSaved
}) => {
  const [survey, setSurvey] = useState<Survey>({
    id: generateUUID(),
    title: '',
    description: '',
    status: 'draft',
    version: 1,
    questions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      if (surveyId) {
        const existing = await surveyRepository.getById(surveyId);
        if (existing) {
          setSurvey(existing);
        }
      }
      setLoading(false);
    }
    load();
  }, [surveyId]);

  const handleSaveSurvey = async (newStatus?: SurveyStatus) => {
    if (!survey.title.trim()) {
      alert('Vui lòng nhập tên bài khảo sát!');
      return;
    }

    if (survey.questions.length === 0) {
      alert('Vui lòng thêm ít nhất 1 câu hỏi vào khảo sát!');
      return;
    }

    setIsSaving(true);
    try {
      const toSave: Survey = {
        ...survey,
        title: survey.title.trim(),
        description: survey.description?.trim() || undefined,
        status: newStatus || survey.status
      };

      await surveyRepository.save(toSave);
      setSurvey(toSave);
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 2500);
      onSaved(toSave.id);
    } catch (e) {
      console.error('Lỗi khi lưu khảo sát:', e);
      alert('Không thể lưu khảo sát vào bộ nhớ.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestion(undefined);
    setIsEditorOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setIsEditorOpen(true);
  };

  const handleSaveQuestion = (q: Question) => {
    if (editingQuestion) {
      // Sửa câu hỏi hiện tại
      setSurvey((prev) => ({
        ...prev,
        questions: prev.questions.map((item) => (item.id === q.id ? q : item))
      }));
    } else {
      // Thêm câu hỏi mới vào cuối
      setSurvey((prev) => ({
        ...prev,
        questions: [...prev.questions, { ...q, order: prev.questions.length + 1 }]
      }));
    }
    setIsEditorOpen(false);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      setSurvey((prev) => ({
        ...prev,
        questions: prev.questions
          .filter((q) => q.id !== id)
          .map((q, idx) => ({ ...q, order: idx + 1 }))
      }));
    }
  };

  const handleDuplicateQuestion = (id: string) => {
    const original = survey.questions.find((q) => q.id === id);
    if (!original) return;

    const copy: Question = {
      ...original,
      id: generateUUID(),
      title: `${original.title} (Bản sao)`,
      order: survey.questions.length + 1
    };

    setSurvey((prev) => ({
      ...prev,
      questions: [...prev.questions, copy]
    }));
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newQuestions = [...survey.questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index - 1];
    newQuestions[index - 1] = temp;

    setSurvey((prev) => ({
      ...prev,
      questions: newQuestions.map((q, idx) => ({ ...q, order: idx + 1 }))
    }));
  };

  const handleMoveDown = (index: number) => {
    if (index >= survey.questions.length - 1) return;
    const newQuestions = [...survey.questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index + 1];
    newQuestions[index + 1] = temp;

    setSurvey((prev) => ({
      ...prev,
      questions: newQuestions.map((q, idx) => ({ ...q, order: idx + 1 }))
    }));
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 text-sm">Đang nạp dữ liệu...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => onPreview(survey.id)}
          >
            Xem trước
          </Button>

          <Button
            variant="primary"
            size="sm"
            isLoading={isSaving}
            icon={<Save className="w-3.5 h-3.5" />}
            onClick={() => handleSaveSurvey()}
          >
            Lưu nháp
          </Button>

          {survey.status !== 'published' && (
            <Button
              variant="success"
              size="sm"
              isLoading={isSaving}
              icon={<Send className="w-3.5 h-3.5" />}
              onClick={() => handleSaveSurvey('published')}
            >
              Xuất bản
            </Button>
          )}
        </div>
      </div>

      {saveSuccessNotice && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Khảo sát đã được lưu an toàn vào bộ nhớ cục bộ (IndexedDB).</span>
        </div>
      )}

      {/* Survey Information Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Thông tin khảo sát
          </h3>
          <span className="text-xs font-mono text-slate-500">Phiên bản: v{survey.version}</span>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            Tên bài khảo sát <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            value={survey.title}
            onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
            placeholder="Ví dụ: Khảo sát chất lượng sản phẩm quý 3/2026"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            Mô tả mục đích khảo sát
          </label>
          <textarea
            rows={2}
            value={survey.description || ''}
            onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
            placeholder="Nhập lời cảm ơn hoặc hướng dẫn chung cho người tham gia..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Danh sách câu hỏi ({survey.questions.length})
          </h3>
        </div>

        <QuestionList
          questions={survey.questions}
          onAddNew={handleOpenAddQuestion}
          onEdit={handleOpenEditQuestion}
          onDelete={handleDeleteQuestion}
          onDuplicate={handleDuplicateQuestion}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      </div>

      {/* Modal Editor câu hỏi */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
        maxWidth="md"
      >
        <QuestionEditor
          initialQuestion={editingQuestion}
          onSave={handleSaveQuestion}
          onCancel={() => setIsEditorOpen(false)}
        />
      </Modal>
    </div>
  );
};

