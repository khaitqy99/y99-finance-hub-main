import { createServiceClient } from '@/lib/supabase/server';
import { CMS_MEDIA_BUCKET, CMS_MEDIA_FOLDER } from '@/lib/media/constants';
import { getMediaPublicUrl } from '@/lib/media/storage';
import type { MediaItem } from '@/lib/media/types';

export type MediaLibraryRow = {
  id: string;
  storage_path: string;
  public_url: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string;
  created_at: string;
};

export function rowToMediaItem(row: MediaLibraryRow): MediaItem {
  return {
    id: row.id,
    path: row.storage_path,
    url: row.public_url,
    name: row.file_name,
    size: row.size_bytes,
    created_at: row.created_at,
    alt_text: row.alt_text,
  };
}

export async function insertMediaRecord(input: {
  storage_path: string;
  public_url: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
}): Promise<MediaItem> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('media_library')
    .insert({
      storage_path: input.storage_path,
      public_url: input.public_url,
      file_name: input.file_name,
      mime_type: input.mime_type,
      size_bytes: input.size_bytes,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToMediaItem(data as MediaLibraryRow);
}

export async function listMediaRecords(): Promise<MediaItem[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('media_library')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data as MediaLibraryRow[]).map(rowToMediaItem);
}

export async function deleteMediaRecord(storagePath: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from('media_library').delete().eq('storage_path', storagePath);
  if (error) throw error;
}

/** Backfill DB rows for files already in Storage (upload trước khi có bảng). */
export async function syncOrphansFromStorage(): Promise<MediaItem[]> {
  const supabase = createServiceClient();
  const { data: files, error } = await supabase.storage.from(CMS_MEDIA_BUCKET).list(CMS_MEDIA_FOLDER, {
    limit: 200,
    sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error || !files?.length) return [];

  const items: MediaItem[] = [];
  for (const f of files) {
    if (!f.name?.endsWith('.webp')) continue;
    const storage_path = `${CMS_MEDIA_FOLDER}/${f.name}`;
    const public_url = getMediaPublicUrl(storage_path);
    const { data: existing } = await supabase
      .from('media_library')
      .select('*')
      .eq('storage_path', storage_path)
      .maybeSingle();
    if (existing) {
      items.push(rowToMediaItem(existing as MediaLibraryRow));
      continue;
    }
    try {
      const item = await insertMediaRecord({
        storage_path,
        public_url,
        file_name: f.name,
        mime_type: 'image/webp',
        size_bytes: (f.metadata?.size as number) ?? 0,
      });
      items.push(item);
    } catch {
      /* skip broken row */
    }
  }
  return items;
}
