-- =============================================================================
-- Helping Hands Agency — App tables (portals MVP)
-- Prerequisites:
--   1. docs/supabase-auth-setup.md  (profiles, get_my_role)
--   2. docs/internal-dashboard-database.md  (clients, crew_members, shifts, …)
--   3. supabase/employee-portal.sql  (my_crew_member_id, crew_availability)
-- Run in: Supabase → SQL Editor
-- Docs: docs/helping-hands-app-database.md
-- =============================================================================

-- Ensure helper exists (idempotent)
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

-- Link clients to auth profiles (for opdrachtgeversportaal)
-- Standalone hotfix (same statements): supabase/clients-profile-id.sql
alter table public.clients
  add column if not exists profile_id uuid references public.profiles (id) on delete set null;

create unique index if not exists clients_profile_id_uidx
  on public.clients (profile_id)
  where profile_id is not null;

create or replace function public.my_client_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select c.id
  from public.clients c
  left join public.profiles p on p.id = auth.uid()
  where c.profile_id = auth.uid()
     or (
       c.email is not null
       and p.email is not null
       and lower(c.email) = lower(p.email)
     )
  order by case when c.profile_id = auth.uid() then 0 else 1 end
  limit 1;
$$;

grant execute on function public.my_client_id() to authenticated;

-- -----------------------------------------------------------------------------
-- shift_assignments
-- -----------------------------------------------------------------------------
create table if not exists public.shift_assignments (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shifts (id) on delete cascade,
  crew_member_id uuid not null references public.crew_members (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  notes text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shift_id, crew_member_id)
);

create index if not exists shift_assignments_crew_idx
  on public.shift_assignments (crew_member_id);
create index if not exists shift_assignments_shift_idx
  on public.shift_assignments (shift_id);
create index if not exists shift_assignments_status_idx
  on public.shift_assignments (status);

drop trigger if exists shift_assignments_set_updated_at on public.shift_assignments;
create trigger shift_assignments_set_updated_at
  before update on public.shift_assignments
  for each row execute function public.set_updated_at();

alter table public.shift_assignments enable row level security;

drop policy if exists "Internal select shift_assignments" on public.shift_assignments;
create policy "Internal select shift_assignments"
  on public.shift_assignments for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal write shift_assignments" on public.shift_assignments;
create policy "Internal write shift_assignments"
  on public.shift_assignments for all to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Crew select own shift_assignments" on public.shift_assignments;
create policy "Crew select own shift_assignments"
  on public.shift_assignments for select to authenticated
  using (crew_member_id = public.my_crew_member_id());

drop policy if exists "Crew update own shift_assignments" on public.shift_assignments;
create policy "Crew update own shift_assignments"
  on public.shift_assignments for update to authenticated
  using (crew_member_id = public.my_crew_member_id())
  with check (crew_member_id = public.my_crew_member_id());

-- Crew may update own shift status when responding (accept/decline)
drop policy if exists "Crew update own shifts status" on public.shifts;
create policy "Crew update own shifts status"
  on public.shifts for update to authenticated
  using (crew_member_id = public.my_crew_member_id())
  with check (
    crew_member_id = public.my_crew_member_id()
    or crew_member_id is null
  );

-- -----------------------------------------------------------------------------
-- crew_availability (idempotent — also in employee-portal.sql)
-- -----------------------------------------------------------------------------
create table if not exists public.crew_availability (
  id uuid primary key default gen_random_uuid(),
  crew_member_id uuid not null references public.crew_members (id) on delete cascade,
  availability_date date not null,
  status text not null default 'available'
    check (status in ('available', 'unavailable', 'maybe')),
  start_time time,
  end_time time,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (crew_member_id, availability_date)
);

create index if not exists crew_availability_crew_date_idx
  on public.crew_availability (crew_member_id, availability_date);

alter table public.crew_availability enable row level security;

