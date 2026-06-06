-- Y99 CMS schema (aligned with y99-webclient)

-- Extensions
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- News
-- ---------------------------------------------------------------------------
create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  category text not null default '',
  date_display text not null default '',
  image_url text not null default '',
  content jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Stores (PGD)
-- ---------------------------------------------------------------------------
create table if not exists public.store_locations (
  id text primary key,
  name text not null,
  address text not null,
  province text not null,
  district text not null,
  phone text not null default '1900575792',
  hours text not null default '',
  lat double precision not null default 0,
  lng double precision not null default 0,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Loan products
-- ---------------------------------------------------------------------------
create table if not exists public.loan_products (
  slug text primary key,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  max_amount text not null default '',
  max_term text not null default '',
  interest_rate text not null default '',
  approval_time text not null default '',
  benefits jsonb not null default '[]'::jsonb,
  conditions jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  process jsonb not null default '[]'::jsonb,
  image_key text,
  image_url text,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Recruitment
-- ---------------------------------------------------------------------------
create table if not exists public.recruitment_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null default '',
  description text not null default '',
  location text not null default '',
  job_type text not null default 'Toàn thời gian',
  deadline text not null default '',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Marketing
-- ---------------------------------------------------------------------------
create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  alt_text text not null default '',
  image_url text not null default '',
  link_to text not null default '/',
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  role text not null default '',
  content text not null,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Site settings (singleton)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  company_name text not null default 'CÔNG TY CỔ PHẦN CẦM ĐỒ Y99',
  hotline text not null default '1900575792',
  foreign_phone text not null default '+84 292 38 999 33',
  email text not null default 'cskh@y99.vn',
  address text not null default '',
  tax_id text not null default '',
  facebook text not null default '',
  zalo text not null default '',
  whatsapp text not null default '',
  header_marquee text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------
create type public.lead_status as enum ('new', 'contacted', 'closed');

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  city text,
  district text,
  loan_need text,
  asset text,
  status public.lead_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists news_articles_updated_at on public.news_articles;
create trigger news_articles_updated_at
  before update on public.news_articles
  for each row execute function public.set_updated_at();

drop trigger if exists store_locations_updated_at on public.store_locations;
create trigger store_locations_updated_at
  before update on public.store_locations
  for each row execute function public.set_updated_at();

drop trigger if exists loan_products_updated_at on public.loan_products;
create trigger loan_products_updated_at
  before update on public.loan_products
  for each row execute function public.set_updated_at();

drop trigger if exists recruitment_jobs_updated_at on public.recruitment_jobs;
create trigger recruitment_jobs_updated_at
  before update on public.recruitment_jobs
  for each row execute function public.set_updated_at();

drop trigger if exists hero_slides_updated_at on public.hero_slides;
create trigger hero_slides_updated_at
  before update on public.hero_slides
  for each row execute function public.set_updated_at();

drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.news_articles enable row level security;
alter table public.store_locations enable row level security;
alter table public.loan_products enable row level security;
alter table public.recruitment_jobs enable row level security;
alter table public.hero_slides enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;
alter table public.leads enable row level security;

-- Public read (published / active)
create policy "Public read published news"
  on public.news_articles for select to anon, authenticated
  using (published = true);

create policy "Public read active stores"
  on public.store_locations for select to anon, authenticated
  using (active = true);

create policy "Public read published products"
  on public.loan_products for select to anon, authenticated
  using (published = true);

create policy "Public read published jobs"
  on public.recruitment_jobs for select to anon, authenticated
  using (published = true);

create policy "Public read active hero slides"
  on public.hero_slides for select to anon, authenticated
  using (active = true);

create policy "Public read active testimonials"
  on public.testimonials for select to anon, authenticated
  using (active = true);

create policy "Public read site settings"
  on public.site_settings for select to anon, authenticated
  using (true);

-- Leads: public insert only
create policy "Public insert leads"
  on public.leads for insert to anon, authenticated
  with check (true);

-- Grants for Data API
grant usage on schema public to anon, authenticated;
grant select on public.news_articles to anon, authenticated;
grant select on public.store_locations to anon, authenticated;
grant select on public.loan_products to anon, authenticated;
grant select on public.recruitment_jobs to anon, authenticated;
grant select on public.hero_slides to anon, authenticated;
grant select on public.testimonials to anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert on public.leads to anon, authenticated;
