# Uren & kilometers — één ecosysteem

Bron van waarheid: **`public.time_entries`** (kolommen `hours`, `kilometers`, `travel_time_hours`, `status`).  
Geen aparte kilometers-tabel. Intern, medewerkers en opdrachtgevers lezen/schrijven dezelfde rijen via server actions + RLS.

## Dataflow

```
Medewerker (portaal)
  → dient uren + km in / bewerkt concept|ingediend|afgekeurd
  → of vraagt correctie aan (incl. gewenste km) bij goedgekeurd
        ↓
Intern dashboard (/dashboard/intern/urenregistratie)
  → goedkeuren / afkeuren / bewerken
  → factuurconcept met arbeidsregels + Kilometervergoeding (km_rate)
  → Moneybird ledgers (sitecrew / horeca / km)
        ↓
Opdrachtgever (portaal)
  → ziet submitted / approved / invoiced uren + km per project/datum (read-only)
```

## SQL die je moet uitvoeren

1. Basis (als nog niet gedaan): schema in [`internal-dashboard-database.md`](./internal-dashboard-database.md)
2. Crew RLS: [`supabase/employee-portal.sql`](../supabase/employee-portal.sql)
3. App helpers (`my_client_id`): [`supabase/helping-hands-app.sql`](../supabase/helping-hands-app.sql) of [`supabase/clients-profile-id.sql`](../supabase/clients-profile-id.sql)
4. **Nieuw — portal ecosystem:** [`supabase/hours-km-ecosystem.sql`](../supabase/hours-km-ecosystem.sql)

Plak stap 4 in de Supabase SQL Editor en run. Idempotent.

## Portalen

| Portaal | Route | Rechten |
|---|---|---|
| Medewerkers | `/portaal/medewerkers/uren` | Eigen rijen: insert/update; correctie bij approved |
| Intern | `/dashboard/intern/urenregistratie` | Full CRUD + approve/reject + facturatie |
| Opdrachtgevers | `/portaal/opdrachtgevers/uren` | Select op projecten van `my_client_id()`; statuses submitted/approved/invoiced |

## Code

- Shared helpers: `src/lib/time-entries/shared.ts`
- Medewerker actions: `submitOwnTimeEntryAction`, `updateOwnTimeEntryAction`, `submitHoursCorrectionAction`
- Client data: `src/lib/client-portal/data.ts` → `getClientPortalHoursBundle`
- Intern: bestaande `create/update/approve/rejectTimeEntryAction` + invoice builders

## Capacitor / app

De native shell laadt de live site (`docs/capacitor-app.md`). Geen aparte uren-API nodig: Auth + deze portals werken in de WebView zodra productie is gedeployed.
