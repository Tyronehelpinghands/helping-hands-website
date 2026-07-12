# Dashboard Sync Audit — Helping Hands

Datum: 12 juli 2026

## 1. Gecontroleerde routes

| Route | Status |
|-------|--------|
| `/dashboard/intern` | Cockpit met KPI-cards uit demo-modules |
| `/dashboard/intern/sales` | Actief (mock data) |
| `/dashboard/intern/leads` | Actief (Supabase + fallback) |
| `/dashboard/intern/projecten` | Actief (Supabase + fallback) |
| `/dashboard/intern/planning` | Actief (server data + Shiftbase) |
| `/dashboard/intern/crew` | Actief (demo lib) |
| `/dashboard/intern/urenregistratie` | Actief (demo lib) |
| `/dashboard/intern/facturatie` | Actief (demo lib + Moneybird API) |
| `/dashboard/intern/financien` | Actief (demo lib + Moneybird API) |
| `/dashboard/intern/risico-acties` | Actief (demo lib) |
| `/dashboard/intern/berichten` | Actief (demo lib) |
| `/dashboard/intern/instellingen` | Actief (demo lib) |
| `/dashboard/intern/risico` | Redirect → `/dashboard/intern/risico-acties` |

## 2. Gevonden problemen

- Navigatie verspreid over `intern-nav.ts` zonder centrale route-config
- Dubbele `MODULE_LINKS` in `riskActions.ts` en `messages.ts`
- Dubbele currency-formatters in 4 lib-bestanden
- Tarieven/reiskosten gedefinieerd in meerdere bestanden (`hours.ts`, `settings.ts`)
- Dashboard-overzicht gebruikte losse mock-data zonder koppeling aan modules
- Mock-data bevatte echte namen (Mesbah, Jaeden, Tyrone, Naomi)
- Geen gedeeld integratie-statuspanel
- `/dashboard/intern` ontbrak in `intern-page-meta.ts`
- `/api/kilometers/status` bestaat nog niet (Google Maps status)

## 3. Opgeloste problemen

- **Centrale navigatie:** `src/lib/dashboardNavigation.ts` met routes, sidebar-items en `MODULE_LINKS`
- **intern-nav.ts** herexporteert nu vanuit centrale config
- **Gedeelde helpers:** `src/lib/dashboardHelpers.ts` (formatCurrency, formatDate, statuskleuren, marge, btw)
- **Centrale tarieven:** `src/lib/rates.ts` — €0,25/km, 21% btw, 11 functietarieven
- **Lib-sync:** `hours.ts`, `invoicing.ts`, `finance.ts`, `settings.ts` gebruiken gedeelde helpers/tarieven
- **MODULE_LINKS:** `messages.ts` en `riskActions.ts` verwijzen naar centrale config
- **Dashboard cockpit:** `InternDashboardOverview` met KPI's uit demo-modules + aandachtspunten
- **IntegrationHealthPanel:** gedeeld component in intern dashboard, instellingen, facturatie, financiën
- **Demo-data:** fictieve namen (Demo Planner, Demo Crew, Demo Klant)
- **Page meta:** titel/subtitel voor `/dashboard/intern`

## 4. Nog openstaande punten

- Sales-dashboard nog volledig mock (`salesMockData`)
- Leads/projecten/planning: Supabase-koppeling deels, geen volledige sync tussen modules
- `/api/kilometers/status` nog niet gebouwd
- Gmail, WhatsApp, Supabase integraties: UI-only “Binnenkort”
- Echte auth/rollen nog niet afgedwongen op routes
- Audit logs en Supabase settings table nog niet geïmplementeerd
- Legacy `DashboardSidebar` (medewerker/opdrachtgever) heeft andere linkset — bewust gescheiden

## 5. Integratiestatus

| Integratie | API-route | Frontend |
|------------|-----------|----------|
| Shiftbase | `/api/shiftbase` | Statuscheck via IntegrationHealthPanel |
| Moneybird | `/api/moneybird/status`, `/contacts`, `/sales-invoices` | Server-side only, geen tokens in UI |
| Google Maps | `/api/kilometers/status` | Nog niet gebouwd — toont “Nog niet gebouwd” |
| HubSpot | `/api/hubspot/test` | Server-side only |
| Gmail | — | Binnenkort |
| WhatsApp | — | Binnenkort |
| Supabase | Client anon key (standaard) | Data voor leads/projecten |

## 6. Security checks

| Check | Resultaat |
|-------|-----------|
| Geen `NEXT_PUBLIC_MONEYBIRD` / `NEXT_PUBLIC_SHIFTBASE` / `NEXT_PUBLIC_GOOGLE_MAPS` | OK |
| Moneybird token alleen in `src/lib/server/moneybird.ts` | OK |
| Shiftbase token alleen in `src/lib/shiftbase.ts` + API routes | OK |
| Geen tokens in client components | OK |
| Geen Authorization Bearer hardcoded | OK |
| API calls via `/api/moneybird/*` en `/api/shiftbase/*` | OK |

**Env-variabelen (server-side):**
- `MONEYBIRD_ACCESS_TOKEN`, `MONEYBIRD_ADMINISTRATION_ID`, `MONEYBIRD_BASE_URL`
- `SHIFTBASE_API_TOKEN`, `SHIFTBASE_API_BASE_URL`
- `GOOGLE_MAPS_API_KEY` (voorbereid, endpoint nog niet gebouwd)

## 7. Build resultaat

`npm run build` — zie laatste run in CI/lokaal. Alle TypeScript- en importfouten uit deze sync zijn opgelost.

## 8. Advies volgende stap

1. Supabase settings + auth/rollen zodat alleen admin instellingen kan wijzigen
2. Bouw `/api/kilometers/status` met server-side Google Maps key
3. Koppel dashboard-KPI's aan echte Supabase-data i.p.v. losse mock
4. Gmail/WhatsApp Business API voor Berichten-module
5. Audit log voor instellingen- en communicatiewijzigingen
