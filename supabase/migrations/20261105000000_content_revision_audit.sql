-- Preserve an immutable baseline of the customer-approved CMS content and
-- retain the prior version of every subsequent edit or deletion.
create table if not exists public.cms_content_snapshots (
  id bigint generated always as identity primary key,
  captured_at timestamptz not null default now(),
  reason text not null,
  payload jsonb not null
);

create table if not exists public.cms_content_audit (
  id bigint generated always as identity primary key,
  captured_at timestamptz not null default now(),
  changed_by uuid,
  table_name text not null check (table_name in ('communities', 'events')),
  row_id text not null,
  action text not null check (action in ('UPDATE', 'DELETE')),
  previous_value jsonb not null,
  next_value jsonb
);

alter table public.cms_content_snapshots enable row level security;
alter table public.cms_content_audit enable row level security;

-- The client can inspect recovery history, but cannot create, modify, or
-- delete it. The trigger below is the only writer for future revisions.
create policy "authenticated users can read CMS snapshots"
  on public.cms_content_snapshots for select to authenticated using (true);
create policy "authenticated users can read CMS audit history"
  on public.cms_content_audit for select to authenticated using (true);

create or replace function public.capture_cms_content_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.cms_content_audit (
    changed_by, table_name, row_id, action, previous_value, next_value
  ) values (
    auth.uid(), TG_TABLE_NAME, old.id, TG_OP, to_jsonb(old),
    case when TG_OP = 'UPDATE' then to_jsonb(new) else null end
  );

  if TG_OP = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists communities_content_audit on public.communities;
create trigger communities_content_audit
  before update or delete on public.communities
  for each row execute function public.capture_cms_content_audit();

drop trigger if exists events_content_audit on public.events;
create trigger events_content_audit
  before update or delete on public.events
  for each row execute function public.capture_cms_content_audit();

-- One approved baseline, captured before the audit triggers begin recording
-- future changes. This contains no generated or rewritten copy.
insert into public.cms_content_snapshots (reason, payload)
select
  'Approved CMS baseline — 2026-11-05',
  jsonb_build_object(
    'communities', coalesce((select jsonb_agg(to_jsonb(c) order by c.sort_order) from public.communities c), '[]'::jsonb),
    'events', coalesce((select jsonb_agg(to_jsonb(e) order by e.sort_order) from public.events e), '[]'::jsonb)
  );
