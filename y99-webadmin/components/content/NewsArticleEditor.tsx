'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Newspaper } from 'lucide-react';
import { useAdminStore } from '@/lib/store';
import { cmsApi } from '@/lib/cms/api-client';
import { ImageField } from '@/components/media/ImageField';
import { NewsContentEditor } from '@/components/content/NewsContentEditor';
import { SeoFields } from '@/components/content/SeoFields';
import { ImageAltAudit } from '@/components/content/ImageAltAudit';
import {
  NewsPreviewOverlay,
  formToPreviewData,
} from '@/components/content/NewsPreviewOverlay';
import { contentToHtml, htmlToContent } from '@/lib/cms/article-html';
import { normalizeNewsSlug, slugify } from '@/lib/cms/helpers';
import type { NewsRow } from '@/lib/cms/types';

type FormState = Partial<NewsRow> & { contentText?: string };

const inputClass =
  'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

const textareaClass =
  'flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

const clientBase = process.env.NEXT_PUBLIC_CLIENT_URL ?? 'http://localhost:5173';

function emptyForm(sortOrder: number): FormState {
  return {
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
    sort_order: sortOrder,
  };
}

export function NewsArticleEditor({ articleId }: { articleId?: string }) {
  const router = useRouter();
  const { data, loading, refresh } = useAdminStore();
  const [editing, setEditing] = useState<FormState | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const articles = data?.news ?? [];

  useEffect(() => {
    if (!data || initialized) return;
    if (!articleId) {
      setEditing(emptyForm(articles.length + 1));
      setNotFound(false);
      setInitialized(true);
      return;
    }
    const item = articles.find((row) => row.id === articleId);
    if (!item) {
      setNotFound(true);
      setEditing(null);
      setInitialized(true);
      return;
    }
    setNotFound(false);
    setEditing({ ...item, contentText: contentToHtml(item.content) });
    setInitialized(true);
  }, [articleId, articles, data, initialized]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        slug: normalizeNewsSlug(editing.slug || slugify(editing.title ?? '')),
        title: editing.title,
        meta_title: editing.meta_title ?? '',
        meta_description: editing.meta_description ?? '',
        seo_h1: editing.seo_h1 ?? '',
        excerpt: editing.excerpt,
        category: editing.category,
        date_display: editing.date_display,
        image_url: editing.image_url,
        image_alt: editing.image_alt ?? '',
        content: htmlToContent(editing.contentText ?? ''),
        published: editing.published ?? false,
        sort_order: editing.sort_order ?? 0,
      };
      await cmsApi.saveNews(payload, editing.id);
      await refresh();
      router.push('/content/news');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data || (!editing && !notFound)) {
    return <p className="text-sm text-slate-500">Đang tải bài viết…</p>;
  }

  if (notFound) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center">
        <Newspaper className="mx-auto text-slate-400" size={28} />
        <h2 className="mt-4 text-lg font-medium text-slate-900">Không tìm thấy bài viết</h2>
        <p className="mt-1 text-sm text-slate-500">Bài này có thể đã bị xóa.</p>
        <Link
          href="/content/news"
          className="mt-6 inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  if (!editing) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/content/news"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={14} />
            Bản tin
          </Link>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {editing.id ? 'Sửa bài viết' : 'Thêm bài viết mới'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Soạn nội dung bên trái — cấu hình hiển thị, SEO và ảnh bên phải.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 text-sm hover:bg-slate-100"
          >
            <Eye size={14} />
            Xem trước
          </button>
          <Link
            href="/content/news"
            className="inline-flex h-9 items-center rounded-md border border-slate-200 bg-white px-4 text-sm hover:bg-slate-100"
          >
            Hủy
          </Link>
          <button
            type="submit"
            form="news-article-form"
            disabled={saving}
            className="inline-flex h-9 min-w-[120px] items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? 'Đang lưu…' : 'Lưu bài viết'}
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        {editing.slug ? (
          <>
            URL: <span className="font-medium text-slate-700">/ban-tin/{editing.slug}</span>
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
                    placeholder="Ví dụ: Y99 đồng hành cùng khách hàng vay nhanh tại Cần Thơ"
                  value={editing.title ?? ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      title: e.target.value,
                      slug: editing.id ? editing.slug : slugify(e.target.value),
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Tóm tắt</label>
                <textarea
                  rows={3}
                    placeholder="2–3 câu tóm tắt hiện trên danh sách Bản tin và khi chia sẻ bài viết"
                  value={editing.excerpt ?? ''}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  className={textareaClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <NewsContentEditor
              key="news-body-editor-v2"
              label="Nội dung bài viết"
              value={editing.contentText ?? ''}
              onChange={(contentText) => setEditing({ ...editing, contentText })}
              priorImageCount={editing.image_url ? 1 : 0}
              altSuggestion={editing.title ?? ''}
            />
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start">
          <SeoFields
            metaTitle={editing.meta_title ?? ''}
            metaDescription={editing.meta_description ?? ''}
            seoH1={editing.seo_h1 ?? ''}
            onMetaTitleChange={(meta_title) => setEditing({ ...editing, meta_title })}
            onMetaDescriptionChange={(meta_description) =>
              setEditing({ ...editing, meta_description })
            }
            onSeoH1Change={(seo_h1) => setEditing({ ...editing, seo_h1 })}
            pagePath={editing.slug ? `/ban-tin/${editing.slug}` : undefined}
            titleFallback={editing.title}
            h1Fallback={editing.title}
            descriptionFallback={editing.excerpt}
            primaryKeyword={editing.title}
          />

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Thông tin hiển thị
            </h3>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-900">Slug (URL)</label>
              <input
                required
                placeholder="gioi-thieu-y99-cam-do-online"
                value={editing.slug ?? ''}
                onChange={(e) => setEditing({ ...editing, slug: normalizeNewsSlug(e.target.value) })}
                className={inputClass}
              />
              <p className="text-xs text-slate-500">
                Chỉ nhập phần đuôi URL, không dán cả link. Ví dụ đúng:{' '}
                <span className="font-medium text-slate-700">gioi-thieu-y99-cam-do-online</span>
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-900">Danh mục</label>
              <input
                required
                placeholder="Tin công ty, Cẩm nang vay, Khuyến mãi…"
                value={editing.category ?? ''}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Ngày</label>
                <input
                  required
                  placeholder="19/08/2026"
                  value={editing.date_display ?? ''}
                  onChange={(e) => setEditing({ ...editing, date_display: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Thứ tự</label>
                <input
                  type="number"
                  min={1}
                  value={editing.sort_order ?? 1}
                  onChange={(e) =>
                    setEditing({ ...editing, sort_order: Number(e.target.value) })
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
              value={editing.image_url ?? ''}
              onChange={(image_url) => setEditing({ ...editing, image_url })}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-900">
                Alt text ảnh đại diện{' '}
                <span className="text-sky-700 font-normal">(#1 — Google ưu tiên)</span>
              </label>
              <input
                placeholder="Mô tả ảnh + từ khóa, ví dụ: Tư vấn cầm đồ Y99 tại Cần Thơ"
                value={editing.image_alt ?? ''}
                onChange={(e) => setEditing({ ...editing, image_alt: e.target.value })}
                className={inputClass}
              />
              {editing.title ? (
                <button
                  type="button"
                  className="text-xs text-emerald-700 hover:underline"
                  onClick={() =>
                    setEditing({
                      ...editing,
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
              imageUrl={editing.image_url}
              imageAlt={editing.image_alt}
              content={htmlToContent(editing.contentText ?? '')}
            />
            {editing.image_url ? (
              <div className="rounded-md border border-slate-200 overflow-hidden">
                <p className="px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-100">
                  Thẻ trên web
                </p>
                <div className="aspect-[16/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editing.image_url} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            ) : null}
          </section>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              editing.published
                ? 'border-emerald-200 bg-emerald-50/80'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <input
              type="checkbox"
              checked={editing.published ?? false}
              onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
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

      <NewsPreviewOverlay
        key={editing.slug || 'preview'}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={formToPreviewData(editing)}
        clientBase={clientBase}
        closeLabel="Quay lại chỉnh sửa"
      />
    </div>
  );
}
