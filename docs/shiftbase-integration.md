# Shiftbase-integratie

Server-side koppeling met de [Shiftbase Public API](https://developer.shiftbase.com/).

## Dual mode (actueel)

| Laag | Rol |
|---|---|
| **Supabase** | Bron van waarheid voor Helping Hands (planning, crew, uren, portalen) |
| **Shiftbase** | Optioneel maar beschikbaar — sync terwijl je operationeel Shiftbase blijft gebruiken |

Helping Hands plant in Supabase; sync naar Shiftbase kan aan wanneer `SHIFTBASE_API_KEY` (of `TOKEN`) staat.

## Environment (Vercel / server only)

| Variabele | Verplicht | Beschrijving |
|---|---|---|
| `SHIFTBASE_API_KEY` | Voor sync | Public API-token uit Shiftbase |
| `SHIFTBASE_API_TOKEN` | Alias | Zelfde als `SHIFTBASE_API_KEY` |
| `SHIFTBASE_API_BASE_URL` | Nee | Default: `https://api.shiftbase.com/api` |
| `SHIFTBASE_ENABLED` | Nee | Default: sync **aan** als key aanwezig. Zet `false` om auto-sync/UI uit te zetten; `true` forceert beschikbaar |

**Nooit** `NEXT_PUBLIC_SHIFTBASE_API_KEY` zetten. Tokens blijven server-side; nooit in frontend of logs.

Token aanmaken: Shiftbase → **Settings → App center → Public API** (App Center Plus vereist).

## Authenticatie

```http
Authorization: API <token>
Accept: application/json
Content-Type: application/json
```

**Niet** `Authorization: Bearer …` — Shiftbase verwacht type `API`.

## Medewerkers / users

| Endpoint | Gebruik |
|---|---|
| `GET /users` | Primair — medewerkers sync & statusprobe |
| `GET /users?active=true` | Fallback bij sync |
| `GET /users/{id}` | Enkele gebruiker |
| `GET /employees` | **Bestaat niet** in de Public API → **404** |

Broncode: `src/lib/shiftbase.ts` (re-export: `src/lib/integrations/shiftbase.ts`).

## Routes in deze app

| Route | Rol | Doel |
|---|---|---|
| `GET /api/shiftbase/status` | intern | Status: connected / message (geen token) |
| `POST /api/shiftbase/sync-employees` | owner/admin/planner | Sync `/users` → `crew_members` |
| `POST /api/shiftbase/sync-shift` | intern | Eén shift → Shiftbase |
| `POST /api/shiftbase/sync-all-shifts` | intern | Bulk shifts |
| `GET /api/shiftbase/timesheets` | intern | Uren **ophalen** uit Shiftbase |
| `POST /api/shiftbase/sync-hours` | intern | Import-probe (GET timesheets) |
| `POST /api/shiftbase/push-hours` | intern | Best-effort uren **naar** Shiftbase |
| `GET /api/shiftbase/test` | intern | Healthprobe via `/users` |

## Sync-gedrag

### Medewerkers
- Upsert op **e-mail**; rijen zonder e-mail worden overgeslagen.
- `shiftbase_user_id` wordt gezet indien de kolom bestaat.
- Lokale-only crew wordt niet verwijderd.

### Shifts (auto)
- Bij **shift aanmaken** (`createShiftAction`): als API key aanwezig en niet `SHIFTBASE_ENABLED=false` → sync naar Shiftbase.
- Zonder key: stil overslaan, toast alleen **"Shift aangemaakt."**
- Bij sync-fout: Supabase-shift blijft bestaan; toast toont duidelijke fout.

### Uren → Shiftbase (beperking)

Shiftbase documenteert **Timesheets** / **TimeTracking** (o.a. uitwisseling van tijdregistratie), maar de publieke write-schema’s zijn niet volledig vastgelegd.

- App probeert `POST /timesheets` via `/api/shiftbase/push-hours` (per regel of datumbereik).
- Vereist: `crew_members.shiftbase_user_id` (via medewerkers-sync).
- Bij **404 / 405 / 422**: write niet ondersteund of payload geweigerd → **uren handmatig in Shiftbase zetten**. Helping Hands blijft bron.
- UI: Intern → **Urenregistratie** → “Sync naar Shiftbase” (per regel of gefilterd bereik).

**Fabrice 28 juni:** filter in Urenregistratie op crewlid Fabrice + datum `2026-06-28` (of `2025-06-28`). Regel staat in Supabase `time_entries`. Sync-knop gebruiken of handmatig in Shiftbase invoeren.

## Integraties-UI

Statuslabels:
- **Actief** — key + API OK
- **Optioneel — beschikbaar** — key ontbreekt of test nog niet groen; sync kan aan
- **Optioneel — uitgeschakeld** — alleen bij `SHIFTBASE_ENABLED=false`

Sync-knoppen (medewerkers) staan zichtbaar onder Integraties — niet begraven onder “uitgeschakeld”.

## Fouten (UI)

| Situatie | Richting |
|---|---|
| 404 | Endpoint fout — gebruik `/users`, niet `/employees` |
| 401 / 403 | Token geweigerd — Public API-token + App Center Plus |
| Key ontbreekt | `SHIFTBASE_API_KEY` in Vercel + redeploy |
| Timesheet write geweigerd | Handmatig in Shiftbase; HH blijft bron |

## Verifiëren na deploy

1. Vercel: `SHIFTBASE_API_KEY` (geen `SHIFTBASE_ENABLED=false` nodig)
2. Redeploy
3. Dashboard → Integraties → **Test API** + **Medewerkers synchroniseren**
4. Planning → shift aanmaken → toast met Shiftbase-sync of “Shift aangemaakt.” zonder key
