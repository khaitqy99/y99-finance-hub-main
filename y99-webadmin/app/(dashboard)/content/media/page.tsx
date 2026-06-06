'use client';

import Link from 'next/link';
import { MediaLibrary } from '@/components/media/MediaLibrary';

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Thư viện ảnh</h2>
        <p className="text-sm text-slate-500 mt-1">
          Bấm ảnh xem chi tiết · icon <strong>phóng to</strong> mở gallery nhỏ (đổi ảnh bằng ← → hoặc dải thumbnail).
          Upload WebP + Storage + CSDL. Gắn vào:{' '}
          <Link href="/content/news" className="text-slate-900 underline">
            Bản tin
          </Link>
          ,{' '}
          <Link href="/content/marketing" className="text-slate-900 underline">
            Marketing
          </Link>
          ,{' '}
          <Link href="/content/products" className="text-slate-900 underline">
            Sản phẩm
          </Link>
          .
        </p>
      </div>
      <MediaLibrary />
    </div>
  );
}
