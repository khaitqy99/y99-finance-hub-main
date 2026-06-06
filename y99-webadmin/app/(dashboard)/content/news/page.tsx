'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/lib/store';
import { cmsApi } from '@/lib/cms/api-client';
import { Modal } from '@/components/Modal';
import {
  NewsPreviewOverlay,
  formToPreviewData,
  rowToPreviewData,
} from '@/components/content/NewsPreviewOverlay';
import { ImageField } from '@/components/media/ImageField';
import { ContentTextarea } from '@/components/media/ContentTextarea';
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
import { arrayToLines, linesToArray, slugify } from '@/lib/cms/helpers';
import { useSortableReorder } from '@/lib/hooks/useSortableReorder';
import { SeoFields } from '@/components/content/SeoFields';
import { ImageAltAudit } from '@/components/content/ImageAltAudit';
import type { NewsRow } from '@/lib/cms/types';

type FormState = Partial<NewsRow> & { contentText?: string };

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

const inputClass =
  'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

const textareaClass =
  'flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

const clientBase = process.env.NEXT_PUBLIC_CLIENT_URL ?? 'http://localhost:5173';

export default function NewsPage() {
  const { data, refresh } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<ReturnType<typeof formToPreviewData> | null>(
    null,
  );
  const [previewFromForm, setPreviewFromForm] = useState(false);
  const [reordering, setReordering] = useState(false);

  const openPreview = (item?: NewsRow) => {
    if (item) {
      setPreviewData(rowToPreviewData(item));
      setPreviewFromForm(false);
    } else if (editing) {
      setPreviewData(formToPreviewData(editing));
      setPreviewFromForm(true);
    }
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

  const handleEdit = (item?: NewsRow) => {
    setEditing(
      item
        ? { ...item, contentText: arrayToLines(item.content) }
        : {
            title: '',
            slug: '',
            meta_title: '',
            meta_description: '',
            seo_h1: '',
            excerpt: '',
            category: '',
            date_display: '',
            image_url: '',
            image_alt: '',
            contentText: '',
            published: false,
            sort_order: articles.length + 1,
          },
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        slug: editing.slug || slugify(editing.title ?? ''),
        title: editing.title,
        meta_title: editing.meta_title ?? '',
        meta_description: editing.meta_description ?? '',
        seo_h1: editing.seo_h1 ?? '',
        excerpt: editing.excerpt,
        category: editing.category,
        date_display: editing.date_display,
        image_url: editing.image_url,
        image_alt: editing.image_alt ?? '',
        content: linesToArray(editing.contentText ?? ''),
        published: editing.published ?? false,
        sort_order: editing.sort_order ?? 0,
      };
      await cmsApi.saveNews(payload, editing.id);
      setIsModalOpen(false);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

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
        <button
          type="button"
          onClick={() => handleEdit()}
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow hover:bg-slate-800"
        >
          <Plus size={16} className="mr-2" />
          Thêm bài viết
        </button>
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
          <button
            type="button"
            onClick={() => handleEdit()}
            className="mt-6 inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={16} className="mr-2" />
            Viết bài đầu tiên
          </button>
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
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-700 shadow hover:bg-slate-50"
                    title="Sửa"
                  >
                    <Edit2 size={14} />
                  </button>
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
                <h3 className="font-medium text-slate-900 line-clamp-2">{item.title}</h3>
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

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing?.id ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        description="Soạn nội dung bên trái — cấu hình hiển thị & ảnh bên phải."
        size="xl"
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500 truncate">
              {editing?.slug ? (
                <>
                  URL:{' '}
                  <span className="font-medium text-slate-700">
                    /ban-tin/{editing.slug}
                  </span>
                  {' · '}
                  {editing.published ? (
                    <span className="text-emerald-700">Sẽ hiển thị công khai</span>
                  ) : (
                    <span className="text-amber-700">Đang lưu nháp</span>
                  )}
                </>
              ) : (
                'Nhập tiêu đề để tạo slug tự động'
              )}
            </p>
            <div className="flex shrink-0 justify-end gap-2">
              <button
                type="button"
                onClick={() => openPreview()}
                className="h-9 px-4 rounded-md border border-slate-200 bg-white text-sm hover:bg-slate-100 inline-flex items-center gap-1.5"
              >
                <Eye size={14} />
                Xem trước
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-9 px-4 rounded-md border border-slate-200 bg-white text-sm hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                form="news-article-form"
                disabled={saving}
                className="h-9 min-w-[120px] px-4 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Đang lưu…' : 'Lưu bài viết'}
              </button>
            </div>
          </div>
        }
      >
        <form
          id="news-article-form"
          onSubmit={handleSave}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 lg:gap-8 text-sm"
        >
          <div className="min-w-0 space-y-5">
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                Nội dung chính
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-900">Tiêu đề</label>
                  <input
                    required
                    placeholder="VD: Y99 mở rộng dịch vụ vay nhanh"
                    value={editing?.title ?? ''}
                    onChange={(e) =>
                      setEditing({
                        ...editing!,
                        title: e.target.value,
                        slug: editing?.id ? editing.slug : slugify(e.target.value),
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-900">Tóm tắt</label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả ngắn hiển thị trên danh sách bài viết"
                    value={editing?.excerpt ?? ''}
                    onChange={(e) => setEditing({ ...editing!, excerpt: e.target.value })}
                    className={textareaClass}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <ContentTextarea
                label="Nội dung bài viết"
                value={editing?.contentText ?? ''}
                onChange={(contentText) => setEditing({ ...editing!, contentText })}
                rows={16}
                priorImageCount={editing?.image_url ? 1 : 0}
                altSuggestion={editing?.title ?? ''}
                hint="Mỗi đoạn một dòng. «Chèn ảnh» tạo ![alt](url) — 3 ảnh đầu (đại diện + nội dung) cần alt mô tả + từ khóa."
              />
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-0 lg:self-start">
            <SeoFields
              metaTitle={editing?.meta_title ?? ''}
              metaDescription={editing?.meta_description ?? ''}
              seoH1={editing?.seo_h1 ?? ''}
              onMetaTitleChange={(meta_title) => setEditing({ ...editing!, meta_title })}
              onMetaDescriptionChange={(meta_description) =>
                setEditing({ ...editing!, meta_description })
              }
              onSeoH1Change={(seo_h1) => setEditing({ ...editing!, seo_h1 })}
              pagePath={editing?.slug ? `/ban-tin/${editing.slug}` : undefined}
              titleFallback={editing?.title}
              h1Fallback={editing?.title}
              descriptionFallback={editing?.excerpt}
              primaryKeyword={editing?.title}
            />

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Thông tin hiển thị
              </h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Slug (URL)</label>
                <input
                  required
                  placeholder="y99-mo-rong-dich-vu"
                  value={editing?.slug ?? ''}
                  onChange={(e) => setEditing({ ...editing!, slug: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Danh mục</label>
                <input
                  required
                  placeholder="Tin công ty"
                  value={editing?.category ?? ''}
                  onChange={(e) => setEditing({ ...editing!, category: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-900">Ngày</label>
                  <input
                    required
                    placeholder="03/06/2026"
                    value={editing?.date_display ?? ''}
                    onChange={(e) =>
                      setEditing({ ...editing!, date_display: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-900">Thứ tự</label>
                  <input
                    type="number"
                    min={1}
                    value={editing?.sort_order ?? 1}
                    onChange={(e) =>
                      setEditing({ ...editing!, sort_order: Number(e.target.value) })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Hoặc kéo thả thẻ bài viết trên danh sách để đổi thứ tự.
              </p>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Ảnh đại diện
              </h3>
              <ImageField
                label=""
                value={editing?.image_url ?? ''}
                onChange={(image_url) => setEditing({ ...editing!, image_url })}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">
                  Alt text ảnh đại diện <span className="text-sky-700 font-normal">(#1 — Google ưu tiên)</span>
                </label>
                <input
                  placeholder='vd. "Y99 mở rộng dịch vụ vay tiền nhanh tại Cần Thơ"'
                  value={editing?.image_alt ?? ''}
                  onChange={(e) => setEditing({ ...editing!, image_alt: e.target.value })}
                  className={inputClass}
                />
                {editing?.title ? (
                  <button
                    type="button"
                    className="text-xs text-emerald-700 hover:underline"
                    onClick={() =>
                      setEditing({
                        ...editing!,
                        image_alt: `${editing.title} — ${editing.category || 'Y99 Finance'}`.slice(
                          0,
                          125,
                        ),
                      })
                    }
                  >
                    Gợi ý alt từ tiêu đề
                  </button>
                ) : null}
              </div>
              <ImageAltAudit
                imageUrl={editing?.image_url}
                imageAlt={editing?.image_alt}
                content={
                  editing?.contentText != null
                    ? linesToArray(editing.contentText)
                    : (editing?.content ?? [])
                }
              />
              {editing?.image_url ? (
                <div className="rounded-md border border-slate-200 overflow-hidden">
                  <p className="px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-100">
                    Thẻ trên web
                  </p>
                  <div className="aspect-[16/9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editing.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : null}
            </section>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                editing?.published
                  ? 'border-emerald-200 bg-emerald-50/80'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={editing?.published ?? false}
                onChange={(e) => setEditing({ ...editing!, published: e.target.checked })}
                className="accent-slate-900 mt-0.5 h-4 w-4"
              />
              <span>
                <span className="text-sm font-medium text-slate-900 block">Xuất bản</span>
                <span className="text-xs text-slate-500 mt-0.5 block">
                  Bật để bài hiện trên /ban-tin cho khách xem.
                </span>
              </span>
            </label>
          </aside>
        </form>
      </Modal>

      <NewsPreviewOverlay
        key={previewData?.slug ?? 'preview'}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={previewData}
        clientBase={clientBase}
        closeLabel={previewFromForm ? 'Quay lại chỉnh sửa' : 'Đóng'}
      />
    </div>
  );
}
