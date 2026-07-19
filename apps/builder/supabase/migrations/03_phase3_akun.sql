-- ============================================================
-- KALAMEKAR — Migrasi Fase 3: dashboard pembeli (/akun)
-- Murni ADDITIVE, aman dijalankan berulang (idempotent).
-- ============================================================

-- ============================================================
-- 1. Tabel klaim_attempts — rate-limit klaim order guest.
--    Hanya diakses lewat route handler (service role); RLS aktif
--    TANPA policy sama sekali supaya anon/authenticated tidak bisa
--    baca/tulis langsung.
-- ============================================================
create table if not exists public.klaim_attempts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists klaim_attempts_user_created_idx
  on public.klaim_attempts (user_id, created_at);

alter table public.klaim_attempts enable row level security;

-- ============================================================
-- 2. Aktifkan Realtime untuk orders — dipakai tracking live di
--    /akun/pesanan/[id]. Client subscribe dengan JWT pembeli, jadi
--    tetap dibatasi policy SELECT "pembeli baca order sendiri" yang
--    sudah ada (Realtime Supabase menghormati RLS tabel sumber).
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end $$;
