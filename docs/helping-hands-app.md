# Helping Hands App

Supabase is the **source of truth** for planning, crew, hours and client requests. Shiftbase is **optional / disabled** by default and must not block the product.

## Stack

- Next.js App Router + TypeScript + Tailwind
- Supabase Auth + Postgres (RLS)
- Vercel hosting
- Resend (contact), Gmail prepared, WhatsApp later

## Portals

| Portal | Route | Role |
|---|---|---|
| Intern | `/dashboard/intern` | owner, admin, planner, sales, finance |
| Crew | `/portaal/medewerkers` | crew (+ internal for support) |
| Clients | `/portaal/opdrachtgevers` | client (+ sales/admin) |

## Architecture rules

1. **No automatic Shiftbase sync** on shift create/assign — toast is only `"Shift aangemaakt."`
2. Shiftbase opt-in via `SHIFTBASE_ENABLED=true` + API key; UI shows **Optioneel — uitgeschakeld** otherwise
3. No demo bypass, no localStorage as DB, no frontend secrets
4. Brand: navy `#173A8A` / deep `#0B1F4D` / orange `#F28C28`

## Feature matrix (MVP)

| Feature | Intern | Crew | Client |
|---|---|---|---|
| Create/assign shifts (Supabase) | ✅ | — | — |
| Accept / decline shift | — | ✅ | — |
| Availability | view (crew module) | ✅ | — |
| Hours + corrections | ✅ approve | ✅ request | — |
| Client requests | notified | — | ✅ persist |
| Notifications | insert | ✅ feed | (schema ready) |
| Mobile bottom nav | sheet sidebar | ✅ | ✅ |
| PWA manifest | site-wide `/manifest.json` | | |

## Database

- Core MVP: [`internal-dashboard-database.md`](./internal-dashboard-database.md)
- Employee portal: [`employee-portal-supabase.md`](./employee-portal-supabase.md)
- App tables: [`helping-hands-app-database.md`](./helping-hands-app-database.md) → run `supabase/helping-hands-app.sql`

## Shiftbase (optional)

- Default: disabled — health status **Optioneel — uitgeschakeld** (`ok: true`, does not break integrations)
- Manual sync only under Integraties → Geavanceerd when `SHIFTBASE_ENABLED=true`
- Legacy columns on `shifts` / `crew_members` remain for optional sync; no feature depends on them

## PWA

- `public/manifest.json` — name Helping Hands Agency, `start_url` `/login`, theme `#173A8A`, standalone
- Root `layout.tsx`: `manifest`, `themeColor`, `appleWebApp`, icons from brand assets

## Related docs

- [`internal-dashboard-mvp.md`](./internal-dashboard-mvp.md)
- [`shiftbase-integration.md`](./shiftbase-integration.md) — treat as optional legacy
- [`gmail-integration.md`](./gmail-integration.md)
- [`whatsapp-integration.md`](./whatsapp-integration.md)
