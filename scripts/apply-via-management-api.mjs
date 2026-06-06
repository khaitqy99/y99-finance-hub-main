/**
 * Apply APPLY_ALL.sql via Supabase Management API (no DB password).
 * Requires: SUPABASE_ACCESS_TOKEN (from `npx supabase login`) or token file.
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT_REF = 'ccrvxhpujqsgkbyuiezt';

function loadEnvFile() {
  const envPath = join(root, 'y99-webadmin', '.env');
  if (!existsSync(envPath)) return {};
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

function loadToken() {
  const env = loadEnvFile();
  if (env.SUPABASE_ACCESS_TOKEN) return env.SUPABASE_ACCESS_TOKEN;
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN.trim();
  const candidates = [
    join(homedir(), '.supabase', 'access-token'),
    join(process.env.APPDATA || '', 'supabase', 'access-token'),
    join(process.env.LOCALAPPDATA || '', 'supabase', 'access-token'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return readFileSync(p, 'utf8').trim();
  }
  return null;
}

async function runQuery(token, sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${res.status} ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

async function main() {
  const token = loadToken();
  if (!token) {
    console.error(
      'Thiếu Supabase access token.\n' +
        'Chạy: npx supabase login\n' +
        'Hoặc thêm SUPABASE_ACCESS_TOKEN vào y99-webadmin/.env (lấy từ https://supabase.com/dashboard/account/tokens)',
    );
    process.exit(1);
  }

  const sqlPath = join(root, 'supabase', 'APPLY_ALL.sql');
  const sql = readFileSync(sqlPath, 'utf8');
  console.log('Applying CMS schema + seed via Management API...');
  await runQuery(token, sql);
  console.log('OK — CMS applied on', PROJECT_REF);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
