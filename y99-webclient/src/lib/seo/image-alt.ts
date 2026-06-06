/** Google spider ưu tiên alt của 3 ảnh đầu tiên trong bài. */
export const SEO_PRIORITY_IMAGE_COUNT = 3;

const WEAK_ALTS = new Set(["", "ảnh", "ảnh minh họa", "image", "photo", "picture"]);

export type ImageAltContext = {
  title: string;
  excerpt?: string;
  category?: string;
};

export function isWeakImageAlt(alt: string | undefined | null): boolean {
  return WEAK_ALTS.has((alt ?? "").trim().toLowerCase());
}

/** Alt text cho ảnh bài viết / sản phẩm — 3 ảnh đầu có fallback mô tả rõ hơn. */
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
    return `${title} — minh họa ${category?.trim() || "bài viết"} (${imageIndex + 1})`.slice(
      0,
      125,
    );
  }

  return alt || title;
}
