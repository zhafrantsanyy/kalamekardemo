-- ============================================================
-- KALAMEKAR — Seed data dummy florist untuk demo peta florist
-- terdekat. Data placeholder, TIDAK mewakili florist nyata.
-- Cakupan: 5 wilayah administrasi Jakarta + Bekasi (satu titik
-- kota). Mudah dihapus/diganti nanti kalau data florist asli
-- sudah tersedia — cukup DELETE baris dengan kota_slug terisi
-- dan user_id null (florist dummy tidak terikat akun apa pun).
-- ============================================================

-- Florist dev seed lama (migration 04_seed_dev_akun.sql) dapat
-- lokasi + kota_slug supaya ikut tampil di peta juga (area-nya
-- memang "Kemang, Jakarta Selatan").
update public.florists
set
  kota_slug = 'jakarta-selatan',
  deskripsi = 'Florist pengujian internal Kalamekar, dipakai untuk verifikasi alur pemesanan.',
  location = extensions.ST_MakePoint(106.8133, -6.2607)::extensions.geography
where area = 'Kemang, Jakarta Selatan'
  and kota_slug is null;

insert into public.florists (nama, area, wa, rating, aktif, kota_slug, deskripsi, location)
values
  -- Jakarta Selatan
  ('Kuntum Kasih Florist', 'Kebayoran Baru, Jakarta Selatan', '6281200000001', 4.9, true, 'jakarta-selatan',
    'Merangkai bunga segar dengan sentuhan tradisi Betawi, dipercaya keluarga Jakarta Selatan sejak bertahun-tahun.',
    extensions.ST_MakePoint(106.7789, -6.2415)::extensions.geography),
  ('Rangkai Bahagia', 'Cilandak, Jakarta Selatan', '6281200000002', 4.7, true, 'jakarta-selatan',
    'Florist keluarga yang mengutamakan kehangatan dalam setiap rangkaian, dari buket ucapan syukur hingga karangan duka cita.',
    extensions.ST_MakePoint(106.8089, -6.2765)::extensions.geography),
  ('Taman Sekar Kebayoran', 'Kebayoran Lama, Jakarta Selatan', '6281200000003', 4.8, true, 'jakarta-selatan',
    'Menghadirkan bunga pilihan dengan kualitas terjaga, dipetik segar setiap pagi untuk pengiriman hari yang sama.',
    extensions.ST_MakePoint(106.7669, -6.2535)::extensions.geography),

  -- Jakarta Barat
  ('Anggrek Senja Florist', 'Grogol Petamburan, Jakarta Barat', '6281200000004', 4.8, true, 'jakarta-barat',
    'Florist tepercaya dengan koleksi anggrek dan mawar segar, melayani warga Jakarta Barat penuh ketelitian.',
    extensions.ST_MakePoint(106.7771, -6.1563)::extensions.geography),
  ('Seroja Karangan Bunga', 'Kebon Jeruk, Jakarta Barat', '6281200000005', 4.6, true, 'jakarta-barat',
    'Spesialis papan bunga dan karangan duka yang dikerjakan dengan hormat dan tepat waktu.',
    extensions.ST_MakePoint(106.7491, -6.1483)::extensions.geography),
  ('Griya Kembang Grogol', 'Grogol, Jakarta Barat', '6281200000006', 4.9, true, 'jakarta-barat',
    'Toko bunga keluarga yang menjaga tradisi merangkai dengan tangan, bukan sekadar berjualan.',
    extensions.ST_MakePoint(106.7791, -6.1833)::extensions.geography),

  -- Jakarta Timur
  ('Melati Berkah Florist', 'Cakung, Jakarta Timur', '6281200000007', 4.7, true, 'jakarta-timur',
    'Merangkai melati dan mawar segar dengan harga bersahabat untuk warga Jakarta Timur.',
    extensions.ST_MakePoint(106.9184, -6.2130)::extensions.geography),
  ('Kembang Setaman Cakung', 'Duren Sawit, Jakarta Timur', '6281200000008', 4.8, true, 'jakarta-timur',
    'Florist yang tumbuh dari usaha rumahan, kini dipercaya untuk acara pernikahan hingga hajatan keluarga.',
    extensions.ST_MakePoint(106.8904, -6.2050)::extensions.geography),
  ('Puspa Warna Florist', 'Matraman, Jakarta Timur', '6281200000009', 4.6, true, 'jakarta-timur',
    'Menghadirkan warna-warni bunga segar dengan pelayanan hangat khas keluarga Indonesia.',
    extensions.ST_MakePoint(106.9204, -6.2400)::extensions.geography),
  ('Bunga Abadi Jaya', 'Jatinegara, Jakarta Timur', '6281200000010', 4.9, true, 'jakarta-timur',
    'Florist berpengalaman dalam karangan bunga duka cita, dikerjakan dengan penuh empati.',
    extensions.ST_MakePoint(106.8784, -6.2170)::extensions.geography),

  -- Jakarta Utara
  ('Sekuntum Cinta Florist', 'Kelapa Gading, Jakarta Utara', '6281200000011', 4.8, true, 'jakarta-utara',
    'Toko bunga yang mengutamakan kepercayaan pelanggan, dari buket kecil hingga dekorasi acara besar.',
    extensions.ST_MakePoint(106.8716, -6.1361)::extensions.geography),
  ('Kuncup Merona Kelapa Gading', 'Kelapa Gading, Jakarta Utara', '6281200000012', 4.7, true, 'jakarta-utara',
    'Florist modern dengan akar tradisi floristry Indonesia, favorit warga Jakarta Utara.',
    extensions.ST_MakePoint(106.8436, -6.1281)::extensions.geography),

  -- Jakarta Pusat
  ('Bunga Ibu Kota', 'Gambir, Jakarta Pusat', '6281200000013', 5.0, true, 'jakarta-pusat',
    'Florist legendaris di jantung Jakarta, melayani karangan bunga resmi hingga buket pribadi.',
    extensions.ST_MakePoint(106.8464, -6.1685)::extensions.geography),
  ('Rangkaian Hati Menteng', 'Menteng, Jakarta Pusat', '6281200000014', 4.8, true, 'jakarta-pusat',
    'Merangkai setiap pesanan dengan hati, seperti untuk keluarga sendiri.',
    extensions.ST_MakePoint(106.8184, -6.1605)::extensions.geography),
  ('Toko Bunga Harum Melati', 'Senen, Jakarta Pusat', '6281200000015', 4.6, true, 'jakarta-pusat',
    'Florist yang menjaga wangi dan kesegaran melati khas Indonesia dalam setiap rangkaian.',
    extensions.ST_MakePoint(106.8484, -6.1955)::extensions.geography),
  ('Karangan Bunga Sejahtera', 'Cempaka Putih, Jakarta Pusat', '6281200000016', 4.9, true, 'jakarta-pusat',
    'Spesialis papan bunga ucapan dan duka cita untuk kantor dan instansi di Jakarta Pusat.',
    extensions.ST_MakePoint(106.8064, -6.1725)::extensions.geography),
  ('Rumah Bunga Nusantara', 'Tanah Abang, Jakarta Pusat', '6281200000017', 4.7, true, 'jakarta-pusat',
    'Florist yang merawat tradisi rangkaian bunga Nusantara dengan sentuhan masa kini.',
    extensions.ST_MakePoint(106.8164, -6.2005)::extensions.geography),

  -- Bekasi
  ('Bunga Pertiwi Bekasi', 'Bekasi Timur, Bekasi', '6281200000018', 4.8, true, 'bekasi',
    'Florist keluarga yang telah melayani warga Bekasi dengan bunga segar dan harga jujur.',
    extensions.ST_MakePoint(106.9936, -6.2263)::extensions.geography),
  ('Toko Bunga Damai Sentosa', 'Bekasi Barat, Bekasi', '6281200000019', 4.6, true, 'bekasi',
    'Melayani karangan bunga duka dan ucapan dengan penuh kehangatan dan ketepatan waktu.',
    extensions.ST_MakePoint(106.9656, -6.2183)::extensions.geography),
  ('Kembang Asri Bekasi', 'Bekasi Selatan, Bekasi', '6281200000020', 4.9, true, 'bekasi',
    'Florist tepercaya untuk buket wisuda, ulang tahun, hingga hantaran pernikahan di Bekasi.',
    extensions.ST_MakePoint(106.9956, -6.2533)::extensions.geography);
