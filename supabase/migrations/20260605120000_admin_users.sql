-- Admin user profiles (1:1 with auth.users). No roles/permissions yet.

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_profiles_email_idx on public.admin_profiles (email);

alter table public.admin_profiles enable row level security;

-- Authenticated admins can list profiles (user management UI)
create policy "admin_profiles_select_authenticated"
  on public.admin_profiles
  for select
  to authenticated
  using (true);

-- Auto-create profile when a new auth user is created
create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_admin_profile on auth.users;

create trigger on_auth_user_created_admin_profile
  after insert on auth.users
  for each row
  execute function public.handle_new_admin_user();

-- Backfill profiles for existing auth users
insert into public.admin_profiles (id, email, display_name)
select
  id,
  coalesce(email, ''),
  coalesce(raw_user_meta_data ->> 'display_name', split_part(coalesce(email, ''), '@', 1))
from auth.users
on conflict (id) do nothing;

grant select on public.admin_profiles to authenticated;
