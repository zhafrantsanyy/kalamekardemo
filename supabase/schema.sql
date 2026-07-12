-- ============================================================
-- KALAMEKAR — Skema database Supabase (Fase 1 / Concierge)
-- Jalankan seluruh file ini di Supabase: SQL Editor -> New query -> Run
-- ============================================================

-- Tabel pesanan: satu baris per order dari website.
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  kode         text not null,
  created_at   timestamptz not null default now(),

  -- data penerima & pengiriman
  nama         text not null,
  wa           text,
  alamat       text not null,
  tanggal      date not null,
  waktu        text,
  kartu        text,
  metode_bayar text,

  -- rancangan buket/krans (state kanvas disimpan utuh sebagai JSON)
  mode         text not null check (mode in ('bouquet', 'wreath')),
  ukuran       text not null,
  wrapping     text,
  ring_dasar   text,
  items        jsonb not null default '[]'::jsonb,

  -- harga (dalam Rupiah, integer)
  subtotal     integer not null,
  ongkir       integer not null,
  total        integer not null,

  -- orkestrasi manual: kamu update kolom ini dari Table Editor
  status       text not null default 'baru'
               check (status in ('baru','matching','dikonfirmasi','dirakit','diantar','selesai','batal')),
  floris       text,
  catatan_ops  text
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx     on public.orders (status);

-- ------------------------------------------------------------
-- Row Level Security:
-- pengunjung (anon key) HANYA boleh membuat pesanan,
-- tidak bisa membaca/mengubah/menghapus data pesanan siapa pun.
-- Kamu membaca & meng-update pesanan lewat Supabase Dashboard
-- (Table Editor), yang memakai akses service — bukan anon key.
-- ------------------------------------------------------------
alter table public.orders enable row level security;

drop policy if exists "anon dapat membuat pesanan" on public.orders;
create policy "anon dapat membuat pesanan"
  on public.orders
  for insert
  to anon
  with check (true);

-- Sengaja TIDAK ada policy select/update/delete untuk anon.

-- ============================================================
-- OPSIONAL — Fondasi Fase 2 (Otomasi). Belum dipakai frontend,
-- tapi aman dijalankan sekarang bila ingin siap-siap.
-- ============================================================

-- PostGIS untuk geo-matching radius floris di Fase 2.
-- create extension if not exists postgis;

-- create table if not exists public.florists (
--   id         uuid primary key default gen_random_uuid(),
--   nama       text not null,
--   area       text,
--   wa         text,
--   rating     numeric(2,1) default 5.0,
--   aktif      boolean default true,
--   lokasi     geography(point, 4326),   -- untuk query radius PostGIS
--   created_at timestamptz default now()
-- );
-- alter table public.florists enable row level security;
