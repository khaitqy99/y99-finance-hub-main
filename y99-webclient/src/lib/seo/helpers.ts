export const META_DESC_MAX = 160;
export const META_TITLE_MAX = 60;

export function stripForMeta(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Chuẩn hóa meta description cho thẻ & OG (tối đa 160 ký tự). */
export function normalizeMetaDescription(text: string): string {
  const clean = stripForMeta(text);
  if (!clean) return "";
  if (clean.length <= META_DESC_MAX) return clean;
  return `${clean.slice(0, META_DESC_MAX - 1).trimEnd()}…`;
}

export function pickMetaDescription(
  custom: string | undefined | null,
  ...fallbacks: (string | undefined | null)[]
): string {
  if (custom?.trim()) return normalizeMetaDescription(custom);
  for (const fb of fallbacks) {
    if (fb?.trim()) return normalizeMetaDescription(fb);
  }
  return "";
}
