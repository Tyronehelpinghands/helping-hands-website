-- Helping Hands Agency — profiles tabel voor Supabase Auth rollen
-- Voer dit uit in de Supabase SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null check (
    role in ('admin', 'planner', 'medewerker', 'opdrachtgever')
  ),
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Alleen service role / admin tooling mag profielen aanmaken of wijzigen.
-- Maak accounts aan via Supabase Dashboard of een beveiligde server action.

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_profiles_updated_at();

-- Voorbeeld: profiel koppelen na handmatig aanmaken van een auth user
-- insert into public.profiles (id, email, role, full_name)
-- values ('USER_UUID', 'naam@voorbeeld.nl', 'medewerker', 'Voorbeeld Gebruiker');
