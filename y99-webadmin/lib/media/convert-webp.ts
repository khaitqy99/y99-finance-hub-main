import sharp from 'sharp';
import { WEBP_MAX_WIDTH, WEBP_QUALITY } from '@/lib/media/constants';

const INPUT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/bmp',
  'image/tiff',
]);

export function isAllowedImageMime(mime: string) {
  return INPUT_TYPES.has(mime) || mime.startsWith('image/');
}

export async function convertToWebp(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({ width: WEBP_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();
}
