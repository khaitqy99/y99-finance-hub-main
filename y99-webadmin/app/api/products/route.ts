import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  const body = await req.json();
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('loan_products').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  const body = await req.json();
  const { slug, ...rest } = body;
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  const supabase = createServiceClient();
  const { data, error } = await supabase.from('loan_products').update(rest).eq('slug', slug).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  const supabase = createServiceClient();
  const { error } = await supabase.from('loan_products').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
