# Supabase Auth setup — Helping Hands Agency

Deze gids zet echte Supabase Auth + rollen op voor:

- `/dashboard/intern/*` — intern (owner, admin, planner, sales, finance)
- `/portaal/medewerkers/*` — medewerkers (owner, admin, planner, crew)
- `/portaal/opdrachtgevers/*` — opdrachtgevers (owner, admin, sales, client)

Env (Vercel + lokaal):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` — canonical site (redirects + invite e-mail links)
- `SUPABASE_SERVICE_ROLE_KEY` — **server-only**; needed for portaal-uitnodigingen (Auth admin)
- `RESEND_API_KEY` — **server-only**; branded invite mail (zie ook contactformulier)

Gebruik **nooit** de service role key in de browser of als `NEXT_PUBLIC_*`.

---

## 1. Auth URL-configuratie (Supabase Dashboard)

**Authentication → URL Configuration**

| Setting | Waarde |
| --- | --- |
| Site URL | `https://www.helpinghandsagency.nl` |
| Redirect URLs | zie hieronder |

Voeg toe aan **Redirect URLs**:

```
https://www.helpinghandsagency.nl/auth/callback
https://www.helpinghandsagency.nl/update-password
http://localhost:3000/auth/callback
http://localhost:3000/update-password
```

Optioneel (preview):

```
https://*.vercel.app/auth/callback
https://*.vercel.app/update-password
```

**Belangrijk:** Site URL moet productie (`www`) zijn — niet een Vercel-preview.
Verlopen/ongeldige invite-OTP’s redirecten anders naar de homepage met
`#error=access_denied&error_code=otp_expired…` (hash is alleen client-side zichtbaar).
De app vangt dat op via `AuthHashErrorHandler` → `/login?type=opdrachtgever&error=otp_expired`.

**Invite redirect:** `inviteClient` gebruikt altijd productie
`NEXT_PUBLIC_SITE_URL` (fallback `https://www.helpinghandsagency.nl`) voor
`generateLink` → `redirectTo = …/auth/callback?next=/update-password`.
Preview/`localhost` in die env-var wordt bewust genegeerd voor invites.

### E-mail OTP / magic link expiry

**Authentication → Settings** (of Providers → Email): verhoog indien beschikbaar
de expiry voor invite / magic link / recovery (standaard is vaak kort, bijv. 1 uur).
Bij verlopen links: sales klikt **Opnieuw uitnodigen** in het intern dashboard.

---

## 2. SQL: profiles, RLS, trigger, get_my_role

Voer dit uit in **Supabase → SQL Editor** (één keer):

```sql
-- Roles enum
do $$ begin
  create type public.user_role as enum (
    'owner',
    'admin',
    'planner',
    'sales',
    'finance',
    'crew',
    'client'
  );
exception
  when duplicate_object then null;
end $$;

-- Profiles table (1:1 met auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role public.user_role not null default 'crew',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

-- updated_at helper
create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_profiles_updated_at();

-- Auto-create profile on signup (default role: crew — owner wijzigt later)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', null),
    'crew'
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: huidige rol (handig in policies / debugging)
create or replace function public.get_my_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

grant execute on function public.get_my_role() to authenticated;

-- RLS
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Eigenaar mag full_name/email updaten, niet de eigen rol wijzigen via de client.
drop policy if exists "Users can update own profile (non-role)" on public.profiles;
create policy "Users can update own profile (non-role)"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = public.get_my_role()
  );

-- Owner/admin: alle profiles lezen/updaten (via get_my_role = geen RLS-recursie)
drop policy if exists "Owners and admins can read all profiles" on public.profiles;
create policy "Owners and admins can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.get_my_role() in ('owner', 'admin'));

drop policy if exists "Owners and admins can update roles" on public.profiles;
create policy "Owners and admins can update roles"
  on public.profiles
  for update
  to authenticated
  using (public.get_my_role() in ('owner', 'admin'))
  with check (public.get_my_role() in ('owner', 'admin'));
```


---

## 3. Eerste owner instellen

1. Maak in **Authentication → Users** een gebruiker aan (e-mail + wachtwoord), of laat die persoon zichzelf aanmelden als dat aanstaat.
2. Vervang `JOUW_EMAIL_HIER` en voer uit:

