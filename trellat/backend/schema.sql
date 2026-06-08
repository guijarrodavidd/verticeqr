-- ============================================================
--  ROMANSSERA · COMPTABILITAT — Esquema Supabase (Fase 0)
--  Multi-local · Login del propietari · Row Level Security
--
--  COM EXECUTAR-LO:
--    Supabase → SQL Editor → New query → enganxa tot → Run
-- ============================================================

-- ───────────────────────────────────────────────
-- 1) LOCALS + MEMBRES (multi-local)
-- ───────────────────────────────────────────────
create table if not exists public.locales (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  slug        text unique not null,
  iva_ventas  numeric not null default 10,        -- % IVA hostaleria
  created_at  timestamptz not null default now()
);

create table if not exists public.local_members (
  local_id  uuid references public.locales(id) on delete cascade,
  user_id   uuid references auth.users(id) on delete cascade,
  rol       text not null default 'owner',         -- 'owner' | 'gestor' | 'staff'
  primary key (local_id, user_id)
);

-- ───────────────────────────────────────────────
-- 2) VENDES (les genera la carta digital)
-- ───────────────────────────────────────────────
create table if not exists public.ventas (
  id          uuid primary key default gen_random_uuid(),
  local_id    uuid not null references public.locales(id) on delete cascade,
  ts          timestamptz not null default now(),
  mesa        text,
  total       numeric not null default 0,
  metodo_pago text,                                -- 'efectivo' | 'tarjeta' | null
  origen      text not null default 'carta',       -- 'carta' | 'manual' | 'tpv'
  items       jsonb not null default '[]',
  created_at  timestamptz not null default now()
);
create index if not exists ventas_local_ts on public.ventas(local_id, ts);

-- ───────────────────────────────────────────────
-- 3) DESPESES
-- ───────────────────────────────────────────────
create table if not exists public.gastos (
  id         uuid primary key default gen_random_uuid(),
  local_id   uuid not null references public.locales(id) on delete cascade,
  fecha      date not null default current_date,
  proveedor  text,
  concepto   text,
  categoria  text,
  base       numeric not null default 0,
  iva_pct    numeric not null default 10,
  recur_id   uuid,                                 -- si ve d'una despesa fixa
  created_at timestamptz not null default now()
);
create index if not exists gastos_local_fecha on public.gastos(local_id, fecha);

-- ───────────────────────────────────────────────
-- 4) DESPESES FIXES (recurrents)
-- ───────────────────────────────────────────────
create table if not exists public.fijos (
  id        uuid primary key default gen_random_uuid(),
  local_id  uuid not null references public.locales(id) on delete cascade,
  dia       int not null default 1,
  concepto  text,
  categoria text,
  base      numeric not null default 0,
  iva_pct   numeric not null default 10,
  activo    boolean not null default true
);

-- ───────────────────────────────────────────────
-- 5) CATEGORIES de despesa
-- ───────────────────────────────────────────────
create table if not exists public.categorias (
  id        uuid primary key default gen_random_uuid(),
  local_id  uuid not null references public.locales(id) on delete cascade,
  nombre    text not null
);

-- ───────────────────────────────────────────────
-- 6) ARQUEIGS (tancament de caixa)
-- ───────────────────────────────────────────────
create table if not exists public.arqueos (
  id          uuid primary key default gen_random_uuid(),
  local_id    uuid not null references public.locales(id) on delete cascade,
  fecha       date not null,
  efectivo    numeric not null default 0,
  tarjeta     numeric not null default 0,
  registrado  numeric not null default 0,
  descuadre   numeric not null default 0,
  created_at  timestamptz not null default now(),
  unique (local_id, fecha)
);

-- ============================================================
--  ROW LEVEL SECURITY  (cada propietari només veu el seu local)
-- ============================================================
alter table public.locales       enable row level security;
alter table public.local_members enable row level security;
alter table public.ventas        enable row level security;
alter table public.gastos        enable row level security;
alter table public.fijos         enable row level security;
alter table public.categorias    enable row level security;
alter table public.arqueos       enable row level security;

-- Funció auxiliar: locals als quals pertany l'usuari actual.
-- SECURITY DEFINER evita recursió de polítiques sobre local_members.
create or replace function public.my_locales()
returns setof uuid
language sql security definer stable
set search_path = public
as $$
  select local_id from public.local_members where user_id = auth.uid();
$$;

-- LOCALS: el membre veu el seu local
drop policy if exists "membres veuen el seu local" on public.locales;
create policy "membres veuen el seu local" on public.locales
  for select using (id in (select public.my_locales()));

-- MEMBRES: l'usuari veu les seues pertinences
drop policy if exists "veure pertinences propies" on public.local_members;
create policy "veure pertinences propies" on public.local_members
  for select using (user_id = auth.uid());

-- Taules amb local_id: accés total només per a membres del local
do $$
declare t text;
begin
  foreach t in array array['ventas','gastos','fijos','categorias','arqueos'] loop
    execute format('drop policy if exists "membres gestionen %1$s" on public.%1$s;', t);
    execute format($f$
      create policy "membres gestionen %1$s" on public.%1$s
        for all
        using (local_id in (select public.my_locales()))
        with check (local_id in (select public.my_locales()));
    $f$, t);
  end loop;
end $$;

-- VENDES: la carta (clients sense login) pot INSERIR si el local existix.
-- La LECTURA segueix sent privada (només membres). Es pot endurir més avant
-- amb una Edge Function si cal evitar inserts no desitjats.
drop policy if exists "carta pot inserir vendes" on public.ventas;
create policy "carta pot inserir vendes" on public.ventas
  for insert to anon, authenticated
  with check (exists (select 1 from public.locales l where l.id = local_id));

-- ============================================================
--  LLAVOR (executa-ho DESPRÉS de registrar el teu usuari)
--  1) Crea el local i apunta'n l'id:
--       insert into public.locales (nombre, slug)
--       values ('Romanssera Tapasseria','romanssera') returning id;
--  2) Mira el teu user id a:  Authentication → Users
--  3) Vincula't com a propietari:
--       insert into public.local_members (local_id, user_id, rol)
--       values ('<LOCAL_ID>', '<USER_ID>', 'owner');
--  4) (Opcional) Categories per defecte:
--       insert into public.categorias (local_id, nombre)
--       select '<LOCAL_ID>', x from unnest(array[
--         'Compres / Gènere','Begudes','Subministraments','Lloguer',
--         'Personal','Gestoria','Màrqueting','Assegurances','Altres']) as x;
-- ============================================================
