'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Eye, Loader2, Maximize2, Trash2, Upload } from 'lucide-react';
import { mediaApi } from '@/lib/media/api-client';
import { MediaDetailModal } from '@/components/media/MediaDetailModal';
import { MediaFullViewOverlay } from '@/components/media/MediaFullViewOverlay';
import type { MediaItem } from '@/lib/media/types';

type Props = {
  selectable?: boolean;
  /** Chế độ picker: click chỉ highlight, không gọi onSelect ngay (dùng với MediaPickerModal) */
  pickerMode?: boolean;
  selectedUrl?: string;
  onSelect?: (item: MediaItem) => void;
};

export function MediaLibrary({ selectable, pickerMode, selectedUrl, onSelect }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);
  const [fullViewIndex, setFullViewIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayedItems = useMemo(
    () =>
      items.filter(
        (item) => !query || item.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const openFullView = useCallback(
    (target: MediaItem) => {
      const idx = displayedItems.findIndex((i) => i.path === target.path);
      if (idx >= 0) setFullViewIndex(idx);
    },
    [displayedItems],
  );

  useEffect(() => {
    if (fullViewIndex === null) return;
    if (fullViewIndex < 0 || fullViewIndex >= displayedItems.length) {
      setFullViewIndex(null);
    }
  }, [fullViewIndex, displayedItems.length]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { items: list } = await mediaApi.list();
      setItems(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tải thư viện');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      let lastUploaded: MediaItem | null = null;
      for (const file of Array.from(files)) {
        lastUploaded = await mediaApi.upload(file);
      }
      await load();
      if (pickerMode && lastUploaded && onSelect) {
        onSelect(lastUploaded);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload thất bại');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Xóa ảnh ${item.name}?`)) return;
    const deletedAt = displayedItems.findIndex((i) => i.path === item.path);
    try {
      await mediaApi.delete(item.path);
      setItems((prev) => prev.filter((i) => i.path !== item.path));
      if (detailItem?.path === item.path) setDetailItem(null);
      if (fullViewIndex !== null && deletedAt >= 0) {
        const newLen = displayedItems.length - 1;
        if (newLen === 0) setFullViewIndex(null);
        else if (deletedAt === fullViewIndex) {
          setFullViewIndex(Math.min(fullViewIndex, newLen - 1));
        } else if (deletedAt < fullViewIndex) {
          setFullViewIndex(fullViewIndex - 1);
        }
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer bg-slate-50/50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <Loader2 className="animate-spin" size={18} />
            Đang chuyển WebP &amp; tải lên…
          </div>
        ) : (
          <>
            <Upload className="mx-auto text-slate-400 mb-2" size={28} />
            <p className="text-sm font-medium text-slate-700">Kéo thả hoặc bấm để chọn ảnh</p>
            <p className="text-xs text-slate-500 mt-1">JPG, PNG, GIF… → tự động lưu dạng WebP (tối đa 10MB)</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-md px-3 py-2">{error}</p>
      )}

      {!loading && items.length > 0 && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên file…"
          className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm"
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12 text-slate-500 text-sm">
          <Loader2 className="animate-spin mr-2" size={18} />
          Đang tải thư viện…
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-sm text-slate-500 py-8">Chưa có ảnh. Tải lên ảnh đầu tiên ở trên.</p>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
          {displayedItems.map((item) => {
            const selected = selectable && selectedUrl === item.url;
            const handleCardClick = () => {
              if (pickerMode && selectable && onSelect) {
                onSelect(item);
                return;
              }
              if (selectable && onSelect && !pickerMode) {
                onSelect(item);
                return;
              }
              setDetailItem(item);
            };
            return (
              <div
                key={item.path}
                className={`group relative mb-3 break-inside-avoid rounded-xl border overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow hover:ring-2 hover:ring-slate-300 ${
                  selected ? 'ring-2 ring-slate-900 border-slate-900' : 'border-slate-200'
                }`}
                onClick={handleCardClick}
                onDoubleClick={() => openFullView(item)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.name}
                  loading="lazy"
                  className="block w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] text-white truncate">{item.name}</p>
                  <div className="flex gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      title="Xem full ảnh"
                      onClick={() => openFullView(item)}
                      className="h-7 w-7 inline-flex items-center justify-center rounded bg-white/90 text-slate-800 hover:bg-white"
                    >
                      <Maximize2 size={12} />
                    </button>
                    <button
                      type="button"
                      title="Chi tiết & URL"
                      onClick={() => setDetailItem(item)}
                      className="h-7 w-7 inline-flex items-center justify-center rounded bg-white/90 text-slate-800 hover:bg-white"
                    >
                      <Eye size={12} />
                    </button>
                    {!pickerMode && (
                      <>
                        <button
                          type="button"
                          title="Copy URL"
                          onClick={() => copyUrl(item.url)}
                          className="h-7 w-7 inline-flex items-center justify-center rounded bg-white/90 text-slate-800 hover:bg-white"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          type="button"
                          title="Xóa"
                          onClick={() => handleDelete(item)}
                          className="h-7 w-7 inline-flex items-center justify-center rounded bg-white/90 text-rose-600 hover:bg-white"
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {selected && (
                  <span className="absolute top-2 right-2 text-[10px] font-semibold bg-slate-900 text-white px-1.5 py-0.5 rounded">
                    Đã chọn
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <MediaDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onDelete={pickerMode ? undefined : handleDelete}
        onPick={pickerMode && onSelect ? onSelect : undefined}
        onFullView={openFullView}
      />

      <MediaFullViewOverlay
        items={displayedItems}
        currentIndex={fullViewIndex}
        onIndexChange={setFullViewIndex}
        onClose={() => setFullViewIndex(null)}
      />
    </div>
  );
}
