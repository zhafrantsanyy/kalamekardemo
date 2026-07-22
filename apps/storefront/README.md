This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Fase 2 — Dashboard (mitra, akun, admin)

Storefront ini punya tiga dashboard berbasis Supabase Auth, semuanya `noindex` supaya tidak mengganggu SEO halaman publik:

- **`/mitra`** — dashboard floris: terima/tolak order, update status, upload foto rakitan, edit profil.
- **`/akun`** — dashboard pembeli: riwayat pesanan, tracking real-time, klaim order guest, edit profil.
- **`/admin`** — dashboard admin: kelola semua order (assign floris, override status, batalkan), kelola akun floris.

Login pembeli **opsional** — guest checkout (insert anon ke `orders`) tidak berubah sama sekali.

### 1. Jalankan migrasi SQL

Migrasi ada di `apps/builder/supabase/migrations/`, jalankan **berurutan** lewat Supabase SQL Editor (New query → paste isi file → Run):

| File | Isi | Wajib di production? |
|---|---|---|
| `01_phase2_auth.sql` | Tabel `florists`, `profiles`, kolom auth di `orders`, bucket storage `foto-rakitan` | Ya |
| `02_seed_dev.sql` | User floris dummy + 1 order contoh | **Tidak** — dev/staging saja |
| `03_phase3_akun.sql` | Tabel `klaim_attempts` (rate-limit klaim order), aktifkan Realtime untuk `orders` | Ya |
| `04_seed_dev_akun.sql` | User pembeli dummy + 1 order guest contoh | **Tidak** — dev/staging saja |
| `05_phase4_admin.sql` | Policy RLS admin baca semua `orders`/`florists` | Ya |
| `06_seed_dev_admin.sql` | User admin dummy dengan `app_metadata.role = "admin"` | **Tidak** — dev/staging saja |

Semua migrasi murni additive dan aman dijalankan berulang (idempotent).

### 2. Buat admin pertama (production)

File seed dev (`06_seed_dev_admin.sql`) **jangan** dipakai di production. Untuk membuat admin sungguhan:

1. Buka **Supabase Dashboard → Authentication → Users**.
2. Buat user baru (atau pilih user yang sudah ada), lalu klik untuk edit.
3. Di bagian **App Metadata**, tambahkan:
   ```json
   { "role": "admin" }
   ```
4. Simpan. User tersebut sekarang bisa login dan otomatis diarahkan masuk ke `/admin` (dicek lewat `user.app_metadata.role` di `middleware.js` dan lewat RLS policy `(auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'` di tabel `orders`/`florists`).

Akun floris **tidak** self-signup — dibuat admin lewat form "Tambah floris baru" di `/admin/floris` (otomatis membuat auth user + baris `florists`, kata sandi sementara ditampilkan sekali untuk dikirim ke floris via WhatsApp).

### 3. Environment variables

Salin `.env.example` menjadi `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # HANYA dipakai di Route Handler /api/**, jangan pernah di kode client

NEXT_PUBLIC_SITE_URL=...        # domain storefront ini sendiri, dipakai metadata/sitemap/JSON-LD
NEXT_PUBLIC_BUILDER_URL=...     # workspace apps/builder
NEXT_PUBLIC_APP_URL=...         # workspace apps/dashboard (dashboard mitra)
```

Di Vercel, isi semuanya lewat **Project Settings → Environment Variables**. Ketiga URL lintas-workspace dibaca dari `packages/shared/tokens.js` (`SITE_URL`, `BUILDER_URL`, `APP_URL`) — jangan pernah hardcode domain ini langsung di kode, selalu impor dari sana.

> **Catatan migrasi dashboard mitra**: `/mitra` di storefront ini masih berfungsi penuh dan BELUM dinonaktifkan — akan dialihkan ke `apps/dashboard` (lihat root README) setelah workspace itu diverifikasi end-to-end. `/admin` sudah dinonaktifkan sementara di `middleware.js` (kode dibiarkan utuh, hanya aksesnya ditutup) sambil menunggu dipindah — **artinya form "Tambah floris baru" di `/admin/floris` juga ikut tidak bisa diakses**, jadi selama masa transisi ini tidak ada cara UI untuk membuat akun floris baru. Buat manual lewat Supabase Dashboard kalau ada floris baru yang perlu onboarding sebelum admin dipindah/diaktifkan lagi.
