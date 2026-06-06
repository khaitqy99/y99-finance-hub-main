import type { Metadata } from 'next';
import './globals.css';
import { DashboardShell } from '@/components/DashboardShell';

export const metadata: Metadata = {
  title: 'Y99 Admin Portal',
  description: 'Web Admin for Y99 Client',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body
        className="bg-slate-50 min-h-screen text-slate-900 flex font-sans"
        suppressHydrationWarning
      >
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
