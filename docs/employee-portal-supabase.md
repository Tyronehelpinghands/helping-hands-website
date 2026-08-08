# Medewerkersportaal — Supabase koppeling

Live data voor `/portaal/medewerkers`. Vereist de interne dashboard-tabellen uit [`internal-dashboard-database.md`](./internal-dashboard-database.md).

## User ↔ crew linking

| Prioriteit | Match | Kolom |
|---|---|---|
| 1 | Auth user id | `crew_members.profile_id = auth.uid()` |
| 2 | E-mail (case-insensitive) | `crew_members.email` = `profiles.email` |

Zonder match toont het portaal **Geen medewerkerprofiel gekoppeld** (geen demodata).

### Crew-account koppelen (SQL)

```sql
-- Voorbeeld: koppel bestaand crewlid aan een login-profiel
update public.crew_members
set profile_id = (select id from public.profiles where email = 'crew@voorbeeld.nl')
where lower(email) = lower('crew@voorbeeld.nl');

-- Of: zet role op crew voor een testaccount
update public.profiles
set role = 'crew'
where email = 'crew@voorbeeld.nl';
```

Owners zonder `crew_members`-rij zien bewust de lege status — geen Demo Medewerker.

---

## SQL om uit te voeren in Supabase

Voer dit **na** `internal-dashboard-database.md` uit (idempotent).

```sql
-- =============================================================================
-- Medewerkersportaal — RLS voor crew + beschikbaarheid
-- Requires: profiles, get_my_role(), is_internal_role(), crew_members, shifts,
--           projects, time_entries, internal_messages
-- =============================================================================

-- Unique profile link (één crewlid per login)
create unique index if not exists crew_members_profile_id_uidx
  on public.crew_members (profile_id)
  where profile_id is not null;

-- Helper: crewlid-id van de ingelogde gebruiker (bypasses RLS)
create or replace function public.my_crew_member_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select cm.id
  from public.crew_members cm
  left join public.profiles p on p.id = auth.uid()
  where cm.profile_id = auth.uid()
     or (
       cm.email is not null
       and p.email is not null
       and lower(cm.email) = lower(p.email)
     )
  order by case when cm.profile_id = auth.uid() then 0 else 1 end
  limit 1;
$$;

grant execute on function public.my_crew_member_id() to authenticated;

-- -----------------------------------------------------------------------------
-- crew_availability
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

drop trigger if exists crew_availability_set_updated_at on public.crew_availability;
create trigger crew_availability_set_updated_at
  before update on public.crew_availability
  for each row execute function public.set_updated_at();

alter table public.crew_availability enable row level security;

drop policy if exists "Internal can select crew_availability" on public.crew_availability;
create policy "Internal can select crew_availability"
  on public.crew_availability for select to authenticated
  using (public.is_internal_role());

drop policy if exists "Internal can write crew_availability" on public.crew_availability;
create policy "Internal can write crew_availability"
  on public.crew_availability for all to authenticated
  using (public.is_internal_role())
  with check (public.is_internal_role());

drop policy if exists "Crew can select own availability" on public.crew_availability;
create policy "Crew can select own availability"
  on public.crew_availability for select to authenticated
  using (crew_member_id = public.my_crew_member_id());

drop policy if exists "Crew can insert own availability" on public.crew_availability;
create policy "Crew can insert own availability"
  on public.crew_availability for insert to authenticated
  with check (crew_member_id = public.my_crew_member_id());

drop policy if exists "Crew can update own availability" on public.crew_availability;
create policy "Crew can update own availability"
  on public.crew_availability for update to authenticated
  using (crew_member_id = public.my_crew_member_id())
  with check (crew_member_id = public.my_crew_member_id());

drop policy if exists "Crew can delete own availability" on public.crew_availability;
create policy "Crew can delete own availability"
  on public.crew_availability for delete to authenticated
  using (crew_member_id = public.my_crew_member_id());

-- -----------------------------------------------------------------------------
-- Extra SELECT/UPDATE policies voor crew (naast bestaande internal policies)
-- -----------------------------------------------------------------------------

drop policy if exists "Crew can select own crew_members" on public.crew_members;
create policy "Crew can select own crew_members"
  on public.crew_members for select to authenticated
  using (id = public.my_crew_member_id());

drop policy if exists "Crew can update own crew_members" on public.crew_members;
create policy "Crew can update own crew_members"
  on public.crew_members for update to authenticated
  using (id = public.my_crew_member_id())
  with check (id = public.my_crew_member_id());

drop policy if exists "Crew can select own shifts" on public.shifts;
create policy "Crew can select own shifts"
  on public.shifts for select to authenticated
  using (crew_member_id = public.my_crew_member_id());

drop policy if exists "Crew can select related projects" on public.projects;
create policy "Crew can select related projects"
  on public.projects for select to authenticated
  using (
    exists (
      select 1
      from public.shifts s
      where s.project_id = projects.id
        and s.crew_member_id = public.my_crew_member_id()
    )
  );

drop policy if exists "Crew can select related clients" on public.clients;
create policy "Crew can select related clients"
  on public.clients for select to authenticated
  using (
    exists (
      select 1
      from public.projects p
      join public.shifts s on s.project_id = p.id
      where p.client_id = clients.id
        and s.crew_member_id = public.my_crew_member_id()
    )
  );

drop policy if exists "Crew can select own time_entries" on public.time_entries;
create policy "Crew can select own time_entries"
  on public.time_entries for select to authenticated
  using (crew_member_id = public.my_crew_member_id());

drop policy if exists "Crew can insert own time_entries" on public.time_entries;
create policy "Crew can insert own time_entries"
  on public.time_entries for insert to authenticated
  with check (
    crew_member_id = public.my_crew_member_id()
    and status in ('draft', 'submitted')
  );

drop policy if exists "Crew can update own time_entries correction" on public.time_entries;
drop policy if exists "Crew can update own time_entries" on public.time_entries;
create policy "Crew can update own time_entries"
  on public.time_entries for update to authenticated
  using (crew_member_id = public.my_crew_member_id())
  with check (crew_member_id = public.my_crew_member_id());

-- Opdrachtgever read + optionele requested_kilometers:
-- zie ook supabase/hours-km-ecosystem.sql

drop policy if exists "Crew can select own messages" on public.internal_messages;
create policy "Crew can select own messages"
  on public.internal_messages for select to authenticated
  using (
    recipient_email is not null
    and lower(recipient_email) = lower((
      select email from public.profiles where id = auth.uid()
    ))
    and status in ('sent', 'ready')
  );
```

---

## Wat de app toont (na SQL)

| Pagina | Bron |
|---|---|
| Overzicht | Eigen shifts, `time_entries` deze week, open acties, berichten |
| Planning | `shifts` waar `crew_member_id` = jou |
| Uren | `time_entries` (correctie → `correction_reason`) |
| Beschikbaarheid | `crew_availability` (upsert) |
| Berichten | `internal_messages` met jouw e-mail + status sent/ready |
| Documenten | Certificaten uit `crew_members.certificates` (geen fake uploads) |
| Profiel | `crew_members` contactvelden |

## Checklist testen

1. SQL hierboven uitvoeren in Supabase.
2. Crew-testaccount: `profiles.role = 'crew'` + `crew_members.profile_id` of matching e-mail.
3. In intern dashboard: shift toewijzen aan dat crewlid → zichtbaar onder Planning.
4. Owner zonder crew-rij: `/portaal/medewerkers` → “Geen medewerkerprofiel gekoppeld”.
5. Geen “Demo Medewerker”, Scheveningen of RAI-demo meer in het live portaal.
