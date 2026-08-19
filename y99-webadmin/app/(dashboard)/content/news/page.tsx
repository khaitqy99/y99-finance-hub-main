'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/lib/store';
import { cmsApi } from '@/lib/cms/api-client';
import {
  NewsPreviewOverlay,
  rowToPreviewData,
} from '@/components/content/NewsPreviewOverlay';
import {
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  Newspaper,
  Plus,
  Trash2,
} from 'lucide-react';
import { useSortableReorder } from '@/lib/hooks/useSortableReorder';
import type { NewsRow } from '@/lib/cms/types';

function newsPayload(a: NewsRow) {
  return {
    slug: a.slug,
    title: a.title,
    meta_title: a.meta_title ?? '',
    meta_description: a.meta_description ?? '',
    seo_h1: a.seo_h1 ?? '',
    excerpt: a.excerpt,
    category: a.category,
    date_display: a.date_display,
    image_url: a.image_url,
    image_alt: a.image_alt ?? '',
    content: a.content,
    published: a.published,
    sort_order: a.sort_order,
  };
}

const clientBase = process.env.NEXT_PUBLIC_CLIENT_URL ?? 'http://localhost:5173';

export default function NewsPage() {
  const { data, refresh } = useAdminStore();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<ReturnType<typeof rowToPreviewData> | null>(
    null,
  );
  const [reordering, setReordering] = useState(false);

  const openPreview = (item: NewsRow) => {
    setPreviewData(rowToPreviewData(item));
    setPreviewOpen(true);
  };

  const articles = useMemo(() => {
    if (!data) return [];
    return [...data.news].sort((a, b) => a.sort_order - b.sort_order);
  }, [data]);

  const {
    items: orderedArticles,
    draggedId,
    overId,
    onDragStart,
    onDragEnd,
    onDragOver,
    commitDrop,
    isDragging,
  } = useSortableReorder(articles);

  const publishedCount = articles.filter((a) => a.published).length;

  const persistOrder = async (reordered: NewsRow[]) => {
    if (!data) return;
    const withOrder = reordered.map((a, i) => ({ ...a, sort_order: i + 1 }));
    const prevMap = new Map(data.news.map((a) => [a.id, a.sort_order]));
    const changed = withOrder.filter((a) => prevMap.get(a.id) !== a.sort_order);
    if (changed.length === 0) return;

    setReordering(true);
    try {
      await Promise.all(changed.map((a) => cmsApi.saveNews(newsPayload(a), a.id)));
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

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa bài viết này khỏi trang Bản tin?')) return;
    await cmsApi.deleteNews(id);
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
            <Newspaper size={16} />
            <span>Nội dung tin tức</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Quản lý Bản tin</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Bài viết hiển thị trên trang /ban-tin web client. Bài đã xuất bản theo thứ tự — ảnh đại diện nên tỷ lệ ngang (16:9).
          </p>
        </div>
        <Link
          href="/content/news/new"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow hover:bg-slate-800"
        >
          <Plus size={16} className="mr-2" />
          Thêm bài viết
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tổng bài</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{articles.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Đã xuất bản</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">{publishedCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Xem trên web</p>
          <Link
            href={`${clientBase}/ban-tin`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:underline"
          >
            Bản tin
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
            <Newspaper className="text-slate-400" size={28} />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-900">Chưa có bài viết nào</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Thêm bài đầu tiên để trang Bản tin hiển thị nội dung từ CMS thay vì dữ liệu mặc định.
          </p>
          <Link
            href="/content/news/new"
            className="mt-6 inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={16} className="mr-2" />
            Viết bài đầu tiên
          </Link>
        </div>
      ) : (
        <>
          {articles.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
              <GripVertical size={16} className="shrink-0 text-slate-400" />
              <span>
                Kéo biểu tượng <strong className="font-medium text-slate-800">≡</strong> trên thẻ để
                sắp xếp thứ tự trên /ban-tin.
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
          {orderedArticles.map((item, index) => (
            <article
              key={item.id}
              onDragOver={(e) => onDragOver(e, item.id)}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(item.id);
              }}
              className={`group rounded-xl border bg-white shadow-sm overflow-hidden transition-all hover:shadow-md ${
                draggedId === item.id
                  ? 'opacity-50 scale-[0.98] border-slate-300'
                  : overId === item.id && draggedId
                    ? 'border-sky-400 ring-2 ring-sky-400/40 ring-offset-2'
                    : 'border-slate-200'
              }`}
            >
              <div className="relative aspect-[16/9] bg-slate-100">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <Newspaper size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    draggable={!reordering}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', item.id);
                      onDragStart(item.id);
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
                      item.published
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-slate-800/80 text-white'
                    }`}
                  >
                    {item.published ? (
                      <>
                        <Eye size={12} /> Đã xuất bản
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} /> Nháp
                      </>
                    )}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => openPreview(item)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-700 shadow hover:bg-slate-50"
                    title="Xem trước"
                  >
                    <Eye size={14} />
                  </button>
                  <Link
                    href={`/content/news/${item.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-700 shadow hover:bg-slate-50"
                    title="Sửa"
                  >
                    <Edit2 size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-rose-600 shadow hover:bg-rose-50"
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {index === 0 && item.published && (
                  <span className="absolute top-3 right-3 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950">
                    Nổi bật
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-medium text-slate-900 line-clamp-2">
                  <Link href={`/content/news/${item.id}`} className="hover:underline">
                    {item.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {item.category}
                  {item.date_display ? ` · ${item.date_display}` : ''}
                </p>
                {item.excerpt ? (
                  <p className="text-xs text-slate-600 line-clamp-2">{item.excerpt}</p>
                ) : null}
                <Link
                  href={`${clientBase}/ban-tin/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                >
                  <span className="truncate max-w-[200px]">/ban-tin/{item.slug}</span>
                  <ExternalLink size={12} className="shrink-0" />
                </Link>
              </div>
            </article>
          ))}
          </div>
        </>
      )}

      <NewsPreviewOverlay
        key={previewData?.slug ?? 'preview'}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={previewData}
        clientBase={clientBase}
        closeLabel="Đóng"
      />
    </div>
  );
}
