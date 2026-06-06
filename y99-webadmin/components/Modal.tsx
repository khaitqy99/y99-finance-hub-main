import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
  bodyClassName?: string;
}

const SIZE_CLASS = {
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-6xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  bodyClassName,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-50 flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ${SIZE_CLASS[size]} max-h-[min(94vh,920px)]`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="min-w-0">
            <h2 id="modal-title" className="text-lg font-semibold tracking-tight text-slate-900">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        <div
          className={`min-h-0 flex-1 overflow-y-auto ${bodyClassName ?? 'px-6 py-5'}`}
        >
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-slate-200 bg-slate-50/90 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
