-- English Path: tabla para sincronizar el progreso entre dispositivos.
-- Ejecútalo una sola vez en Supabase: SQL Editor → New query → pega esto → Run.

create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade default auth.uid(),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Permisos para usuarios con sesión iniciada (los proyectos nuevos de Supabase no los dan solos).
-- Los visitantes sin sesión (anon) no reciben ningún permiso.
grant usage on schema public to authenticated;
grant select, insert, update on public.progress to authenticated;


-- Cada usuario solo puede ver y modificar su propia fila.
drop policy if exists "leer mi progreso" on public.progress;
create policy "leer mi progreso" on public.progress
  for select using (auth.uid() = user_id);

drop policy if exists "crear mi progreso" on public.progress;
create policy "crear mi progreso" on public.progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "actualizar mi progreso" on public.progress;
create policy "actualizar mi progreso" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
