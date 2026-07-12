# 🌸 Kalamekar — Panduan Deploy Lengkap (Frontend + Backend)

Marketplace florist dengan custom bouquet & wreath builder. Setup ini dirancang untuk **Fase 1 (Concierge)**: website menerima pesanan → tersimpan di database → kamu orkestrasi ke floris partner via WhatsApp. Semuanya bisa jalan di **free tier** (Rp0/bulan), kecuali domain custom.

**Arsitektur:**

```
Pengunjung ──> Frontend (Vercel)  ──insert──>  Database orders (Supabase)
                    │                                │
                    └── tombol wa.me ──> WhatsApp kamu (orchestrator)
                                                     │
                              kamu update status pesanan di Table Editor
```

---

## Prasyarat

1. Akun [GitHub](https://github.com) (gratis)
2. Akun [Supabase](https://supabase.com) (gratis) — backend & database
3. Akun [Vercel](https://vercel.com) (gratis) — hosting frontend, login pakai GitHub
4. [Node.js](https://nodejs.org) versi 18 atau lebih baru di laptopmu

---

## Langkah 1 — Jalankan dulu di laptop

```bash
# masuk ke folder proyek ini, lalu:
npm install
npm run dev
```

Buka `http://localhost:5173`. Website sudah jalan dalam **mode demo** (pesanan belum tersimpan karena env Supabase belum diisi). Ini normal — lanjut ke langkah 2.

---

## Langkah 2 — Setup backend (Supabase)

1. Login ke [supabase.com](https://supabase.com) → **New project**
   - Name: `kalamekar`
   - Database password: buat yang kuat, simpan baik-baik
   - Region: **Southeast Asia (Singapore)** — `ap-southeast-1`, paling dekat ke Jakarta
2. Setelah project siap, buka menu **SQL Editor** → **New query**
3. Salin seluruh isi file `supabase/schema.sql` dari proyek ini → paste → klik **Run**
   - Ini membuat tabel `orders` lengkap dengan Row Level Security: pengunjung hanya bisa *membuat* pesanan, tidak bisa membaca data pesanan orang lain.
4. Ambil kredensial: menu **Project Settings → API**
   - Salin **Project URL** (contoh: `https://abcdxyz.supabase.co`)
   - Salin **anon public key** (yang panjang, diawali `eyJ...`)

> Anon key memang aman ditaruh di frontend — itulah gunanya RLS. Yang **tidak boleh** pernah masuk frontend adalah `service_role` key.

---

## Langkah 3 — Hubungkan frontend ke backend

1. Salin `.env.example` menjadi `.env`:

   ```bash
   cp .env.example .env
   ```

2. Isi tiga variabelnya:

   ```
   VITE_SUPABASE_URL=https://abcdxyz.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_ADMIN_WA=628xxxxxxxxxx
   ```

   `VITE_ADMIN_WA` = nomor WhatsApp kamu sebagai orchestrator, format internasional tanpa `+` (mis. `6281234567890`). Ini memunculkan tombol "Konfirmasi pesanan via WhatsApp" di halaman tracking — inti dari alur concierge.

3. Restart `npm run dev`, buat pesanan percobaan, lalu cek di Supabase → **Table Editor → orders**. Barisnya harus muncul. ✅

---

## Langkah 4 — Push ke GitHub

```bash
git init
git add .
git commit -m "Kalamekar v0.1 - Fase 1 concierge"
```

Buat repository baru di GitHub (private boleh), lalu:

```bash
git remote add origin https://github.com/USERNAME-KAMU/kalamekar.git
git branch -M main
git push -u origin main
```

File `.env` otomatis **tidak** ikut ter-push (sudah ada di `.gitignore`) — memang seharusnya begitu.

---

## Langkah 5 — Deploy frontend (Vercel)

1. Login [vercel.com](https://vercel.com) → **Add New → Project** → **Import** repo `kalamekar`
2. Vercel otomatis mendeteksi Vite. Biarkan default:
   - Build Command: `vite build` · Output Directory: `dist`
3. Sebelum klik Deploy, buka bagian **Environment Variables** dan isi ketiga variabel yang sama persis seperti `.env`-mu:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_WA`
4. Klik **Deploy**. Sekitar satu menit kemudian website live di `https://kalamekar.vercel.app` (atau nama serupa).

Setiap `git push` ke `main` setelah ini akan otomatis men-deploy versi baru.

> Alternatif: Netlify juga bisa dengan cara serupa (build command `npm run build`, publish directory `dist`, env variables sama).

---

## Langkah 6 — Domain custom (opsional, satu-satunya yang berbayar)

1. Beli domain (mis. `kalamekar.id` / `kalamekar.com`) di registrar mana pun — Cloudflare Registrar, Niagahoster, Domainesia, dll. Kisaran Rp150–300rb/tahun.
2. Di Vercel: **Project → Settings → Domains → Add** → masukkan domainmu.
3. Ikuti instruksi DNS yang Vercel tampilkan (biasanya record `A` ke `76.76.21.21` dan `CNAME www` ke `cname.vercel-dns.com`) — atur di dashboard registrarmu.
4. Tunggu propagasi (menit–jam). HTTPS otomatis aktif.

---

## Operasional harian Fase 1 (concierge)

1. Pesanan baru masuk → muncul di Supabase **Table Editor → orders** dengan `status = baru`. Pelanggan juga bisa menekan tombol WhatsApp di halaman tracking, jadi notifikasi datang langsung ke WA-mu.
2. Kamu meneruskan detail order ke floris partner via WA (pakai template SOP Fase 1 yang sudah kita susun), lalu update kolom `status` di Table Editor: `matching → dikonfirmasi → dirakit → diantar → selesai`, dan isi kolom `floris`.
3. Pembayaran pilot: konfirmasi manual via WA (transfer/QRIS statis). Kolom `metode_bayar` mencatat preferensi pelanggan.
4. Kolom `items` menyimpan rancangan kanvas pelanggan sebagai JSON — kirimkan bersama screenshot ke floris agar rakitan sesuai.

Ritme ini persis model "kamu jadi orchestrator" di deck — website mengumpulkan demand tervalidasi, datanya rapi sejak hari pertama.

---

## Troubleshooting

| Gejala | Penyebab & solusi |
|---|---|
| Muncul "Mode demo — pesanan tidak disimpan" | Env Supabase belum terbaca. Cek nama variabel diawali `VITE_`, lalu restart dev server / redeploy di Vercel. |
| "Pesanan gagal disimpan: new row violates row-level security policy" | Policy insert belum ada. Jalankan ulang `supabase/schema.sql` di SQL Editor. |
| "Pesanan gagal disimpan: relation \"orders\" does not exist" | Skema belum dijalankan, atau dijalankan di project Supabase yang berbeda dari URL di env. |
| Tombol WhatsApp tidak muncul di tracking | `VITE_ADMIN_WA` kosong atau formatnya salah — gunakan `628...` tanpa `+`, spasi, atau strip. |
| Berhasil di laptop, gagal di Vercel | Env variables di Vercel belum diisi/typo. Setelah mengubah env, wajib **Redeploy**. |

---

## Roadmap teknis menuju Fase 2 (Otomasi)

Ketika gate criteria Fase 1 terpenuhi, fondasi ini tinggal diperluas — tanpa ganti stack:

1. **Pembayaran otomatis** — integrasi Midtrans Snap / Xendit Invoice. Callback/webhook-nya ditangani **Supabase Edge Functions** (serverless, satu project yang sama). Catatan: Midtrans/Xendit bukan escrow murni — di pilot, "escrow" berarti dana masuk rekening platform dulu dan payout ke floris dilakukan manual setelah bunga diterima; otomatisasi payout (disbursement API) menyusul di Fase 2.
2. **Matching otomatis** — aktifkan blok `florists` + PostGIS yang sudah disiapkan (dikomentari) di `schema.sql`, lalu query floris dalam radius alamat pelanggan.
3. **Notifikasi floris** — WhatsApp Business API (via BSP seperti Qontak/Wati) menggantikan forward manual.
4. **Dashboard floris** — halaman login floris membaca tabel `orders` dengan RLS per-floris (Supabase Auth).

---

## Struktur proyek

```
kalamekar/
├── index.html              # entry HTML + meta SEO dasar
├── package.json
├── vite.config.js
├── .env.example            # template environment variables
├── src/
│   ├── main.jsx            # bootstrap React
│   ├── App.jsx             # seluruh aplikasi (builder, checkout, tracking)
│   └── lib/supabase.js     # koneksi database (auto mode-demo bila env kosong)
└── supabase/
    └── schema.sql          # skema database + RLS, jalankan di SQL Editor
```
