<div align="center">

# 🌸 Kalamekar

**Marketplace florist lokal Indonesia — rangkai buket & krans sendiri, dirakit florist terverifikasi di kotamu.**

*Kala* (waktu) + *mekar* — waktu ketika bunga berada di puncak keindahannya.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white&labelColor=173D28)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&labelColor=173D28)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20RLS-3FCF8E?logo=supabase&logoColor=white&labelColor=173D28)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white&labelColor=173D28)
![Fase](https://img.shields.io/badge/Fase%201-Concierge-B93365?labelColor=173D28)

</div>

---

## Tentang Proyek

Kalamekar menghubungkan pembeli dengan florist lokal (UMKM) terverifikasi di seluruh Indonesia. Pembeli bisa menelusuri produk siap pesan atau **merangkai buket/krans custom lewat kanvas drag-and-drop** dengan harga real-time, lalu checkout — pesanan tersimpan di database dan dikoordinasikan ke florist partner via WhatsApp.

**Fase 1 (Concierge, saat ini):** website menerima & memvalidasi pesanan → orchestrator meneruskan ke florist partner via WhatsApp → status diperbarui manual. Seluruh setup berjalan di **free tier** (Rp0/bulan) kecuali domain custom.

```
Pengunjung ──> Frontend (Vercel) ──insert──> Database orders (Supabase, RLS)
                    │                              │
                    └── tombol wa.me ──> WhatsApp orchestrator
                                                   │
                          update status pesanan via Table Editor
```

## Fitur

| Fitur | Deskripsi |
|---|---|
| 🎨 **Bouquet Builder** | Kanvas drag-and-drop untuk merangkai buket & krans — pilih bunga, filler, ukuran, wrapping; harga terhitung real-time |
| 🛍️ **Katalog Produk** | Produk siap pesan dari florist partner (`/produk`, detail per slug) |
| 🛒 **Keranjang & Checkout** | Cart context global, checkout tersimpan ke Supabase |
| 📦 **Order Tracking** | Lacak status pesanan + tombol konfirmasi via WhatsApp |
| 🏙️ **Cakupan Kota** | Chip kota aktif vs "segera hadir" di beranda |
| 💬 **Concierge WhatsApp** | Handoff pesanan ke florist via `wa.me` — inti alur Fase 1 |
| 🔒 **Row Level Security** | Pengunjung hanya bisa *membuat* pesanan, tidak bisa membaca pesanan orang lain |
| ♿ **Aksesibilitas** | Focus outline konsisten, `prefers-reduced-motion`, navigasi keyboard |

## Rute Aplikasi

```
/                → Beranda (hero, kategori, momen, cara kerja, untuk floris, FAQ)
/produk          → Katalog produk florist
/produk/:slug    → Detail produk
/builder         → Kanvas rangkai buket & krans
/keranjang       → Keranjang belanja
/checkout        → Checkout & simpan pesanan
/tentang         → Cerita, misi, dan roadmap Kalamekar
```

## Tech Stack

- **Frontend:** React 18 + Vite 5, React Router DOM 7, lucide-react
- **State:** React Context (`CartContext`)
- **Backend:** Supabase — Postgres, PostgREST, Row Level Security · region Singapore (`ap-southeast-1`)
- **Hosting:** Vercel (auto-deploy dari `main`, preview per PR)
- **Bahasa:** Seluruh copy dalam Bahasa Indonesia 🇮🇩

## Design System

Token desain terpusat di [`src/lib/theme.js`](src/lib/theme.js) — jangan hardcode hex di komponen.

**Palet — bloom pink · green · marigold · ink:**

| Token | Hex | Peran |
|---|---|---|
| Bloom | `#B93365` | Warna utama brand (tombol, aksen) |
| Bloom Dark | `#8F2450` | Hover state |
| Petal | `#F6DCE6` | Latar chip/ikon pink muda |
| Green-900 | `#173D28` | Band gelap: footer, ribbon, CTA |
| Green-700 | `#275C3B` | Aksen hijau sekunder |
| Marigold | `#E6A93B` | Aksen tersier + focus outline (a11y) |
| Green-100 | `#EEF4EC` | Background halaman |
| Ink / Ink Soft | `#1C2A20` / `#49584D` | Teks utama / sekunder |

**Tipografi (Google Fonts):**

- **Bricolage Grotesque** (500/600/700) — display & heading (`.rk-serif`)
- **Plus Jakarta Sans** (400–700 + italic) — body & UI

## Menjalankan di Lokal

**Prasyarat:** Node.js ≥ 18, akun [Supabase](https://supabase.com) (gratis).

```bash
# 1. Clone & install
git clone https://github.com/USERNAME/kalamekar.git
cd kalamekar
npm install

# 2. Setup environment
cp .env.example .env
```

Isi `.env`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_ADMIN_WA=628xxxxxxxxxx   # nomor WA orchestrator, tanpa + atau spasi
```

```bash
# 3. Jalankan
npm run dev        # → http://localhost:5173
```

> 💡 Tanpa env Supabase, aplikasi berjalan dalam **mode demo** (pesanan tidak tersimpan) — cocok untuk pengembangan UI.

**Setup database:** buat project Supabase (region **Singapore**), buka **SQL Editor**, jalankan seluruh isi [`supabase/schema.sql`](supabase/schema.sql). Ini membuat tabel `orders` (dan `products`) lengkap dengan kebijakan RLS.

## Deploy ke Production (Vercel)

1. Push repo ke GitHub (`.env` sudah di-ignore).
2. Vercel → **Add New → Project** → import repo. Vite terdeteksi otomatis (`vite build` → `dist`).
3. Isi **Environment Variables** (Production + Preview): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_WA`.
4. **Deploy** → live di `https://kalamekar.vercel.app`. Setiap push ke `main` = deploy otomatis.
5. *(Opsional)* Domain custom: **Settings → Domains** → record `A` ke `76.76.21.21` dan `CNAME www` ke `cname.vercel-dns.com`.

> ⚠️ **Keamanan:** `anon key` aman di frontend karena dilindungi RLS. `service_role` key **tidak boleh pernah** masuk repo atau kode frontend.

## Alur Status Pesanan (Fase 1)

```
baru → matching → dikonfirmasi → dirakit → diantar → selesai
```

Kolom `items` menyimpan rancangan kanvas pelanggan sebagai JSON — teruskan bersama screenshot ke florist agar rakitan sesuai. Status & kolom `floris` diperbarui manual via Supabase Table Editor.

## Struktur Proyek

```
kalamekar/
├── index.html                  # entry HTML + meta SEO + Google Fonts
├── package.json
├── vite.config.js
├── .env.example                # template environment variables
├── src/
│   ├── main.jsx                # bootstrap React + BrowserRouter
│   ├── App.jsx                 # routing + layout (Navbar, Footer, CartProvider)
│   ├── lib/
│   │   ├── theme.js            # 🎨 design tokens (warna, font, helper rupiah)
│   │   └── supabase.js         # koneksi DB (auto mode-demo bila env kosong)
│   ├── context/
│   │   └── CartContext.jsx     # state keranjang global
│   ├── components/
│   │   ├── GlobalStyle.jsx     # seluruh CSS utility (.rk-*)
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── pages/
│       ├── Home.jsx            # beranda marketplace
│       ├── ProductList.jsx     # katalog /produk
│       ├── ProductDetail.jsx   # detail /produk/:slug
│       ├── BouquetBuilder.jsx  # kanvas rangkai /builder
│       ├── Cart.jsx            # /keranjang
│       ├── Checkout.jsx        # /checkout
│       └── About.jsx           # /tentang
└── supabase/
    └── schema.sql              # skema DB + RLS — jalankan di SQL Editor
```

## Troubleshooting

| Gejala | Penyebab & solusi |
|---|---|
| "Mode demo — pesanan tidak disimpan" | Env Supabase belum terbaca. Pastikan variabel diawali `VITE_`, lalu restart dev server / redeploy. |
| `violates row-level security policy` | Policy insert belum ada — jalankan ulang `supabase/schema.sql`. |
| `relation "orders" does not exist` | Skema belum dijalankan, atau env menunjuk project Supabase berbeda. |
| Tombol WhatsApp tidak muncul | `VITE_ADMIN_WA` kosong/salah format — gunakan `628...` tanpa `+`, spasi, atau strip. |
| Jalan di laptop, gagal di Vercel | Env variables di Vercel belum diisi/typo. Setelah mengubah env, wajib **Redeploy**. |

## Roadmap → Fase 2 (Otomasi)

Fondasi saat ini tinggal diperluas tanpa ganti stack:

1. **Pembayaran otomatis** — Midtrans Snap / Xendit Invoice; webhook ditangani Supabase Edge Functions.
2. **Matching otomatis** — aktifkan blok `florists` + PostGIS di `schema.sql`, query florist dalam radius alamat pelanggan.
3. **Notifikasi florist** — WhatsApp Business API (BSP: Qontak/Wati) menggantikan forward manual.
4. **Dashboard florist & buyer** — Supabase Auth + RLS per-florist untuk kelola pesanan langsung.

## Kontribusi

Proyek ini dikembangkan secara privat. Alur kerja internal:

```bash
git checkout -b fitur/nama-fitur   # kerja di branch
npm run build && npm run preview   # verifikasi build sebelum PR
# buka PR → review → merge ke main → auto-deploy Vercel
```

---

<div align="center">

Dibuat dengan 🌸 untuk memekarkan UMKM florist Indonesia

**[kalamekar.id](https://kalamekar.id)** · Fase 1 Concierge · © 2026 Kalamekar

</div>
