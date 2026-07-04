-- Helping Hands Agency — dashboard tabellen (voorbereid, nog niet verplicht in gebruik)
-- Voer dit uit in de Supabase SQL Editor wanneer je live data wilt koppelen.

-- ---------------------------------------------------------------------------
-- Clients (opdrachtgevers)
-- ---------------------------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  type text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete set null,
  title text not null,
  status text not null default 'planning' check (
    status in ('planning', 'actief', 'afgerond', 'gepauzeerd')
  ),
  location text,
  start_date date,
  end_date date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Crew members
-- ---------------------------------------------------------------------------
create table if not exists public.crew_members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  roles text[] default '{}',
  availability_status text not null default 'beschikbaar' check (
    availability_status in ('beschikbaar', 'ingepland', 'niet_beschikbaar')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Shifts
-- ---------------------------------------------------------------------------
create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  crew_member_id uuid references public.crew_members (id) on delete set null,
  role text,
  shift_date date not null,
  start_time time,
  end_time time,
  status text not null default 'gepland' check (
    status in ('gepland', 'bevestigd', 'afgerond', 'geannuleerd')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Invoices
-- ---------------------------------------------------------------------------
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  invoice_number text,
  amount numeric(10, 2) not null default 0,
  status text not null default 'concept' check (
    status in ('concept', 'verzonden', 'betaald', 'vervallen')
  ),
  due_date date,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  source text,
  status text not null default 'nieuw' check (
    status in ('nieuw', 'contact', 'offerte', 'gewonnen', 'verloren')
  ),
  estimated_value numeric(10, 2),
  notes text,
  assigned_to uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Tasks (open acties)
-- ---------------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner_id uuid references public.profiles (id) on delete set null,
  owner_name text,
  deadline date,
  status text not null default 'nieuw' check (
    status in ('nieuw', 'bezig', 'wachten', 'follow-up', 'afgerond')
  ),
  priority text default 'normaal' check (
    priority in ('laag', 'normaal', 'hoog', 'urgent')
  ),
  project_id uuid references public.projects (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  type text not null default 'info' check (
    type in ('lead', 'project', 'invoice', 'crew', 'request', 'info')
  ),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS (basis: alleen interne rollen lezen — pas aan naar wens)
-- ---------------------------------------------------------------------------
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.crew_members enable row level security;
alter table public.shifts enable row level security;
alter table public.invoices enable row level security;
alter table public.leads enable row level security;
alter table public.tasks enable row level security;
alter table public.notifications enable row level security;

-- Voorbeeldbeleid: admin/planner mogen alles lezen (pas role-check aan in productie)
-- create policy "Intern roles can read clients"
--   on public.clients for select to authenticated
--   using (
--     exists (
--       select 1 from public.profiles
--       where profiles.id = auth.uid()
--       and profiles.role in ('admin', 'planner')
--     )
--   );

-- Herhaal vergelijkbaar beleid per tabel en voeg write policies toe via service role of server actions.
