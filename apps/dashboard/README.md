# dashboard

Dashboard mitra floris Kalamekar (Next.js App Router + TypeScript). Deploy sebagai project Vercel terpisah dengan Root Directory `apps/dashboard`.

## Menjalankan lokal

```bash
pnpm install
cp apps/dashboard/.env.example apps/dashboard/.env.local
# isi .env.local
pnpm dev:dashboard
```

## Struktur

- `app/mitra/masuk` — login floris (invite-only, tanpa signup). Tidak dibungkus shell.
- `app/mitra/(dashboard)` — route group berisi shell (sidebar + topbar) dan 8 tab: Ringkasan, Order Masuk, Sedang Diproses, Riwayat, Katalog & Stok, Analitik, Profil Toko, Bantuan.
- `middleware.ts` — proteksi `/mitra/*`: hanya user yang punya baris di tabel `florists` yang lolos (model peran struktural, sama seperti storefront — bukan kolom `profiles.role`).
- `lib/auth/requireRole.ts` — dipakai di Route Handler `/api/mitra/*` (middleware tidak jalan di situ).
- `lib/site-config.ts` — URL lintas-workspace, semua dari env, jangan hardcode.
- `components/ui/*` — komponen dasar (Button, Input, Card, Badge, Toast, Skeleton, EmptyState, Drawer, Switch).

## Catatan

Halaman `/mitra` yang sudah berjalan di storefront (`apps/storefront/app/mitra`) TIDAK dimatikan sampai workspace ini diverifikasi end-to-end dan di-deploy — lihat rencana migrasi Fase 5.
