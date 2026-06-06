/**
 * Apply SEO columns migration only (20260603140000_cms_seo_fields.sql).
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from '../y99-webadmin/node_modules/pg/lib/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, 'y99-webadmin', '.env');
const PROJECT_REF = 'ccrvxhpujqsgkbyuiezt';

function loadPassword() {
  if (!existsSync(envPath)) throw new Error('Missing y99-webadmin/.env');
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (t.startsWith('SUPABASE_DB_PASSWORD=')) return t.slice(21).trim();
  }
  throw new Error('Missing SUPABASE_DB_PASSWORD in y99-webadmin/.env');
}

async function main() {
  const enc = encodeURIComponent(loadPassword());
  const dbUrl = `postgresql://postgres.${PROJECT_REF}:${enc}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`;
  const sql = readFileSync(
    join(root, 'supabase', 'migrations', '20260603140000_cms_seo_fields.sql'),
    'utf8',
  );

  const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
    const { rows } = await client.query(`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND (
          (table_name = 'news_articles' AND column_name IN ('meta_title', 'meta_description'))
          OR (table_name = 'loan_products' AND column_name IN ('meta_title', 'meta_description'))
          OR (table_name = 'site_settings' AND column_name IN ('seo_home_title', 'seo_home_description', 'seo_og_image_url'))
        )
      ORDER BY table_name, column_name
    `);
    console.log('OK — SEO migration applied on', PROJECT_REF);
    for (const r of rows) console.log(`  • ${r.table_name}.${r.column_name}`);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
