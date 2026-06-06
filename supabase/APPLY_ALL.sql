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
  job_type text not null default 'ToÃ n thá»i gian',
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
  company_name text not null default 'CÃ”NG TY Cá»” PHáº¦N Cáº¦M Äá»’ Y99',
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
-- Seed from y99-webclient canonical data

insert into public.site_settings (
  id, company_name, hotline, foreign_phone, email, address, tax_id,
  facebook, zalo, whatsapp, header_marquee
) values (
  1,
  'CÃ”NG TY Cá»” PHáº¦N Cáº¦M Äá»’ Y99',
  '1900575792',
  '+84 292 38 999 33',
  'cskh@y99.vn',
  '99B Nguyá»…n TrÃ£i, PhÆ°á»ng Ninh Kiá»u, ThÃ nh phá»‘ Cáº§n ThÆ¡',
  '1801778932',
  '',
  '',
  '',
  'Y99 há»— trá»£ cáº§m Ä‘á»“ uy tÃ­n, cung cáº¥p dá»‹ch vá»¥ cáº§m Ä‘á»“ online minh báº¡ch, an toÃ n, tiá»‡n lá»£i - linh hoáº¡t, khÃ´ng giá»›i háº¡n khoáº£ng cÃ¡ch.'
) on conflict (id) do update set
  company_name = excluded.company_name,
  hotline = excluded.hotline,
  foreign_phone = excluded.foreign_phone,
  email = excluded.email,
  address = excluded.address,
  header_marquee = excluded.header_marquee;

insert into public.store_locations (id, name, address, province, district, phone, hours, lat, lng, active, sort_order) values
  ('ct-nk-1', 'Y99 PhÃ²ng giao dá»‹ch Ninh Kiá»u', '99B Nguyá»…n TrÃ£i, PhÆ°á»ng Ninh Kiá»u, ThÃ nh phá»‘ Cáº§n ThÆ¡', 'Cáº§n ThÆ¡', 'Ninh Kiá»u', '1900575792', '8:00 - 21:00 (Thá»© 2 - Chá»§ nháº­t)', 10.0459, 105.7871, true, 1),
  ('ct-nk-2', 'Y99 PGD HÆ°ng PhÃº', 'Khu dÃ¢n cÆ° HÆ°ng PhÃº, PhÆ°á»ng HÆ°ng PhÃº, ThÃ nh phá»‘ Cáº§n ThÆ¡', 'Cáº§n ThÆ¡', 'CÃ¡i RÄƒng', '1900575792', '8:00 - 20:00 (Thá»© 2 - Chá»§ nháº­t)', 10.0123, 105.7489, true, 2),
  ('bn-qv-1', 'Y99 Báº¯c Ninh â€” Quáº¿ VÃµ', 'Sá»‘ 06, Khu phá»‘ I, PhÆ°á»ng Quáº¿ VÃµ, Tá»‰nh Báº¯c Ninh', 'Báº¯c Ninh', 'Quáº¿ VÃµ', '1900575792', '8:00 - 21:00 (Thá»© 2 - Chá»§ nháº­t)', 21.1541, 106.1446, true, 3),
  ('bn-tp-1', 'Y99 PGD Báº¯c Ninh (TP)', 'ÄÆ°á»ng NgÃ´ Gia Tá»±, PhÆ°á»ng Suá»‘i Hoa, Tá»‰nh Báº¯c Ninh', 'Báº¯c Ninh', 'Báº¯c Ninh', '1900575792', '8:00 - 20:30 (Thá»© 2 - Thá»© 7)', 21.1861, 106.0763, true, 4),
  ('hcm-q1-1', 'Y99 PGD Quáº­n 1 (Ä‘ang má»Ÿ rá»™ng)', 'LÃª Lá»£i, PhÆ°á»ng Báº¿n NghÃ©, TP. Há»“ ChÃ­ Minh', 'TP. Há»“ ChÃ­ Minh', 'Quáº­n 1', '1900575792', '8:00 - 20:00 (Thá»© 2 - Chá»§ nháº­t)', 10.7769, 106.7009, true, 5),
  ('hcm-q7-1', 'Y99 PGD Quáº­n 7', 'Nguyá»…n Thá»‹ Tháº­p, PhÆ°á»ng TÃ¢n PhÃº, TP. Há»“ ChÃ­ Minh', 'TP. Há»“ ChÃ­ Minh', 'Quáº­n 7', '1900575792', '8:00 - 21:00 (Thá»© 2 - Chá»§ nháº­t)', 10.7314, 106.7181, true, 6),
  ('hn-hk-1', 'Y99 PGD HoÃ n Kiáº¿m', 'Phá»‘ HÃ ng BÃ i, PhÆ°á»ng HÃ ng BÃ i, HÃ  Ná»™i', 'HÃ  Ná»™i', 'HoÃ n Kiáº¿m', '1900575792', '8:00 - 20:30 (Thá»© 2 - Chá»§ nháº­t)', 21.0245, 105.8412, true, 7),
  ('hn-cg-1', 'Y99 PGD Cáº§u Giáº¥y', 'XuÃ¢n Thá»§y, PhÆ°á»ng Dá»‹ch Vá»ng Háº­u, HÃ  Ná»™i', 'HÃ  Ná»™i', 'Cáº§u Giáº¥y', '1900575792', '8:00 - 21:00 (Thá»© 2 - Chá»§ nháº­t)', 21.0382, 105.7835, true, 8)
