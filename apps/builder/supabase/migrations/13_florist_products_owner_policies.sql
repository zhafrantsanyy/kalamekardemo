-- ============================================================
-- KALAMEKAR — Migrasi: floris kelola produk sendiri (dashboard mitra)
-- Murni ADDITIVE, aman dijalankan berulang (idempotent).
--
-- florist_products sebelumnya hanya punya policy publik baca produk
-- aktif (lihat 09_florist_products.sql). Floris butuh baca/tulis
-- produk miliknya sendiri (termasuk yang nonaktif) dari dashboard
-- mitra — pola sama seperti "floris update profil sendiri" di
-- florists.
-- ============================================================

drop policy if exists "floris baca produk sendiri" on public.florist_products;
create policy "floris baca produk sendiri"
  on public.florist_products
  for select
  to authenticated
  using (florist_id in (select id from public.florists where user_id = auth.uid()));

drop policy if exists "floris tambah produk sendiri" on public.florist_products;
create policy "floris tambah produk sendiri"
  on public.florist_products
  for insert
  to authenticated
  with check (florist_id in (select id from public.florists where user_id = auth.uid()));

drop policy if exists "floris update produk sendiri" on public.florist_products;
create policy "floris update produk sendiri"
  on public.florist_products
  for update
  to authenticated
  using (florist_id in (select id from public.florists where user_id = auth.uid()))
  with check (florist_id in (select id from public.florists where user_id = auth.uid()));

drop policy if exists "floris hapus produk sendiri" on public.florist_products;
create policy "floris hapus produk sendiri"
  on public.florist_products
  for delete
  to authenticated
  using (florist_id in (select id from public.florists where user_id = auth.uid()));
