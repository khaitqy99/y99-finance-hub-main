import { parseImageLine } from "@/lib/cms/content-images";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isHtmlFragment(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value.trim());
}

export function isRichArticleContent(content: string[]): boolean {
  return content.some((block) => isHtmlFragment(block) && !parseImageLine(block));
}

export function contentToHtml(content: string[]): string {
  if (content.length === 0) return "";
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
      if (!block.trim()) return "";
      return `<p>${escapeHtml(block)}</p>`;
    })
    .join("");
}

export function sanitizeArticleHtml(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}
