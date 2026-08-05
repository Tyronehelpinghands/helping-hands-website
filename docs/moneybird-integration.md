# Moneybird-integratie

Server-side koppeling met de [Moneybird API v2](https://developer.moneybird.com/).

## Dual mode (actueel)

| Laag | Rol |
|---|---|
| **Supabase** | Bron van waarheid voor factuurconcepten (`invoice_drafts` + regels) |
| **Moneybird** | Optioneel — conceptfactuur aanmaken (draft); verzenden optioneel |

Zonder env-variabelen blijven concepten in Supabase; CSV-export blijft beschikbaar. De UI toont dan duidelijke setup-stappen (geen valse “connected”-status).

## Environment (Vercel / server only)

| Variabele | Verplicht | Beschrijving |
|---|---|---|
| `MONEYBIRD_ACCESS_TOKEN` | Voor API | Personal Access Token |
| `MONEYBIRD_API_TOKEN` | Alias | Zelfde als `MONEYBIRD_ACCESS_TOKEN` |
| `MONEYBIRD_ADMINISTRATION_ID` | Voor API | Administratie-ID (uit Moneybird-URL of API) |
| `MONEYBIRD_DEFAULT_TAX_RATE_ID` | Optioneel | Override standaard btw-tarief; anders auto uit API |
| `MONEYBIRD_DEFAULT_LEDGER_ACCOUNT_ID` | Optioneel | Override standaard omzet-grootboek; anders auto uit API |
| `MONEYBIRD_BASE_URL` | Nee | Default: `https://moneybird.com/api/v2` |

**Minimaal nodig:** token + administration ID. Tax/ledger worden automatisch opgehaald uit Moneybird (voorkeur: actief 21% BTW / `sales_invoice`, en een `revenue`-omzetrekening geschikt voor sales invoices). Optionele env-overrides blijven beschikbaar.

**Nooit** `NEXT_PUBLIC_MONEYBIRD_*` zetten. Tokens blijven server-side; nooit in frontend of logs.

### Token & IDs ophalen

1. Moneybird → **Instellingen → Externe toepassingen / API** → Personal Access Token  
   Scopes: `sales_invoices`, `contacts` (minimaal).
2. Administration ID: zichtbaar in de Moneybird-URL of via `GET /administrations.json`.
3. (Optioneel) Tax rate / ledger account IDs: via API  
   `GET /{administration_id}/tax_rates.json` en  
   `GET /{administration_id}/ledger_accounts.json`.
4. Vercel → Project → **Settings → Environment Variables** (Production + Preview) → waarden zetten → **Redeploy**.

### Auto-resolve (tax / ledger)

Bij elke factuursync (en bij health/status):

1. Gebruik env-overrides als beide gezet zijn.
2. Anders: haal `tax_rates` (filter `sales_invoice`) en `ledger_accounts` op.
3. Kies beste match (21% BTW / omzet + `sales_invoice`).
4. Cache in geheugen (TTL ~15 minuten) per administratie.

Als auto-resolve faalt: duidelijke Nederlandse fout + link naar deze docs — niet “niet gekoppeld”.

## Authenticatie

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Broncode: `src/lib/server/moneybird.ts`.

## Routes in deze app

| Route | Rol | Doel |
|---|---|---|
| `GET /api/moneybird/status` | intern | Env + contacts-probe + tax/ledger resolve |
| `GET /api/moneybird/contacts` | intern | Contacten ophalen |
| `POST /api/moneybird/create-contact` | finance/admin/owner | Contact aanmaken |
| `GET /api/moneybird/sales-invoices` | intern | Facturen ophalen |
| `POST /api/moneybird/sales-invoices` | finance/admin/owner | Conceptfactuur aanmaken (`send: true` = ook versturen) |

Server action (Facturatie-MVP):

| Action | Rol | Doel |
|---|---|---|
| `pushInvoiceDraftToMoneybirdAction` | finance/admin/owner | Supabase-concept → Moneybird draft (+ optioneel send) |

## Sync-gedrag

1. Maak een factuurconcept in **Facturatie** (uit goedgekeurde uren).
2. Vul bij de opdrachtgever (Sales) of in het Moneybird-dialog een **Moneybird contact-id** in.
3. Klik **Moneybird** → standaard alleen **concept/draft** in Moneybird.
4. Optioneel checkbox: ook direct versturen (`PATCH .../send_invoice.json`).
5. Bij succes: `moneybird_invoice_id` + sync-status op `invoice_drafts`; lokale status → `ready` of `sent`.

**Let op:** “Token OK (contacts)” betekent alleen dat de API bereikbaar is — nog niet dat tax/ledger klaar zijn. “Klaar voor facturen” volgt als tax + ledger via env of auto-resolve beschikbaar zijn.

## SQL (bestaande databases)

Voer de migratie uit via [`supabase/moneybird-columns.sql`](../supabase/moneybird-columns.sql) (of dezelfde SQL in [`internal-dashboard-database.md`](./internal-dashboard-database.md) onder **Migration: Moneybird sync columns**):

- `clients.moneybird_contact_id`
- `invoice_drafts.moneybird_invoice_id`
- `invoice_drafts.moneybird_sync_status` (`niet_gesynct` \| `concept` \| `verzonden` \| `fout`)
- `invoice_drafts.moneybird_synced_at`
- `invoice_drafts.moneybird_sync_error`

## Integraties-UI / health check

| Status | Betekenis |
|---|---|
| **Actief** / “Klaar voor facturen” | Token werkt én tax/ledger opgelost (env of auto) |
| **Voorbereid** / “Token OK (contacts)” | Token werkt; tax/ledger nog niet gevonden |
| **Ontbreekt** | Geen token/administration ID |

Facturatie toont setup-stappen zolang env ontbreekt — geen nep-“connected”.

## Fouten (UI)

| Situatie | Richting |
|---|---|
| 401 / 403 | Token of scopes controleren |
| 422 / validatiefout | Contact-id, tax rate of ledger account controleren |
| Env ontbreekt (token/admin) | Vercel: `MONEYBIRD_ACCESS_TOKEN` + `MONEYBIRD_ADMINISTRATION_ID` + redeploy |
| Tax/ledger niet gevonden | Optionele overrides of Moneybird-administratie (actieve sales BTW + omzet) |
| Kolom ontbreekt | SQL-migratie hierboven |

## Verifiëren na deploy

1. Vercel: token + administration ID (tax/ledger optioneel)
2. Redeploy
3. Dashboard → **Integraties** → Moneybird **Test API** → verwacht “Klaar voor facturen”
4. Supabase: Moneybird SQL-migratie
5. **Facturatie** → concept → **Moneybird** → concept verschijnt in Moneybird (niet auto-send tenzij aangevinkt)
