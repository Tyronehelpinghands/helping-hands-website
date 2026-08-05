-- -----------------------------------------------------------------------------
-- Add invoice_drafts status: gecrediteerd
-- Run in Supabase SQL Editor (idempotent).
-- Required before Facturatie → Crediteren.
-- -----------------------------------------------------------------------------

do $$
declare
  constraint_name text;
begin
  -- Drop any existing status check on invoice_drafts (name may vary).
  for constraint_name in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'invoice_drafts'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%status%'
  loop
    execute format(
      'alter table public.invoice_drafts drop constraint %I',
      constraint_name
    );
  end loop;

  alter table public.invoice_drafts
    add constraint invoice_drafts_status_check
    check (
      status in (
        'draft',
        'ready',
        'sent',
        'paid',
        'cancelled',
        'gecrediteerd'
      )
    );
end $$;
