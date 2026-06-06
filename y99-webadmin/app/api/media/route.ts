import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { ensureMediaBucket, getMediaPublicUrl } from '@/lib/media/storage';
import { convertToWebp, isAllowedImageMime } from '@/lib/media/convert-webp';
import {
  CMS_MEDIA_BUCKET,
  CMS_MEDIA_FOLDER,
  MAX_UPLOAD_BYTES,
} from '@/lib/media/constants';
import { deleteMediaRecord, insertMediaRecord, listMediaRecords, syncOrphansFromStorage } from '@/lib/media/db';
import { isMissingMediaTableError, listMediaFromStorageOnly } from '@/lib/media/list-from-storage';
import type { MediaItem } from '@/lib/media/types';

function safeBaseName(name: string) {
  const base = name.replace(/\.[^.]+$/, '');
  return base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'image';
}

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase chưa cấu hình' }, { status: 503 });
  }
  try {
    let items: Awaited<ReturnType<typeof listMediaRecords>> = [];
    try {
      items = await listMediaRecords();
      if (items.length === 0) {
        items = await syncOrphansFromStorage();
      }
    } catch (dbErr) {
      if (!isMissingMediaTableError(dbErr)) throw dbErr;
      items = await listMediaFromStorageOnly();
    }
    return NextResponse.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không tải được thư viện';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase chưa cấu hình' }, { status: 503 });
  }
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Thiếu file ảnh' }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'Ảnh tối đa 10MB' }, { status: 400 });
    }
    if (!isAllowedImageMime(file.type)) {
      return NextResponse.json({ error: 'Định dạng ảnh không hỗ trợ' }, { status: 400 });
    }

    const raw = Buffer.from(await file.arrayBuffer());
    const webp = await convertToWebp(raw);
    const filename = `${Date.now()}-${safeBaseName(file.name)}.webp`;
    const path = `${CMS_MEDIA_FOLDER}/${filename}`;

    await ensureMediaBucket();
    const supabase = createServiceClient();
    const { error: uploadErr } = await supabase.storage.from(CMS_MEDIA_BUCKET).upload(path, webp, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: false,
    });
    if (uploadErr) throw uploadErr;

    const publicUrl = getMediaPublicUrl(path);
    let item: MediaItem = {
      path,
      url: publicUrl,
      name: filename,
      size: webp.length,
      created_at: new Date().toISOString(),
    };
    try {
      item = await insertMediaRecord({
        storage_path: path,
        public_url: publicUrl,
        file_name: filename,
        mime_type: 'image/webp',
        size_bytes: webp.length,
      });
    } catch (dbErr) {
      if (!isMissingMediaTableError(dbErr)) throw dbErr;
    }

    return NextResponse.json({ item });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload thất bại';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase chưa cấu hình' }, { status: 503 });
  }
  const path = request.nextUrl.searchParams.get('path');
  if (!path || !path.startsWith(`${CMS_MEDIA_FOLDER}/`)) {
    return NextResponse.json({ error: 'path không hợp lệ' }, { status: 400 });
  }
  try {
    const supabase = createServiceClient();
    const { error: storageErr } = await supabase.storage.from(CMS_MEDIA_BUCKET).remove([path]);
    if (storageErr) throw storageErr;
    await deleteMediaRecord(path).catch(() => {
      /* row may be missing for legacy uploads */
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Xóa thất bại';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
