/* ============================================================
   KALAMEKAR — Registry SKU mode Free-form Canvas
   ============================================================
   Data DUMMY/PLACEHOLDER untuk membangun & mengetes kanvas
   drag-and-drop bebas. SEBELUM FITUR INI LIVE, wajib diganti:

     1. `img` tiap SKU     -> foto produk asli
     2. `harga` tiap SKU   -> harga riil (lihat komentar TODO)

   Wrapping ditampilkan sebagai kategori palet ke-9 ("Wrapping") dan
   masing-masing kombinasi material×warna adalah SKU biasa — di-drag ke
   kanvas jadi instance item sungguhan (bisa direposisi/resize/rotate/
   digandakan/dihapus persis seperti kategori lain), BUKAN atribut
   tunggal komposisi. Material + harga REUSE array WRAPS yang sudah ada
   di catalog.js (satu sumber kebenaran lintas mode builder).
   ============================================================ */

import { WRAPS } from "../lib/catalog";

export { WRAPS as WRAP_STYLES };

/** @typedef {'stems'|'blooms'|'ribbons'|'extras'|'satin'|'crochet'|'wire'|'money'|'wrapping'} SkuCategory */

/** @type {{ id: SkuCategory, label: string }[]} */
export const FREEFORM_CATEGORIES = [
  { id: "stems", label: "Batang Bunga" },
  { id: "blooms", label: "Bunga Utama" },
  { id: "ribbons", label: "Pita" },
  { id: "extras", label: "Aksen Tambahan" },
  { id: "satin", label: "Satin" },
  { id: "crochet", label: "Rajut" },
  { id: "wire", label: "Kawat Dekor" },
  { id: "money", label: "Uang Lipat" },
  { id: "wrapping", label: "Wrapping" },
];

/**
 * @typedef {Object} WrapMaterial
 * @property {string} id
 * @property {string} nama
 * @property {number} harga
 */

// Reuse material + harga dari WRAPS yang sama (satu sumber kebenaran
// lintas mode builder) — dipakai di bawah untuk generate SKU wrapping
// per kombinasi material×warna.
/** @type {WrapMaterial[]} */
const WRAP_MATERIALS = WRAPS.map(({ id, nama, harga }) => ({ id, nama, harga }));

/**
 * @typedef {Object} WrapColor
 * @property {string} id
 * @property {string} label
 * @property {string} hex
 */

/** @type {WrapColor[]} */
const WRAP_COLORS = [
  { id: "natural", label: "Natural Kraft", hex: "#c8a878" },
  { id: "blush", label: "Blush Pink", hex: "#efdfe0" },
  { id: "maroon", label: "Maroon", hex: "#8d5468" },
  { id: "ivory", label: "Ivory White", hex: "#faf6f0" },
  { id: "sage", label: "Sage Green", hex: "#a8b89a" },
  { id: "charcoal", label: "Charcoal Black", hex: "#3a3a3a" },
];

