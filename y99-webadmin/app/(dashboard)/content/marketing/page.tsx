'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/lib/store';
import { cmsApi } from '@/lib/cms/api-client';
import { Modal } from '@/components/Modal';
import { ImageField } from '@/components/media/ImageField';
import {
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  ImageIcon,
  Layers,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useSortableReorder } from '@/lib/hooks/useSortableReorder';
import type { HeroSlideRow } from '@/lib/cms/types';

function slidePayload(s: HeroSlideRow) {
  return {
    title: s.title,
    alt_text: s.alt_text,
    image_url: s.image_url,
    link_to: s.link_to,
    active: s.active,
    sort_order: s.sort_order,
  };
}

const inputClass =
  'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

export default function MarketingPage() {
  const { data, refresh } = useAdminStore();
  const [slideModal, setSlideModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlideRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  const slides = useMemo(() => {
    if (!data) return [];
    return [...data.marketing.slides].sort((a, b) => a.sort_order - b.sort_order);
  }, [data]);

  const {
    items: orderedSlides,
    draggedId,
    overId,
    onDragStart,
    onDragEnd,
    onDragOver,
    commitDrop,
    isDragging,
  } = useSortableReorder(slides);

  const activeCount = slides.filter((s) => s.active).length;

  const persistOrder = async (reordered: HeroSlideRow[]) => {
    if (!data) return;
    const withOrder = reordered.map((s, i) => ({ ...s, sort_order: i + 1 }));
    const prevMap = new Map(data.marketing.slides.map((s) => [s.id, s.sort_order]));
    const changed = withOrder.filter((s) => prevMap.get(s.id) !== s.sort_order);
    if (changed.length === 0) return;

    setReordering(true);
    try {
      await Promise.all(changed.map((s) => cmsApi.saveSlide(slidePayload(s), s.id)));
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lưu thứ tự thất bại');
      await refresh();
    } finally {
      setReordering(false);
    }
  };

  const handleDrop = (targetId: string) => {
    const next = commitDrop(targetId);
    if (next) void persistOrder(next);
  };

  if (!data) return null;

  const openSlide = (item?: HeroSlideRow) => {
    setEditingSlide(
      item ?? {
        title: '',
        alt_text: '',
        image_url: '',
        link_to: '/',
        active: true,
        sort_order: slides.length + 1,
      },
    );
    setSlideModal(true);
  };

  const saveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;
    setSaving(true);
    try {
      await cmsApi.saveSlide(
        {
          title: editingSlide.title,
          alt_text: editingSlide.alt_text,
          image_url: editingSlide.image_url,
          link_to: editingSlide.link_to,
          active: editingSlide.active ?? true,
          sort_order: editingSlide.sort_order ?? 0,
        },
        editingSlide.id,
      );
      setSlideModal(false);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const deleteSlide = async (id: string) => {
    if (!confirm('Xóa slide này khỏi carousel trang chủ?')) return;
    await cmsApi.deleteSlide(id);
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
            <Layers size={16} />
            <span>Nội dung trang chủ</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Hero Carousel</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Quản lý banner lớn trên trang chủ web client. Slide đang bật hiển thị theo thứ tự — ảnh nên tỷ lệ ngang (16:9).
          </p>
        </div>
        <button
          type="button"
          onClick={() => openSlide()}
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow hover:bg-slate-800"
        >
          <Plus size={16} className="mr-2" />
          Thêm slide
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tổng slide</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{slides.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Đang hiển thị</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Xem trên web</p>
          <Link
            href={process.env.NEXT_PUBLIC_CLIENT_URL ?? 'http://localhost:5173'}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:underline"
          >
            Trang chủ
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {slides.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
            <ImageIcon className="text-slate-400" size={28} />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-900">Chưa có slide nào</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Thêm banner đầu tiên để carousel trang chủ hiển thị nội dung từ CMS thay vì ảnh mặc định.
          </p>
          <button
            type="button"
            onClick={() => openSlide()}
            className="mt-6 inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={16} className="mr-2" />
            Tạo slide đầu tiên
          </button>
        </div>
      ) : (
        <>
          {slides.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
              <GripVertical size={16} className="shrink-0 text-slate-400" />
              <span>
                Kéo biểu tượng <strong className="font-medium text-slate-800">≡</strong> trên thẻ để
                sắp xếp thứ tự carousel trang chủ.
              </span>
              {reordering ? (
                <span className="text-xs font-medium text-sky-700 ml-auto">Đang lưu thứ tự…</span>
              ) : null}
              {isDragging ? (
                <span className="text-xs text-slate-500 ml-auto">Thả lên thẻ đích để đổi vị trí</span>
              ) : null}
            </div>
          )}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 ${reordering ? 'opacity-60 pointer-events-none' : ''}`}
          >
          {orderedSlides.map((slide, index) => (
            <article
              key={slide.id}
              onDragOver={(e) => onDragOver(e, slide.id)}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(slide.id);
              }}
              className={`group rounded-xl border bg-white shadow-sm overflow-hidden transition-all hover:shadow-md ${
                draggedId === slide.id
                  ? 'opacity-50 scale-[0.98] border-slate-300'
                  : overId === slide.id && draggedId
                    ? 'border-sky-400 ring-2 ring-sky-400/40 ring-offset-2'
                    : 'border-slate-200'
              }`}
            >
              <div className="relative aspect-[16/9] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image_url}
                  alt={slide.alt_text}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    draggable={!reordering}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', slide.id);
                      onDragStart(slide.id);
                    }}
                    onDragEnd={onDragEnd}
                    className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur cursor-grab active:cursor-grabbing touch-none select-none"
                    title="Kéo để sắp xếp"
                  >
                    <GripVertical size={12} className="text-slate-500" />
                    #{index + 1}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${
                      slide.active
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-slate-800/80 text-white'
                    }`}
                  >
                    {slide.active ? (
                      <>
                        <Eye size={12} /> Đang chạy
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} /> Đã ẩn
                      </>
                    )}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => openSlide(slide)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-700 shadow hover:bg-slate-50"
                    title="Sửa"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSlide(slide.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-rose-600 shadow hover:bg-rose-50"
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {index === 0 && slide.active && (
                  <span className="absolute top-3 right-3 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950">
                    Mở đầu
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-medium text-slate-900 line-clamp-1">{slide.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1" title={slide.alt_text}>
                  Alt: {slide.alt_text}
                </p>
                {slide.link_to ? (
                  <a
                    href={slide.link_to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                  >
                    <span className="truncate max-w-[200px]">{slide.link_to}</span>
                    <ExternalLink size={12} className="shrink-0" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Chưa có link</span>
                )}
              </div>
            </article>
          ))}
          </div>
        </>
      )}

      <Modal
        open={slideModal}
        onClose={() => setSlideModal(false)}
        title={editingSlide?.id ? 'Sửa slide' : 'Thêm slide mới'}
        size="lg"
      >
        <form onSubmit={saveSlide} className="space-y-5 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-slate-900">Tiêu đề nội bộ</label>
              <input
                required
                placeholder="VD: Banner vay nhanh T4"
                value={editingSlide?.title ?? ''}
                onChange={(e) => setEditingSlide({ ...editingSlide!, title: e.target.value })}
                className={inputClass}
              />
              <p className="text-xs text-slate-500">Chỉ hiển thị trong admin, khách không thấy.</p>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-slate-900">Alt text (SEO & accessibility)</label>
              <input
                required
                placeholder="Mô tả ngắn nội dung ảnh"
                value={editingSlide?.alt_text ?? ''}
                onChange={(e) => setEditingSlide({ ...editingSlide!, alt_text: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <ImageField
            label="Ảnh banner"
            required
            value={editingSlide?.image_url ?? ''}
            onChange={(image_url) => setEditingSlide({ ...editingSlide!, image_url })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-slate-900">Link khi bấm slide</label>
              <input
                required
                placeholder="/vay-tien-online hoặc https://..."
                value={editingSlide?.link_to ?? ''}
                onChange={(e) => setEditingSlide({ ...editingSlide!, link_to: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-900">Thứ tự</label>
              <input
                type="number"
                min={1}
                value={editingSlide?.sort_order ?? 1}
                onChange={(e) =>
                  setEditingSlide({ ...editingSlide!, sort_order: Number(e.target.value) })
                }
                className={inputClass}
              />
              <p className="text-xs text-slate-500">
                Hoặc kéo thả thẻ slide trên danh sách để đổi thứ tự.
              </p>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 w-full hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={editingSlide?.active ?? true}
                  onChange={(e) => setEditingSlide({ ...editingSlide!, active: e.target.checked })}
                  className="accent-slate-900 h-4 w-4"
                />
                <span className="text-sm font-medium">Hiển thị trên trang chủ</span>
              </label>
            </div>
          </div>

          {editingSlide?.image_url && (
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
              <p className="px-3 py-2 text-xs font-medium text-slate-500 border-b border-slate-200 bg-white">
                Xem trước
              </p>
              <div className="aspect-[16/9] max-h-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editingSlide.image_url}
                  alt={editingSlide.alt_text || 'Preview'}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setSlideModal(false)}
              className="h-9 px-4 rounded-md border border-slate-200 text-sm hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-9 px-4 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-50"
            >
              {saving ? 'Đang lưu…' : 'Lưu slide'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
