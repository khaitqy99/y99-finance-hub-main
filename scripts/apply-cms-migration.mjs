/**
 * Apply Y99 CMS migrations to Supabase.
 * Requires DATABASE_URL (Session pooler) in y99-webadmin/.env
 * Get it from: Dashboard → Project Settings → Database → Connection string → URI
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, 'y99-webadmin', '.env');

function loadEnv() {
  if (!existsSync(envPath)) throw new Error('Missing y99-webadmin/.env');
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const ref = 'ccrvxhpujqsgkbyuiezt';
  let dbUrl = env.DATABASE_URL || env.SUPABASE_DB_URL;
  const dbPassword = env.SUPABASE_DB_PASSWORD || env.DB_PASSWORD;
  if (!dbUrl && dbPassword) {
    const enc = encodeURIComponent(dbPassword);
    const poolers = [
      `postgresql://postgres.${ref}:${enc}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
      `postgresql://postgres.${ref}:${enc}@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`,
    ];
    dbUrl = poolers[0];
    console.log('Dùng Session pooler (ap-southeast-1) từ SUPABASE_DB_PASSWORD');
  }
  if (!dbUrl) {
    console.error(
      'Thiếu DATABASE_URL hoặc SUPABASE_DB_PASSWORD trong y99-webadmin/.env\n' +
        'Dashboard → Project Y99 → Settings → Database → Database password / Connection string (Session)\n' +
        'Thêm: SUPABASE_DB_PASSWORD=your_db_password',
    );
    process.exit(1);
  }

  const { default: pg } = await import('pg');
  const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

  const file = join(root, 'supabase', 'APPLY_ALL.sql');

  await client.connect();
  try {
    const sql = readFileSync(file, 'utf8');
    console.log('Running', file.replace(root, ''));
    await client.query(sql);
    console.log('OK — CMS schema + seed applied.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
