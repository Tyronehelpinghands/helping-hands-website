# Shiftbase-integratie

Server-side koppeling met de [Shiftbase Public API](https://developer.shiftbase.com/).

## Environment (Vercel / server only)

| Variabele | Verplicht | Beschrijving |
|---|---|---|
| `SHIFTBASE_API_KEY` | Ja (of alias) | Public API-token uit Shiftbase |
| `SHIFTBASE_API_TOKEN` | Alias | Zelfde als `SHIFTBASE_API_KEY` (beide worden geaccepteerd) |
| `SHIFTBASE_API_BASE_URL` | Nee | Default: `https://api.shiftbase.com/api` |

**Nooit** `NEXT_PUBLIC_SHIFTBASE_API_KEY` zetten. Tokens blijven server-side; nooit in frontend of logs.

Token aanmaken: Shiftbase → **Settings → App center → Public API** (App Center Plus vereist).

## Authenticatie

Elke request gebruikt:

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

Historische fout: sync hardcodede `/employees`, wat `Shiftbase API fout (404) op /employees` gaf terwijl de key wél geldig was.

Broncode: `src/lib/shiftbase.ts` (re-export: `src/lib/integrations/shiftbase.ts`).

```ts
const SHIFTBASE_EMPLOYEE_ENDPOINTS = ["/users", "/users?active=true"];
```

## Routes in deze app

| Route | Rol | Doel |
|---|---|---|
| `GET /api/shiftbase/status` | intern | Status: `connected`, `statusCode`, `endpointUsed`, `message` (geen token) |
| `POST /api/shiftbase/sync-employees` | owner/admin/planner | Sync `/users` → `crew_members` |
| `GET /api/shiftbase/test` | intern | Healthprobe via `/users` |
| `GET /api/shiftbase/config-status` | intern | Env-diagnose (geen tokenwaarde) |

## Sync-gedrag

- Upsert op **e-mail**; rijen zonder e-mail worden overgeslagen.
- `employment_type = payroll` bij insert.
- `notes = "Gesynchroniseerd vanuit Shiftbase"` bij sync insert/update.
- `shiftbase_user_id` wordt gezet indien de kolom bestaat.
- Lokale-only crew wordt niet verwijderd.

Response: `imported`, `updated`, `skipped`, `errors`, plus `statusCode` / `endpointUsed` bij fouten.

## Fouten (UI)

| Situatie | Richting |
|---|---|
| 404 | Endpoint fout — gebruik `/users`, niet `/employees`. Zie developer.shiftbase.com |
| 401 / 403 | Token geweigerd — Public API-token + App Center Plus controleren |
| Key ontbreekt | `SHIFTBASE_API_KEY` (of `SHIFTBASE_API_TOKEN`) in Vercel zetten en redeployen |

Actie-tekst: *Controleer Public API token, App Center Plus en endpoint.*

## Verifiëren na deploy

1. Vercel env: `SHIFTBASE_API_KEY` + optioneel `SHIFTBASE_API_BASE_URL=https://api.shiftbase.com/api`
2. Redeploy
3. Dashboard → Integraties → **Test API** of open `/api/shiftbase/status`
4. **Medewerkers synchroniseren** — verwacht geen 404 op `/employees`
