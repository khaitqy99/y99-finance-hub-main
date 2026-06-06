import { createServiceClient } from '@/lib/supabase/server';
import { CMS_MEDIA_BUCKET } from '@/lib/media/constants';

export function getMediaPublicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  return `${base}/storage/v1/object/public/${CMS_MEDIA_BUCKET}/${path}`;
}

export async function ensureMediaBucket() {
  const supabase = createServiceClient();
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) throw listErr;
  if (buckets?.some((b) => b.name === CMS_MEDIA_BUCKET || b.id === CMS_MEDIA_BUCKET)) {
    return;
  }
  const { error } = await supabase.storage.createBucket(CMS_MEDIA_BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/avif'],
  });
  if (error && !error.message.includes('already exists')) throw error;
}