on conflict (id) do nothing;

insert into public.news_articles (slug, title, excerpt, category, date_display, image_url, content, published, sort_order) values
  (
    'y99-mo-rong-mang-luoi-2026',
    'Y99 má»Ÿ rá»™ng máº¡ng lÆ°á»›i lÃªn 500 phÃ²ng giao dá»‹ch trong nÄƒm 2026',
    'Y99 Finance cÃ´ng bá»‘ káº¿ hoáº¡ch má»Ÿ rá»™ng máº¡ng lÆ°á»›i phÃ²ng giao dá»‹ch lÃªn 500 Ä‘iá»ƒm trÃªn toÃ n quá»‘c, mang dá»‹ch vá»¥ tÃ i chÃ­nh Ä‘áº¿n gáº§n hÆ¡n vá»›i ngÆ°á»i dÃ¢n.',
    'Tin doanh nghiá»‡p', '20/04/2026',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    '["Y99 Finance vá»«a cÃ´ng bá»‘ chiáº¿n lÆ°á»£c má»Ÿ rá»™ng máº¡ng lÆ°á»›i phÃ²ng giao dá»‹ch lÃªn 500 Ä‘iá»ƒm trÃªn toÃ n quá»‘c trong nÄƒm 2026, Ä‘Ã¡nh dáº¥u bÆ°á»›c phÃ¡t triá»ƒn vÆ°á»£t báº­c cá»§a doanh nghiá»‡p trong lÄ©nh vá»±c tÃ i chÃ­nh tiÃªu dÃ¹ng.","Theo Ä‘áº¡i diá»‡n Y99, viá»‡c má»Ÿ rá»™ng máº¡ng lÆ°á»›i sáº½ giÃºp cÃ´ng ty phá»¥c vá»¥ tá»‘t hÆ¡n nhu cáº§u vay vá»‘n nhanh, minh báº¡ch cá»§a hÃ ng triá»‡u khÃ¡ch hÃ ng táº¡i cÃ¡c tá»‰nh thÃ nh. Má»—i phÃ²ng giao dá»‹ch Ä‘á»u Ä‘Æ°á»£c thiáº¿t káº¿ hiá»‡n Ä‘áº¡i, thÃ¢n thiá»‡n vÃ  Ã¡p dá»¥ng quy trÃ¬nh sá»‘ hÃ³a toÃ n diá»‡n.","BÃªn cáº¡nh viá»‡c má»Ÿ rá»™ng quy mÃ´, Y99 cÅ©ng Ä‘áº§u tÆ° máº¡nh vÃ o cÃ´ng nghá»‡, á»©ng dá»¥ng AI Ä‘á»ƒ tá»‘i Æ°u quy trÃ¬nh tháº©m Ä‘á»‹nh, giÃºp khÃ¡ch hÃ ng nháº­n Ä‘Æ°á»£c khoáº£n vay chá»‰ trong 15 phÃºt."]'::jsonb,
    true, 1
  ),
  (
    'huong-dan-vay-bang-cavet-xe-may',
    'HÆ°á»›ng dáº«n chi tiáº¿t vay tiá»n báº±ng cÃ  váº¹t xe mÃ¡y táº¡i Y99',
    'Táº¥t táº§n táº­t nhá»¯ng Ä‘iá»u cáº§n biáº¿t khi vay tiá»n báº±ng cÃ  váº¹t xe mÃ¡y: Ä‘iá»u kiá»‡n, há»“ sÆ¡ vÃ  quy trÃ¬nh giáº£i ngÃ¢n nhanh chá»‰ trong 15 phÃºt.',
    'Cáº©m nang vay', '12/04/2026',
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80',
    '["Vay tiá»n báº±ng cÃ  váº¹t xe mÃ¡y lÃ  má»™t trong nhá»¯ng giáº£i phÃ¡p tÃ i chÃ­nh phá»• biáº¿n nháº¥t hiá»‡n nay. Táº¡i Y99, khÃ¡ch hÃ ng chá»‰ cáº§n mang theo Ä‘Äƒng kÃ½ xe chÃ­nh chá»§ vÃ  CCCD lÃ  Ä‘Ã£ cÃ³ thá»ƒ nháº­n khoáº£n vay lÃªn Ä‘áº¿n 30 triá»‡u Ä‘á»“ng.","Äáº·c biá»‡t, khÃ¡ch hÃ ng váº«n Ä‘Æ°á»£c giá»¯ vÃ  sá»­ dá»¥ng xe bÃ¬nh thÆ°á»ng sau khi vay. Y99 chá»‰ giá»¯ giáº¥y tá» Ä‘Äƒng kÃ½ xe trong thá»i gian há»£p Ä‘á»“ng cÃ³ hiá»‡u lá»±c.","Quy trÃ¬nh vay diá»…n ra nhanh chÃ³ng: Ä‘Äƒng kÃ½ - Ä‘á»‹nh giÃ¡ xe - kÃ½ há»£p Ä‘á»“ng - nháº­n tiá»n, tá»•ng thá»i gian chá»‰ khoáº£ng 15 phÃºt."]'::jsonb,
    true, 2
  ),
  (
    'y99-trao-tang-hoc-bong-2026',
    'Y99 trao táº·ng 1.000 suáº¥t há»c bá»•ng cho há»c sinh khÃ³ khÄƒn nÄƒm 2026',
    'ChÆ°Æ¡ng trÃ¬nh ''Tiáº¿p sá»©c Ä‘áº¿n trÆ°á»ng'' cá»§a Y99 nÄƒm nay Ä‘Ã£ trao 1.000 suáº¥t há»c bá»•ng trá»‹ giÃ¡ hÆ¡n 5 tá»· Ä‘á»“ng cho há»c sinh nghÃ¨o vÆ°á»£t khÃ³ trÃªn toÃ n quá»‘c.',
    'TrÃ¡ch nhiá»‡m xÃ£ há»™i', '05/04/2026',
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&q=80',
    '["Trong khuÃ´n khá»• chÆ°Æ¡ng trÃ¬nh thiá»‡n nguyá»‡n ''Tiáº¿p sá»©c Ä‘áº¿n trÆ°á»ng'', Y99 Finance Ä‘Ã£ trao táº·ng 1.000 suáº¥t há»c bá»•ng trá»‹ giÃ¡ hÆ¡n 5 tá»· Ä‘á»“ng cho cÃ¡c em há»c sinh nghÃ¨o vÆ°á»£t khÃ³ táº¡i 30 tá»‰nh thÃ nh trÃªn toÃ n quá»‘c.","ChÆ°Æ¡ng trÃ¬nh lÃ  sá»± tiáº¿p ná»‘i cá»§a chuá»—i hoáº¡t Ä‘á»™ng trÃ¡ch nhiá»‡m xÃ£ há»™i mÃ  Y99 Ä‘Ã£ thá»±c hiá»‡n trong nhiá»u nÄƒm qua, thá»ƒ hiá»‡n cam káº¿t Ä‘á»“ng hÃ nh cÃ¹ng cá»™ng Ä‘á»“ng vÃ  Ä‘Ã³ng gÃ³p vÃ o sá»± phÃ¡t triá»ƒn bá»n vá»¯ng cá»§a xÃ£ há»™i."]'::jsonb,
    true, 3
  ),
  (
    'tang-truong-quy-1-2026',
    'Y99 tÄƒng trÆ°á»Ÿng 45% trong quÃ½ I/2026, dáº«n Ä‘áº§u phÃ¢n khÃºc',
    'BÃ¡o cÃ¡o káº¿t quáº£ kinh doanh quÃ½ I/2026 cho tháº¥y Y99 Ä‘áº¡t má»©c tÄƒng trÆ°á»Ÿng áº¥n tÆ°á»£ng 45% so vá»›i cÃ¹ng ká»³ nÄƒm trÆ°á»›c, cá»§ng cá»‘ vá»‹ tháº¿ dáº«n Ä‘áº§u thá»‹ trÆ°á»ng.',
    'Tin doanh nghiá»‡p', '28/03/2026',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    '["Y99 Finance vá»«a cÃ´ng bá»‘ bÃ¡o cÃ¡o káº¿t quáº£ kinh doanh quÃ½ I/2026 vá»›i má»©c tÄƒng trÆ°á»Ÿng doanh thu Ä‘áº¡t 45% so vá»›i cÃ¹ng ká»³ nÄƒm trÆ°á»›c. ÄÃ¢y lÃ  tÃ­n hiá»‡u tÃ­ch cá»±c cho tháº¥y cÃ´ng ty Ä‘ang phÃ¡t triá»ƒn bá»n vá»¯ng.","Lá»£i nhuáº­n trÆ°á»›c thuáº¿ quÃ½ I Ä‘áº¡t 250 tá»· Ä‘á»“ng, hoÃ n thÃ nh 28% káº¿ hoáº¡ch nÄƒm 2026. Sá»‘ lÆ°á»£ng khÃ¡ch hÃ ng má»›i tÄƒng 38%, Ä‘áº·c biá»‡t lÃ  cÃ¡c sáº£n pháº©m vay theo lÆ°Æ¡ng vÃ  vay báº±ng cÃ  váº¹t xe mÃ¡y."]'::jsonb,
    true, 4
  )
