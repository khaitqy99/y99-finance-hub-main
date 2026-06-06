'use client';

import { Sidebar } from '@/components/Sidebar';
import { UserMenu } from '@/components/UserMenu';
import { CmsStatusBanner } from '@/components/CmsStatusBanner';
import { AdminProvider } from '@/lib/store';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white/95 backdrop-blur border-b border-slate-200 flex items-center px-8 justify-between shrink-0 sticky top-0 z-10 transition-shadow">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold tracking-tight text-sm text-slate-600">
              Y99 Content Management
            </h1>
          </div>
          <UserMenu />
        </header>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <CmsStatusBanner />
            {children}
          </div>
        </div>
      </main>
    </AdminProvider>
  );
}
