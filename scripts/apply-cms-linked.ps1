# Sau khi: npx supabase login (đúng tài khoản Y99)
Set-Location $PSScriptRoot\..
$token = node -e "const k=require('./y99-webadmin/node_modules/keytar');k.findCredentials('Supabase CLI').then(c=>process.stdout.write(c[0]?.password||''))"
if (-not $token) { Write-Error "Chua co token. Chay: npx supabase login"; exit 1 }
$env:SUPABASE_ACCESS_TOKEN = $token
node scripts/apply-cms-linked.mjs
