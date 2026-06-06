/**
 * Apply admin users migration (20260605120000_admin_users.sql) to remote Supabase.
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
  const poolers = [
    `postgresql://postgres.${PROJECT_REF}:${enc}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.${PROJECT_REF}:${enc}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.${PROJECT_REF}:${enc}@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`,
  ];

  const sql = readFileSync(
    join(root, 'supabase', 'migrations', '20260605120000_admin_users.sql'),
    'utf8',
  );

  let lastErr;
  for (const dbUrl of poolers) {
    const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    try {
      await client.connect();
      await client.query(sql);

      const { rows: profiles } = await client.query(
        'select email, display_name, is_active from public.admin_profiles order by created_at',
      );
      const { rows: triggers } = await client.query(
        "select tgname from pg_trigger where tgname = 'on_auth_user_created_admin_profile'",
      );

      console.log(`OK — admin_users migration applied on ${PROJECT_REF}`);
      for (const p of profiles) {
        console.log(`  • ${p.email} (${p.display_name}) active=${p.is_active}`);
      }
      console.log(`  • trigger: ${triggers.length ? 'on_auth_user_created_admin_profile' : 'MISSING'}`);
      await client.end();
      return;
    } catch (err) {
      lastErr = err;
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }

  throw lastErr ?? new Error('Could not connect to Supabase database');
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
