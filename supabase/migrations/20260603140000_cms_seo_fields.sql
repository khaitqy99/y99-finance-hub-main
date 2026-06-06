-- SEO fields for CMS → web client (meta title / description)

alter table public.news_articles
  add column if not exists meta_title text not null default '',
  add column if not exists meta_description text not null default '';

alter table public.loan_products
  add column if not exists meta_title text not null default '',
  add column if not exists meta_description text not null default '';

alter table public.site_settings
  add column if not exists seo_home_title text not null default '',
  add column if not exists seo_home_description text not null default '',
  add column if not exists seo_og_image_url text not null default '';
