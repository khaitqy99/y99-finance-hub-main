'use client';

import { auditArticleImageAlts, listArticleImageSlots } from '@/lib/seo/image-alt';

type Props = {
  imageUrl?: string;
  imageAlt?: string;
  content: string[];
};

export function ImageAltAudit({ imageUrl, imageAlt, content }: Props) {
  const slots = listArticleImageSlots({ imageUrl, imageAlt, content });
  const warnings = auditArticleImageAlts({ imageUrl, imageAlt, content });

  if (!slots.length) return null;

  return (
    <section className="rounded-lg border border-sky-200/80 bg-sky-50/40 p-3 space-y-2">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-sky-900">
          Alt text ảnh (SEO)
        </h4>
        <p className="text-xs text-slate-600 mt-1">
          Spider ưu tiên <strong className="font-medium">3 ảnh đầu</strong> — dùng{' '}
          <code className="text-[11px] bg-white px-1 rounded">{`<img alt="…">`}</code> mô tả + từ khóa.
        </p>
      </div>

      <ul className="space-y-1">
        {slots.slice(0, 5).map((slot) => (
          <li key={slot.index} className="flex items-start gap-2 text-xs">
            <span
              className={`shrink-0 mt-0.5 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                slot.isPriority
                  ? slot.isWeak
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {slot.index + 1}
            </span>
            <span className="text-slate-700">
              <span className="font-medium">{slot.label}: </span>
              {slot.isWeak ? (
                <span className="text-amber-700">chưa có alt mô tả</span>
              ) : (
                <span className="text-emerald-800">{slot.alt}</span>
              )}
            </span>
          </li>
        ))}
        {slots.length > 5 ? (
          <li className="text-xs text-slate-500 pl-6">+{slots.length - 5} ảnh khác</li>
        ) : null}
      </ul>

      {warnings.length ? (
        <ul className="space-y-1 pt-1 border-t border-sky-200/60">
          {warnings.map((w) => (
            <li key={w} className="text-xs text-amber-800 flex gap-1.5">
              <span className="shrink-0">⚠</span>
              {w}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-emerald-700">✓ 3 ảnh đầu đã có alt text phù hợp.</p>
      )}
    </section>
  );
}
