# Chạy SAU khi login xong — tránh lỗi "Access token not provided"
Start-Sleep -Seconds 2
$token = node -e "try{const k=require('./y99-webadmin/node_modules/keytar');k.findCredentials('Supabase CLI').then(c=>process.stdout.write(c[0]?.password||''))}catch(e){process.exit(1)}"
if (-not $token) {
  Write-Host "Chua co token. Chay rieng: npx supabase login" -ForegroundColor Yellow
  exit 1
}
$env:SUPABASE_ACCESS_TOKEN = $token
npx supabase projects list
