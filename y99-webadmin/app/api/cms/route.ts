import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { loadAdminData } from '@/lib/cms/load-all';

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase chưa cấu hình. Thêm biến môi trường vào .env.local' },
      { status: 503 },
    );
  }
  try {
    const data = await loadAdminData();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Load failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
