import { ENV } from '../../config/env';

export interface RequestOptions {
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  code: string;
  status?: number;

  constructor(message: string, code: string = 'NETWORK_ERROR', status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Gửi POST HTTP request với timeout và xử lý lỗi chuẩn hóa
 */
export async function postWithTimeout<T>(
  url: string,
  payload: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const timeoutMs = options.timeoutMs || ENV.API_TIMEOUT;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: 'follow'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(
        `Máy chủ phản hồi mã lỗi HTTP ${response.status}`,
        'SERVER_ERROR',
        response.status
      );
    }

    const json = await response.json();
    return json as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Kết nối mạng quá thời gian chờ (Timeout)', 'TIMEOUT');
    }

    const message = error instanceof Error ? error.message : 'Lỗi kết nối mạng';
    throw new ApiError(message, 'NETWORK_FAILURE');
  }
}

/**
 * Gửi GET HTTP request với timeout
 */
export async function getWithTimeout<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const timeoutMs = options.timeoutMs || ENV.API_TIMEOUT;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(
        `Máy chủ phản hồi mã lỗi HTTP ${response.status}`,
        'SERVER_ERROR',
        response.status
      );
    }

    const json = await response.json();
    return json as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Kết nối mạng quá thời gian chờ (Timeout)', 'TIMEOUT');
    }

    const message = error instanceof Error ? error.message : 'Lỗi kết nối mạng';
    throw new ApiError(message, 'NETWORK_FAILURE');
  }
}
