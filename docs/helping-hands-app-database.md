# Helping Hands App — database (portals MVP)

SQL: [`supabase/helping-hands-app.sql`](../supabase/helping-hands-app.sql)

## Prerequisites (run first)

1. [`supabase-auth-setup.md`](./supabase-auth-setup.md) — `profiles`, `get_my_role()`
2. [`internal-dashboard-database.md`](./internal-dashboard-database.md) — core MVP tables + `is_internal_role()`
3. [`employee-portal-supabase.md`](./employee-portal-supabase.md) / `supabase/employee-portal.sql` — `my_crew_member_id()`, `crew_availability`

## New / extended objects

| Object | Purpose |
|---|---|
| `clients.profile_id` | Link opdrachtgever auth user → client row |
| `my_client_id()` | Resolve current user's client id (profile or e-mail) |
| `shift_assignments` | Crew accept/decline per shift (`pending` / `accepted` / `declined` / `cancelled`) |
| `crew_availability` | Idempotent create (also in employee-portal SQL) |
| `time_corrections` | Structured hours correction requests |
| `client_requests` | Persisted klantaanvragen (replaces DEMO localStorage) |
| `app_notifications` | In-app meldingen per user |

## RLS summary

- **Internal** (`is_internal_role()`): full access to assignments, corrections, requests, notifications insert
- **Crew** (`my_crew_member_id()`): own assignments (select/update), own corrections (select/insert), own shifts status update for accept/decline
- **Client** (`my_client_id()` / `created_by`): own requests select/insert/update; own client row select
- **Notifications**: user reads/updates own rows; internal may insert for others

## How to run

Supabase → SQL Editor → paste `supabase/helping-hands-app.sql` → Run.

**If you only need the opdrachtgever invite fix** (`column clients.profile_id does not exist`):

paste [`supabase/clients-profile-id.sql`](../supabase/clients-profile-id.sql) → Run.  
(That snippet is also the first block of `helping-hands-app.sql`.)

Optional: set `clients.profile_id` for client test accounts:

```sql
update public.clients
set profile_id = (select id from public.profiles where email = 'klant@voorbeeld.nl')
where lower(email) = 'klant@voorbeeld.nl';
```
