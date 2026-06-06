export const META_TITLE_MAX = 60;
export const META_DESC_MAX = 160;

export function stripForMeta(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function truncateMeta(text: string, max: number): string {
  const clean = stripForMeta(text);
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function metaDescriptionLength(text: string): number {
  return stripForMeta(text).length;
}
