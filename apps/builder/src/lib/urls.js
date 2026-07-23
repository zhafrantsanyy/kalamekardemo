// URL storefront tempat checkout terpadu berada — builder redirect ke sini
// setelah komposisi disimpan (lihat submitToCheckout di masing-masing
// halaman builder). Pola fallback sama seperti packages/shared/tokens.js,
// tapi lewat import.meta.env (Vite), bukan process.env (Next.js only).
export const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  (import.meta.env.PROD ? "https://kalamekar.id" : "http://localhost:3000");
