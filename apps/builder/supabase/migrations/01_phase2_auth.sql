-- ============================================================
-- KALAMEKAR — Migrasi Fase 2 (awal): fondasi auth & dashboard
-- Jalankan SETELAH schema.sql (di file yang sama, folder ../schema.sql).
-- Jalankan seluruh file ini di Supabase: SQL Editor -> New query -> Run.
-- Migrasi ini murni ADDITIVE — tidak mengubah/menghapus apa pun dari
-- schema.sql, dan tidak mengganggu insert anon (guest checkout) yang
-- sudah ada di tabel orders.
-- ============================================================

-- ============================================================
-- 1. Tabel florists — akun mitra floris (dibuat admin, bukan self-signup)
-- ============================================================
create table if not exists public.florists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique references auth.users(id) on delete set null,
  nama       text not null,
  area       text,
  wa         text,
  rating     numeric(2,1) default 5.0,
  aktif      boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.florists enable row level security;

drop policy if exists "floris baca profil sendiri" on public.florists;
create policy "floris baca profil sendiri"
  on public.florists
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "floris update profil sendiri" on public.florists;
create policy "floris update profil sendiri"
  on public.florists
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Directory publik floris aktif (dipakai halaman toko-bunga/kota nanti).
-- Catatan: RLS hanya bisa membatasi baris, bukan kolom — jika suatu saat
-- perlu menyembunyikan kolom tertentu (mis. wa) dari publik, buat view
-- terpisah alih-alih menambah kolom sensitif ke sini.
drop policy if exists "anon baca floris aktif" on public.florists;
create policy "anon baca floris aktif"
  on public.florists
  for select
  to anon
  using (aktif = true);

-- ============================================================
-- 2. Tabel profiles — data tambahan pembeli yang login
-- ============================================================
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  nama            text,
  wa              text,
  alamat_default  text,
  created_at      timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "user baca profil sendiri" on public.profiles;
create policy "user baca profil sendiri"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "user insert profil sendiri" on public.profiles;
create policy "user insert profil sendiri"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

drop policy if exists "user update profil sendiri" on public.profiles;
create policy "user update profil sendiri"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Auto-create baris profiles setiap kali ada user baru daftar.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 3. Kolom baru di orders untuk auth & alur mitra
-- ============================================================
alter table public.orders
  add column if not exists user_id           uuid references auth.users(id),
  add column if not exists floris_id         uuid references public.florists(id),
  add column if not exists foto_rakitan_url  text,
  add column if not exists foto_disetujui    boolean not null default false,
  add column if not exists status_log        jsonb not null default '[]'::jsonb;

-- ------------------------------------------------------------
-- Policy SELECT baru. Policy INSERT anon yang sudah ada di
-- schema.sql TIDAK diubah/dihapus.
--
-- Sengaja TIDAK ada policy UPDATE untuk floris di sini — mutasi
-- status hanya lewat Route Handler (service role) di Fase 2, supaya
-- transisi status tervalidasi di server.
-- ------------------------------------------------------------
drop policy if exists "pembeli baca order sendiri" on public.orders;
create policy "pembeli baca order sendiri"
  on public.orders
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "floris baca order miliknya" on public.orders;
create policy "floris baca order miliknya"
  on public.orders
  for select
  to authenticated
  using (
    floris_id in (select id from public.florists where user_id = auth.uid())
  );

-- ============================================================
-- 4. Storage bucket untuk foto rakitan
-- ============================================================
insert into storage.buckets (id, name, public)
values ('foto-rakitan', 'foto-rakitan', true)
on conflict (id) do nothing;

drop policy if exists "authenticated upload foto rakitan" on storage.objects;
create policy "authenticated upload foto rakitan"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'foto-rakitan');

drop policy if exists "publik baca foto rakitan" on storage.objects;
create policy "publik baca foto rakitan"
  on storage.objects
  for select
  to public
  using (bucket_id = 'foto-rakitan');
