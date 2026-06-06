export const IMAGE_LINE_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

export function parseImageLine(line: string): { alt: string; url: string } | null {
  const m = line.trim().match(IMAGE_LINE_RE);
  if (!m) return null;
  return { alt: m[1], url: m[2] };
}
