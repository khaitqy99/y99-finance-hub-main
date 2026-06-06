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
