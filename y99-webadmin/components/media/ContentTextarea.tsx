'use client';

import { useRef, useState } from 'react';
import { Images } from 'lucide-react';
import { MediaPickerModal } from '@/components/media/MediaPickerModal';
import type { MediaItem } from '@/lib/media/types';
import { imageMarkdownLine, countMarkdownImages } from '@/lib/media/content-images';
import { SEO_PRIORITY_IMAGE_COUNT } from '@/lib/seo/image-alt';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
  /** Số ảnh đã có trước nội dung (vd. 1 nếu đã có ảnh đại diện) */
  priorImageCount?: number;
  /** Gợi ý alt khi chèn ảnh */
  altSuggestion?: string;
};

export function ContentTextarea({
  label,
  value,
  onChange,
  rows = 6,
  placeholder,
  hint = 'Mỗi đoạn văn một dòng. «Chèn ảnh» thêm dòng ![alt](url) — 3 ảnh đầu bài cần alt mô tả + từ khóa.',
  priorImageCount = 0,
  altSuggestion = '',
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const insertImage = (item: MediaItem) => {
    const inlineCount = countMarkdownImages(value);
    const imageIndex = priorImageCount + inlineCount;
    const isPriority = imageIndex < SEO_PRIORITY_IMAGE_COUNT;

    const suggested =
      item.alt_text?.trim() ||
      altSuggestion.trim() ||
      item.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');

    let alt = suggested;
    if (isPriority) {
      const input = window.prompt(
        `Alt text cho ảnh #${imageIndex + 1} — Google ưu tiên 3 ảnh đầu bài.\nMô tả nội dung + từ khóa (vd. "vay tiền nhanh tại Y99"):`,
        suggested,
      );
      if (input === null) return;
      alt = input.trim();
      if (!alt) {
        window.alert('3 ảnh đầu bài viết cần alt text mô tả rõ — không bỏ qua thẻ alt.');
        return;
      }
    } else {
      const input = window.prompt('Alt text mô tả ảnh (tuỳ chọn, Enter để dùng gợi ý):', suggested);
      if (input === null) return;
      alt = input.trim() || suggested || 'Ảnh minh họa';
    }

    const line = imageMarkdownLine(item.url, alt);
    const el = ref.current;
    if (!el) {
      onChange(value ? `${value}\n${line}` : line);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const needsNlBefore = before.length > 0 && !before.endsWith('\n');
    const needsNlAfter = after.length > 0 && !after.startsWith('\n');
    const insert = `${needsNlBefore ? '\n' : ''}${line}${needsNlAfter ? '\n' : ''}`;
    const next = before + insert + after;
    onChange(next);
    requestAnimationFrame(() => {
      const pos = before.length + insert.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium">{label}</label>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          <Images size={14} />
          Chèn ảnh từ thư viện
        </button>
      </div>
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="flex w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-mono leading-relaxed"
      />
      <p className="text-xs text-slate-500">{hint}</p>
      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={insertImage}
        title="Chèn ảnh vào nội dung"
      />
    </div>
  );
}
