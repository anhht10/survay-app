import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
  presentation?: 'sheet' | 'dialog';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  presentation = 'sheet'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  }[maxWidth];

  const containerClass =
    presentation === 'dialog'
      ? 'absolute inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-20 sm:pt-4 overflow-y-auto'
      : 'absolute inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4';

  const cardClass =
    presentation === 'dialog'
      ? `relative bg-white w-full ${widthClass} rounded-3xl shadow-2xl z-10 overflow-hidden max-h-[calc(100vh-6rem)] sm:max-h-[90vh] flex flex-col transition-all duration-200`
      : `relative bg-white w-full ${widthClass} rounded-t-3xl sm:rounded-2xl shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col transition-all duration-200`;

  return (
    <div className={containerClass}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card / Bottom Sheet on Mobile */}
      <div className={cardClass}>
        {/* Header */}
        {title && (
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

