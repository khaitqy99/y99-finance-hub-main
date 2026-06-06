export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://y99.vn";
export const SITE_NAME = "Y99 Finance";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, "")}${normalized}`;
}
