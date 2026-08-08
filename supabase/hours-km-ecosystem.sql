-- =============================================================================
-- Hours + kilometers ecosystem — RLS across three portals
-- RUN IN SUPABASE SQL EDITOR (idempotent)
--
-- Requires:
--   - docs/internal-dashboard-database.md (time_entries with kilometers)
--   - supabase/employee-portal.sql (my_crew_member_id)
--   - supabase/helping-hands-app.sql or clients-profile-id.sql (my_client_id)
--
-- Single source of truth: public.time_entries
--   - kilometers numeric (already on table)
--   - travel_time_hours numeric (already on table)
-- No separate kilometers table.
-- =============================================================================

-- Optional structured field on corrections (safe if table missing → skip via DO)
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'time_corrections'
  ) then
    alter table public.time_corrections
      add column if not exists requested_kilometers numeric;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Crew: insert + update own time_entries (uren + km indienen/bewerken)
-- -----------------------------------------------------------------------------
drop policy if exists "Crew can insert own time_entries" on public.time_entries;
create policy "Crew can insert own time_entries"
  on public.time_entries for insert to authenticated
  with check (
    crew_member_id = public.my_crew_member_id()
    and status in ('draft', 'submitted')
  );

-- Keep existing update policy name if present; recreate for clarity
drop policy if exists "Crew can update own time_entries correction" on public.time_entries;
drop policy if exists "Crew can update own time_entries" on public.time_entries;
create policy "Crew can update own time_entries"
  on public.time_entries for update to authenticated
  using (crew_member_id = public.my_crew_member_id())
  with check (crew_member_id = public.my_crew_member_id());

-- -----------------------------------------------------------------------------
-- Opdrachtgever: read projects + approved/submitted/invoiced hours (+ km)
-- -----------------------------------------------------------------------------
drop policy if exists "Client can select own projects" on public.projects;
create policy "Client can select own projects"
  on public.projects for select to authenticated
  using (client_id = public.my_client_id());

drop policy if exists "Client can select project time_entries" on public.time_entries;
create policy "Client can select project time_entries"
  on public.time_entries for select to authenticated
  using (
    status in ('submitted', 'approved', 'invoiced')
    and exists (
      select 1
      from public.projects p
      where p.id = time_entries.project_id
        and p.client_id = public.my_client_id()
    )
  );

-- Opdrachtgever mag shifts van eigen projecten zien (planning context)
drop policy if exists "Client can select project shifts" on public.shifts;
create policy "Client can select project shifts"
  on public.shifts for select to authenticated
  using (
    exists (
      select 1
      from public.projects p
      where p.id = shifts.project_id
        and p.client_id = public.my_client_id()
    )
  );
