'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Newspaper, 
  Store, 
  WalletCards, 
  Megaphone, 
  Users, 
  UserCog,
  Settings,
  LogOut,
  Images,
} from 'lucide-react';
import { createBrowserSupabaseClient, isAuthConfigured } from '@/lib/supabase/client';

const MENU_ITEMS = [
  { name: 'Tổng quan', href: '/', icon: LayoutDashboard },
  { name: 'Thư viện ảnh', href: '/content/media', icon: Images },
  { name: 'Bản tin', href: '/content/news', icon: Newspaper },
  { name: 'Hệ thống PGD', href: '/content/stores', icon: Store },
  { name: 'Sản phẩm vay', href: '/content/products', icon: WalletCards },
  { name: 'Marketing', href: '/content/marketing', icon: Megaphone },
  { name: 'Lượt đăng ký (Leads)', href: '/content/leads', icon: Users },
  { name: 'Người dùng', href: '/content/users', icon: UserCog },
  { name: 'Cài đặt Site', href: '/content/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    if (!isAuthConfigured()) return;
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen text-slate-900">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center font-bold text-white shadow-sm">
            Y9
          </div>
          <span className="text-lg font-semibold tracking-tight">Admin</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col gap-1 px-3">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-slate-900' : 'text-slate-500'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 mt-auto border-t border-slate-200">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
