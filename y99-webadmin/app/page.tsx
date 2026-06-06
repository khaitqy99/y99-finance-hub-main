'use client';

import { useAdminStore } from '@/lib/store';
import { Newspaper, Store, WalletCards, Megaphone, Users } from 'lucide-react';

export default function DashboardPage() {
  const { data } = useAdminStore();

  if (!data) return null;

  const stats = [
    { label: 'Bản tin', value: data.news.length, icon: Newspaper },
    { label: 'Phòng Giao Dịch', value: data.stores.length, icon: Store },
    { label: 'Sản phẩm vay', value: data.products.length, icon: WalletCards },
    { label: 'Marketing Slides', value: data.marketing.slides.length, icon: Megaphone },
    { label: 'Leads Mới', value: data.leads.filter((l) => l.status === 'new').length, icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Tổng quan</h2>
        <p className="text-sm text-slate-500 mt-1">Dữ liệu đồng bộ với website client qua Supabase.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                <Icon size={16} className="text-slate-400" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
