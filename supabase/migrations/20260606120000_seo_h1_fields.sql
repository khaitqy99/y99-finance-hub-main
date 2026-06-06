-- SEO H1 override fields (on-page heading, có thể khác meta title)

alter table public.site_settings
  add column if not exists seo_home_h1 text not null default '';

alter table public.loan_products
  add column if not exists seo_h1 text not null default '';

alter table public.news_articles
  add column if not exists seo_h1 text not null default '';
