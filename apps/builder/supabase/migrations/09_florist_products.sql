-- ============================================================
-- KALAMEKAR — Migrasi: slug floris + katalog produk floris
-- Murni ADDITIVE, aman dijalankan berulang (idempotent).
--
-- 1. Tambah kolom `slug` ke florists — dipakai URL profil publik
--    floris di /toko-bunga/[kota]/[floristSlug].
-- 2. Tabel florist_product_categories — taksonomi kategori produk,
--    dipakai bersama oleh semua floris (Buket, Papan Bunga, dst).
-- 3. Tabel florist_products — katalog produk milik tiap floris,
--    ditampilkan di halaman profil publiknya.
-- ============================================================

alter table public.florists add column if not exists slug text;

update public.florists
set slug = lower(regexp_replace(regexp_replace(trim(nama), '[^a-zA-Z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g'))
where slug is null;

create unique index if not exists florists_slug_idx on public.florists (slug);

-- ============================================================
-- Kategori produk floris (taxonomy publik, dipakai semua floris)
-- ============================================================
create table if not exists public.florist_product_categories (
  id         uuid primary key default gen_random_uuid(),
  nama       text not null unique,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

alter table public.florist_product_categories enable row level security;

drop policy if exists "publik baca kategori produk floris" on public.florist_product_categories;
create policy "publik baca kategori produk floris"
  on public.florist_product_categories
  for select
  to public
  using (true);

-- ============================================================
-- Produk milik floris, ditampilkan di halaman profil publik floris
-- ============================================================
create table if not exists public.florist_products (
  id          uuid primary key default gen_random_uuid(),
  florist_id  uuid not null references public.florists(id) on delete cascade,
  kategori_id uuid references public.florist_product_categories(id) on delete set null,
  nama        text not null,
  deskripsi   text,
  harga       integer not null,
  image_url   text,
  aktif       boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists florist_products_florist_id_idx on public.florist_products (florist_id);

alter table public.florist_products enable row level security;

drop policy if exists "publik baca produk floris aktif" on public.florist_products;
create policy "publik baca produk floris aktif"
  on public.florist_products
  for select
  to public
  using (aktif = true);
