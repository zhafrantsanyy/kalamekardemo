// URL storefront tempat checkout terpadu berada — builder redirect ke sini
// setelah komposisi disimpan (lihat submitToCheckout di masing-masing
// halaman builder). Pola fallback sama seperti packages/shared/tokens.js,
// tapi lewat import.meta.env (Vite), bukan process.env (Next.js only).
//
// Fallback produksi mengarah ke domain Vercel demo yang sudah live
// (kalamekar.id belum di-setup) — SET env var VITE_SITE_URL di Vercel
// Project Settings begitu domain utama sudah siap, supaya tidak perlu
// ubah kode lagi.
export const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  (import.meta.env.PROD ? "https://kalamekardemo-store.vercel.app" : "http://localhost:3000");
