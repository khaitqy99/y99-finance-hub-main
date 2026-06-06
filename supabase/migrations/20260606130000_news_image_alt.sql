-- Alt text ảnh đại diện bài viết (Google ưu tiên 3 ảnh đầu)

alter table public.news_articles
  add column if not exists image_alt text not null default '';

alter table public.loan_products
  add column if not exists image_alt text not null default '';
