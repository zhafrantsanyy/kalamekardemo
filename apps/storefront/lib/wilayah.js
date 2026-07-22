// Helper client-side untuk data wilayah administratif Indonesia (kota/kabupaten
// & kecamatan), dipakai form yang butuh pilihan kota+kecamatan tanpa perlu
// menghardcode ribuan baris data sendiri. Sumber: emsifa/api-wilayah-indonesia,
// API publik yang umum dipakai proyek Indonesia lain (CORS terbuka).
const WILAYAH_API = "https://www.emsifa.com/api-wilayah-indonesia/api";

// Sebagian nama di data BPS sumbernya tertulis terpisah huruf-per-huruf
// (mis. "KOTA B A T A M", "KABUPATEN S I A K") — gabungkan dulu sebelum
// title-case supaya tidak tampil aneh di dropdown.
function fixSpacedLetters(str) {
  return str.replace(/\b(?:[A-Z](?:\s+|$)){2,}/g, (m) => m.replace(/\s+/g, ""));
}

function titleCase(str) {
  return fixSpacedLetters(str)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function fetchProvinces() {
  const res = await fetch(`${WILAYAH_API}/provinces.json`);
  if (!res.ok) throw new Error("Gagal memuat data provinsi.");
  return res.json();
}

export async function fetchRegencies(provinceId) {
  const res = await fetch(`${WILAYAH_API}/regencies/${provinceId}.json`);
  if (!res.ok) throw new Error("Gagal memuat data kota/kabupaten.");
  return res.json();
}

export async function fetchDistricts(regencyId) {
  const res = await fetch(`${WILAYAH_API}/districts/${regencyId}.json`);
  if (!res.ok) throw new Error("Gagal memuat data kecamatan.");
  return res.json();
}

// Kota-kota besar yang sudah jadi fokus jaringan florist Kalamekar (lihat
// LIVE_KOTA_SLUGS di lib/data/kota.js) plus beberapa kota besar Indonesia
// lainnya — ditampilkan lebih dulu di dropdown Kota sebelum daftar A-Z penuh.
export const POPULAR_KOTA_NAMES = [
  "Kota Jakarta Selatan",
  "Kota Jakarta Barat",
  "Kota Jakarta Timur",
  "Kota Jakarta Utara",
  "Kota Jakarta Pusat",
  "Kota Surabaya",
  "Kota Bandung",
  "Kota Medan",
  "Kota Bekasi",
  "Kota Yogyakarta",
  "Kota Semarang",
  "Kota Makassar",
  "Kota Palembang",
  "Kota Denpasar",
  "Kota Tangerang",
  "Kota Tangerang Selatan",
  "Kota Depok",
  "Kota Malang",
  "Kota Batam",
];

// Menggabungkan kota/kabupaten dari semua provinsi jadi satu daftar datar,
// supaya form cukup punya dropdown Kota tanpa langkah pilih Provinsi dulu.
export async function fetchAllKota() {
  const provinces = await fetchProvinces();
  const lists = await Promise.all(provinces.map((p) => fetchRegencies(p.id)));
  return lists
    .flat()
    .map((r) => ({ id: r.id, name: titleCase(r.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getPopularKota(kotaOptions) {
  const byName = new Map(kotaOptions.map((k) => [k.name, k]));
  return POPULAR_KOTA_NAMES.map((name) => byName.get(name)).filter(Boolean);
}

export async function fetchKecamatanByKota(kotaId) {
  const districts = await fetchDistricts(kotaId);
  return districts
    .map((d) => ({ id: d.id, name: titleCase(d.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
