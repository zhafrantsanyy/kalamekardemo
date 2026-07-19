// Order Masuk belum diterima floris — jangan bocorkan alamat lengkap.
// Ambil 2 segmen terakhir (biasanya kecamatan/kota) dari alamat bebas teks.
export function areaKasar(alamat) {
  if (!alamat) return "-";
  const parts = alamat.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length <= 1) return alamat;
  return parts.slice(-2).join(", ");
}
