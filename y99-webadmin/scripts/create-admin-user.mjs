/**
 * Tạo tài khoản admin đầu tiên (chạy một lần).
 *
 * Usage:
 *   node scripts/create-admin-user.mjs admin@y99.vn "YourPassword123"
 *
 * Cần SUPABASE_SERVICE_ROLE_KEY và NEXT_PUBLIC_SUPABASE_URL trong .env.local
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2];
const password = process.argv[3];

if (!url || !key) {
  console.error('Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!email || !password) {
  console.error('Usage: node scripts/create-admin-user.mjs <email> <password>');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { display_name: email.split('@')[0] },
});

if (error) {
  console.error('Lỗi:', error.message);
  process.exit(1);
}

await supabase.from('admin_profiles').upsert({
  id: data.user.id,
  email,
  display_name: email.split('@')[0],
  is_active: true,
});

console.log('Đã tạo admin:', email);
