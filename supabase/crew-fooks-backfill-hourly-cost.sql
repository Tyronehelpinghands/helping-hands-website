-- =============================================================================
-- Backfill crew_members.hourly_cost from bruto × Fooks when uurkost is missing
-- Paste in: Supabase → SQL Editor → Run
-- Prerequisite: supabase/crew-fooks-columns.sql (gross_hourly_wage + vast type)
--
-- Factors: vast/payroll → × 1.580 · freelance → × 1.635 · zzp → €25
-- =============================================================================

-- Ensure Fooks columns exist (idempotent)
alter table public.crew_members
  add column if not exists gross_hourly_wage numeric;

alter table public.crew_members
  add column if not exists fooks_ww_tariff text;

-- Vast/payroll: bruto × 1.580
update public.crew_members
set
  hourly_cost = round(gross_hourly_wage * 1.580, 2),
  fooks_ww_tariff = 'laag'
where employment_type in ('vast', 'payroll')
  and gross_hourly_wage is not null
  and gross_hourly_wage > 0
  and (hourly_cost is null or hourly_cost <= 0);

-- Freelance: bruto × 1.635
update public.crew_members
set
  hourly_cost = round(gross_hourly_wage * 1.635, 2),
  fooks_ww_tariff = 'hoog'
where employment_type = 'freelance'
  and gross_hourly_wage is not null
  and gross_hourly_wage > 0
  and (hourly_cost is null or hourly_cost <= 0);

-- ZZP: fixed €25 excl. BTW
update public.crew_members
set
  hourly_cost = 25,
  fooks_ww_tariff = null
where employment_type = 'zzp'
  and (hourly_cost is null or hourly_cost <= 0);

-- Quick check (optional)
-- select full_name, employment_type, gross_hourly_wage, hourly_cost
-- from public.crew_members
-- where full_name ilike '%fabrice%';
