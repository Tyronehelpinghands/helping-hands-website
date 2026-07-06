-- Helping Hands Agency — uitgebreide projecten-module
-- Voer uit in Supabase SQL Editor voor live projectdata.
-- Breidt de basis `projects` tabel uit uit dashboard-tables.sql.

-- ---------------------------------------------------------------------------
-- projects (uitbreiden of vervangen)
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete set null,
  title text not null,
  client_name text,
  contact_name text,
  contact_email text,
  contact_phone text,
  location text,
  start_date date,
  end_date date,
  start_time time,
  end_time time,
  project_type text default 'overig',
  status text not null default 'aanvraag' check (
    status in (
      'aanvraag',
      'planning',
      'bevestigd',
      'actief',
      'urencontrole',
      'gefactureerd',
      'afgerond',
      'geannuleerd'
    )
  ),
  planner_id uuid references public.profiles (id) on delete set null,
  crew_needed integer not null default 0,
  crew_planned integer not null default 0,
  customer_hourly_rate numeric(10, 2),
  travel_fee_per_km numeric(6, 4) default 0.25,
  expected_revenue numeric(12, 2) default 0,
  notes text,
  crew_briefing text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Kolommen toevoegen als projects al bestaat met ouder schema
alter table public.projects add column if not exists client_name text;
alter table public.projects add column if not exists contact_name text;
alter table public.projects add column if not exists contact_email text;
alter table public.projects add column if not exists contact_phone text;
alter table public.projects add column if not exists start_time time;
alter table public.projects add column if not exists end_time time;
alter table public.projects add column if not exists project_type text default 'overig';
alter table public.projects add column if not exists planner_id uuid references public.profiles (id) on delete set null;
alter table public.projects add column if not exists crew_needed integer default 0;
alter table public.projects add column if not exists crew_planned integer default 0;
alter table public.projects add column if not exists customer_hourly_rate numeric(10, 2);
alter table public.projects add column if not exists travel_fee_per_km numeric(6, 4) default 0.25;
alter table public.projects add column if not exists expected_revenue numeric(12, 2) default 0;
alter table public.projects add column if not exists crew_briefing text;

-- ---------------------------------------------------------------------------
-- project_roles
-- ---------------------------------------------------------------------------
create table if not exists public.project_roles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  role_name text not null,
  quantity_needed integer not null default 0,
  quantity_planned integer not null default 0,
  hourly_rate numeric(10, 2),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- project_crew_assignments
-- ---------------------------------------------------------------------------
create table if not exists public.project_crew_assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  crew_member_id uuid references public.crew_members (id) on delete set null,
  role_name text,
  start_time timestamptz,
  end_time timestamptz,
  status text not null default 'gepland' check (
    status in ('gepland', 'bevestigd', 'afgerond', 'geannuleerd')
  ),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- project_activity_logs
-- ---------------------------------------------------------------------------
create table if not exists public.project_activity_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  action text not null,
  message text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_projects_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_projects_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.project_roles enable row level security;
alter table public.project_crew_assignments enable row level security;
alter table public.project_activity_logs enable row level security;

create or replace function public.is_intern_role()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role in ('admin', 'planner')
  );
$$ language sql security definer stable;

-- projects policies
drop policy if exists "Intern read projects" on public.projects;
create policy "Intern read projects"
  on public.projects for select to authenticated
  using (public.is_intern_role());

drop policy if exists "Intern insert projects" on public.projects;
create policy "Intern insert projects"
  on public.projects for insert to authenticated
  with check (public.is_intern_role());

drop policy if exists "Intern update projects" on public.projects;
create policy "Intern update projects"
  on public.projects for update to authenticated
  using (public.is_intern_role())
  with check (public.is_intern_role());

drop policy if exists "Intern delete projects" on public.projects;
create policy "Intern delete projects"
  on public.projects for delete to authenticated
  using (public.is_intern_role());

-- project_roles policies
drop policy if exists "Intern read project_roles" on public.project_roles;
create policy "Intern read project_roles"
  on public.project_roles for select to authenticated
  using (public.is_intern_role());

drop policy if exists "Intern write project_roles" on public.project_roles;
create policy "Intern write project_roles"
  on public.project_roles for all to authenticated
  using (public.is_intern_role())
  with check (public.is_intern_role());

-- project_crew_assignments policies
drop policy if exists "Intern read project_crew_assignments" on public.project_crew_assignments;
create policy "Intern read project_crew_assignments"
  on public.project_crew_assignments for select to authenticated
  using (public.is_intern_role());

drop policy if exists "Intern write project_crew_assignments" on public.project_crew_assignments;
create policy "Intern write project_crew_assignments"
  on public.project_crew_assignments for all to authenticated
  using (public.is_intern_role())
  with check (public.is_intern_role());

-- project_activity_logs policies
drop policy if exists "Intern read project_activity_logs" on public.project_activity_logs;
create policy "Intern read project_activity_logs"
  on public.project_activity_logs for select to authenticated
  using (public.is_intern_role());

drop policy if exists "Intern write project_activity_logs" on public.project_activity_logs;
create policy "Intern write project_activity_logs"
  on public.project_activity_logs for all to authenticated
  using (public.is_intern_role())
  with check (public.is_intern_role());
