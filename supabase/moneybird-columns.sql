-- -----------------------------------------------------------------------------
-- Moneybird sync columns (idempotent)
-- Paste into Supabase SQL Editor if clients / invoice_drafts exist without
-- Moneybird fields. Required before Facturatie → Moneybird and for editing
-- invoiced hours (Aanpassen) that check moneybird_invoice_id.
-- Source: docs/internal-dashboard-database.md — Migration: Moneybird sync columns
-- -----------------------------------------------------------------------------

-- Moneybird contact id on public.clients
alter table public.clients
  add column if not exists moneybird_contact_id text;

create unique index if not exists clients_moneybird_contact_id_uidx
  on public.clients (moneybird_contact_id)
  where moneybird_contact_id is not null;

-- Moneybird sync metadata on public.invoice_drafts
alter table public.invoice_drafts
  add column if not exists moneybird_invoice_id text;

alter table public.invoice_drafts
  add column if not exists moneybird_sync_status text not null default 'niet_gesynct';

alter table public.invoice_drafts
  add column if not exists moneybird_synced_at timestamptz;

alter table public.invoice_drafts
  add column if not exists moneybird_sync_error text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'invoice_drafts_moneybird_sync_status_check'
  ) then
    alter table public.invoice_drafts
      add constraint invoice_drafts_moneybird_sync_status_check
      check (
        moneybird_sync_status in (
          'niet_gesynct',
          'concept',
          'verzonden',
          'fout'
        )
      );
  end if;
end $$;

create unique index if not exists invoice_drafts_moneybird_invoice_id_uidx
  on public.invoice_drafts (moneybird_invoice_id)
  where moneybird_invoice_id is not null;
