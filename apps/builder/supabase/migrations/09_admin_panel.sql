-- ============================================================
-- KALAMEKAR — Migrasi Fase 4b: kolom pendukung panel admin (/admin)
-- Murni ADDITIVE, aman dijalankan berulang (idempotent).
--
-- Policy SELECT admin untuk orders & florists sudah ada di
-- 05_phase4_admin.sql (app_metadata.role = 'admin'). Kolom baru di
-- sini otomatis ikut ter-cover policy tsb. Tidak ada policy UPDATE
-- baru — semua mutasi dari /admin lewat Route Handler + service role,
-- sama pola dengan mutasi status/harga_final floris di Fase 2/5.
-- ============================================================

alter table public.orders
  add column if not exists internal_notes text;

alter table public.florists
  add column if not exists verified  boolean not null default false,
  add column if not exists kategori  text;
