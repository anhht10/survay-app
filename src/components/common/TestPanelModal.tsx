import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { syncManager } from '../../services/sync/syncManager';
import { surveyApi } from '../../services/api/surveyApi';
import { responseRepository } from '../../db/responseRepository';
import { generateUUID } from '../../utils/uuid';
import { ENV } from '../../config/env';
import { Bug, ShieldCheck } from 'lucide-react';

interface TestPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const TestPanelModal: React.FC<TestPanelModalProps> = ({
  isOpen,
  onClose,
  onRefreshData
}) => {
  const [simulate500, setSimulate500] = useState<boolean>(() => {
    return sessionStorage.getItem('TEST_SIMULATE_SERVER_500') === 'true';
  });

  const [testResult, setTestResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const toggleSimulate500 = () => {
    const nextVal = !simulate500;
    setSimulate500(nextVal);
    if (nextVal) {
      sessionStorage.setItem('TEST_SIMULATE_SERVER_500', 'true');
    } else {
      sessionStorage.removeItem('TEST_SIMULATE_SERVER_500');
    }
  };

  // Test Kịch bản 4: Gửi cùng responseId 2 lần để kiểm tra Idempotency
  const handleTestIdempotency = async () => {
    setIsRunning(true);
    setTestResult(null);
    try {
      const fixedId = `test-idempotent-${generateUUID().slice(0, 8)}`;
      const testPayload = {
        id: fixedId,
        surveyId: 'test-survey',
        surveyTitle: 'Khảo sát Kiểm thử Idempotency',
        surveyVersion: 1,
        answers: [{ questionId: 'q1', value: 'Giá trị kiểm thử trùng lặp' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncStatus: 'pending' as const,
        syncAttempts: 0
      };

      // Lưu local
      await responseRepository.save(testPayload);

      // Gửi lần 1
      const res1 = await surveyApi.submitResponse(testPayload);

      // Gửi lần 2 với cùng responseId
      const res2 = await surveyApi.submitResponse(testPayload);

      setTestResult(
        `✓ Kết quả Test Idempotency:\n- Lần 1: status = "${res1.status}" (thành công)\n- Lần 2: status = "${res2.status}" (hệ thống nhận diện đã tồn tại, không tạo trùng lặp!)`
      );

      await syncManager.syncPendingResponses(true);
      if (onRefreshData) onRefreshData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Lỗi test';
      setTestResult(`❌ Lỗi khi chạy test: ${msg}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bảng Kiểm Thử Offline & Sync Lab" maxWidth="lg">
      <div className="space-y-5 text-sm">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed">
          <strong>Chế độ hiện tại:</strong>{' '}
          {ENV.IS_MOCK_MODE ? (
            <span className="font-bold text-amber-700">Local Mock Mode (Chưa cấu hình VITE_API_URL)</span>
          ) : (
            <span className="font-bold text-emerald-700">Live Google Apps Script Web App</span>
          )}
          <br />
          Bạn có thể thử nghiệm đầy đủ các kịch bản offline, retry và chống mất dữ liệu ngay tại đây.
        </div>

        {/* Test 3: Giả lập lỗi máy chủ 500 để kiểm tra Retry */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bug className="w-5 h-5 text-rose-600" />
              <div>
                <p className="font-bold text-slate-800">Giả lập lỗi Server 500</p>
                <p className="text-xs text-slate-500">
                  Khi bật, mọi request gửi lên server sẽ bị lỗi để bạn kiểm tra trạng thái Failed & Exponential Backoff Retry
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSimulate500}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                simulate500 ? 'bg-rose-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>
          {simulate500 && (
            <div className="p-2 bg-rose-100 text-rose-800 rounded-lg text-xs font-semibold">
              ⚠️ Đang bật giả lập lỗi 500! Khi bấm gửi khảo sát, trạng thái sẽ chuyển thành 'failed' và chuẩn bị retry.
            </div>
          )}
        </div>

        {/* Test 4: Chống trùng lặp dữ liệu (Idempotency) */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-bold text-slate-800">Kiểm thử tính năng Chống Trùng Lặp (Idempotency)</p>
              <p className="text-xs text-slate-500">
                Gửi liên tiếp cùng 1 responseId 2 lần để xác minh server không tạo dòng duplicate
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            isLoading={isRunning}
            onClick={handleTestIdempotency}
            className="w-full mt-2"
          >
            Chạy thử nghiệm Idempotency
          </Button>
        </div>

        {/* Hiển thị kết quả test nếu có */}
        {testResult && (
          <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl whitespace-pre-wrap">
            {testResult}
          </div>
        )}

        {/* Hướng dẫn test ngoại tuyến với DevTools */}
        <div className="border-t border-slate-200 pt-3 space-y-2 text-xs text-slate-600">
          <p className="font-bold text-slate-800">Cách test Offline với Chrome DevTools:</p>
          <ol className="list-decimal list-inside space-y-1 pl-1">
            <li>Nhấn <strong>F12</strong> mở DevTools → Chuyển sang tab <strong>Network</strong>.</li>
            <li>Tại mục throttling dropdown (mặc định No throttling), chọn <strong>Offline</strong>.</li>
            <li>Điền khảo sát và nhấn <strong>"Gửi khảo sát" / "Apply"</strong>.</li>
            <li>Kiểm tra thông báo lưu an toàn trên máy và trạng thái <strong>Chờ gửi (Pending)</strong>.</li>
            <li>Chuyển lại về <strong>No throttling (Online)</strong> → Hệ thống tự động kích hoạt sync lên <strong>Đã gửi (Synced)</strong>!</li>
          </ol>
        </div>

        <Button variant="primary" size="md" className="w-full" onClick={onClose}>
          Đóng bảng kiểm thử
        </Button>
      </div>
    </Modal>
  );
};
