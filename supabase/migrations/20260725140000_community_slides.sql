-- Community activities carousel (About page / CMS)
create table if not exists public.community_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  alt_text text not null default '',
  image_url text not null default '',
  video_url text not null default '',
  link_to text not null default '',
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists community_slides_updated_at on public.community_slides;
create trigger community_slides_updated_at
  before update on public.community_slides
  for each row execute function public.set_updated_at();

alter table public.community_slides enable row level security;

drop policy if exists "community_slides_public_read" on public.community_slides;
create policy "community_slides_public_read"
  on public.community_slides for select to anon, authenticated
  using (active = true);

grant select on public.community_slides to anon, authenticated;
