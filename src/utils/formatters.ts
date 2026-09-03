export function formatDate(dateString?: string): string {
  if (!dateString) return 'Chưa có';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatAnswerValue(value: unknown): string {
  if (value === undefined || value === null) return '(Chưa trả lời)';
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

export function truncateText(text: string, maxLength: number = 60): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