```sql
update public.profiles
set role = 'owner',
    full_name = coalesce(full_name, 'Owner')
where email = 'JOUW_EMAIL_HIER';
```

3. Log in op `https://www.helpinghandsagency.nl/login` → kies **Intern dashboard** → e-mail/wachtwoord.
4. Je landt op `/dashboard/intern`.

Extra accounts:

```sql
-- Intern admin
update public.profiles set role = 'admin' where email = 'admin@voorbeeld.nl';

-- Planner
update public.profiles set role = 'planner' where email = 'planner@voorbeeld.nl';

-- Sales
update public.profiles set role = 'sales' where email = 'sales@voorbeeld.nl';

-- Finance
update public.profiles set role = 'finance' where email = 'finance@voorbeeld.nl';

-- Crew (medewerkersportaal)
update public.profiles set role = 'crew' where email = 'crew@voorbeeld.nl';

-- Opdrachtgever
update public.profiles set role = 'client' where email = 'klant@voorbeeld.nl';
```

---

## 4. Rol → toegang

| Rol | Intern | Medewerkers | Opdrachtgevers |
| --- | --- | --- | --- |
| owner | ✅ | ✅ | ✅ |
| admin | ✅ | ✅ | ✅ |
| planner | ✅ | ✅ | ❌ |
| sales | ✅ | ❌ | ✅ |
| finance | ✅ | ❌ | ❌ |
| crew | ❌ | ✅ | ❌ |
| client | ❌ | ❌ | ✅ |

Bescherming gebeurt op twee lagen:

1. `src/proxy.ts` — sessie-refresh + pad-check
2. Layouts met `requireRole(...)` — vóór render van dashboard/portaal-UI

---

## 5. Wachtwoord vergeten

Flow: `/forgot-password` → e-mail met link → `/auth/callback?next=/update-password` → `/update-password`.

Zorg dat de redirect URLs hierboven kloppen.

---

## 6. Checklist na deploy

- [ ] SQL hierboven uitgevoerd
- [ ] Eerste owner gezet (`JOUW_EMAIL_HIER` vervangen)
- [ ] Site URL + Redirect URLs gezet
- [ ] Vercel env: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Vercel env (uitnodigingen): `SUPABASE_SERVICE_ROLE_KEY` + `RESEND_API_KEY` + `NEXT_PUBLIC_SITE_URL`
- [ ] Test: zonder login → `/dashboard/intern` redirect naar `/login`
- [ ] Test: crew-account kan geen `/dashboard/intern` openen
- [ ] Test: Uitloggen in intern + beide portalen
- [ ] Test: sales maakt opdrachtgever met e-mail → branded invite → wachtwoord zetten → `/portaal/opdrachtgevers`

---

## 7. Opdrachtgever uitnodigen (portaal)

Sales (`owner` / `admin` / `sales`) kan bij aanmaken of via **Uitnodigen** / **Opnieuw uitnodigen**:

1. `auth.admin.generateLink` (`invite` voor nieuw, `recovery` als het account al bestaat)
2. `profiles.role = 'client'` + `clients.profile_id = user.id`  
   (column + RLS: [`supabase/clients-profile-id.sql`](../supabase/clients-profile-id.sql) — or full [`supabase/helping-hands-app.sql`](../supabase/helping-hands-app.sql))
3. Branded HTML via Resend (`src/lib/email/formatPortalInviteEmail.ts`) — knop naar  
   productie-`redirectTo`: `https://www.helpinghandsagency.nl/auth/callback?next=/update-password`  
   (via `NEXT_PUBLIC_SITE_URL`, nooit een `*.vercel.app` preview)

Code: `src/lib/auth/inviteClient.ts` (alleen server actions). Rate-limit: max 5 invites / e-mail / 15 min (in-memory per instance).

**Verlopen link:** gebruiker landt op `/login?type=opdrachtgever&error=otp_expired` met
Nederlandse uitleg. Actie: **Opnieuw uitnodigen** vanuit intern dashboard (of contact
`info@helpinghandsagency.nl`).

**Fallback:** zonder Resend kun je Supabase Auth e-mailtemplates in het dashboard branden; de app stuurt bij voorkeur zelf de mail zodat het Helping Hands-design vastligt.
