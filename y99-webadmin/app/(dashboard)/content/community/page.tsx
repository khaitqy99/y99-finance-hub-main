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
  HeartHandshake,
  Plus,
  Edit2,
  Trash2,
  Video,
} from 'lucide-react';
import { useSortableReorder } from '@/lib/hooks/useSortableReorder';
import type { CommunitySlideRow } from '@/lib/cms/types';

function slidePayload(s: CommunitySlideRow) {
  return {
    title: s.title,
    alt_text: s.alt_text,
    image_url: s.image_url,
    video_url: s.video_url ?? '',
    link_to: s.link_to ?? '',
    active: s.active,
    sort_order: s.sort_order,
  };
}

const inputClass =
  'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

export default function CommunityPage() {
  const { data, refresh } = useAdminStore();
  const [slideModal, setSlideModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<CommunitySlideRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  const slides = useMemo(() => {
    if (!data) return [];
    return [...(data.communitySlides ?? [])].sort((a, b) => a.sort_order - b.sort_order);
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

  const persistOrder = async (reordered: CommunitySlideRow[]) => {
    if (!data) return;
    const withOrder = reordered.map((s, i) => ({ ...s, sort_order: i + 1 }));
    const prevMap = new Map((data.communitySlides ?? []).map((s) => [s.id, s.sort_order]));
    const changed = withOrder.filter((s) => prevMap.get(s.id) !== s.sort_order);
    if (changed.length === 0) return;

    setReordering(true);
    try {
      await Promise.all(changed.map((s) => cmsApi.saveCommunitySlide(slidePayload(s), s.id)));
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

  const openSlide = (item?: CommunitySlideRow) => {
    setEditingSlide(
      item ?? {
        title: '',
        alt_text: '',
        image_url: '',
        video_url: '',
        link_to: '',
        active: true,
        sort_order: slides.length + 1,
      },
    );
    setSlideModal(true);
  };

  const saveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;
    if (!editingSlide.image_url?.trim()) {
      alert('Cần chọn ảnh (thumbnail khi gắn video)');
      return;
    }
    setSaving(true);
    try {
      await cmsApi.saveCommunitySlide(
        {
          title: editingSlide.title,
          alt_text: editingSlide.alt_text,
          image_url: editingSlide.image_url,
          video_url: editingSlide.video_url ?? '',
          link_to: editingSlide.link_to ?? '',
          active: editingSlide.active ?? true,
          sort_order: editingSlide.sort_order ?? 0,
        },
        editingSlide.id,
      );
      setSlideModal(false);
      await refresh();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Lưu thất bại — kiểm tra đã chạy migration community_slides chưa',
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteSlide = async (id: string) => {
    if (!confirm('Xóa hoạt động này khỏi slideshow?')) return;
    await cmsApi.deleteCommunitySlide(id);
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
            <HeartHandshake size={16} />
            <span>Trang Về Y99</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Hoạt động cộng đồng</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Slideshow ảnh/video thay cho mục &quot;Cột mốc phát triển&quot;. Gắn YouTube / Vimeo / .mp4 — ảnh làm
            thumbnail.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openSlide()}
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow hover:bg-slate-800"
        >
          <Plus size={16} className="mr-2" />
          Thêm hoạt động
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
            href={`${process.env.NEXT_PUBLIC_CLIENT_URL ?? 'http://localhost:3000'}/ve-y99#hoat-dong-cong-dong`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:underline"
          >
            Trang Về Y99
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {slides.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
            <ImageIcon className="text-slate-400" size={28} />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-900">Chưa có hoạt động nào</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Thêm ảnh hoặc video. Nếu chưa có dữ liệu CMS, trang web vẫn hiện slide mẫu.
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
                Kéo <strong className="font-medium text-slate-800">≡</strong> để sắp xếp thứ tự.
              </span>
              {reordering ? (
                <span className="ml-auto text-xs font-medium text-sky-700">Đang lưu thứ tự…</span>
              ) : null}
              {isDragging ? (
                <span className="ml-auto text-xs text-slate-500">Thả lên thẻ đích để đổi vị trí</span>
              ) : null}
            </div>
          )}
          <div
            className={`grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 ${reordering ? 'pointer-events-none opacity-60' : ''}`}
          >
            {orderedSlides.map((slide, index) => (
              <article
                key={slide.id}
                onDragOver={(e) => onDragOver(e, slide.id)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(slide.id);
                }}
                className={`group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${
                  draggedId === slide.id
                    ? 'scale-[0.98] border-slate-300 opacity-50'
                    : overId === slide.id && draggedId
                      ? 'border-sky-400 ring-2 ring-sky-400/40 ring-offset-2'
                      : 'border-slate-200'
                }`}
              >
                <div className="relative aspect-[16/9] bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.image_url} alt={slide.alt_text} className="h-full w-full object-cover" />
                  {slide.video_url ? (
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-rose-600/90 px-2 py-1 text-xs font-semibold text-white shadow">
                      <Video size={12} /> Video
                    </span>
                  ) : null}
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span
                      draggable={!reordering}
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', slide.id);
                        onDragStart(slide.id);
                      }}
                      onDragEnd={onDragEnd}
                      className="inline-flex cursor-grab touch-none select-none items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur active:cursor-grabbing"
                      title="Kéo để sắp xếp"
                    >
                      <GripVertical size={12} className="text-slate-500" />#{index + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${
                        slide.active ? 'bg-emerald-500/90 text-white' : 'bg-slate-800/80 text-white'
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
                  <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="line-clamp-1 font-medium text-slate-900">{slide.title || 'Không tiêu đề'}</h3>
                  <p className="line-clamp-1 text-xs text-slate-500" title={slide.alt_text}>
                    Alt: {slide.alt_text}
                  </p>
                  {slide.video_url ? (
                    <p className="truncate text-xs text-rose-700" title={slide.video_url}>
                      Video: {slide.video_url}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <Modal
        open={slideModal}
        onClose={() => setSlideModal(false)}
        title={editingSlide?.id ? 'Sửa hoạt động' : 'Thêm hoạt động'}
        size="lg"
      >
        <form onSubmit={saveSlide} className="space-y-5 text-sm">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-900">Tiêu đề</label>
            <input
              required
              placeholder="VD: Trao học bổng 2026"
              value={editingSlide?.title ?? ''}
              onChange={(e) => setEditingSlide({ ...editingSlide!, title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-900">Alt text</label>
            <input
              required
              placeholder="Mô tả ảnh / video"
              value={editingSlide?.alt_text ?? ''}
              onChange={(e) => setEditingSlide({ ...editingSlide!, alt_text: e.target.value })}
              className={inputClass}
            />
          </div>

          <ImageField
            label="Ảnh / thumbnail"
            required
            value={editingSlide?.image_url ?? ''}
            onChange={(image_url) => setEditingSlide({ ...editingSlide!, image_url })}
          />

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
              <Video size={14} /> Video (tuỳ chọn)
            </label>
            <input
              placeholder="https://youtube.com/watch?v=... hoặc URL .mp4"
              value={editingSlide?.video_url ?? ''}
              onChange={(e) => setEditingSlide({ ...editingSlide!, video_url: e.target.value })}
              className={inputClass}
            />
            <p className="text-xs text-slate-500">
              Dán link YouTube / Vimeo / file mp4. Ảnh phía trên làm thumbnail; khách bấm play để xem.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-900">Link khi bấm (tuỳ chọn)</label>
              <input
                placeholder="/ban-tin/... hoặc https://..."
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
            </div>
            <div className="flex items-end pb-1 sm:col-span-2">
              <label className="flex w-full cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={editingSlide?.active ?? true}
                  onChange={(e) => setEditingSlide({ ...editingSlide!, active: e.target.checked })}
                  className="h-4 w-4 accent-slate-900"
                />
                <span className="text-sm font-medium">Hiển thị trên trang Về Y99</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={() => setSlideModal(false)}
              className="h-9 rounded-md border border-slate-200 px-4 text-sm hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-9 rounded-md bg-slate-900 px-4 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? 'Đang lưu…' : 'Lưu'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
