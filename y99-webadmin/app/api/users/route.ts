import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createServiceClient } from '@/lib/supabase/server';
import type { AdminUserRow } from '@/lib/users/types';

async function listUsers(): Promise<AdminUserRow[]> {
  const supabase = createServiceClient();
  const { data: profiles, error: profileError } = await supabase
    .from('admin_profiles')
    .select('id, email, display_name, is_active, created_at')
    .order('created_at', { ascending: true });

  if (profileError) throw new Error(profileError.message);

  const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });
  if (authError) throw new Error(authError.message);

  const lastSignIn = new Map(
    authData.users.map((u) => [u.id, u.last_sign_in_at ?? null]),
  );

  return (profiles ?? []).map((p) => ({
    id: p.id,
    email: p.email,
    display_name: p.display_name,
    is_active: p.is_active,
    created_at: p.created_at,
    last_sign_in_at: lastSignIn.get(p.id) ?? null,
  }));
}

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    const users = await listUsers();
    return NextResponse.json(users);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Load failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const body = await req.json();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  const displayName = String(body.display_name ?? '').trim();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email và mật khẩu là bắt buộc' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Mật khẩu tối thiểu 8 ký tự' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName || email.split('@')[0] },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const userId = data.user.id;
  await supabase
    .from('admin_profiles')
    .upsert({
      id: userId,
      email,
      display_name: displayName || email.split('@')[0],
      is_active: true,
      updated_at: new Date().toISOString(),
    });

  const users = await listUsers();
  const created = users.find((u) => u.id === userId);
  return NextResponse.json(created ?? users[users.length - 1]);
}

export async function PUT(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const body = await req.json();
  const id = String(body.id ?? '');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = createServiceClient();
  const displayName =
    body.display_name !== undefined ? String(body.display_name).trim() : undefined;
  const isActive = body.is_active !== undefined ? Boolean(body.is_active) : undefined;
  const password = body.password ? String(body.password) : undefined;

  if (password && password.length < 8) {
    return NextResponse.json({ error: 'Mật khẩu tối thiểu 8 ký tự' }, { status: 400 });
  }

  if (id === guard.user.id && isActive === false) {
    return NextResponse.json({ error: 'Không thể tự vô hiệu hóa tài khoản của mình' }, { status: 400 });
  }

  const profilePatch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (displayName !== undefined) profilePatch.display_name = displayName;
  if (isActive !== undefined) profilePatch.is_active = isActive;

  if (Object.keys(profilePatch).length > 1) {
    const { error: profileError } = await supabase
      .from('admin_profiles')
      .update(profilePatch)
      .eq('id', id);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  const authPatch: { password?: string; ban_duration?: string } = {};
  if (password) authPatch.password = password;
  if (isActive !== undefined) {
    authPatch.ban_duration = isActive ? 'none' : '876000h';
  }

  if (Object.keys(authPatch).length > 0) {
    const { error: authError } = await supabase.auth.admin.updateUserById(id, authPatch);
    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const users = await listUsers();
  const updated = users.find((u) => u.id === id);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  if (id === guard.user.id) {
    return NextResponse.json({ error: 'Không thể xóa tài khoản của mình' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
