'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { MediaLibrary } from '@/components/media/MediaLibrary';
import type { MediaItem } from '@/lib/media/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onPick: (item: MediaItem) => void;
  title?: string;
  currentUrl?: string;
};

export function MediaPickerModal({
  open,
  onClose,
  onPick,
  title = 'Chọn ảnh từ thư viện',
  currentUrl,
}: Props) {
  const [pending, setPending] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (open) setPending(null);
  }, [open]);

  const confirm = () => {
    if (!pending) return;
    onPick(pending);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      <p className="text-sm text-slate-500 mb-4">
        Bấm vào ảnh để xem trước, sau đó bấm <strong>Chọn ảnh này</strong>. Có thể upload thêm ngay trong cửa sổ này.
      </p>
      <MediaLibrary
        selectable
        pickerMode
        selectedUrl={pending?.url ?? currentUrl}
        onSelect={setPending}
      />
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-4">
        <p className="text-xs text-slate-500 truncate flex-1">
          {pending ? pending.name : 'Chưa chọn ảnh'}
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-md border border-slate-200 text-sm hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={!pending}
            onClick={confirm}
            className="h-9 px-4 rounded-md bg-slate-900 text-white text-sm disabled:opacity-40 inline-flex items-center gap-1.5"
          >
            <Check size={14} />
            Chọn ảnh này
          </button>
        </div>
      </div>
    </Modal>
  );
}
