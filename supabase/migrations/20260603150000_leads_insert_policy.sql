-- Ensure public can insert leads from web client forms (anon key)
alter table public.leads enable row level security;

drop policy if exists "Public insert leads" on public.leads;
create policy "Public insert leads"
  on public.leads for insert
  with check (true);

grant insert on public.leads to anon, authenticated;
