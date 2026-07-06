-- Helping Hands Agency — Planning-module met Shiftbase-ondersteuning
-- Voer uit in Supabase SQL Editor voor live planningdata.

-- ---------------------------------------------------------------------------
-- planning_shifts
-- ---------------------------------------------------------------------------
create table if not exists public.planning_shifts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete set null,
  title text not null,
  client_name text,
  location_name text,
  location_address text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  break_minutes integer not null default 0,
  role_name text,
  crew_needed integer not null default 1,
  crew_planned integer not null default 0,
  customer_hourly_rate numeric(10, 2),
  crew_hourly_rate numeric(10, 2),
  travel_fee_per_km numeric(6, 4) default 0.25,
  description text,
  internal_notes text,
  crew_briefing text,
  clothing_requirements text,
  contact_name text,
  contact_phone text,
  status text not null default 'open' check (
    status in (
      'open',
      'deels_ingepland',
      'volledig_ingepland',
      'bevestigd',
      'urencontrole',
      'afgerond',
      'geannuleerd'
    )
  ),
  shiftbase_shift_id text,
  shiftbase_sync_status text not null default 'niet_gesynct' check (
    shiftbase_sync_status in ('niet_gesynct', 'gesynct', 'fout', 'bezig')
  ),
  shiftbase_last_synced_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- planning_assignments
-- ---------------------------------------------------------------------------
create table if not exists public.planning_assignments (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid references public.planning_shifts (id) on delete cascade,
  crew_member_id uuid references public.crew_members (id) on delete set null,
  profile_id uuid references public.profiles (id) on delete set null,
  shiftbase_employee_id text,
  role_name text,
  status text not null default 'gepland' check (
    status in ('gepland', 'bevestigd', 'afgerond', 'geannuleerd')
  ),
  confirmed_at timestamptz,
  home_city text,
  home_address_hash text,
  travel_km_one_way numeric(8, 2),
  travel_km_return numeric(8, 2),
  travel_fee_per_km numeric(6, 4) default 0.25,
  travel_fee_total numeric(10, 2),
  travel_calculation_status text not null default 'niet_berekend' check (
    travel_calculation_status in (
      'niet_berekend',
      'berekend',
      'adres_ontbreekt',
      'locatieadres_ontbreekt'
    )
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- planning_hours
-- ---------------------------------------------------------------------------
create table if not exists public.planning_hours (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid references public.planning_shifts (id) on delete cascade,
  assignment_id uuid references public.planning_assignments (id) on delete cascade,
  crew_member_id uuid references public.crew_members (id) on delete set null,
  shiftbase_timesheet_id text,
  planned_start_time timestamptz,
  planned_end_time timestamptz,
  actual_start_time timestamptz,
  actual_end_time timestamptz,
  break_minutes integer not null default 0,
  planned_hours numeric(6, 2),
  worked_hours numeric(6, 2),
  overtime_hours numeric(6, 2) default 0,
  status text not null default 'open' check (
    status in ('open', 'gecontroleerd', 'goedgekeurd', 'afgekeurd')
  ),
  source text not null default 'shiftbase',
  approved_by uuid references public.profiles (id) on delete set null,
  approved_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- shiftbase_sync_logs
-- ---------------------------------------------------------------------------
create table if not exists public.shiftbase_sync_logs (
  id uuid primary key default gen_random_uuid(),
  sync_type text not null,
  status text not null,
  message text,
  records_processed integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_planning_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists planning_shifts_updated_at on public.planning_shifts;
create trigger planning_shifts_updated_at
  before update on public.planning_shifts
  for each row execute function public.set_planning_updated_at();

drop trigger if exists planning_assignments_updated_at on public.planning_assignments;
create trigger planning_assignments_updated_at
  before update on public.planning_assignments
  for each row execute function public.set_planning_updated_at();

drop trigger if exists planning_hours_updated_at on public.planning_hours;
create trigger planning_hours_updated_at
  before update on public.planning_hours
  for each row execute function public.set_planning_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.planning_shifts enable row level security;
alter table public.planning_assignments enable row level security;
alter table public.planning_hours enable row level security;
alter table public.shiftbase_sync_logs enable row level security;

create or replace function public.is_intern_role()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role in ('admin', 'planner')
  );
$$ language sql security definer stable;

-- planning_shifts
drop policy if exists "Intern read planning_shifts" on public.planning_shifts;
create policy "Intern read planning_shifts"
  on public.planning_shifts for select to authenticated
  using (public.is_intern_role());

drop policy if exists "Intern insert planning_shifts" on public.planning_shifts;
create policy "Intern insert planning_shifts"
  on public.planning_shifts for insert to authenticated
  with check (public.is_intern_role());

drop policy if exists "Intern update planning_shifts" on public.planning_shifts;
create policy "Intern update planning_shifts"
  on public.planning_shifts for update to authenticated
  using (public.is_intern_role())
  with check (public.is_intern_role());

drop policy if exists "Intern delete planning_shifts" on public.planning_shifts;
create policy "Intern delete planning_shifts"
  on public.planning_shifts for delete to authenticated
  using (public.is_intern_role());

-- planning_assignments
drop policy if exists "Intern read planning_assignments" on public.planning_assignments;
create policy "Intern read planning_assignments"
  on public.planning_assignments for select to authenticated
  using (public.is_intern_role());

drop policy if exists "Intern write planning_assignments" on public.planning_assignments;
create policy "Intern write planning_assignments"
  on public.planning_assignments for all to authenticated
  using (public.is_intern_role())
  with check (public.is_intern_role());

-- planning_hours
drop policy if exists "Intern read planning_hours" on public.planning_hours;
create policy "Intern read planning_hours"
  on public.planning_hours for select to authenticated
  using (public.is_intern_role());

drop policy if exists "Intern write planning_hours" on public.planning_hours;
create policy "Intern write planning_hours"
  on public.planning_hours for all to authenticated
  using (public.is_intern_role())
  with check (public.is_intern_role());

-- shiftbase_sync_logs
drop policy if exists "Intern read shiftbase_sync_logs" on public.shiftbase_sync_logs;
create policy "Intern read shiftbase_sync_logs"
  on public.shiftbase_sync_logs for select to authenticated
  using (public.is_intern_role());

drop policy if exists "Intern insert shiftbase_sync_logs" on public.shiftbase_sync_logs;
create policy "Intern insert shiftbase_sync_logs"
  on public.shiftbase_sync_logs for insert to authenticated
  with check (public.is_intern_role());
