-- ============================================================
-- KALAMEKAR — Migrasi Fase Papan Bunga (Phase 5)
-- Murni ADDITIVE kecuali dua relaksasi constraint yang dijelaskan
-- di bawah (poin 2 & 3) — keduanya aman dijalankan berulang
-- (idempotent) dan tidak mengubah perilaku order krans/buket yang
-- sudah ada (app tetap selalu mengisi kolom itu untuk krans/buket).
-- ============================================================

-- ============================================================
-- 1. product_type — diskriminator eksplisit tipe produk order,
--    menggantikan `mode` sebagai sumber kebenaran ke depan (mode
--    tetap ada untuk kompatibilitas data lama & canvas krans/buket).
-- ============================================================
alter table public.orders
  add column if not exists product_type text;

update public.orders
   set product_type = case mode when 'bouquet' then 'buket' when 'wreath' then 'krans' else product_type end
 where product_type is null and mode is not null;

alter table public.orders
  alter column product_type set not null;

alter table public.orders
  drop constraint if exists orders_product_type_check;
alter table public.orders
  add constraint orders_product_type_check check (product_type in ('krans', 'buket', 'papan_bunga'));

create index if not exists orders_product_type_idx on public.orders (product_type);

-- ============================================================
-- 2. `mode` — papan bunga tidak punya konsep bouquet/wreath, jadi
--    kolom ini harus boleh NULL untuk order papan_bunga. Nilainya
--    tetap wajib (not null, bouquet/wreath) untuk product_type
--    krans/buket karena canvas Stage masih membacanya.
-- ============================================================
alter table public.orders
  alter column mode drop not null;

alter table public.orders
  drop constraint if exists orders_mode_check;
alter table public.orders
  add constraint orders_mode_check check (mode is null or mode in ('bouquet', 'wreath'));

-- ============================================================
-- 3. subtotal/ongkir/total — papan bunga TIDAK PERNAH punya harga
--    pasti di titik checkout (lihat harga_estimasi_min/max & harga_final
--    di bawah). Kolom-kolom ini jadi nullable; krans/buket tetap
--    selalu mengisinya (app tidak berubah untuk mereka).
-- ============================================================
alter table public.orders
  alter column subtotal drop not null,
  alter column ongkir drop not null,
  alter column total drop not null;

-- ============================================================
-- 4. Kolom baru khusus papan bunga.
-- ============================================================
alter table public.orders
  add column if not exists papan_bunga_config    jsonb,
  add column if not exists harga_estimasi_min     integer,
  add column if not exists harga_estimasi_max     integer,
  add column if not exists harga_final            integer,
  add column if not exists desain_preview_url     text;

-- Sengaja TIDAK ada policy UPDATE untuk anon/authenticated pada
-- harga_final — hanya diisi lewat Route Handler (service role) di
-- /api/mitra/orders/[id]/harga, sama seperti pola foto_rakitan_url
-- & status di migrasi Fase 2.

-- ============================================================
-- 5. Storage bucket untuk preview render papan bunga (hasil
--    canvas.toBlob() di builder, diupload SEBELUM user login —
--    checkout papan bunga tetap guest checkout seperti krans/buket,
--    jadi policy insert-nya anon, sama presedennya dengan policy
--    "anon dapat membuat pesanan" di schema.sql).
-- ============================================================
insert into storage.buckets (id, name, public)
values ('papan-bunga-preview', 'papan-bunga-preview', true)
on conflict (id) do nothing;

drop policy if exists "anon upload preview papan bunga" on storage.objects;
create policy "anon upload preview papan bunga"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'papan-bunga-preview');

drop policy if exists "publik baca preview papan bunga" on storage.objects;
create policy "publik baca preview papan bunga"
  on storage.objects
  for select
  to public
  using (bucket_id = 'papan-bunga-preview');
