# Moneybird-integratie

Server-side koppeling met de [Moneybird API v2](https://developer.moneybird.com/).

## Dual mode (actueel)

| Laag | Rol |
|---|---|
| **Supabase** | Bron van waarheid voor factuurconcepten (`invoice_drafts` + regels) |
| **Moneybird** | Optioneel — conceptfactuur aanmaken (draft); verzenden alleen via expliciete **Bevestig factuur** |

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
| `POST /api/moneybird/sales-invoices` | finance/admin/owner | Conceptfactuur aanmaken (`send: true` blijft API-optie; UI gebruikt dit niet) |

Server actions (Facturatie-MVP):

| Action | Rol | Doel |
|---|---|---|
| `pushInvoiceDraftToMoneybirdAction` | finance/admin/owner | Supabase-concept → Moneybird **alleen concept** (aanmaken of bijwerken) |
| `confirmInvoiceDraftInMoneybirdAction` | finance/admin/owner | Expliciet bevestigen/verzenden in Moneybird |
| `deleteInvoiceDraftAction` | finance/admin/owner | Concept verwijderen (niet verzonden); uren → approved; optioneel Moneybird-concept DELETE |
| `creditInvoiceDraftAction` | finance/admin/owner | Creditnota: lokaal `gecrediteerd` + creditconcept; Moneybird `duplicate_creditinvoice` indien gekoppeld (**nooit** auto-send) |

## Sync-gedrag (twee stappen)

1. Maak een factuurconcept in **Facturatie** (uit goedgekeurde uren).
2. Vul bij de opdrachtgever (Sales) of in het Moneybird-dialog een **Moneybird contact-id** in.
3. **Naar Moneybird als concept** → alleen draft in Moneybird (`POST` of `PATCH` sales invoice). Nooit automatisch verzenden.
4. **Bevestig factuur** (aparte knop + bevestigingsdialog) → `PATCH .../send_invoice.json`. Lokale status → `sent`, `moneybird_sync_status` → `verzonden`.

### Verwijderen / Crediteren

| Actie | Wanneer | Lokaal | Moneybird | Uren |
|---|---|---|---|---|
| **Verwijderen** | Concept (`draft`/`ready`), niet `verzonden` | Concept verwijderen | Optioneel `DELETE` concept | → `approved` (opnieuw factureerbaar) |
| **Crediteren** | `sent`/`paid` of Moneybird `verzonden` | Origineel → `gecrediteerd` + lokaal creditconcept | `PATCH .../duplicate_creditinvoice.json` (alleen concept) | Blijven `invoiced` |

Beide acties vereisen een expliciete Nederlandse bevestiging; nooit stilzwijgend verzenden.

SQL voor status `gecrediteerd`: [`supabase/invoice-draft-status-gecrediteerd.sql`](../supabase/invoice-draft-status-gecrediteerd.sql).

### Uren aanpassen ↔ factuurconcept

Als je in **Urenregistratie** een goedgekeurde of gefactureerde regel aanpast (`updateTimeEntryAction`):

- Open lokale concepten (`draft` / `ready`, niet verzonden) voor hetzelfde project worden herberekend uit goedgekeurde + gekoppelde uren.
- Er is **geen** auto-send naar Moneybird.
- Bestond er al een Moneybird-concept (nog niet verzonden): sync-status → `niet_gesynct` met melding *Concept verouderd — vernieuw vanuit uren*; vernieuw daarna via “Naar Moneybird als concept” / “Vernieuw Moneybird”.

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
5. **Facturatie** → concept → **Naar Moneybird als concept** → daarna optioneel **Bevestig factuur** (nooit casual/auto-send)
6. Uren wijzigen op een project met open concept → lokaal concept vernieuwt; Moneybird pas na expliciete vernieuw-sync