on conflict (slug) do nothing;

-- Loan products (full JSON from client)
insert into public.loan_products (
  slug, name, tagline, description, max_amount, max_term, interest_rate, approval_time,
  benefits, conditions, documents, process, image_key, published, sort_order
) values
  (
    'vay-tien-bang-cavet-xe-may',
    'Vay tiá»n báº±ng cÃ  váº¹t xe mÃ¡y',
    'Váº«n giá»¯ xe Ä‘á»ƒ Ä‘i - chá»‰ cáº§n giáº¥y Ä‘Äƒng kÃ½ xe mÃ¡y lÃ  cÃ³ ngay khoáº£n vay.',
    'Vay nhanh báº±ng cÃ  váº¹t (Ä‘Äƒng kÃ½) xe mÃ¡y chÃ­nh chá»§. Y99 chá»‰ giá»¯ giáº¥y tá», khÃ¡ch hÃ ng váº«n sá»­ dá»¥ng xe bÃ¬nh thÆ°á»ng. Háº¡n má»©c cao theo giÃ¡ trá»‹ xe, lÃ£i suáº¥t minh báº¡ch.',
    'Äáº¿n 30 triá»‡u', '3 - 9 thÃ¡ng', '1.099%/thÃ¡ng', '15 phÃºt',
    '["Váº«n Ä‘Æ°á»£c sá»­ dá»¥ng xe sau khi vay","Äá»‹nh giÃ¡ xe minh báº¡ch, cÃ´ng khai","Chá»‰ cáº§n CCCD & VNeID má»©c 2","Duyá»‡t vay nhanh trong 15 phÃºt","Ãp dá»¥ng cho má»i dÃ²ng xe mÃ¡y","Táº¥t toÃ¡n linh hoáº¡t, khÃ´ng phÃ­ pháº¡t"]'::jsonb,
    '["CÃ´ng dÃ¢n Viá»‡t Nam, tá»« 18 - 60 tuá»•i","Sá»Ÿ há»¯u xe mÃ¡y chÃ­nh chá»§ (Ä‘Äƒng kÃ½ xe Ä‘á»©ng tÃªn)","CCCD & VNeID má»©c 2","HÃ³a Ä‘Æ¡n Ä‘iá»‡n/ nÆ°á»›c/ Wifi"]'::jsonb,
    '["CCCD/CMND báº£n gá»‘c","ÄÄƒng kÃ½ xe mÃ¡y báº£n gá»‘c (cÃ  váº¹t)","Há»™ kháº©u / KT3 (báº£n photo)"]'::jsonb,
    '[{"title":"ÄÄƒng kÃ½","desc":"ÄÄƒng kÃ½ online hoáº·c Ä‘áº¿n trá»±c tiáº¿p phÃ²ng giao dá»‹ch Y99."},{"title":"Äá»‹nh giÃ¡ xe","desc":"ChuyÃªn viÃªn Ä‘á»‹nh giÃ¡ xe vÃ  Ä‘Æ°a ra háº¡n má»©c vay phÃ¹ há»£p."},{"title":"KÃ½ há»£p Ä‘á»“ng","desc":"KÃ½ há»£p Ä‘á»“ng vay táº¡i quáº§y, giá»¯ láº¡i Ä‘Äƒng kÃ½ xe gá»‘c."},{"title":"Giáº£i ngÃ¢n","desc":"Nháº­n tiá»n táº¡i quáº§y hoáº·c chuyá»ƒn khoáº£n trong 15 phÃºt."}]'::jsonb,
    'vay-tien-bang-cavet-xe-may', true, 1
  ),
  (
    'vay-tien-bang-cavet-oto',
    'Vay tiá»n báº±ng cÃ  váº¹t Ã´ tÃ´',
    'Váº«n giá»¯ xe Ä‘á»ƒ Ä‘i - chá»‰ cáº§n giáº¥y Ä‘Äƒng kÃ½ xe Ã´ tÃ´ lÃ  cÃ³ ngay khoáº£n vay.',
    'Sáº£n pháº©m vay tiá»n báº±ng cÃ  váº¹t Ã´ tÃ´ dÃ nh cho khÃ¡ch hÃ ng cáº§n vá»‘n lá»›n. Y99 chá»‰ giá»¯ giáº¥y tá» xe, khÃ¡ch váº«n sá»­ dá»¥ng xe bÃ¬nh thÆ°á»ng. Háº¡n má»©c cao, lÃ£i suáº¥t Æ°u Ä‘Ã£i cho khoáº£n vay lá»›n.',
    'Äáº¿n 2 tá»·', '3 - 9 thÃ¡ng', '1.099%/thÃ¡ng', '30 phÃºt',
    '["Háº¡n má»©c vay lÃªn Ä‘áº¿n 2 tá»· Ä‘á»“ng","KhÃ¡ch hÃ ng váº«n sá»­ dá»¥ng xe bÃ¬nh thÆ°á»ng","LÃ£i suáº¥t Æ°u Ä‘Ã£i cho khoáº£n vay lá»›n","Äá»‹nh giÃ¡ xe theo giÃ¡ thá»‹ trÆ°á»ng","Chá»‰ cáº§n CCCD & VNeID má»©c 2","Há»£p Ä‘á»“ng minh báº¡ch, cÃ´ng khai"]'::jsonb,
    '["CÃ´ng dÃ¢n Viá»‡t Nam, tá»« 18 - 60 tuá»•i","Sá»Ÿ há»¯u xe Ã´ tÃ´ chÃ­nh chá»§","CCCD & VNeID má»©c 2","HÃ³a Ä‘Æ¡n Ä‘iá»‡n/ nÆ°á»›c/ Wifi"]'::jsonb,
    '["CCCD/CMND báº£n gá»‘c","ÄÄƒng kÃ½ xe Ã´ tÃ´ báº£n gá»‘c","ÄÄƒng kiá»ƒm xe cÃ²n hiá»‡u lá»±c","Báº£o hiá»ƒm trÃ¡ch nhiá»‡m dÃ¢n sá»± cÃ²n háº¡n"]'::jsonb,
    '[{"title":"ÄÄƒng kÃ½","desc":"ÄÄƒng kÃ½ qua hotline 1900575792 hoáº·c website."},{"title":"Äá»‹nh giÃ¡ xe","desc":"ChuyÃªn viÃªn Ä‘áº¿n táº­n nÆ¡i Ä‘á»‹nh giÃ¡ xe cá»§a báº¡n."},{"title":"Tháº©m Ä‘á»‹nh há»“ sÆ¡","desc":"Y99 tháº©m Ä‘á»‹nh nhanh, duyá»‡t há»“ sÆ¡ trong 30 phÃºt."},{"title":"Giáº£i ngÃ¢n","desc":"KÃ½ há»£p Ä‘á»“ng vÃ  nháº­n tiá»n chuyá»ƒn khoáº£n hoáº·c táº¡i quáº§y."}]'::jsonb,
    'vay-tien-bang-cavet-oto', true, 2
  ),
  (
    'vay-bang-icloud',
    'Vay tiá»n báº±ng iCloud',
    'Äiá»‡n thoáº¡i váº«n dÃ¹ng - tiá»n váº«n vá». KhÃ´ng cáº§n giá»¯ mÃ¡y.',
    'Vay nhanh báº±ng iCloud iPhone cá»§a báº¡n. Y99 khÃ´ng giá»¯ Ä‘iá»‡n thoáº¡i, khÃ¡ch hÃ ng váº«n sá»­ dá»¥ng bÃ¬nh thÆ°á»ng. PhÃ¹ há»£p vá»›i khÃ¡ch hÃ ng cáº§n khoáº£n vay nhá» trong thá»i gian ngáº¯n.',
    'Äáº¿n 30 triá»‡u', '3 - 9 thÃ¡ng', '1.099%/thÃ¡ng', '15 phÃºt',
    '["KhÃ´ng giá»¯ mÃ¡y - váº«n dÃ¹ng iPhone bÃ¬nh thÆ°á»ng","Thá»§ tá»¥c cá»±c ká»³ Ä‘Æ¡n giáº£n","Duyá»‡t vay siÃªu tá»‘c trong 15 phÃºt","Háº¡n má»©c theo giÃ¡ trá»‹ mÃ¡y","KhÃ´ng cáº§n tháº©m Ä‘á»‹nh ngÆ°á»i thÃ¢n","Ãp dá»¥ng cho iPhone tá»« Ä‘á»i 11 trá»Ÿ lÃªn"]'::jsonb,
    '["CÃ´ng dÃ¢n Viá»‡t Nam, tá»« 18 - 60 tuá»•i","Sá»Ÿ há»¯u iPhone Ä‘á»i 12 Pro Max trá»Ÿ lÃªn cÃ²n hoáº¡t Ä‘á»™ng tá»‘t","CCCD & VNeID má»©c 2","HÃ³a Ä‘Æ¡n Ä‘iá»‡n/ nÆ°á»›c/ Wifi"]'::jsonb,
    '["CCCD/CMND báº£n gá»‘c","iPhone Ä‘Äƒng nháº­p sáºµn iCloud","Máº­t kháº©u iCloud (Ä‘á»ƒ cÃ i Ä‘áº·t liÃªn káº¿t)"]'::jsonb,
    '[{"title":"ÄÄƒng kÃ½","desc":"LiÃªn há»‡ CSKH Ä‘á»ƒ tiáº¿n hÃ nh Ä‘Äƒng kÃ½ vay Online hoáº·c trá»±c tiáº¿p Ä‘áº¿n phÃ²ng giao dá»‹ch Y99 gáº§n nháº¥t."},{"title":"Kiá»ƒm tra mÃ¡y","desc":"ChuyÃªn viÃªn kiá»ƒm tra tÃ¬nh tráº¡ng mÃ¡y vÃ  iCloud."},{"title":"KÃ½ káº¿t há»£p Ä‘á»“ng","desc":"KÃ½ káº¿t há»£p Ä‘á»“ng vÃ  thiáº¿t láº­p báº£o máº­t ICloud Y99."},{"title":"Nháº­n tiá»n","desc":"Nháº­n tiá»n ngay táº¡i quáº§y hoáº·c chuyá»ƒn khoáº£n."}]'::jsonb,
    'vay-bang-icloud', true, 3
  )
