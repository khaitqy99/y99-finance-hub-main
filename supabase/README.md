# Y99 CMS — Supabase

Schema và seed khớp dữ liệu chuẩn trong `y99-webclient`.

**Thư viện ảnh admin:** bucket `cms-media` (migration `20260603130000_cms_media_storage.sql` hoặc tự tạo khi upload lần đầu). Ảnh upload được chuyển sang WebP.

## Cài đặt nhanh

1. Tạo project trên [Supabase Dashboard](https://supabase.com/dashboard).
2. **SQL Editor** → mở [SQL Editor](https://supabase.com/dashboard/project/ccrvxhpujqsgkbyuiezt/sql/new), dán nội dung file `APPLY_ALL.sql` → **Run** (một lần).

   Hoặc chạy lần lượt 2 file trong `migrations/`.
3. **Settings → API**: copy `Project URL`, `anon key`, `service_role key`.
4. Tạo file env:

**`y99-webadmin/.env.local`**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

**`y99-webclient/.env.local`**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

5. Chạy admin: `cd y99-webadmin && npm run dev` (port mặc định 3000).
6. Chạy client: `cd y99-webclient && npm run dev`.

## Bảng dữ liệu

| Bảng | Client | Admin |
|------|--------|-------|
| `news_articles` | /ban-tin | Bản tin |
| `store_locations` | /he-thong-cua-hang | Hệ thống PGD |
| `loan_products` | /cho-vay-cam-co/[slug] | Sản phẩm vay |
| `recruitment_jobs` | /tuyen-dung | Tuyển dụng |
| `hero_slides` | Hero trang chủ | Marketing |
| `testimonials` | Testimonials | Marketing |
| `site_settings` | Header, Footer | Cài đặt Site |
| `leads` | Form đăng ký vay | Leads |

## Bảo mật

- Client dùng `anon` key + RLS (chỉ đọc nội dung published/active, insert leads).
- Admin dùng `service_role` **chỉ trong API routes** server-side.
- Production: thêm đăng nhập admin trước khi public URL admin.

## Fallback

Nếu chưa cấu hình Supabase, client vẫn dùng file tĩnh trong `src/data/`.
