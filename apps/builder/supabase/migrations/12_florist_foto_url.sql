-- ============================================================
-- KALAMEKAR — Migrasi: kolom foto profil floris
-- Murni ADDITIVE, aman dijalankan berulang (idempotent).
--
-- Kolom foto_url nullable — diisi lewat dashboard mitra
-- (ProfilFlorisForm). Selama kosong, storefront menampilkan ilustrasi
-- template buket/toko bunga bawaan (lihat FloristPhotoPlaceholder.js).
-- ============================================================

alter table public.florists add column if not exists foto_url text;