on conflict (slug) do nothing;

insert into public.recruitment_jobs (title, excerpt, location, job_type, deadline, published, sort_order) values
  (
    'ChuyÃªn viÃªn tÆ° váº¥n tÃ i chÃ­nh',
    'TÆ° váº¥n giáº£i phÃ¡p tÃ i chÃ­nh phÃ¹ há»£p, há»— trá»£ khÃ¡ch hÃ ng hoÃ n thiá»‡n há»“ sÆ¡ vÃ  Ä‘á»“ng hÃ nh xuyÃªn suá»‘t quÃ¡ trÃ¬nh giáº£i ngÃ¢n.',
    'Cáº§n ThÆ¡', 'ToÃ n thá»i gian', '31/05/2026', true, 1
  ),
  (
    'NhÃ¢n viÃªn chÄƒm sÃ³c khÃ¡ch hÃ ng',
    'Tiáº¿p nháº­n, há»— trá»£ vÃ  xá»­ lÃ½ pháº£n há»“i khÃ¡ch hÃ ng Ä‘a kÃªnh, Ä‘áº£m báº£o tráº£i nghiá»‡m dá»‹ch vá»¥ minh báº¡ch vÃ  hÃ i lÃ²ng.',
    'TP. Há»“ ChÃ­ Minh', 'ToÃ n thá»i gian', '05/06/2026', true, 2
  ),
  (
    'ChuyÃªn viÃªn phÃ¡t triá»ƒn kinh doanh',
    'Má»Ÿ rá»™ng máº¡ng lÆ°á»›i Ä‘á»‘i tÃ¡c, triá»ƒn khai hoáº¡t Ä‘á»™ng thá»‹ trÆ°á»ng táº¡i khu vá»±c phá»¥ trÃ¡ch vÃ  thÃºc Ä‘áº©y hiá»‡u quáº£ tÄƒng trÆ°á»Ÿng.',
    'HÃ  Ná»™i', 'ToÃ n thá»i gian', '10/06/2026', true, 3
  );

