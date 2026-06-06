import { NextResponse } from 'next/server';
import { createAuthClient, createServiceClient, isSupabaseConfigured } from '@/lib/supabase/server';

type GuardResult =
  | { user: { id: string; email?: string }; error: null }
  | { user: null; error: NextResponse };

export async function requireAdmin(): Promise<GuardResult> {
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Supabase chưa cấu hình' }, { status: 503 }),
    };
  }

  const auth = await createAuthClient();
  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();

  if (authError || !user) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const service = createServiceClient();
  const { data: profile } = await service
    .from('admin_profiles')
    .select('is_active')
    .eq('id', user.id)
    .maybeSingle();

  if (profile && !profile.is_active) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Tài khoản đã bị vô hiệu hóa' }, { status: 403 }),
    };
  }

  return { user: { id: user.id, email: user.email }, error: null };
}
