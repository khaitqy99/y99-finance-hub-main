import type { MediaItem } from '@/lib/media/types';

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || res.statusText);
  return data as T;
}

export const mediaApi = {
  list: () => jsonFetch<{ items: MediaItem[] }>('/api/media'),

  upload: async (file: File): Promise<MediaItem> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/media', { method: 'POST', body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error || 'Upload thất bại');
    return (data as { item: MediaItem }).item;
  },

  delete: (path: string) =>
    jsonFetch<{ ok: boolean }>(`/api/media?path=${encodeURIComponent(path)}`, { method: 'DELETE' }),
};
