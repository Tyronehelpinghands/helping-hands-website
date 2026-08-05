-- =============================================================================
-- Fooks payrolling columns + employment_type "vast" on public.crew_members
-- Paste in: Supabase → SQL Editor → Run
-- Prerequisite: public.crew_members (docs/internal-dashboard-database.md)
--
-- Factors (Fooks sales voorstel R.E.R Productions):
--   WW Laag 1,580 · WW Hoog 1,635
--   uurkost = round(bruto * factor, 2)
--
-- Derived from employment_type (UI has no WW select):
--   vast / payroll → WW Laag 1,580  (fooks_ww_tariff = 'laag')
--   freelance      → WW Hoog 1,635  (fooks_ww_tariff = 'hoog')
--   zzp            → fixed €25 excl. btw (fooks_ww_tariff = null)
--   other          → manual hourly_cost (fooks_ww_tariff = null)
-- fooks_ww_tariff remains as stored derived value for audit.
-- =============================================================================

-- Allow Vast (loondienst) alongside payroll / zzp / freelance / other
alter table public.crew_members
  drop constraint if exists crew_members_employment_type_check;

alter table public.crew_members
  add constraint crew_members_employment_type_check
  check (
    employment_type in ('payroll', 'vast', 'zzp', 'freelance', 'other')
  );

-- Bruto uurloon (before Fooks factor) for edit re-display
alter table public.crew_members
  add column if not exists gross_hourly_wage numeric;

-- Derived Fooks WW tariff for audit: 'laag' | 'hoog' | null
alter table public.crew_members
  add column if not exists fooks_ww_tariff text;

alter table public.crew_members
  drop constraint if exists crew_members_fooks_ww_tariff_check;

alter table public.crew_members
  add constraint crew_members_fooks_ww_tariff_check
  check (
    fooks_ww_tariff is null
    or fooks_ww_tariff in ('laag', 'hoog')
  );
