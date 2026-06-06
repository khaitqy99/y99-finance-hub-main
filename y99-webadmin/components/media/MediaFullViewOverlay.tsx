'use client';

import { useCallback, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  X,
} from 'lucide-react';
import type { MediaItem } from '@/lib/media/types';

type Props = {
  items: MediaItem[];
  currentIndex: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export function MediaFullViewOverlay({
  items,
  currentIndex,
  onIndexChange,
  onClose,
}: Props) {
  const open = currentIndex !== null && currentIndex >= 0 && currentIndex < items.length;
  const item = open ? items[currentIndex] : null;
  const hasPrev = open && currentIndex > 0;
  const hasNext = open && currentIndex < items.length - 1;

  const goPrev = useCallback(() => {
    if (currentIndex !== null && currentIndex > 0) onIndexChange(currentIndex - 1);
  }, [currentIndex, onIndexChange]);

  const goNext = useCallback(() => {
    if (currentIndex !== null && currentIndex < items.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  }, [currentIndex, items.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || !item) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" aria-hidden />

      <div
        className="relative z-10 flex h-[640px] w-[720px] max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {(currentIndex ?? 0) + 1} / {items.length}
              <span className="hidden sm:inline"> · ← → đổi ảnh</span>
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink size={13} />
              Mở tab
            </a>
            <a
              href={item.url}
              download={item.name}
              className="hidden sm:inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download size={13} />
              Tải
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="relative h-[496px] shrink-0 flex items-center justify-center bg-slate-50 px-12">
          {hasPrev && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 sm:left-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 border border-slate-200 shadow-md text-slate-700 hover:bg-white"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.name}
            className="h-full w-full object-contain select-none"
            draggable={false}
          />

          {hasNext && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 sm:right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 border border-slate-200 shadow-md text-slate-700 hover:bg-white"
              aria-label="Ảnh sau"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        <div className="h-[88px] shrink-0 border-t border-slate-100 bg-white px-3 py-2 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full gap-2 justify-start min-w-min items-center">
            {items.map((thumb, i) => (
              <button
                key={thumb.path}
                type="button"
                onClick={() => onIndexChange(i)}
                className={`shrink-0 h-14 w-14 rounded-md overflow-hidden border-2 transition-all ${
                  i === currentIndex
                    ? 'border-slate-900 ring-1 ring-slate-900'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                aria-label={`Xem ${thumb.name}`}
                aria-current={i === currentIndex}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
