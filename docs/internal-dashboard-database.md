# Internal dashboard — Supabase database MVP

SQL for Helping Hands Agency internal CRM / planning / hours / invoicing.

**Prerequisite:** Auth + `profiles` + `get_my_role()` from [`supabase-auth-setup.md`](./supabase-auth-setup.md).

**Run in:** Supabase → SQL Editor (once).

**Conflict note:** If you already have a legacy `projects` or `sales_leads` table with a different schema, rename or drop it (after backup) before running this script. This MVP uses `clients`, `leads`, `crew_members`, `projects`, `shifts`, `time_entries`, `invoice_drafts`, `invoice_draft_lines`, `tasks`, `internal_messages`, `company_settings`.

---

## Full SQL

```sql
-- =============================================================================
-- Helping Hands Agency — Internal Dashboard tables + RLS
-- Requires: public.profiles, public.user_role, public.get_my_role()
-- =============================================================================

-- Shared updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Internal role check helper (stable, security definer via get_my_role)
create or replace function public.is_internal_role()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.get_my_role() in (
    'owner'::public.user_role,
    'admin'::public.user_role,
    'planner'::public.user_role,
    'sales'::public.user_role,
    'finance'::public.user_role
  );
$$;

grant execute on function public.is_internal_role() to authenticated;

-- -----------------------------------------------------------------------------
-- 1. clients
-- -----------------------------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email text,
  phone text,
  address text,
  city text,
  notes text,
  status text not null default 'active'
    check (status in ('active', 'prospect', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_status_idx on public.clients (status);
create index if not exists clients_company_name_idx on public.clients (company_name);

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

alter table public.clients enable row level security;

drop policy if exists "Internal can select clients" on public.clients;
create policy "Internal can select clients"
  on public.clients for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal can insert clients" on public.clients;
create policy "Internal can insert clients"
  on public.clients for insert to authenticated
  with check (public.is_internal_role());

drop policy if exists "Internal can update clients" on public.clients;
create policy "Internal can update clients"
  on public.clients for update to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Internal can delete clients" on public.clients;
create policy "Internal can delete clients"
  on public.clients for delete to authenticated
  using (public.is_internal_role());

-- -----------------------------------------------------------------------------
-- 2. leads
-- -----------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email text,
  phone text,
  source text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'proposal_sent', 'won', 'lost')),
  value_estimate numeric,
  next_follow_up date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_next_follow_up_idx on public.leads (next_follow_up);

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

alter table public.leads enable row level security;

drop policy if exists "Internal can select leads" on public.leads;
create policy "Internal can select leads"
  on public.leads for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal can insert leads" on public.leads;
create policy "Internal can insert leads"
  on public.leads for insert to authenticated
  with check (public.is_internal_role());

drop policy if exists "Internal can update leads" on public.leads;
create policy "Internal can update leads"
  on public.leads for update to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Internal can delete leads" on public.leads;
create policy "Internal can delete leads"
  on public.leads for delete to authenticated
  using (public.is_internal_role());

-- -----------------------------------------------------------------------------
-- 3. crew_members
-- -----------------------------------------------------------------------------
create table if not exists public.crew_members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  city text,
  employment_type text not null default 'payroll'
    check (employment_type in ('payroll', 'zzp', 'freelance', 'other')),
  role_type text,
  skills text[] default '{}',
  certificates text[] default '{}',
  has_drivers_license boolean not null default false,
  has_car boolean not null default false,
  hourly_cost numeric,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'onboarding')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crew_members_status_idx on public.crew_members (status);
create index if not exists crew_members_city_idx on public.crew_members (city);

drop trigger if exists crew_members_set_updated_at on public.crew_members;
create trigger crew_members_set_updated_at
  before update on public.crew_members
  for each row execute function public.set_updated_at();

alter table public.crew_members enable row level security;

drop policy if exists "Internal can select crew_members" on public.crew_members;
create policy "Internal can select crew_members"
  on public.crew_members for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal can insert crew_members" on public.crew_members;
create policy "Internal can insert crew_members"
  on public.crew_members for insert to authenticated
  with check (public.is_internal_role());

drop policy if exists "Internal can update crew_members" on public.crew_members;
create policy "Internal can update crew_members"
  on public.crew_members for update to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Internal can delete crew_members" on public.crew_members;
create policy "Internal can delete crew_members"
  on public.crew_members for delete to authenticated
  using (public.is_internal_role());

-- -----------------------------------------------------------------------------
-- 4. projects
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete set null,
  project_name text not null,
  location text,
  address text,
  start_date date,
  end_date date,
  status text not null default 'draft'
    check (status in ('draft', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  project_type text
    check (
      project_type is null
      or project_type in (
        'event', 'horeca', 'restaurant', 'keuken', 'bar',
        'stagebouw', 'productie', 'logistiek', 'hospitality', 'overig'
      )
    ),
  contact_on_site text,
  briefing text,
  clothing text,
  ppe text,
  certificates_required text,
  travel_agreements text,
  default_hourly_rate numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_client_id_idx on public.projects (client_id);
create index if not exists projects_start_date_idx on public.projects (start_date);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "Internal can select projects" on public.projects;
create policy "Internal can select projects"
  on public.projects for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal can insert projects" on public.projects;
create policy "Internal can insert projects"
  on public.projects for insert to authenticated
  with check (public.is_internal_role());

drop policy if exists "Internal can update projects" on public.projects;
create policy "Internal can update projects"
  on public.projects for update to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Internal can delete projects" on public.projects;
create policy "Internal can delete projects"
  on public.projects for delete to authenticated
  using (public.is_internal_role());

-- -----------------------------------------------------------------------------
-- 5. shifts
-- -----------------------------------------------------------------------------
create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  crew_member_id uuid references public.crew_members (id) on delete set null,
  shift_date date not null,
  start_time time,
  end_time time,
  role_name text,
  required_people integer not null default 1,
  assigned_people integer not null default 0,
  status text not null default 'open'
    check (status in ('open', 'assigned', 'confirmed', 'completed', 'cancelled')),
  notes text,
  shiftbase_shift_id text,
  shiftbase_sync_status text not null default 'niet_gesynct'
    check (shiftbase_sync_status in ('niet_gesynct', 'gesynct', 'fout', 'overgeslagen')),
  shiftbase_last_synced_at timestamptz,
  shiftbase_sync_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shifts_project_id_idx on public.shifts (project_id);
create index if not exists shifts_shift_date_idx on public.shifts (shift_date);
create index if not exists shifts_status_idx on public.shifts (status);
create index if not exists shifts_crew_member_id_idx on public.shifts (crew_member_id);

drop trigger if exists shifts_set_updated_at on public.shifts;
create trigger shifts_set_updated_at
  before update on public.shifts
  for each row execute function public.set_updated_at();

alter table public.shifts enable row level security;

drop policy if exists "Internal can select shifts" on public.shifts;
create policy "Internal can select shifts"
  on public.shifts for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal can insert shifts" on public.shifts;
create policy "Internal can insert shifts"
  on public.shifts for insert to authenticated
  with check (public.is_internal_role());

drop policy if exists "Internal can update shifts" on public.shifts;
create policy "Internal can update shifts"
  on public.shifts for update to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Internal can delete shifts" on public.shifts;
create policy "Internal can delete shifts"
  on public.shifts for delete to authenticated
  using (public.is_internal_role());

-- -----------------------------------------------------------------------------
-- 6. time_entries
-- -----------------------------------------------------------------------------
create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete set null,
  shift_id uuid references public.shifts (id) on delete set null,
  crew_member_id uuid references public.crew_members (id) on delete set null,
  work_date date not null,
  start_time time,
  end_time time,
  break_minutes integer not null default 0,
  hours numeric,
  kilometers numeric not null default 0,
  travel_time_hours numeric not null default 0,
  status text not null default 'submitted'
    check (status in ('draft', 'submitted', 'approved', 'rejected', 'invoiced')),
  internal_notes text,
  correction_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists time_entries_status_idx on public.time_entries (status);
create index if not exists time_entries_work_date_idx on public.time_entries (work_date);
create index if not exists time_entries_project_id_idx on public.time_entries (project_id);
create index if not exists time_entries_crew_member_id_idx on public.time_entries (crew_member_id);

drop trigger if exists time_entries_set_updated_at on public.time_entries;
create trigger time_entries_set_updated_at
  before update on public.time_entries
  for each row execute function public.set_updated_at();

alter table public.time_entries enable row level security;

drop policy if exists "Internal can select time_entries" on public.time_entries;
create policy "Internal can select time_entries"
  on public.time_entries for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal can insert time_entries" on public.time_entries;
create policy "Internal can insert time_entries"
  on public.time_entries for insert to authenticated
  with check (public.is_internal_role());

drop policy if exists "Internal can update time_entries" on public.time_entries;
create policy "Internal can update time_entries"
  on public.time_entries for update to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Internal can delete time_entries" on public.time_entries;
create policy "Internal can delete time_entries"
  on public.time_entries for delete to authenticated
  using (public.is_internal_role());

-- -----------------------------------------------------------------------------
-- 7. invoice_drafts
-- -----------------------------------------------------------------------------
create table if not exists public.invoice_drafts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  invoice_number text,
  status text not null default 'draft'
    check (status in ('draft', 'ready', 'sent', 'paid', 'cancelled')),
  total_hours numeric not null default 0,
  hourly_rate numeric,
  travel_costs numeric not null default 0,
  subtotal numeric not null default 0,
  vat_amount numeric not null default 0,
  total_amount numeric not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invoice_drafts_status_idx on public.invoice_drafts (status);
create index if not exists invoice_drafts_client_id_idx on public.invoice_drafts (client_id);
create index if not exists invoice_drafts_project_id_idx on public.invoice_drafts (project_id);

drop trigger if exists invoice_drafts_set_updated_at on public.invoice_drafts;
create trigger invoice_drafts_set_updated_at
  before update on public.invoice_drafts
  for each row execute function public.set_updated_at();

alter table public.invoice_drafts enable row level security;

drop policy if exists "Internal can select invoice_drafts" on public.invoice_drafts;
create policy "Internal can select invoice_drafts"
  on public.invoice_drafts for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal can insert invoice_drafts" on public.invoice_drafts;
create policy "Internal can insert invoice_drafts"
  on public.invoice_drafts for insert to authenticated
  with check (public.is_internal_role());

drop policy if exists "Internal can update invoice_drafts" on public.invoice_drafts;
create policy "Internal can update invoice_drafts"
  on public.invoice_drafts for update to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Internal can delete invoice_drafts" on public.invoice_drafts;
create policy "Internal can delete invoice_drafts"
  on public.invoice_drafts for delete to authenticated
  using (public.is_internal_role());

-- -----------------------------------------------------------------------------
-- 8. invoice_draft_lines
-- -----------------------------------------------------------------------------
create table if not exists public.invoice_draft_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_draft_id uuid not null references public.invoice_drafts (id) on delete cascade,
  description text not null,
  quantity numeric,
  unit_price numeric,
  vat_rate numeric not null default 21,
  line_total numeric,
  created_at timestamptz not null default now()
);

create index if not exists invoice_draft_lines_draft_id_idx
  on public.invoice_draft_lines (invoice_draft_id);

alter table public.invoice_draft_lines enable row level security;

drop policy if exists "Internal can select invoice_draft_lines" on public.invoice_draft_lines;
create policy "Internal can select invoice_draft_lines"
  on public.invoice_draft_lines for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal can insert invoice_draft_lines" on public.invoice_draft_lines;
create policy "Internal can insert invoice_draft_lines"
  on public.invoice_draft_lines for insert to authenticated
  with check (public.is_internal_role());

drop policy if exists "Internal can update invoice_draft_lines" on public.invoice_draft_lines;
create policy "Internal can update invoice_draft_lines"
  on public.invoice_draft_lines for update to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Internal can delete invoice_draft_lines" on public.invoice_draft_lines;
create policy "Internal can delete invoice_draft_lines"
  on public.invoice_draft_lines for delete to authenticated
  using (public.is_internal_role());

-- -----------------------------------------------------------------------------
-- 9. tasks
-- -----------------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  linked_type text,
  linked_id uuid,
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'critical')),
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'done', 'cancelled')),
  due_date date,
  assigned_to uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_status_idx on public.tasks (status);
create index if not exists tasks_priority_idx on public.tasks (priority);
create index if not exists tasks_due_date_idx on public.tasks (due_date);

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

alter table public.tasks enable row level security;

drop policy if exists "Internal can select tasks" on public.tasks;
create policy "Internal can select tasks"
  on public.tasks for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal can insert tasks" on public.tasks;
create policy "Internal can insert tasks"
  on public.tasks for insert to authenticated
  with check (public.is_internal_role());

drop policy if exists "Internal can update tasks" on public.tasks;
create policy "Internal can update tasks"
  on public.tasks for update to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Internal can delete tasks" on public.tasks;
create policy "Internal can delete tasks"
  on public.tasks for delete to authenticated
  using (public.is_internal_role());

-- -----------------------------------------------------------------------------
-- 10. internal_messages
-- -----------------------------------------------------------------------------
create table if not exists public.internal_messages (
  id uuid primary key default gen_random_uuid(),
  message_type text,
  recipient_name text,
  recipient_email text,
  recipient_phone text,
  subject text,
  body text,
  status text not null default 'draft'
    check (status in ('draft', 'ready', 'sent', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists internal_messages_status_idx on public.internal_messages (status);

drop trigger if exists internal_messages_set_updated_at on public.internal_messages;
create trigger internal_messages_set_updated_at
  before update on public.internal_messages
  for each row execute function public.set_updated_at();

alter table public.internal_messages enable row level security;

drop policy if exists "Internal can select internal_messages" on public.internal_messages;
create policy "Internal can select internal_messages"
  on public.internal_messages for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal can insert internal_messages" on public.internal_messages;
create policy "Internal can insert internal_messages"
  on public.internal_messages for insert to authenticated
  with check (public.is_internal_role());

drop policy if exists "Internal can update internal_messages" on public.internal_messages;
create policy "Internal can update internal_messages"
  on public.internal_messages for update to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Internal can delete internal_messages" on public.internal_messages;
create policy "Internal can delete internal_messages"
  on public.internal_messages for delete to authenticated
  using (public.is_internal_role());

-- -----------------------------------------------------------------------------
-- 11. company_settings
-- -----------------------------------------------------------------------------
create table if not exists public.company_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists company_settings_key_idx on public.company_settings (key);

drop trigger if exists company_settings_set_updated_at on public.company_settings;
create trigger company_settings_set_updated_at
  before update on public.company_settings
  for each row execute function public.set_updated_at();

alter table public.company_settings enable row level security;

drop policy if exists "Internal can select company_settings" on public.company_settings;
create policy "Internal can select company_settings"
  on public.company_settings for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal can insert company_settings" on public.company_settings;
create policy "Internal can insert company_settings"
  on public.company_settings for insert to authenticated
  with check (public.is_internal_role());

drop policy if exists "Internal can update company_settings" on public.company_settings;
create policy "Internal can update company_settings"
  on public.company_settings for update to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Internal can delete company_settings" on public.company_settings;
create policy "Internal can delete company_settings"
  on public.company_settings for delete to authenticated
  using (public.is_internal_role());

-- -----------------------------------------------------------------------------
-- Default company settings (idempotent upsert)
-- -----------------------------------------------------------------------------
insert into public.company_settings (key, value)
values
  (
    'rates',
    '{
      "km_rate": 0.25,
      "vat_percent": 21,
      "site_crew": 31.50,
      "horeca_allround": 31.50,
      "keukenhulp": 32.50,
      "zelfstandig_kok": 40.00,
      "teamcaptain": 42.50
    }'::jsonb
  ),
  (
    'company',
    '{
      "company_name": "Helping Hands Agency",
      "address": "Wandelpad 30",
      "postal_code": "1211 GN",
      "city": "Hilversum",
      "phone": "06 5741 6338",
      "website": "https://helpinghandsagency.nl"
    }'::jsonb
  ),
  (
    'emails',
    '{
      "planning": "planning@helpinghandsagency.nl",
      "aanmeldingen": "aanmeldingen@helpinghandsagency.nl",
      "info": "info@helpinghandsagency.nl"
    }'::jsonb
  )
on conflict (key) do nothing;
```

---

## Migration: Shiftbase sync columns on `shifts`

Run this in the Supabase SQL editor if `public.shifts` already exists without Shiftbase fields (idempotent):

```sql
-- -----------------------------------------------------------------------------
-- Shiftbase sync metadata on public.shifts
-- -----------------------------------------------------------------------------
alter table public.shifts
  add column if not exists shiftbase_shift_id text;

alter table public.shifts
  add column if not exists shiftbase_sync_status text not null default 'niet_gesynct';

alter table public.shifts
  add column if not exists shiftbase_last_synced_at timestamptz;

alter table public.shifts
  add column if not exists shiftbase_sync_error text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'shifts_shiftbase_sync_status_check'
  ) then
    alter table public.shifts
      add constraint shifts_shiftbase_sync_status_check
      check (
        shiftbase_sync_status in (
          'niet_gesynct',
          'gesynct',
          'fout',
          'overgeslagen'
        )
      );
  end if;
end $$;
```

---

## Security notes

- RLS: only internal roles via `is_internal_role()` → `get_my_role()`.
- Crew/client roles cannot read or write these tables.
- App mutations also call `requireRole` server-side.
- Do **not** store BSN, IBAN, or other sensitive payroll documents in these tables.
- Never expose the service role key to the client.
