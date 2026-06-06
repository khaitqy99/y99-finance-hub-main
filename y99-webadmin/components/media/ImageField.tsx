'use client';

import { useState } from 'react';
import { ImageIcon, Images } from 'lucide-react';
import { MediaPickerModal } from '@/components/media/MediaPickerModal';
import { mediaApi } from '@/lib/media/api-client';
import type { MediaItem } from '@/lib/media/types';

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
};

export function ImageField({ label = 'Ảnh', value, onChange, required }: Props) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const item = await mediaApi.upload(file);
      onChange(item.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload thất bại');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handlePick = (item: MediaItem) => {
    onChange(item.url);
  };

  return (
    <div className="space-y-2">
      {label ? <label className="text-sm font-medium">{label}</label> : null}
      {value ? (
        <div className="relative rounded-md border border-slate-200 overflow-hidden bg-slate-50 h-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-24 rounded-md border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs gap-2">
          <ImageIcon size={16} />
          Chưa chọn ảnh — bấm «Chọn từ thư viện»
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-xs font-medium text-white gap-1.5 hover:bg-slate-800"
        >
          <Images size={14} />
          Chọn từ thư viện
        </button>
        <label className="inline-flex h-9 cursor-pointer items-center rounded-md border border-slate-200 px-4 text-xs font-medium hover:bg-slate-50">
          {uploading ? 'Đang tải…' : 'Upload mới'}
          <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
        </label>
      </div>
      <input
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Hoặc dán URL ảnh"
        className="flex h-9 w-full rounded-md border border-slate-200 px-3 text-sm"
      />

      <MediaPickerModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onPick={handlePick}
        currentUrl={value || undefined}
        title="Chọn ảnh đại diện"
      />
    </div>
  );
}
