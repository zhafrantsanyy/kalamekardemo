-- ============================================================
-- KALAMEKAR — Migrasi Cart & Checkout Terpadu (Storefront)
-- Murni ADDITIVE terhadap orders. Tabel baru: carts, cart_items,
-- builder_compositions, order_items.
--
-- Catatan drift: 6 migrasi terakhir yang sudah live di project
-- (florist_products_and_slug, florist_maps_postgis, payout_audit,
-- dst — lihat list_migrations) belum punya file lokal di folder
-- ini. File ini ditulis berdasarkan skema LIVE (dicek langsung
-- lewat MCP), bukan berdasarkan file lokal yang sudah usang.
--
-- Reuse kolom orders yang sudah ada (TIDAK bikin kolom duplikat):
--   - nama, wa       -> dipakai sebagai recipient_name/recipient_phone
--                       (sudah dirender begitu di admin/akun/mitra)
--   - alamat         -> shipping address (text, sudah not null)
--   - kartu          -> catatan/ucapan buket (builder sudah label
--                       ini "Pesan kartu ucapan")
--   - metode_bayar   -> payment method (kolom text bebas, tanpa
--                       CHECK constraint — checkout dummy tinggal
--                       isi 'transfer_bank' | 'qris', additive)
--   - total          -> total_amount (sudah integer, nullable)
-- ============================================================

