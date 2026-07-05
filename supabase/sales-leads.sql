-- Helping Hands Agency — sales_leads tabel voor Leads-module
-- Voer uit in Supabase SQL Editor wanneer je live leads-data wilt koppelen.
-- Let op: dashboard-tables.sql bevat een eenvoudigere `leads` tabel; gebruik sales_leads voor de CRM-module.

-- ---------------------------------------------------------------------------
-- sales_leads
-- ---------------------------------------------------------------------------
create table if not exists public.sales_leads (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email text,
  phone text,
  website text,
  source text default 'handmatig',
  status text not null default 'nieuw' check (
    status in (
      'nieuw',
      'te_kwalificeren',
      'benaderd',
      'gesprek_gepland',
      'offerte_nodig',
      'omgezet_naar_deal',
      'verloren'
    )
  ),
  priority text not null default 'normaal' check (
    priority in ('laag', 'normaal', 'hoog', 'spoed')
  ),
  estimated_value numeric(12, 2) not null default 0,
  owner_id uuid references public.profiles (id) on delete set null,
  last_contact_at timestamptz,
  next_action text,
  next_action_date date,
  notes text,
  hubspot_contact_id text,
  hubspot_company_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- sales_deals (voor omzetten naar deal)
-- ---------------------------------------------------------------------------
create table if not exists public.sales_deals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.sales_leads (id) on delete set null,
  deal_name text not null,
  company_name text,
  contact_name text,
  amount numeric(12, 2) not null default 0,
  expected_close_date date,
  pipeline_stage text default 'nieuw' check (
    pipeline_stage in (
      'nieuw',
      'contact',
      'offerte',
      'onderhandeling',
      'gewonnen',
      'verloren'
    )
  ),
  owner_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists sales_leads_updated_at on public.sales_leads;
create trigger sales_leads_updated_at
  before update on public.sales_leads
  for each row execute function public.set_updated_at();

drop trigger if exists sales_deals_updated_at on public.sales_deals;
create trigger sales_deals_updated_at
  before update on public.sales_deals
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.sales_leads enable row level security;
alter table public.sales_deals enable row level security;

-- Helper: interne rol check
create or replace function public.is_intern_role()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role in ('admin', 'planner')
  );
$$ language sql security definer stable;

-- sales_leads policies
drop policy if exists "Intern read sales_leads" on public.sales_leads;
create policy "Intern read sales_leads"
  on public.sales_leads for select to authenticated
  using (public.is_intern_role());

drop policy if exists "Intern insert sales_leads" on public.sales_leads;
create policy "Intern insert sales_leads"
  on public.sales_leads for insert to authenticated
  with check (public.is_intern_role());

drop policy if exists "Intern update sales_leads" on public.sales_leads;
create policy "Intern update sales_leads"
  on public.sales_leads for update to authenticated
  using (public.is_intern_role())
  with check (public.is_intern_role());

drop policy if exists "Intern delete sales_leads" on public.sales_leads;
create policy "Intern delete sales_leads"
  on public.sales_leads for delete to authenticated
  using (public.is_intern_role());

-- sales_deals policies
drop policy if exists "Intern read sales_deals" on public.sales_deals;
create policy "Intern read sales_deals"
  on public.sales_deals for select to authenticated
  using (public.is_intern_role());

drop policy if exists "Intern insert sales_deals" on public.sales_deals;
create policy "Intern insert sales_deals"
  on public.sales_deals for insert to authenticated
  with check (public.is_intern_role());

drop policy if exists "Intern update sales_deals" on public.sales_deals;
create policy "Intern update sales_deals"
  on public.sales_deals for update to authenticated
  using (public.is_intern_role())
  with check (public.is_intern_role());

drop policy if exists "Intern delete sales_deals" on public.sales_deals;
create policy "Intern delete sales_deals"
  on public.sales_deals for delete to authenticated
  using (public.is_intern_role());
