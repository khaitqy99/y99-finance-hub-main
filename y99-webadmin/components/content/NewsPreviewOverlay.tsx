'use client';

import { useState } from 'react';
import { Calendar, ExternalLink, LayoutGrid, X } from 'lucide-react';
import { linesToArray } from '@/lib/cms/helpers';
import { parseImageLine } from '@/lib/media/content-images';
import { resolveArticleImageAlt } from '@/lib/seo/image-alt';
import type { NewsRow } from '@/lib/cms/types';

export type NewsPreviewData = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date_display: string;
  image_url: string;
  image_alt?: string;
  content: string[];
  published?: boolean;
};

type ViewMode = 'detail' | 'card';

type Props = {
  open: boolean;
  onClose: () => void;
  data: NewsPreviewData | null;
  clientBase?: string;
  closeLabel?: string;
};

const PRIMARY = 'hsl(199 100% 49%)';
const MUTED = 'hsl(215 16% 47%)';

function PreviewBadge({ published }: { published?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        published
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-amber-100 text-amber-900'
      }`}
    >
      {published ? 'Đã xuất bản trên web' : 'Bản xem trước — chưa xuất bản'}
    </span>
  );
}

function DetailPreview({ data }: { data: NewsPreviewData }) {
  const altCtx = {
    title: data.title || 'Tiêu đề bài viết',
    excerpt: data.excerpt,
    category: data.category,
  };
  let imageIndex = 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div
        className="px-8 py-10 border-b border-slate-100"
        style={{ background: 'linear-gradient(135deg, hsl(199 100% 97%), hsl(210 40% 98%))' }}
      >
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: PRIMARY }}
        >
          {data.category || 'Danh mục'}
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          {data.title || 'Tiêu đề bài viết'}
        </h1>
        <p className="mt-2 text-sm" style={{ color: MUTED }}>
          Tin tức / {data.title?.slice(0, 40) || '…'}
        </p>
      </div>

      <div className="px-8 py-10 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: MUTED }}>
          <Calendar className="h-4 w-4" />
          {data.date_display || '—'}
        </div>

        {data.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.image_url}
            alt={resolveArticleImageAlt(imageIndex++, data.image_alt, altCtx)}
            className="rounded-3xl w-full aspect-[16/9] object-cover shadow-md"
          />
        ) : (
          <div className="rounded-3xl w-full aspect-[16/9] bg-slate-100 flex items-center justify-center text-sm text-slate-400">
            Chưa có ảnh đại diện
          </div>
        )}

        <div className="mt-8 space-y-5">
          {data.excerpt ? (
            <p className="text-lg font-medium text-slate-800 leading-relaxed">{data.excerpt}</p>
          ) : null}

          {data.content.length === 0 ? (
            <p className="text-sm text-slate-400 italic">Chưa có nội dung bài viết.</p>
          ) : (
            data.content.map((p, i) => {
              const img = parseImageLine(p);
              if (img) {
                const idx = imageIndex++;
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img.url}
                    alt={resolveArticleImageAlt(idx, img.alt, altCtx)}
                    className="rounded-2xl w-full my-2 object-cover shadow-md"
                  />
                );
              }
              return (
                <p key={i} className="text-base text-slate-700 leading-relaxed">
                  {p}
                </p>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function CardPreview({ data }: { data: NewsPreviewData }) {
  return (
    <div className="max-w-md mx-auto">
      <p className="text-xs text-slate-500 mb-3 text-center">
        Cách hiển thị trên danh sách /ban-tin
      </p>
      <article className="rounded-2xl bg-white overflow-hidden border border-slate-200 shadow-md">
        <div className="aspect-[16/10] overflow-hidden bg-slate-100">
          {data.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.image_url}
              alt={resolveArticleImageAlt(0, data.image_alt, {
                title: data.title || 'Tiêu đề',
                excerpt: data.excerpt,
                category: data.category,
              })}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              Chưa có ảnh
            </div>
          )}
        </div>
        <div className="p-6">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: PRIMARY }}
          >
            {data.category || 'Danh mục'}
          </span>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
            {data.title || 'Tiêu đề'}
          </h3>
          <p className="mt-2 text-sm line-clamp-2" style={{ color: MUTED }}>
            {data.excerpt || 'Tóm tắt bài viết…'}
          </p>
          <div className="mt-4 text-xs flex items-center gap-1.5" style={{ color: MUTED }}>
            <Calendar className="h-3.5 w-3.5" />
            {data.date_display || '—'}
          </div>
        </div>
      </article>
    </div>
  );
}

export function formToPreviewData(
  form: Partial<NewsRow> & { contentText?: string },
): NewsPreviewData {
  return {
    title: form.title ?? '',
    slug: form.slug ?? '',
    excerpt: form.excerpt ?? '',
    category: form.category ?? '',
    date_display: form.date_display ?? '',
    image_url: form.image_url ?? '',
    image_alt: form.image_alt ?? '',
    content: form.contentText != null ? linesToArray(form.contentText) : (form.content ?? []),
    published: form.published,
  };
}

export function rowToPreviewData(row: NewsRow): NewsPreviewData {
  return {
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    category: row.category,
    date_display: row.date_display,
    image_url: row.image_url,
    image_alt: row.image_alt,
    content: row.content,
    published: row.published,
  };
}

export function NewsPreviewOverlay({
  open,
  onClose,
  data,
  clientBase = 'http://localhost:5173',
  closeLabel = 'Đóng',
}: Props) {
  const [view, setView] = useState<ViewMode>('detail');

  if (!open || !data) return null;

  const liveUrl = data.slug ? `${clientBase}/ban-tin/${data.slug}` : null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950/60 backdrop-blur-sm">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 py-3">
        <div className="min-w-0 flex flex-wrap items-center gap-3">
          <h2 className="text-base font-semibold text-slate-900">Xem trước bài viết</h2>
          <PreviewBadge published={data.published} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setView('detail')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === 'detail' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trang chi tiết
            </button>
            <button
              type="button"
              onClick={() => setView('card')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid size={14} />
              Thẻ danh sách
            </button>
          </div>
          {data.published && liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Mở bản live
              <ExternalLink size={12} />
            </a>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Đóng xem trước"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="sm:hidden flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setView('detail')}
              className={`flex-1 rounded-md py-2 text-xs font-medium border ${
                view === 'detail' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'
              }`}
            >
              Chi tiết
            </button>
            <button
              type="button"
              onClick={() => setView('card')}
              className={`flex-1 rounded-md py-2 text-xs font-medium border ${
                view === 'card' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'
              }`}
            >
              Thẻ danh sách
            </button>
          </div>
          {view === 'detail' ? <DetailPreview data={data} /> : <CardPreview data={data} />}
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white px-4 sm:px-6 py-3 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="h-9 px-4 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
