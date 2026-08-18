# Fooks uurkost (crew)

Werkgeverskost (`hourly_cost`) uit bruto uurloon × Fooks payrolling-factor.

**Bron:** Fooks sales voorstel R.E.R Productions — inclusief vakantiegeld, vakantiedagen, sociale lasten, verzuim.

| Tarief | Factor |
| --- | --- |
| WW Laag | 1,580 |
| WW Hoog | 1,635 |

**Formule:** `hourly_cost = round(bruto × factor, 2)`

## Regel

- Contract **Payroll** of **Vast (loondienst)** → bruto × 1,580 → automatische uurkost (server herberekenen). Override via “Handmatig uurkost”.
- **Freelance** → bruto × 1,635
- **ZZP** → vaste uurkost €25 excl. BTW
- **Overig** → uurkost handmatig

## Code & SQL

- Factoren: `src/lib/dashboard/fooksRates.ts`
- UI: `src/components/dashboard/mvp/CrewMvpClient.tsx`
- Mutaties: `createCrewMemberAction` / `updateCrewMemberAction` (schrijven altijd berekende `hourly_cost`)
- Financiën: `resolveUnitCost` in `src/lib/dashboard/financeOverview.ts` — prefer `hourly_cost` > 0, anders bruto × Fooks. Verstuurde facturen koppelen via project aan approved/invoiced uren.
- Kolommen: `gross_hourly_wage`, `fooks_ww_tariff` — migrate via [`supabase/crew-fooks-columns.sql`](../supabase/crew-fooks-columns.sql)
- Backfill bestaande rijen: [`supabase/crew-fooks-backfill-hourly-cost.sql`](../supabase/crew-fooks-backfill-hourly-cost.sql)
