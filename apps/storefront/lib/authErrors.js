// Menerjemahkan pesan error Supabase Auth (selalu dalam Inggris) ke Bahasa
// Indonesia yang ramah, supaya pembeli tidak bingung baca istilah teknis.
const PATTERNS = [
  { match: /invalid login credentials/i, message: "Email atau kata sandi salah. Coba periksa lagi." },
  { match: /email not confirmed/i, message: "Email belum dikonfirmasi. Cek kotak masukmu untuk link konfirmasi." },
  { match: /already registered|user already exists/i, message: "Email ini sudah terdaftar. Coba masuk, atau pakai email lain." },
  { match: /password should be at least/i, message: "Kata sandi minimal 6 karakter." },
  { match: /unable to validate email address|invalid email/i, message: "Format email tidak valid." },
  { match: /rate limit/i, message: "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi." },
  { match: /network/i, message: "Koneksi bermasalah. Periksa internetmu dan coba lagi." },
];

export function humanizeAuthError(error) {
  if (!error?.message) return "Terjadi kesalahan. Coba lagi beberapa saat lagi.";
  const found = PATTERNS.find((p) => p.match.test(error.message));
  return found ? found.message : "Terjadi kesalahan. Coba lagi beberapa saat lagi.";
}
