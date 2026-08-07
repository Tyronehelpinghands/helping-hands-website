# Fooks uurkost (crew)

Werkgeverskost (`hourly_cost`) uit bruto uurloon × Fooks payrolling-factor.

**Bron:** Fooks sales voorstel R.E.R Productions — inclusief vakantiegeld, vakantiedagen, sociale lasten, verzuim.

| Tarief | Factor |
| --- | --- |
| WW Laag | 1,580 |
| WW Hoog | 1,635 |

**Formule:** `hourly_cost = round(bruto × factor, 2)`

## Wanneer

- Contract **Payroll** of **Vast (loondienst)** → bruto + Fooks-tarief → automatische uurkost (server herberekenen). Override via “Handmatig uurkost”.
- **ZZP / Freelance / Overig** → uurkost handmatig (geen Fooks-factor).

## Code & SQL

- Factoren: `src/lib/dashboard/fooksRates.ts`
- UI: `src/components/dashboard/mvp/CrewMvpClient.tsx`
- Mutaties: `createCrewMemberAction` / `updateCrewMemberAction`
- Financiën: `hours × hourly_cost` → personeelskosten in `src/lib/dashboard/financeOverview.ts`
- Kolommen: `gross_hourly_wage`, `fooks_ww_tariff` — migrate via [`supabase/crew-fooks-columns.sql`](../supabase/crew-fooks-columns.sql)