-- ============================================================
-- 1. Tabel carts
-- ============================================================
create table if not exists public.carts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  status     text not null default 'active'
             check (status in ('active', 'checked_out', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists carts_user_id_idx on public.carts (user_id);
-- Query paling sering: cari cart aktif milik user (getOrCreateActiveCart).
create index if not exists carts_user_active_idx on public.carts (user_id) where status = 'active';

alter table public.carts enable row level security;

drop policy if exists "user kelola cart sendiri select" on public.carts;
create policy "user kelola cart sendiri select"
  on public.carts for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "user kelola cart sendiri insert" on public.carts;
create policy "user kelola cart sendiri insert"
  on public.carts for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "user kelola cart sendiri update" on public.carts;
create policy "user kelola cart sendiri update"
  on public.carts for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================
-- 2. Tabel builder_compositions — BARU. Saat audit, ditemukan
--    builder TIDAK punya tabel draft komposisi: builder selama ini
--    langsung insert ke `orders` (anon, guest checkout satu-item).
--    Supaya builder bisa kirim reference ID ke storefront (Fase 7),
--    perlu tempat menyimpan komposisi SEBELUM jadi order/cart_item.
--    Kolom meniru bentuk kolom orders yang sudah ada untuk
--    krans/buket/papan_bunga/kustom (items, wrapping, dst) supaya
--    tidak menciptakan bentuk data baru yang beda konvensi.
--
--    Publik (anon & authenticated) sengaja boleh insert & select —
--    komposisi tidak berisi PII, hanya konfigurasi kanvas & harga,
--    presedennya sama seperti bucket storage "papan-bunga-preview"
--    yang public read dan "anon dapat membuat pesanan" yang public
--    insert. ID uuid tidak predictable jadi tetap aman dipakai
--    sebagai reference token.
-- ============================================================
create table if not exists public.builder_compositions (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references auth.users(id) on delete set null,
  product_type       text not null check (product_type in ('krans', 'buket', 'papan_bunga', 'kustom')),
  mode               text check (mode is null or mode in ('bouquet', 'wreath')),
  ukuran             text,
  wrapping           text,
  ring_dasar         text,
  items              jsonb not null default '[]'::jsonb,
  papan_bunga_config jsonb,
  preview_url        text,
  harga              integer not null,
  created_at         timestamptz not null default now()
);

create index if not exists builder_compositions_user_id_idx on public.builder_compositions (user_id);

alter table public.builder_compositions enable row level security;

drop policy if exists "publik buat komposisi" on public.builder_compositions;
create policy "publik buat komposisi"
  on public.builder_compositions for insert
  to anon, authenticated
  with check (true);

drop policy if exists "publik baca komposisi by id" on public.builder_compositions;
create policy "publik baca komposisi by id"
  on public.builder_compositions for select
  to anon, authenticated
  using (true);

-- ============================================================
-- 3. Tabel cart_items
-- ============================================================
create table if not exists public.cart_items (
  id             uuid primary key default gen_random_uuid(),
  cart_id        uuid not null references public.carts(id) on delete cascade,
  item_type      text not null check (item_type in ('catalog', 'builder_composition')),
  -- 'catalog' -> katalog produk milik floris (florist_products), BUKAN
  -- tabel `products` generik — mengikuti definisi eksplisit dari brief.
  product_id     uuid references public.florist_products(id),
  composition_id uuid references public.builder_compositions(id),
  quantity       integer not null default 1 check (quantity > 0),
  unit_price     integer not null,
  item_snapshot  jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  constraint cart_items_item_ref_check check (
    (item_type = 'catalog' and product_id is not null and composition_id is null)
    or
    (item_type = 'builder_composition' and composition_id is not null and product_id is null)
  )
);

create index if not exists cart_items_cart_id_idx on public.cart_items (cart_id);

alter table public.cart_items enable row level security;

drop policy if exists "user kelola item cart sendiri select" on public.cart_items;
create policy "user kelola item cart sendiri select"
  on public.cart_items for select
  to authenticated
  using (cart_id in (select id from public.carts where user_id = auth.uid()));

drop policy if exists "user kelola item cart sendiri insert" on public.cart_items;
create policy "user kelola item cart sendiri insert"
  on public.cart_items for insert
  to authenticated
  with check (cart_id in (select id from public.carts where user_id = auth.uid()));

drop policy if exists "user kelola item cart sendiri update" on public.cart_items;
create policy "user kelola item cart sendiri update"
  on public.cart_items for update
  to authenticated
  using (cart_id in (select id from public.carts where user_id = auth.uid()))
  with check (cart_id in (select id from public.carts where user_id = auth.uid()));

drop policy if exists "user kelola item cart sendiri delete" on public.cart_items;
create policy "user kelola item cart sendiri delete"
  on public.cart_items for delete
  to authenticated
  using (cart_id in (select id from public.carts where user_id = auth.uid()));

-- ============================================================
-- 4. ALTER orders — hanya kolom yang BENAR-BENAR belum ada.
--    (recipient_name/phone/address/notes/total_amount SENGAJA
--    tidak ditambah, lihat catatan reuse di atas file.)
-- ============================================================
alter table public.orders
  add column if not exists cart_id        uuid references public.carts(id),
  add column if not exists payment_status text not null default 'pending'
                            check (payment_status in ('pending', 'paid')),
  add column if not exists updated_at     timestamptz not null default now();

-- Tambah 'menunggu_pembayaran' di awal alur status — dipakai
-- untuk integrasi payment gateway asli nanti (Fase 2 non-dummy).
-- Default kolom TETAP 'baru' (tidak diubah) supaya insert langsung
-- dari builder (guest checkout krans/buket/papan_bunga yang sudah
-- ada) tidak diam-diam pindah status tanpa app-nya berubah.
alter table public.orders
  drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check check (
    status in ('menunggu_pembayaran', 'baru', 'matching', 'dikonfirmasi', 'dirakit', 'diantar', 'selesai', 'batal')
  );

-- ============================================================
-- 5. Tabel order_items — snapshot permanen per order (mirror
--    cart_items, tapi tidak ikut terhapus/berubah kalau cart-nya
--    diubah lagi setelah checkout).
-- ============================================================
create table if not exists public.order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders(id) on delete cascade,
  item_type      text not null check (item_type in ('catalog', 'builder_composition')),
  product_id     uuid references public.florist_products(id),
  composition_id uuid references public.builder_compositions(id),
  quantity       integer not null default 1 check (quantity > 0),
  unit_price     integer not null,
  item_snapshot  jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  constraint order_items_item_ref_check check (
    (item_type = 'catalog' and product_id is not null and composition_id is null)
    or
    (item_type = 'builder_composition' and composition_id is not null and product_id is null)
  )
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

-- Sengaja TIDAK ada policy insert/update untuk siapa pun — order_items
-- hanya diisi lewat Route Handler service role di /api/checkout/*,
-- sama presedennya dengan orders (tidak ada policy update floris).
drop policy if exists "pembeli baca order_items order sendiri" on public.order_items;
create policy "pembeli baca order_items order sendiri"
  on public.order_items for select
  to authenticated
  using (order_id in (select id from public.orders where user_id = auth.uid()));