-- -----------------------------------------------------------------------------
-- time_corrections
-- -----------------------------------------------------------------------------
create table if not exists public.time_corrections (
  id uuid primary key default gen_random_uuid(),
  time_entry_id uuid not null references public.time_entries (id) on delete cascade,
  crew_member_id uuid not null references public.crew_members (id) on delete cascade,
  reason text not null,
  explanation text not null,
  requested_start_time time,
  requested_end_time time,
  requested_break_minutes integer,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists time_corrections_entry_idx
  on public.time_corrections (time_entry_id);
create index if not exists time_corrections_crew_idx
  on public.time_corrections (crew_member_id);
create index if not exists time_corrections_status_idx
  on public.time_corrections (status);

drop trigger if exists time_corrections_set_updated_at on public.time_corrections;
create trigger time_corrections_set_updated_at
  before update on public.time_corrections
  for each row execute function public.set_updated_at();

alter table public.time_corrections enable row level security;

drop policy if exists "Internal select time_corrections" on public.time_corrections;
create policy "Internal select time_corrections"
  on public.time_corrections for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal write time_corrections" on public.time_corrections;
create policy "Internal write time_corrections"
  on public.time_corrections for all to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Crew select own time_corrections" on public.time_corrections;
create policy "Crew select own time_corrections"
  on public.time_corrections for select to authenticated
  using (crew_member_id = public.my_crew_member_id());

drop policy if exists "Crew insert own time_corrections" on public.time_corrections;
create policy "Crew insert own time_corrections"
  on public.time_corrections for insert to authenticated
  with check (crew_member_id = public.my_crew_member_id());

-- -----------------------------------------------------------------------------
-- client_requests
-- -----------------------------------------------------------------------------
create table if not exists public.client_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  title text not null,
  event_date date,
  start_time time,
  end_time time,
  location_name text,
  location_address text,
  roles_needed text[] not null default '{}',
  number_of_people integer not null default 1,
  deployment_type text,
  clothing text,
  on_site_contact text,
  on_site_phone text,
  urgent boolean not null default false,
  notes text,
  status text not null default 'submitted'
    check (status in (
      'draft', 'submitted', 'in_progress', 'confirmed', 'rejected', 'cancelled'
    )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_requests_client_idx
  on public.client_requests (client_id);
create index if not exists client_requests_status_idx
  on public.client_requests (status);
create index if not exists client_requests_event_date_idx
  on public.client_requests (event_date);

drop trigger if exists client_requests_set_updated_at on public.client_requests;
create trigger client_requests_set_updated_at
  before update on public.client_requests
  for each row execute function public.set_updated_at();

alter table public.client_requests enable row level security;

drop policy if exists "Internal select client_requests" on public.client_requests;
create policy "Internal select client_requests"
  on public.client_requests for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal write client_requests" on public.client_requests;
create policy "Internal write client_requests"
  on public.client_requests for all to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Client select own requests" on public.client_requests;
create policy "Client select own requests"
  on public.client_requests for select to authenticated
  using (
    client_id = public.my_client_id()
    or created_by = auth.uid()
  );

drop policy if exists "Client insert own requests" on public.client_requests;
create policy "Client insert own requests"
  on public.client_requests for insert to authenticated
  with check (
    public.get_my_role() = 'client'::public.user_role
    or public.is_internal_role()
  );

drop policy if exists "Client update own draft requests" on public.client_requests;
create policy "Client update own draft requests"
  on public.client_requests for update to authenticated
  using (
    created_by = auth.uid()
    or client_id = public.my_client_id()
  )
  with check (
    created_by = auth.uid()
    or client_id = public.my_client_id()
  );

drop policy if exists "Client select own client row" on public.clients;
create policy "Client select own client row"
  on public.clients for select to authenticated
  using (id = public.my_client_id() or profile_id = auth.uid());

-- -----------------------------------------------------------------------------
-- app_notifications
-- -----------------------------------------------------------------------------
create table if not exists public.app_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text,
  category text not null default 'general'
    check (category in (
      'general', 'planning', 'hours', 'request', 'invoice', 'system'
    )),
  link text,
  meta jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists app_notifications_user_idx
  on public.app_notifications (user_id, created_at desc);
create index if not exists app_notifications_unread_idx
  on public.app_notifications (user_id)
  where read_at is null;

alter table public.app_notifications enable row level security;

drop policy if exists "Users select own notifications" on public.app_notifications;
create policy "Users select own notifications"
  on public.app_notifications for select to authenticated
  using (user_id = auth.uid() or public.is_internal_role());

drop policy if exists "Users update own notifications" on public.app_notifications;
create policy "Users update own notifications"
  on public.app_notifications for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Internal insert notifications" on public.app_notifications;
create policy "Internal insert notifications"
  on public.app_notifications for insert to authenticated
  with check (public.is_internal_role() or user_id = auth.uid());

drop policy if exists "Users delete own notifications" on public.app_notifications;
create policy "Users delete own notifications"
  on public.app_notifications for delete to authenticated
  using (user_id = auth.uid() or public.is_internal_role());
