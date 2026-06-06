import { createServiceClient } from '@/lib/supabase/server';
import { CMS_MEDIA_BUCKET, CMS_MEDIA_FOLDER } from '@/lib/media/constants';
import { getMediaPublicUrl } from '@/lib/media/storage';
import type { MediaItem } from '@/lib/media/types';

/** Khi chưa có bảng media_library — liệt kê trực tiếp từ Storage */
export async function listMediaFromStorageOnly(): Promise<MediaItem[]> {
  const supabase = createServiceClient();
  const { data: files, error } = await supabase.storage.from(CMS_MEDIA_BUCKET).list(CMS_MEDIA_FOLDER, {
    limit: 200,
    sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error) throw error;

  return (files ?? [])
    .filter((f) => f.name?.endsWith('.webp'))
    .map((f) => {
      const path = `${CMS_MEDIA_FOLDER}/${f.name}`;
      return {
        path,
        url: getMediaPublicUrl(path),
        name: f.name,
        size: (f.metadata?.size as number) ?? null,
        created_at: f.created_at ?? null,
      };
    });
}

export function isMissingMediaTableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes('media_library') || msg.includes('schema cache');
}
