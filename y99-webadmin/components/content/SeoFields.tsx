'use client';

import { META_DESC_MAX, META_TITLE_MAX, metaDescriptionLength } from '@/lib/seo/helpers';

type Props = {
  metaTitle: string;
  metaDescription: string;
  seoH1?: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onSeoH1Change?: (value: string) => void;
  /** Đường dẫn trang, vd. `/vay-tien-online` hoặc `/cho-vay-cam-co/slug` */
  pagePath?: string;
  /** Gợi ý điền meta description (vd. tóm tắt / tagline) */
  descriptionFallback?: string;
  /** Gợi ý điền meta title (vd. tiêu đề bài / tên SP) */
  titleFallback?: string;
  /** Gợi ý điền H1 (vd. tiêu đề hiển thị trên trang) */
  h1Fallback?: string;
  /** Từ khóa chính gợi ý (hiển thị trong checklist) */
  primaryKeyword?: string;
};

const SITE_URL = (process.env.NEXT_PUBLIC_CLIENT_URL ?? 'https://y99.vn').replace(/\/$/, '');

const inputClass =
  'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

const textareaClass =
  'flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';

function counterClass(len: number, max: number): string {
  if (len > max) return 'text-amber-600 font-medium';
  if (len >= max * 0.85) return 'text-slate-600';
  return 'text-slate-400';
}

function serpTitle(metaTitle: string, fallback: string): string {
  const raw = metaTitle.trim() || fallback.trim();
  if (!raw) return 'Tiêu đề trang | Y99 Finance';
  return raw.includes('Y99') ? raw : `${raw} | Y99 Finance`;
}

const CHECKLIST = [
  'URL: không dấu, ngăn cách bằng dấu gạch ngang (vd. vay-tien-online).',
  'Title tag: đặt từ khóa chính sát bên trái, thương hiệu ở cuối.',
  'Meta description: chứa từ khóa, 120–160 ký tự để tăng CTR.',
  'H1: mỗi trang chỉ 1 thẻ, chứa từ khóa chính (có thể dài hơn title).',
  'Nội dung: phân bổ tự nhiên từ khóa chính & phụ, in đậm điểm nhấn.',
  'H2/H3: dùng từ khóa phụ hoặc biến thể từ khóa chính.',
  'Ảnh: 3 ảnh đầu bài cần alt mô tả rõ + từ khóa (<img alt="…">).',
] as const;

export function SeoFields({
  metaTitle,
  metaDescription,
  seoH1 = '',
  onMetaTitleChange,
  onMetaDescriptionChange,
  onSeoH1Change,
  pagePath,
  descriptionFallback,
  titleFallback,
  h1Fallback,
  primaryKeyword,
}: Props) {
  const descLen = metaDescriptionLength(metaDescription);
  const displayTitle = serpTitle(metaTitle, titleFallback ?? '');
  const displayDesc =
    metaDescription.trim() ||
    (descriptionFallback ? descriptionFallback.slice(0, META_DESC_MAX) : 'Mô tả trang sẽ hiển thị trên Google…');
  const canonical = pagePath ? `${SITE_URL}${pagePath.startsWith('/') ? pagePath : `/${pagePath}`}` : SITE_URL;

  return (
    <section className="rounded-lg border border-emerald-200/80 bg-emerald-50/30 p-4 space-y-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
          SEO on-page
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Title, mô tả & H1 cho Google và mạng xã hội. Để trống sẽ dùng tiêu đề / tagline mặc định.
        </p>
      </div>

      {/* SERP preview */}
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Xem trước Google
        </p>
        <p className="text-xs text-emerald-700 truncate">{canonical}</p>
        <p className="text-base text-[#1a0dab] font-medium leading-snug mt-0.5 line-clamp-2 hover:underline cursor-default">
          {displayTitle}
        </p>
        <p className="text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">{displayDesc}</p>
      </div>

      {pagePath ? (
        <div className="text-xs text-slate-600">
          <span className="font-medium text-slate-700">URL: </span>
          <code className="rounded bg-white px-1.5 py-0.5 border border-slate-200">{pagePath}</code>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-slate-900">Meta title</label>
          <span className={`text-xs tabular-nums ${counterClass(metaTitle.length, META_TITLE_MAX)}`}>
            {metaTitle.length}/{META_TITLE_MAX}
          </span>
        </div>
        <input
          maxLength={META_TITLE_MAX + 20}
          placeholder="Từ khóa chính đặt sát bên trái (≤ 60 ký tự)"
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          className={inputClass}
        />
        {titleFallback ? (
          <button
            type="button"
            className="text-xs text-emerald-700 hover:underline"
            onClick={() => onMetaTitleChange(titleFallback.slice(0, META_TITLE_MAX))}
          >
            Lấy từ tiêu đề
          </button>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-slate-900">Meta description</label>
          <span className={`text-xs tabular-nums ${counterClass(descLen, META_DESC_MAX)}`}>
            {descLen}/{META_DESC_MAX}
          </span>
        </div>
        <textarea
          rows={3}
          maxLength={META_DESC_MAX + 40}
          placeholder="Mô tả chứa từ khóa, khuyến nghị 120–160 ký tự"
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          className={textareaClass}
        />
        {descriptionFallback ? (
          <button
            type="button"
            className="text-xs text-emerald-700 hover:underline"
            onClick={() => onMetaDescriptionChange(descriptionFallback.slice(0, META_DESC_MAX))}
          >
            Lấy từ tóm tắt / tagline
          </button>
        ) : null}
      </div>

      {onSeoH1Change ? (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-900">Tiêu đề H1 (trên trang)</label>
          <input
            placeholder="1 H1/trang, chứa từ khóa chính — có thể dài hơn meta title"
            value={seoH1}
            onChange={(e) => onSeoH1Change(e.target.value)}
            className={inputClass}
          />
          {h1Fallback ? (
            <button
              type="button"
              className="text-xs text-emerald-700 hover:underline"
              onClick={() => onSeoH1Change(h1Fallback)}
            >
              Lấy từ tiêu đề hiển thị
            </button>
          ) : null}
          <p className="text-xs text-slate-500">
            H1 hiển thị cho người đọc; meta title tối ưu cho kết quả tìm kiếm.
          </p>
        </div>
      ) : null}

      <details className="group">
        <summary className="text-xs font-semibold text-emerald-800 cursor-pointer list-none flex items-center gap-1">
          <span className="group-open:rotate-90 transition-transform">▸</span>
          Checklist SEO on-page
          {primaryKeyword ? (
            <span className="font-normal text-slate-500 ml-1">— từ khóa: {primaryKeyword}</span>
          ) : null}
        </summary>
        <ul className="mt-2 space-y-1.5 pl-3">
          {CHECKLIST.map((tip) => (
            <li key={tip} className="text-xs text-slate-600 leading-relaxed flex gap-2">
              <span className="text-emerald-600 shrink-0">✓</span>
              {tip}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
