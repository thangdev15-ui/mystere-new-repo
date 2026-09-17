create table if not exists public.communities (
  id text primary key,
  slug text not null unique,
  name text not null,
  region jsonb not null default '{"en":"","vi":""}',
  title jsonb not null default '{"en":"","vi":""}',
  line jsonb not null default '{"en":"","vi":""}',
  story jsonb not null default '{"en":"","vi":""}',
  craft jsonb not null default '{"en":"","vi":""}',
  image text not null default '',
  published boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id text primary key,
  image text not null default '',
  url text not null default '',
  title jsonb not null default '{"en":"","vi":""}',
  date_label jsonb not null default '{"en":"","vi":""}',
  date_start date,
  schedule jsonb not null default '{"en":"","vi":""}',
  venue text not null default '',
  address jsonb not null default '{"en":"","vi":""}',
  published boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.communities enable row level security;
alter table public.events enable row level security;
drop policy if exists "published communities are public" on public.communities;
drop policy if exists "published events are public" on public.events;
drop policy if exists "authenticated editors manage communities" on public.communities;
drop policy if exists "authenticated editors manage events" on public.events;
create policy "published communities are public" on public.communities for select using (published = true or auth.role() = 'authenticated');
create policy "published events are public" on public.events for select using (published = true or auth.role() = 'authenticated');
create policy "authenticated editors manage communities" on public.communities for all to authenticated using (true) with check (true);
create policy "authenticated editors manage events" on public.events for all to authenticated using (true) with check (true);

-- Run once after creating the Auth user in Supabase Dashboard:
-- insert into auth.users ... is intentionally omitted; create the user via Auth > Users.
