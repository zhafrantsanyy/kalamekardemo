-- ============================================================
-- KALAMEKAR — Migrasi Fase 4: dashboard admin (/admin)
-- Murni ADDITIVE, aman dijalankan berulang (idempotent).
--
-- Sebelum ini, tidak ada policy SELECT untuk role admin di orders
-- maupun florists (yang ada cuma "baca milik sendiri"). Admin butuh
-- baca semua baris untuk daftar order & kelola floris. Mutasi (assign
-- floris, override status, buat/toggle floris) tetap lewat Route
-- Handler dengan service role + cek app_metadata.role === 'admin',
-- SELECT saja yang dibuka lewat RLS supaya halaman admin bisa query
-- langsung pakai anon key + sesi (bukan service role di Server
-- Component).
-- ============================================================

drop policy if exists "admin baca semua order" on public.orders;
create policy "admin baca semua order"
  on public.orders
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin baca semua floris" on public.florists;
create policy "admin baca semua floris"
  on public.florists
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
