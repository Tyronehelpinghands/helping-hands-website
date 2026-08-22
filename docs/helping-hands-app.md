# Helping Hands App

Supabase is the **source of truth** for planning, crew, hours and client requests. Shiftbase sync is **optional but available** while the team still uses Shiftbase operationally (e.g. before BV / app stores).

## Stack

- Next.js App Router + TypeScript + Tailwind
- Supabase Auth + Postgres (RLS)
- Vercel hosting
- Resend (contact), Gmail prepared, WhatsApp later
- Capacitor / PWA code may remain in the repo for a future store release — not required for Shiftbase dual mode

## Portals

| Portal | Route | Role |
|---|---|---|
| Intern | `/dashboard/intern` | owner, admin, planner, sales, finance |
| Crew | `/portaal/medewerkers` | crew (+ internal for support) |
| Clients | `/portaal/opdrachtgevers` | client (+ sales/admin) |

## Architecture rules

1. **Supabase primary** — shifts, assignments, hours live in HH
2. **Shiftbase sync available** when `SHIFTBASE_API_KEY` / `TOKEN` is set:
   - Auto-sync on shift create (skip silently without key → toast `"Shift aangemaakt."`)
   - On sync failure: keep Supabase shift; show clear error toast
   - Manual medewerkers sync under Integraties
3. Optional flag: `SHIFTBASE_ENABLED=false` disables sync; default is **on when key present**
4. No demo bypass, no localStorage as DB, no frontend secrets
5. Brand: navy `#173A8A` / deep `#0B1F4D` / orange `#F28C28`

## Feature matrix (MVP)

| Feature | Intern | Crew | Client |
|---|---|---|---|
| Create/assign shifts (Supabase) | ✅ | — | — |
| Accept / decline shift | — | ✅ | — |
| Availability | view (crew module) | ✅ | — |
| Hours + corrections | ✅ approve | ✅ request | — |
| Optional Shiftbase sync | ✅ | — | — |
| Client requests | notified | — | ✅ persist |
| Notifications | insert | ✅ feed | (schema ready) |
| Mobile bottom nav | sheet sidebar | ✅ | ✅ |
| PWA manifest | site-wide `/manifest.json` | | |

## Database

- Core MVP: [`internal-dashboard-database.md`](./internal-dashboard-database.md)
- Employee portal: [`employee-portal-supabase.md`](./employee-portal-supabase.md)
- App tables: [`helping-hands-app-database.md`](./helping-hands-app-database.md) → run `supabase/helping-hands-app.sql`

## Shiftbase (optional dual mode)

- Health: **Optioneel — beschikbaar** / **Actief** when key present; **Optioneel — uitgeschakeld** only if `SHIFTBASE_ENABLED=false`
- Sync buttons visible under Integraties (not buried as disabled)
- Hours → Shiftbase: best-effort `POST /timesheets` — if API rejects write, enter manually in Shiftbase; see [`shiftbase-integration.md`](./shiftbase-integration.md)
- Legacy columns on `shifts` / `crew_members` remain for sync

## PWA

- `public/manifest.json` — name Helping Hands Agency, `start_url` `/login`, theme `#173A8A`, standalone
- Root `layout.tsx`: `manifest`, `themeColor`, `appleWebApp`, icons from brand assets

## Related docs

- [`internal-dashboard-mvp.md`](./internal-dashboard-mvp.md)
- [`shiftbase-integration.md`](./shiftbase-integration.md) — dual mode + hours limitation
- [`gmail-integration.md`](./gmail-integration.md)
- [`whatsapp-integration.md`](./whatsapp-integration.md)
- [`openclaw-integration.md`](./openclaw-integration.md)
- [`supabase-auth-setup.md`](./supabase-auth-setup.md) — auth, roles, client portal invites

## Client portal invites (sales)

When sales creates an opdrachtgever with an e-mail and **Stuur portaal-uitnodiging** (default on):

1. Server action uses **service role** (`SUPABASE_SERVICE_ROLE_KEY`) to `generateLink` (invite or recovery)
2. Sets `profiles.role = 'client'` and `clients.profile_id`  
   (requires column: run [`supabase/clients-profile-id.sql`](../supabase/clients-profile-id.sql) if missing)
3. Sends a **branded Resend** HTML mail (navy/orange) with CTA to set password via `/auth/callback?next=/update-password`

Env (Vercel + local, **server-only** except site URL):

| Variable | Purpose |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Auth admin + profile/client link (never `NEXT_PUBLIC_*`) |
| `RESEND_API_KEY` | Branded invite e-mail |
| `NEXT_PUBLIC_SITE_URL` | Redirect + logo URLs in the mail |
| `CONTACT_FROM_EMAIL` | Optional From override (same as contact form) |

Fallback without Resend branding: customize Supabase Auth e-mail templates in the dashboard — this app prefers Resend so the invite is fully Helping Hands branded.

