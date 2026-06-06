import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-slate-500">Trang không tồn tại.</p>
      <Link href="/" className="mt-6 text-sm font-medium text-slate-900 underline">
        Về tổng quan
      </Link>
    </div>
  );
}
