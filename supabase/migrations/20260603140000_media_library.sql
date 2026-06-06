-- Media library metadata (files live in Storage bucket cms-media)
create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  file_name text not null,
  mime_type text not null default 'image/webp',
  size_bytes int not null default 0,
  alt_text text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists media_library_created_at_idx on public.media_library (created_at desc);

alter table public.media_library enable row level security;

drop policy if exists "media_library_public_read" on public.media_library;
create policy "media_library_public_read"
  on public.media_library for select
  to anon, authenticated
  using (true);

grant select on public.media_library to anon, authenticated;
grant all on public.media_library to service_role;