function placeholderIcon(hex, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
    <circle cx="60" cy="60" r="52" fill="${hex}" fill-opacity="0.85"/>
    <circle cx="60" cy="60" r="52" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="3"/>
    <text x="60" y="64" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#ffffff">${label}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/**
 * @typedef {Object} FreeformSku
 * @property {string} id
 * @property {SkuCategory} category
 * @property {string} nama
 * @property {number} harga
 * @property {string} img
 */

// TODO(Zhafran): semua harga di bawah PLACEHOLDER — review sebelum live.
// Khusus kategori 'money': harga SKU merepresentasikan nominal uang asli
// yang dilipat (bukan cuma biaya jasa/craft) — perlu alur akuntansi
// terpisah dari SKU dekorasi biasa, tandai jelas ke tim ops sebelum live.
/** @type {FreeformSku[]} */
const BASE_SKUS = [
  { id: "stem_mawar_merah", category: "stems", nama: "Mawar Merah", harga: 15000, img: placeholderIcon("#B93365", "Mawar") },
  { id: "stem_mawar_putih", category: "stems", nama: "Mawar Putih", harga: 15000, img: placeholderIcon("#C97290", "Mawar Putih") },
  { id: "stem_tulip", category: "stems", nama: "Tulip", harga: 25000, img: placeholderIcon("#E6A93B", "Tulip") },
  { id: "stem_anyelir", category: "stems", nama: "Anyelir", harga: 10000, img: placeholderIcon("#D98CAA", "Anyelir") },

  { id: "bloom_peony", category: "blooms", nama: "Peony", harga: 35000, img: placeholderIcon("#8F2450", "Peony") },
  { id: "bloom_hydrangea", category: "blooms", nama: "Hortensia", harga: 28000, img: placeholderIcon("#6B5B95", "Hortensia") },
  { id: "bloom_sunflower", category: "blooms", nama: "Bunga Matahari", harga: 18000, img: placeholderIcon("#E6A93B", "Matahari") },

  { id: "ribbon_satin_merah", category: "ribbons", nama: "Pita Satin Merah", harga: 8000, img: placeholderIcon("#B93365", "Pita") },
  { id: "ribbon_gold", category: "ribbons", nama: "Pita Gold", harga: 9000, img: placeholderIcon("#E6A93B", "Pita Gold") },
  { id: "ribbon_putih", category: "ribbons", nama: "Pita Putih", harga: 7000, img: placeholderIcon("#F6DCE6", "Pita Putih") },

  { id: "extra_kupu", category: "extras", nama: "Aksen Kupu-Kupu", harga: 6000, img: placeholderIcon("#275C3B", "Kupu") },
  { id: "extra_mutiara", category: "extras", nama: "Untaian Mutiara", harga: 7000, img: placeholderIcon("#F0C36B", "Mutiara") },
  { id: "extra_daun", category: "extras", nama: "Daun Eukaliptus", harga: 6000, img: placeholderIcon("#173D28", "Daun") },

  { id: "satin_swatch_merah", category: "satin", nama: "Kain Satin Merah", harga: 12000, img: placeholderIcon("#8F2450", "Satin") },
  { id: "satin_swatch_putih", category: "satin", nama: "Kain Satin Putih", harga: 12000, img: placeholderIcon("#EEF4EC", "Satin Putih") },

  { id: "crochet_bunga", category: "crochet", nama: "Bunga Rajut", harga: 20000, img: placeholderIcon("#D98CAA", "Rajut") },
  { id: "crochet_daun", category: "crochet", nama: "Daun Rajut", harga: 15000, img: placeholderIcon("#275C3B", "Daun Rajut") },

  { id: "wire_heart", category: "wire", nama: "Kawat Bentuk Hati", harga: 10000, img: placeholderIcon("#B93365", "Kawat Hati") },
  { id: "wire_swirl", category: "wire", nama: "Kawat Spiral", harga: 8000, img: placeholderIcon("#49584D", "Kawat Spiral") },

  { id: "money_100k", category: "money", nama: "Lipatan Uang Rp100rb", harga: 100000, img: placeholderIcon("#173D28", "Uang 100rb") },
  { id: "money_50k", category: "money", nama: "Lipatan Uang Rp50rb", harga: 50000, img: placeholderIcon("#173D28", "Uang 50rb") },
];

// Wrapping = SKU biasa juga (kategori "wrapping"), satu entri per
// kombinasi material×warna, supaya bisa di-drag ke kanvas jadi item
// sungguhan persis seperti kategori lain (bukan atribut komposisi
// terpisah).
const WRAP_SKUS = WRAP_MATERIALS.flatMap((material) =>
  WRAP_COLORS.map((color) => ({
    id: `wrap_${material.id}_${color.id}`,
    category: "wrapping",
    nama: `${material.nama} · ${color.label}`,
    harga: material.harga,
    img: placeholderIcon(color.hex, material.nama),
  }))
);

/** @type {FreeformSku[]} */
export const FREEFORM_SKUS = [...BASE_SKUS, ...WRAP_SKUS];

export const FREEFORM_SKU_MAP = Object.fromEntries(FREEFORM_SKUS.map((s) => [s.id, s]));

export function getSkusByCategory(categoryId) {
  return FREEFORM_SKUS.filter((s) => s.category === categoryId);
}
