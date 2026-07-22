-- ============================================================
-- KALAMEKAR — Seed DEV-ONLY: produk dummy untuk tiap floris aktif
-- JANGAN dijalankan di project production.
--
-- 5 produk contoh (tersebar di 5 kategori) untuk tiap floris yang
-- sudah ada, supaya halaman profil publik floris punya katalog untuk
-- dioptimasi tampilannya. Harga dibuat sedikit bervariasi per floris
-- lewat hash nama+id supaya tidak semua floris punya harga identik.
--
-- Aman dijalankan berulang kali (idempotent, cek florist_id+nama).
-- ============================================================

insert into public.florist_products (florist_id, kategori_id, nama, deskripsi, harga)
select
  f.id,
  c.id,
  t.nama,
  t.deskripsi,
  t.harga + (('x' || substr(md5(f.id::text || t.nama), 1, 4))::bit(16)::int % 20) * 1000
from public.florists f
cross join (
  values
    ('Buket Mawar Merah Klasik', 'Rangkaian mawar merah segar, cocok untuk ucapan cinta dan perhatian.', 185000, 'buket'),
    ('Buket Bunga Segar Campuran', 'Kombinasi bunga segar warna-warni untuk berbagai momen spesial.', 165000, 'buket'),
    ('Papan Bunga Ucapan Selamat', 'Papan bunga standing besar untuk grand opening atau ucapan selamat.', 750000, 'papan-bunga'),
    ('Karangan Bunga Duka Cita', 'Karangan bunga duka cita dengan pita ucapan personal.', 650000, 'karangan-duka-cita'),
    ('Hampers Bunga & Cokelat', 'Paket hampers berisi bunga segar dan cokelat premium.', 275000, 'hampers')
) as t(nama, deskripsi, harga, kategori_slug)
join public.florist_product_categories c on c.slug = t.kategori_slug
where f.aktif = true
  and not exists (
    select 1 from public.florist_products p where p.florist_id = f.id and p.nama = t.nama
  );
