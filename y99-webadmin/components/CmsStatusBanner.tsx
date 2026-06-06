'use client';

import { useAdminStore } from '@/lib/store';

export function CmsStatusBanner() {
  const { error } = useAdminStore();

  if (error) {
    return (
      <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
        <strong>Lỗi kết nối Supabase:</strong> {error}. Kiểm tra biến môi trường
        (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) trong
        `.env.local` hoặc Vercel → Settings → Environment Variables, rồi redeploy.
      </div>
    );
  }

  return null;
}
