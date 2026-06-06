/**
 * Apply APPLY_ALL.sql via Management API using CLI access token (keytar / env).
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT_REF = 'ccrvxhpujqsgkbyuiezt';

async function loadToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN.trim();
  const envPath = join(root, 'y99-webadmin', '.env');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const t = line.trim();
      if (t.startsWith('SUPABASE_ACCESS_TOKEN=')) return t.slice(22).trim();
    }
  }
  for (const p of [
    join(homedir(), '.supabase', 'access-token'),
    join(process.env.APPDATA || '', 'supabase', 'access-token'),
  ]) {
    if (existsSync(p)) return readFileSync(p, 'utf8').trim();
  }
  try {
    const keytar = require(join(root, 'y99-webadmin', 'node_modules', 'keytar'));
    const creds = await keytar.findCredentials('Supabase CLI');
    return creds[0]?.password || null;
  } catch {
    return null;
  }
}

async function runQuery(token, sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

async function main() {
  const token = await loadToken();
  if (!token) {
    console.error('Chưa có access token. Chạy: npx supabase login');
    process.exit(1);
  }

  const listRes = await fetch('https://api.supabase.com/v1/projects', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const projects = await listRes.json();
  const refs = (Array.isArray(projects) ? projects : []).map((p) => p.id || p.ref).filter(Boolean);
  if (!refs.includes(PROJECT_REF)) {
    console.error(
      `Token không có quyền project ${PROJECT_REF}.\n` +
        `Đang thấy: ${refs.join(', ') || '(none)'}\n` +
        'Chạy lại: npx supabase login (tài khoản tạo project Y99)',
    );
    process.exit(1);
  }

  let sql = readFileSync(join(root, 'supabase', 'APPLY_ALL.sql'), 'utf8');
  sql = sql.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  console.log('Applying CMS on', PROJECT_REF, '...');
  const files = [
    join(root, 'supabase', 'migrations', '20260603120000_y99_cms.sql'),
    join(root, 'supabase', 'migrations', '20260603120001_y99_cms_seed.sql'),
    join(root, 'supabase', 'migrations', '20260603130000_cms_media_storage.sql'),
    join(root, 'supabase', 'migrations', '20260603140000_media_library.sql'),
  ];
  for (const file of files) {
    let chunk = readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
    console.log('  →', file.replace(root, ''));
    await runQuery(token, chunk);
  }
  console.log('OK — schema + seed applied.');
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
