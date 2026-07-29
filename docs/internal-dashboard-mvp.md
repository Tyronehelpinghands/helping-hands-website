# Internal dashboard MVP — Helping Hands Agency

Werkbaar CRM / planning / uren / facturatie-MVP op echte Supabase-data.

## SQL die je moet draaien

1. Auth setup (als nog niet gedaan): [`supabase-auth-setup.md`](./supabase-auth-setup.md)
2. Dashboard-tabellen + RLS: [`internal-dashboard-database.md`](./internal-dashboard-database.md)

Zonder stap 2 tonen modules **lege staten** + een melding om de SQL te draaien. Geen nep-KPI’s.

**Conflict:** als je al een legacy `projects` / `sales_leads` tabel hebt met andere kolommen, hernoem of drop die (na backup) vóór het nieuwe script.

## Tabellen

| Tabel | Doel |
| --- | --- |
| `clients` | Opdrachtgevers |
| `leads` | Sales leads |
| `crew_members` | Crew (geen BSN/IBAN) |
| `projects` | Opdrachten |
| `shifts` | Planning |
| `time_entries` | Uren |
| `invoice_drafts` | Factuurconcepten |
| `invoice_draft_lines` | Factuurregels |
| `tasks` | Risico & acties |
| `internal_messages` | Berichtconcepten |
| `company_settings` | Tarieven / bedrijf / e-mail |

RLS: alleen internal roles via `get_my_role()` / `is_internal_role()`.

## Modules die werken

| Route | Functionaliteit |
| --- | --- |
| `/dashboard/intern` | KPI’s uit Supabase, snelle acties, open uren/taken |
| `/dashboard/intern/sales` | Opdrachtgevers + leads CRUD |
| `/dashboard/intern/leads` | Leads CRUD, status, follow-up |
| `/dashboard/intern/projecten` | Projecten CRUD + detail (shifts/uren/facturen/taken) |
| `/dashboard/intern/planning` | Weeklijst, shift aanmaken, crew toewijzen |
| `/dashboard/intern/crew` | Crew CRUD, skills, kosten + Shiftbase medewerkers-sync |
| `/dashboard/intern/urenregistratie` | Uren invoeren, berekenen, approve/reject |
| `/dashboard/intern/facturatie` | Concept uit goedgekeurde uren, CSV-export |
| `/dashboard/intern/financien` | Aggregaten uit concepten/uren (geen fake charts) |
| `/dashboard/intern/risico-acties` | Taken CRUD |
| `/dashboard/intern/berichten` | Concepten + kopieer / mailto / wa.me |
| `/dashboard/intern/integraties` | Eerlijke status Actief/Voorbereid/Ontbreekt |
| `/dashboard/intern/instellingen` | `company_settings` opslaan |

Code: `src/lib/dashboard/*` + `src/components/dashboard/mvp/*`.

## Kernflow

1. Opdrachtgever (`clients`)
2. Lead (`leads`) — optioneel
3. Project (`projects`)
4. Crew (`crew_members`)
5. Shift (`shifts`) + toewijzing
6. Uren (`time_entries`) → **approve**
7. Factuurconcept (`invoice_drafts` + lines) uit approved uren
8. CSV-export

## Uren goedkeuren

- Statusflow: `draft` → `submitted` → `approved` | `rejected` → `invoiced`
- Alleen interne rollen (planner/finance/owner/admin) via `requireRole`
- Reject vereist correctiereden
- Medewerkersportaal keurt **niet** goed in deze MVP

## Factuurconcepten

- Alleen uit `approved` uren van één project
- Regels: arbeidsuren, km (km_rate), reistijd
- BTW uit `company_settings.rates.vat_percent` (default 21%)
- Uren worden daarna `invoiced`
- **Geen** automatische Moneybird-verzending

## Rollen

| Rol | Mutaties |
| --- | --- |
| owner / admin | Alles (settings alleen owner/admin) |
| sales | clients, leads, projects |
| planner | projects, crew, shifts, hours |
| finance | hours, invoices, finances |
| crew / client | Geen toegang tot intern dashboard |

Layout blijft `requireRole(internalRoles)`. Mutaties checken opnieuw server-side.

## Standaardtarieven (defaults)

- km: `0.25`
- btw: `21`
- site crew / horeca allround: `31.50`
- keukenhulp: `32.50`
- zelfstandig kok: `40.00`
- teamcaptain: `42.50`

## Integraties — status

| Integratie | Status |
| --- | --- |
| Supabase Auth | Actief |
| Supabase Database | Actief na SQL |
| Resend / contact | Actief indien key + route |
| Shiftbase | Actief (shifts + medewerkers-sync via `/api/shiftbase/sync-employees`) |
| Moneybird | Voorbereid (geen auto-send) |
| WhatsApp | Voorbereid (+ wa.me) |
| Gmail | Voorbereid (+ mailto) |

## Data-laag

- `src/lib/dashboard/types.ts`
- `src/lib/dashboard/queries.ts` — leest; lege array bij ontbrekende tabellen
- `src/lib/dashboard/mutations.ts` — `"use server"` + `requireRole`
- `src/lib/dashboard/calculations.ts` — uren / factuurtotalen / marge
- `src/lib/dashboard/formatters.ts` — NL labels + CSV

## Security

- Geen service role in client
- Geen secrets in frontend
- Geen localStorage als database
- Geen demo-KPI bypass
- Geen BSN/IBAN in MVP-tabellen
