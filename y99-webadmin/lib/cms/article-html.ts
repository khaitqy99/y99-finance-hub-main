import { parseImageLine } from '@/lib/media/content-images';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function isHtmlFragment(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value.trim());
}

export function isRichArticleContent(content: string[]): boolean {
  return content.some((block) => isHtmlFragment(block) && !parseImageLine(block));
}

export function contentToHtml(content: string[]): string {
  if (content.length === 0) return '';
  if (content.length === 1 && isHtmlFragment(content[0]) && !parseImageLine(content[0])) {
    return content[0];
  }
  return content
    .map((block) => {
      const img = parseImageLine(block);
      if (img) {
        return `<img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt)}">`;
      }
      if (isHtmlFragment(block)) return block;
      if (!block.trim()) return '';
      return `<p>${escapeHtml(block)}</p>`;
    })
    .join('');
}

export function htmlToContent(html: string): string[] {
  const trimmed = html.trim();
  const hasImage = /<img\b/i.test(trimmed);
  const text = trimmed.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  if (!trimmed || (!text && !hasImage)) return [];
  return [trimmed];
}

const IMG_TAG_RE = /<img\b[^>]*>/gi;
const SRC_RE = /\bsrc=["']([^"']+)["']/i;
const ALT_RE = /\balt=["']([^"']*)["']/i;

export function parseHtmlImages(html: string): { alt: string; url: string }[] {
  return (html.match(IMG_TAG_RE) ?? []).flatMap((tag) => {
    const url = tag.match(SRC_RE)?.[1];
    if (!url) return [];
    return [{ url, alt: tag.match(ALT_RE)?.[1] ?? '' }];
  });
}

export function extractContentImages(content: string[]): { alt: string; url: string }[] {
  const images: { alt: string; url: string }[] = [];
  for (const block of content) {
    const md = parseImageLine(block);
    if (md) {
      images.push(md);
      continue;
    }
    if (isHtmlFragment(block)) images.push(...parseHtmlImages(block));
  }
  return images;
}

export function sanitizeArticleHtml(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');
}

export function countContentImages(htmlOrText: string): number {
  const markdown = (htmlOrText.match(/^!\[/gm) ?? []).length;
  const html = (htmlOrText.match(/<img\b/gi) ?? []).length;
  return markdown + html;
}
