import { parseImageLine } from '@/lib/media/content-images';

export const SEO_PRIORITY_IMAGE_COUNT = 3;

const WEAK_ALTS = new Set(['', 'ảnh', 'ảnh minh họa', 'image', 'photo', 'picture']);

export type ImageAltContext = {
  title: string;
  excerpt?: string;
  category?: string;
};

export type ArticleImageSlot = {
  /** Vị trí ảnh trong bài (0 = ảnh đại diện) */
  index: number;
  alt: string;
  label: string;
  isPriority: boolean;
  isWeak: boolean;
};

export function isWeakImageAlt(alt: string | undefined | null): boolean {
  return WEAK_ALTS.has((alt ?? '').trim().toLowerCase());
}

export function resolveArticleImageAlt(
  imageIndex: number,
  customAlt: string | undefined | null,
  ctx: ImageAltContext,
): string {
  const alt = customAlt?.trim();
  if (alt && !isWeakImageAlt(alt)) return alt;

  const { title, excerpt, category } = ctx;

  if (imageIndex === 0) {
    if (excerpt?.trim()) {
      return `${title} — ${excerpt.trim()}`.slice(0, 125);
    }
    return category?.trim()
      ? `${title} — ${category.trim()} Y99 Finance`
      : `${title} — ảnh đại diện Y99 Finance`;
  }

  if (imageIndex < SEO_PRIORITY_IMAGE_COUNT) {
    return `${title} — minh họa ${category?.trim() || 'bài viết'} (${imageIndex + 1})`.slice(
      0,
      125,
    );
  }

  return alt || title;
}

export function countMarkdownImages(text: string): number {
  return (text.match(/^!\[/gm) ?? []).length;
}

/** Liệt kê tất cả ảnh trong bài (đại diện + nội dung) để kiểm tra alt. */
export function listArticleImageSlots(params: {
  imageUrl?: string;
  imageAlt?: string;
  content: string[];
}): ArticleImageSlot[] {
  const slots: ArticleImageSlot[] = [];
  let index = 0;

  if (params.imageUrl?.trim()) {
    slots.push({
      index,
      alt: params.imageAlt ?? '',
      label: 'Ảnh đại diện (#1)',
      isPriority: index < SEO_PRIORITY_IMAGE_COUNT,
      isWeak: isWeakImageAlt(params.imageAlt),
    });
    index += 1;
  }

  for (const line of params.content) {
    const img = parseImageLine(line);
    if (!img) continue;
    slots.push({
      index,
      alt: img.alt,
      label: `Ảnh trong nội dung (#${index + 1})`,
      isPriority: index < SEO_PRIORITY_IMAGE_COUNT,
      isWeak: isWeakImageAlt(img.alt),
    });
    index += 1;
  }

  return slots;
}

export function auditArticleImageAlts(params: {
  imageUrl?: string;
  imageAlt?: string;
  content: string[];
}): string[] {
  const warnings: string[] = [];
  const slots = listArticleImageSlots(params);
  const weakPriority = slots.filter((s) => s.isPriority && s.isWeak);

  if (weakPriority.length) {
    warnings.push(
      `Google ưu tiên alt của 3 ảnh đầu — còn ${weakPriority.length} ảnh chưa có alt mô tả rõ (vd. «${params.imageAlt || 'vay tiền nhanh tại Y99'}»).`,
    );
  }

  for (const slot of weakPriority) {
    warnings.push(`${slot.label}: thiếu alt text hoặc đang dùng «Ảnh minh họa».`);
  }

  return warnings;
}
