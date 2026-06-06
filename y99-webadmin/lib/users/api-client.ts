import type { AdminUserRow } from '@/lib/users/types';

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? res.statusText);
  return body as T;
}

export const usersApi = {
  list: () => jsonFetch<AdminUserRow[]>('/api/users'),
  create: (payload: { email: string; password: string; display_name?: string }) =>
    jsonFetch<AdminUserRow>('/api/users', { method: 'POST', body: JSON.stringify(payload) }),
  update: (
    id: string,
    payload: { display_name?: string; is_active?: boolean; password?: string },
  ) =>
    jsonFetch<AdminUserRow>('/api/users', {
      method: 'PUT',
      body: JSON.stringify({ id, ...payload }),
    }),
  delete: (id: string) => jsonFetch<{ ok: true }>(`/api/users?id=${id}`, { method: 'DELETE' }),
};
