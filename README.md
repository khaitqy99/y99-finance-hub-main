# Y99 Finance Hub

Monorepo gồm website công khai và CMS admin, dùng chung Supabase.

## Cấu trúc

```
y99-finance-hub/
├── y99-webclient/   # Website khách (Next.js Pages Router)
├── y99-webadmin/    # CMS admin (Next.js App Router)
├── supabase/        # Migrations & seed database
└── scripts/         # Script DB / dev dùng chung
```

## Chạy local

```bash
npm install

# Website khách (port 3000+)
npm run dev:client

# CMS admin (port 3000+)
npm run dev:admin
```

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
