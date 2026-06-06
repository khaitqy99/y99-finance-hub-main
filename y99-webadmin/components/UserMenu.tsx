'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient, isAuthConfigured } from '@/lib/supabase/client';

export function UserMenu() {
  const router = useRouter();
  const [label, setLabel] = useState('AD');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!isAuthConfigured()) return;
    const supabase = createBrowserSupabaseClient();
    void supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user?.email) return;
      setEmail(user.email);
      const name =
        (user.user_metadata?.display_name as string | undefined) ||
        user.email.split('@')[0];
      setLabel(name.slice(0, 2).toUpperCase());
    });
  }, []);

  const handleLogout = async () => {
    if (!isAuthConfigured()) return;
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      {email && (
        <span className="hidden text-sm text-slate-500 sm:inline">{email}</span>
      )}
      <div
        className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-medium text-xs"
        title={email}
      >
        {label}
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="text-sm text-slate-500 hover:text-slate-900"
      >
        Đăng xuất
      </button>
    </div>
  );
}
