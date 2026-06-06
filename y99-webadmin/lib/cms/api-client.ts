async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? res.statusText);
  return body as T;
}

export const cmsApi = {
  loadAll: () => jsonFetch<import('@/lib/cms/types').AdminData>('/api/cms'),
  saveNews: (payload: Record<string, unknown>, id?: string) =>
    id
      ? jsonFetch('/api/news', { method: 'PUT', body: JSON.stringify({ id, ...payload }) })
      : jsonFetch('/api/news', { method: 'POST', body: JSON.stringify(payload) }),
  deleteNews: (id: string) => jsonFetch(`/api/news?id=${id}`, { method: 'DELETE' }),
  saveStore: (payload: Record<string, unknown>, id?: string) =>
    id
      ? jsonFetch('/api/stores', { method: 'PUT', body: JSON.stringify({ id, ...payload }) })
      : jsonFetch('/api/stores', { method: 'POST', body: JSON.stringify(payload) }),
  deleteStore: (id: string) => jsonFetch(`/api/stores?id=${id}`, { method: 'DELETE' }),
  saveProduct: (payload: Record<string, unknown>, slug?: string) =>
    slug
      ? jsonFetch('/api/products', { method: 'PUT', body: JSON.stringify({ slug, ...payload }) })
      : jsonFetch('/api/products', { method: 'POST', body: JSON.stringify(payload) }),
  deleteProduct: (slug: string) => jsonFetch(`/api/products?slug=${slug}`, { method: 'DELETE' }),
  saveSlide: (payload: Record<string, unknown>, id?: string) =>
    id
      ? jsonFetch('/api/hero-slides', { method: 'PUT', body: JSON.stringify({ id, ...payload }) })
      : jsonFetch('/api/hero-slides', { method: 'POST', body: JSON.stringify(payload) }),
  deleteSlide: (id: string) => jsonFetch(`/api/hero-slides?id=${id}`, { method: 'DELETE' }),
  saveTestimonial: (payload: Record<string, unknown>, id?: string) =>
    id
      ? jsonFetch('/api/testimonials', { method: 'PUT', body: JSON.stringify({ id, ...payload }) })
      : jsonFetch('/api/testimonials', { method: 'POST', body: JSON.stringify(payload) }),
  deleteTestimonial: (id: string) => jsonFetch(`/api/testimonials?id=${id}`, { method: 'DELETE' }),
  saveSettings: (payload: Record<string, unknown>) =>
    jsonFetch('/api/settings', { method: 'PUT', body: JSON.stringify(payload) }),
  updateLeadStatus: (id: string, status: string) =>
    jsonFetch('/api/leads', { method: 'PUT', body: JSON.stringify({ id, status }) }),
};
