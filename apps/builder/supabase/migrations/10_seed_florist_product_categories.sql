-- ============================================================
-- KALAMEKAR — Seed kategori produk floris (taksonomi, aman di production)
-- Aman dijalankan berulang kali (idempotent, on conflict do nothing).
-- ============================================================

insert into public.florist_product_categories (nama, slug)
values
  ('Buket', 'buket'),
  ('Papan Bunga', 'papan-bunga'),
  ('Karangan Duka Cita', 'karangan-duka-cita'),
  ('Hampers', 'hampers'),
  ('Dekorasi Pernikahan', 'dekorasi-pernikahan')
on conflict (slug) do nothing;
