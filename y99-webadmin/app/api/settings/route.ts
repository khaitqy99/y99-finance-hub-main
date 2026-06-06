import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function PUT(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  const body = await req.json();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, ...body })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
