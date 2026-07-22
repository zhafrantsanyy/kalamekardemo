// Order Masuk belum diterima floris — jangan bocorkan alamat lengkap.
// Ambil 2 segmen terakhir (biasanya kecamatan/kota) dari alamat bebas teks.
// Port dari apps/storefront/lib/maskAlamat.js — sama-sama baca kolom
// orders.alamat, aturan privasinya harus identik di kedua workspace.
export function areaKasar(alamat: string | null | undefined): string {
  if (!alamat) return "-";
  const parts = alamat.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length <= 1) return alamat;
  return parts.slice(-2).join(", ");
}
