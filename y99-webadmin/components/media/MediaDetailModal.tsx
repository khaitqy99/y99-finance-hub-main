'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink, Maximize2, Trash2 } from 'lucide-react';
import { Modal } from '@/components/Modal';
import type { MediaItem } from '@/lib/media/types';

function formatBytes(n: number | null) {
  if (n == null || n <= 0) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN');
  } catch {
    return iso;
  }
}

type Props = {
  item: MediaItem | null;
  onClose: () => void;
  onDelete?: (item: MediaItem) => void;
  onPick?: (item: MediaItem) => void;
  pickLabel?: string;
  onFullView?: (item: MediaItem) => void;
};

export function MediaDetailModal({
  item,
  onClose,
  onDelete,
  onPick,
  pickLabel = 'Chọn ảnh này',
  onFullView,
}: Props) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const copyUrl = async () => {
    await navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal open={Boolean(item)} onClose={onClose} title="Chi tiết ảnh" size="lg">
      <div className="grid md:grid-cols-2 gap-6">
        <button
          type="button"
          onClick={() => onFullView?.(item)}
          className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center min-h-[240px] max-h-[min(70vh,520px)] w-full cursor-zoom-in group/preview relative"
          title="Xem ảnh full màn hình"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.name}
            className="max-w-full max-h-[min(70vh,520px)] object-contain"
          />
          {onFullView ? (
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/preview:bg-black/30 transition-colors">
              <span className="opacity-0 group-hover/preview:opacity-100 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-900 shadow">
                <Maximize2 size={14} />
                Xem full
              </span>
            </span>
          ) : null}
        </button>
        <div className="space-y-4 text-sm min-w-0">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tên file</p>
            <p className="font-medium text-slate-900 break-all mt-0.5">{item.name}</p>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="text-slate-500">Dung lượng</dt>
              <dd className="font-medium text-slate-800 mt-0.5">{formatBytes(item.size)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Ngày tải</dt>
              <dd className="font-medium text-slate-800 mt-0.5">{formatDate(item.created_at)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-slate-500">Đường dẫn Storage</dt>
              <dd className="font-mono text-[11px] text-slate-700 break-all mt-0.5">{item.path}</dd>
            </div>
          </dl>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">URL công khai (dùng trong bài viết)</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={item.url}
                className="flex-1 h-9 rounded-md border border-slate-200 px-2 text-xs font-mono bg-slate-50"
              />
              <button
                type="button"
                onClick={copyUrl}
                title="Copy URL"
                className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50"
              >
                <Copy size={14} />
              </button>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Mở tab mới"
                className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            {copied && <p className="text-xs text-emerald-600 mt-1">Đã copy URL</p>}
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {onFullView && (
              <button
                type="button"
                onClick={() => onFullView(item)}
                className="h-9 px-4 rounded-md border border-slate-200 text-sm hover:bg-slate-50 inline-flex items-center gap-1.5"
              >
                <Maximize2 size={14} />
                Xem full màn hình
              </button>
            )}
            {onPick && (
              <button
                type="button"
                onClick={() => {
                  onPick(item);
                  onClose();
                }}
                className="h-9 px-4 rounded-md bg-slate-900 text-white text-sm inline-flex items-center gap-1.5"
              >
                <Check size={14} />
                {pickLabel}
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(item);
                  onClose();
                }}
                className="h-9 px-4 rounded-md border border-rose-200 text-rose-700 text-sm hover:bg-rose-50 inline-flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Xóa ảnh
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-md border border-slate-200 text-sm hover:bg-slate-50 ml-auto"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
