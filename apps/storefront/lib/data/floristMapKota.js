// Titik pusat wilayah untuk mode fallback (dropdown kota) di peta florist
// terdekat. Cakupan sengaja dibatasi ke wilayah yang datanya sudah live —
// 5 wilayah administrasi Jakarta + Bekasi (satu titik kota, tidak dipecah
// per kecamatan). Slug harus sama persis dengan kolom florists.kota_slug.

// `warna` dipakai untuk mewarnai marker per wilayah di peta (rk-eyebrow /
// legenda) — enam warna berbeda supaya gampang dibedakan sekilas.
export const FLORIST_MAP_KOTA = [
  { slug: "jakarta-selatan", nama: "Jakarta Selatan", lat: -6.2615, lng: 106.7889, warna: "#B93365" },
  { slug: "jakarta-barat", nama: "Jakarta Barat", lat: -6.1683, lng: 106.7591, warna: "#E6A93B" },
  { slug: "jakarta-timur", nama: "Jakarta Timur", lat: -6.225, lng: 106.9004, warna: "#2E8B57" },
  { slug: "jakarta-utara", nama: "Jakarta Utara", lat: -6.1481, lng: 106.8536, warna: "#2C7BE5" },
  { slug: "jakarta-pusat", nama: "Jakarta Pusat", lat: -6.1805, lng: 106.8284, warna: "#8F2450" },
  { slug: "bekasi", nama: "Bekasi", lat: -6.2383, lng: 106.9756, warna: "#8657C6" },
];

export const FLORIST_MAP_KOTA_SLUGS = FLORIST_MAP_KOTA.map((k) => k.slug);

export const DEFAULT_MARKER_COLOR = "#B93365";

export const KOTA_COLOR_BY_SLUG = Object.fromEntries(FLORIST_MAP_KOTA.map((k) => [k.slug, k.warna]));
