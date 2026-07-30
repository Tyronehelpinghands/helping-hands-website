-- =============================================================================
-- HOTFIX: clients.profile_id (opdrachtgeversportaal invites)
-- Paste in: Supabase → SQL Editor → Run
-- Prerequisite: public.profiles exists (docs/supabase-auth-setup.md)
-- Full app SQL (optional after this): supabase/helping-hands-app.sql
-- =============================================================================

-- Link clients to auth profiles
alter table public.clients
  add column if not exists profile_id uuid references public.profiles (id) on delete set null;

create unique index if not exists clients_profile_id_uidx
  on public.clients (profile_id)
  where profile_id is not null;

-- Resolve current user's client id (profile link or e-mail match)
create or replace function public.my_client_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select c.id
  from public.clients c
  left join public.profiles p on p.id = auth.uid()
  where c.profile_id = auth.uid()
     or (
       c.email is not null
       and p.email is not null
       and lower(c.email) = lower(p.email)
     )
  order by case when c.profile_id = auth.uid() then 0 else 1 end
  limit 1;
$$;

grant execute on function public.my_client_id() to authenticated;

-- Allow opdrachtgever to read their own client row
drop policy if exists "Client select own client row" on public.clients;
create policy "Client select own client row"
  on public.clients for select to authenticated
  using (id = public.my_client_id() or profile_id = auth.uid());
