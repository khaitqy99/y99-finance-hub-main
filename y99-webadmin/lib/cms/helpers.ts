export function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function arrayToLines(items: string[]): string {
  return items.join('\n');
}

export function linesToProcess(text: string): { title: string; desc: string }[] {
  return linesToArray(text).map((line) => {
    const [title, ...rest] = line.split('|');
    return { title: (title ?? '').trim(), desc: rest.join('|').trim() };
  });
}

export function processToLines(steps: { title: string; desc: string }[]): string {
  return steps.map((s) => `${s.title}|${s.desc}`).join('\n');
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Nếu dán full URL vào ô slug thì chỉ lấy đoạn path cuối, vd. `/ban-tin/abc`. */
export function normalizeNewsSlug(input: string): string {
  const raw = input.trim();
  if (!raw) return '';

  let path = raw;
  const looksLikeUrl = /^(https?:\/\/)?[a-z0-9.-]+\.[a-z]{2,}([/:?#]|$)/i.test(raw) || raw.includes('://');
  if (looksLikeUrl) {
    try {
      const url = new URL(raw.includes('://') ? raw : `https://${raw}`);
      const last = url.pathname.split('/').filter(Boolean).pop() ?? '';
      path = last || url.hostname;
    } catch {
      path = raw.split(/[/?#]/).filter(Boolean).pop() ?? raw;
    }
  } else if (raw.includes('/')) {
    path = raw.split('/').filter(Boolean).pop() ?? raw;
  }

  return slugify(path);
}
