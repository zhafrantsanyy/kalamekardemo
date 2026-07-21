/* ============================================================
   KALAMEKAR — Registry Papan Bunga
   ============================================================
   Konfigurator papan bunga: user pilih kategori acara, ukuran
   (tinggi papan), dan bentuk papan — bukan galeri desain siap-jadi.
   Preview di-render generik lewat SVG (lihat
   components/papanBunga/PapanBungaIllustration.jsx), bukan aset
   gambar yang di-load dari luar.

   Semua angka harga di file ini PLACEHOLDER — ditandai TODO di
   setiap tempat. Jangan pernah dipakai sebagai angka final tanpa
   review bisnis.
   ============================================================ */

import { rupiah } from "../lib/theme";

/** @typedef {'wedding'|'duka_cita'|'grand_opening'|'pelantikan_wisuda'|'ulang_tahun'|'lainnya'} KategoriAcaraId */

/** @type {{ id: KategoriAcaraId, label: string, icon: string }[]} */
export const KATEGORI_ACARA = [
  { id: "wedding", label: "Pernikahan", icon: "Heart" },
  { id: "duka_cita", label: "Duka Cita", icon: "Flower2" },
  { id: "grand_opening", label: "Grand Opening / Peresmian", icon: "Store" },
  { id: "pelantikan_wisuda", label: "Pelantikan / Wisuda", icon: "GraduationCap" },
  { id: "ulang_tahun", label: "Ulang Tahun", icon: "PartyPopper" },
  { id: "lainnya", label: "Lainnya", icon: "Sparkles" },
];

/**
 * @typedef {Object} UkuranPapan
 * @property {string} id
 * @property {string} label       - "1,5 m" dst, ditampilkan di chip selector
 * @property {number} tinggiMeter - dipakai untuk skala visual rumpun bunga di preview
 * @property {number} hargaBaseMin
 * @property {number} hargaBaseMax
 */

// TODO(Zhafran): sesuaikan harga riil per ukuran — angka di bawah PLACEHOLDER.
/** @type {UkuranPapan[]} */
export const UKURAN_PAPAN = [
  { id: "150", label: "1,5 m", tinggiMeter: 1.5, hargaBaseMin: 350000, hargaBaseMax: 500000 },
  { id: "200", label: "2 m", tinggiMeter: 2, hargaBaseMin: 450000, hargaBaseMax: 650000 },
  { id: "250", label: "2,5 m", tinggiMeter: 2.5, hargaBaseMin: 600000, hargaBaseMax: 850000 },
  { id: "300", label: "3 m", tinggiMeter: 3, hargaBaseMin: 800000, hargaBaseMax: 1150000 },
];

/**
 * @typedef {Object} BentukPapan
 * @property {string} id       - 'lengkung_klasik' | 'kotak_modern' | 'love_shape' | 'mahkota'
 * @property {string} label
 * @property {string} deskripsi
 * @property {number} hargaModifier - dikalikan ke hargaBaseMin/Max ukuran terpilih
 */

// TODO(Zhafran): sesuaikan modifier harga riil per bentuk — angka di bawah PLACEHOLDER.
/** @type {BentukPapan[]} */
export const BENTUK_PAPAN = [
  { id: "lengkung_klasik", label: "Lengkung Klasik", deskripsi: "Arch/scallop umum, cocok segala okasi.", hargaModifier: 1.0 },
  { id: "kotak_modern", label: "Kotak Modern", deskripsi: "Papan persegi minimalis, bunga jadi border tipis di tepi.", hargaModifier: 0.92 },
  { id: "love_shape", label: "Love Shape", deskripsi: "Bentuk hati romantis, cocok tema pernikahan.", hargaModifier: 1.18 },
  { id: "mahkota", label: "Mahkota", deskripsi: "Puncak meruncing, untuk perayaan formal & dirgahayu.", hargaModifier: 1.08 },
];

// Batas karakter/baris per field teks — dipakai validasi form & auto-fit
// font di preview. Sama untuk semua bentuk papan (teks selalu diposisikan
// relatif terhadap badan papan, bukan per-bentuk).
export const TEXT_FIELD_LIMITS = {
  ucapan: { maxChars: 40, maxLines: 1 },
  nama_utama: { maxChars: 70, maxLines: 3 },
  teks_pendukung: { maxChars: 50, maxLines: 1 },
  nama_pengirim: { maxChars: 60, maxLines: 2 },
};

// Dropdown Field 5 (Teks Ucapan). Copy final wajib direview tim
// brand/bahasa sebelum live.
export const TEKS_UCAPAN_DEFAULT = [
  "Happy Wedding",
  "Selamat Menempuh Hidup Baru",
  "Turut Berdukacita",
  "Congratulations",
  "Selamat & Sukses",
];

export function rupiahRange(min, max) {
  return `${rupiah(min)} – ${rupiah(max)}`;
}

// Estimasi biaya = harga dasar ukuran × modifier bentuk, dibulatkan ke
// kelipatan Rp5.000 terdekat supaya angkanya tidak ganjil.
export function hargaEstimasi(ukuran, bentuk) {
  if (!ukuran || !bentuk) return null;
  const round5k = (n) => Math.round(n / 5000) * 5000;
  return {
    min: round5k(ukuran.hargaBaseMin * bentuk.hargaModifier),
    max: round5k(ukuran.hargaBaseMax * bentuk.hargaModifier),
  };
}
