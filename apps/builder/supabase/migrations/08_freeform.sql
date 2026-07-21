-- ============================================================
-- KALAMEKAR — Migrasi Fase Free-form Canvas (Phase mode ke-4)
-- Murni ADDITIVE. Order mode ini SENGAJA tidak butuh kolom baru:
--
--   - `wrapping`  : reuse kolom yang sama dipakai krans/buket, isi
--                   dengan wrapId terpilih (WRAPS di catalog.js).
--   - `items`     : reuse kolom jsonb yang sama, isi array
--                   composition.items ({ instanceId, skuId, category,
--                   x, y, rotation, scale, zIndex }) — bentuk beda
--                   dari krans/buket ({ type, x, y, size, rot }) tapi
--                   kolomnya jsonb generik, tidak butuh migrasi.
--   - `subtotal/ongkir/total` : diisi angka pasti seperti krans/buket
--                   (bukan estimasi seperti papan bunga), kolom sudah
--                   nullable dari migrasi Fase Papan Bunga tapi mode
--                   ini tetap selalu mengisinya.
--
-- Satu-satunya perubahan skema yang perlu: tambah 'kustom' ke
-- constraint product_type.
-- ============================================================

alter table public.orders
  drop constraint if exists orders_product_type_check;
alter table public.orders
  add constraint orders_product_type_check check (product_type in ('krans', 'buket', 'papan_bunga', 'kustom'));
