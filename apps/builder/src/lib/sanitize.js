/* ============================================================
   Sanitasi free-text field Papan Bunga (Field 5–9 di wizard).
   Dipakai sebelum teks: (a) digambar ke canvas preview,
   (b) dimasukkan ke pesan WhatsApp, (c) disimpan ke Supabase.
   Canvas fillText() & encodeURIComponent() sendiri tidak
   mengeksekusi HTML/script, tapi teks yang sama juga dibaca ulang
   di dashboard admin/mitra/akun (React, auto-escape) — sanitasi di
   sini adalah defense-in-depth: buang tag/markup dan kendalikan
   panjang teks di titik paling awal (input), bukan cuma di titik
   tampil.
   ============================================================ */

// Regex karakter kontrol (kecuali \t, \n, \r yang dibutuhkan untuk
// deteksi baris sebelum dirapikan di bawah), dibangun dari kode char
// eksplisit lewat RegExp constructor supaya tidak ada byte kontrol
// tak-terlihat yang nyelip langsung di source file ini.
const CONTROL_CODEPOINTS = [
  [0, 8],
  [11, 12],
  [14, 31],
  [127, 127],
];
const CONTROL_CHARS_PATTERN = CONTROL_CODEPOINTS.map(([a, b]) => {
  const from = String.fromCharCode(a);
  const to = String.fromCharCode(b);
  return a === b ? from : `${from}-${to}`;
}).join("");
const CONTROL_CHARS_RE = new RegExp(`[${CONTROL_CHARS_PATTERN}]`, "g");

// Buang tag HTML/markup dan karakter kontrol, rapikan whitespace.
// Tidak meng-escape entity (&lt; dst) karena hasilnya dipakai sebagai
// teks biasa di tiga tujuan berbeda (canvas/WA/DB), bukan disisipkan
// sebagai HTML string di mana pun.
function stripMarkup(input) {
  return String(input ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(CONTROL_CHARS_RE, "");
}

/**
 * @param {string} input
 * @param {{ maxChars?: number, maxLines?: number, singleLine?: boolean }} opts
 */
export function sanitizeText(input, { maxChars = 500, maxLines = 1, singleLine = false } = {}) {
  let text = stripMarkup(input).trim();

  if (singleLine) {
    text = text.replace(/\s*\n+\s*/g, " ").replace(/[ \t]+/g, " ");
  } else {
    text = text
      .split(/\r\n|\r|\n/)
      .map((line) => line.replace(/[ \t]+/g, " ").trim())
      .filter((line, i, arr) => line !== "" || i < arr.length - 1)
      .slice(0, maxLines)
      .join("\n");
  }

  if (text.length > maxChars) text = text.slice(0, maxChars);
  return text;
}

// Khusus dipakai saat membangun pesan WhatsApp: satu baris, tanpa
// karakter yang bisa mengacaukan format pesan (mis. baris kosong
// berulang yang menyamarkan batas antar-field).
export function sanitizeForMessage(input, maxChars = 500) {
  return sanitizeText(input, { maxChars, singleLine: true });
}
