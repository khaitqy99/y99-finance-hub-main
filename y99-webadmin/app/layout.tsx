import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Y99 Admin Portal',
  description: 'Web Admin for Y99 Client',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  themeColor: '#2455AD',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body
        className="bg-slate-50 min-h-screen text-slate-900 flex font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