insert into public.hero_slides (title, alt_text, image_url, link_to, active, sort_order) values
  ('Vay cÃ  váº¹t xe mÃ¡y', 'Vay tiá»n báº±ng cÃ  váº¹t xe mÃ¡y táº¡i Y99', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80', '/cho-vay-cam-co/vay-tien-bang-cavet-xe-may', true, 1),
  ('Vay cÃ  váº¹t Ã´ tÃ´', 'Vay tiá»n báº±ng cÃ  váº¹t Ã´ tÃ´ táº¡i Y99', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80', '/cho-vay-cam-co/vay-tien-bang-cavet-oto', true, 2),
  ('Vay iCloud', 'Vay tiá»n báº±ng iCloud táº¡i Y99', 'https://images.unsplash.com/photo-1511707171634-5f897ffdaa50?w=800&q=80', '/cho-vay-cam-co/vay-bang-icloud', true, 3),
  ('Vay online', 'KhÃ¡m phÃ¡ giáº£i phÃ¡p vay tiá»n online cá»§a Y99', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80', '/vay-tien-online', true, 4),
  ('LiÃªn há»‡', 'LiÃªn há»‡ tÆ° váº¥n khoáº£n vay nhanh cÃ¹ng Y99', 'https://images.unsplash.com/photo-1423666639041-f56000c27a9b?w=800&q=80', '/lien-he', true, 5),
  ('Há»‡ thá»‘ng PGD', 'Há»‡ thá»‘ng cá»­a hÃ ng Y99 trÃªn toÃ n quá»‘c', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', '/he-thong-cua-hang', true, 6);

insert into public.testimonials (author, role, content, active, sort_order) values
  ('Anh Minh Tuáº¥n', 'TÃ i xáº¿ cÃ´ng nghá»‡ - HÃ  Ná»™i', 'MÃ¬nh cáº§n vá»‘n gáº¥p Ä‘á»ƒ sá»­a xe, Y99 duyá»‡t vÃ  giáº£i ngÃ¢n chá»‰ trong 20 phÃºt. NhÃ¢n viÃªn tÆ° váº¥n ráº¥t nhiá»‡t tÃ¬nh.', true, 1),
  ('Chá»‹ Thu Háº±ng', 'NhÃ¢n viÃªn vÄƒn phÃ²ng - TP.HCM', 'LÃ£i suáº¥t rÃµ rÃ ng, khÃ´ng cÃ³ phÃ­ áº©n. App ráº¥t dá»… dÃ¹ng, mÃ¬nh theo dÃµi khoáº£n tráº£ má»—i thÃ¡ng cá»±c tiá»‡n.', true, 2),
  ('Anh Quá»‘c Huy', 'Chá»§ shop kinh doanh - ÄÃ  Náºµng', 'Láº§n Ä‘áº§u vay online mÃ  cáº£m tháº¥y yÃªn tÃ¢m. Y99 chuyÃªn nghiá»‡p tá»« tÆ° váº¥n Ä‘áº¿n há»£p Ä‘á»“ng.', true, 3),
  ('Chá»‹ Ngá»c Mai', 'Chá»§ tiá»‡m lÃ m Ä‘áº¹p - Cáº§n ThÆ¡', 'MÃ¬nh cáº§n xoay vá»‘n nháº­p hÃ ng gáº¥p, Y99 há»— trá»£ ráº¥t nhanh vÃ  giáº£i thÃ­ch há»£p Ä‘á»“ng rÃµ rÃ ng tá»«ng khoáº£n phÃ­.', true, 4),
  ('Anh Thanh BÃ¬nh', 'Ká»¹ thuáº­t viÃªn - BÃ¬nh DÆ°Æ¡ng', 'Thá»§ tá»¥c Ä‘Æ¡n giáº£n, chá»‰ cáº§n giáº¥y tá» cÆ¡ báº£n lÃ  Ä‘Æ°á»£c tÆ° váº¥n gÃ³i phÃ¹ há»£p. Quy trÃ¬nh lÃ m viá»‡c minh báº¡ch, dá»… hiá»ƒu.', true, 5),
  ('Chá»‹ HoÃ i An', 'Kinh doanh tá»± do - Äá»“ng Nai', 'MÃ¬nh Ä‘Ã¡nh giÃ¡ cao cÃ¡ch chÄƒm sÃ³c khÃ¡ch hÃ ng cá»§a Y99. Nháº¯c lá»‹ch thanh toÃ¡n rÃµ rÃ ng, há»— trá»£ linh hoáº¡t khi cáº§n tÆ° váº¥n thÃªm.', true, 6);

-- SEO fields (CMS → web client)
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

alter table public.site_settings
  add column if not exists seo_home_h1 text not null default '';

alter table public.loan_products
  add column if not exists seo_h1 text not null default '';

alter table public.news_articles
  add column if not exists seo_h1 text not null default '';

alter table public.news_articles
  add column if not exists image_alt text not null default '';

alter table public.loan_products
  add column if not exists image_alt text not null default '';
