# Y99 Finance Hub

Monorepo gồm website công khai và CMS admin, dùng chung Supabase.

## Cấu trúc

```
y99-finance-hub/
├── y99-webclient/   # Website khách (Next.js Pages Router)
├── y99-webadmin/    # CMS admin (Next.js App Router)
├── y99-lms/         # LMS vận hành khoản vay (Next.js App Router)
├── supabase/        # Migrations & seed database CMS
└── scripts/         # Script DB / dev dùng chung
```

## Chạy local

```bash
npm install

# Cả 3 app cùng lúc (khuyên dùng)
npm run dev

# Hoặc từng app
npm run dev:client   # http://localhost:3000 — website khách
npm run dev:admin    # http://localhost:3001 — CMS admin
npm run dev:lms      # http://localhost:3002 — LMS vận hành vay
```

**Đồng bộ lead website → LMS:** form trên webclient gọi `/api/leads`, lưu CMS và đẩy sang LMS (`/api/public/website-leads`). Cần cùng `WEBSITE_LEAD_SYNC_SECRET` trong `y99-webclient/.env.local` và `y99-lms/.env.local`.

Env mẫu:
- `y99-webclient/.env.example` — Supabase anon key
- `y99-webadmin/.env.example` — Supabase anon + service role key

Chi tiết DB: xem [supabase/README.md](./supabase/README.md).

## Deploy Vercel

Tạo **2 project Vercel** trỏ cùng repo GitHub, mỗi project chọn **Root Directory** khác nhau:

| Project | Root Directory | Env bắt buộc |
|---------|----------------|--------------|
| Web client | `y99-webclient` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Web admin | `y99-webadmin` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |

Push bằng tài khoản GitHub có quyền trên project Vercel (owner) để tránh bị chặn deploy trên Hobby plan.
