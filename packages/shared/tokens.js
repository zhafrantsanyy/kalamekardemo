export const colors = {
  maroon: "#B93365",
  maroonDeep: "#173D28",
  bloomDark: "#8F2450",
  maroonSoft: "#C97290",
  rose: "#D98CAA",
  roseSoft: "#F6DCE6",
  teal: "#275C3B",
  tealDeep: "#173D28",
  gold: "#E6A93B",
  goldSoft: "#F0C36B",
  cream: "#EEF4EC",
  card: "#FFFFFF",
  ink: "#1C2A20",
  inkSoft: "#49584D",
  line: "#E4E9E2",
};

export const fonts = {
  display: "'Bricolage Grotesque', Georgia, 'Times New Roman', serif",
  body: "'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
};

export const WA_NUMBER = "6287720742631";

// Warna badge status order — dipakai storefront (StatusBadge) & dashboard
// mitra, satu sumber supaya tidak drift antar workspace.
export const STATUS_COLORS = {
  matching: { bg: "#fdf1e0", fg: "#a3720f" },
  dikonfirmasi: { bg: "#e7effb", fg: "#2c548f" },
  dirakit: { bg: "#f3e8fb", fg: "#7a3ea0" },
  diantar: { bg: "#e5f3ee", fg: "#1c6b4c" },
  selesai: { bg: "#e9f5e6", fg: "#2f7d3b" },
  batal: { bg: "#fbe9e9", fg: "#a13d3d" },
};

// Ketiga URL lintas-workspace ini env-first (NEXT_PUBLIC_* dibaca lewat
// process.env langsung, bukan lewat next.config — supaya berfungsi sama
// baik di Next.js maupun konsumen lain), dengan fallback ke domain
// produksi kalamekar.id atau localhost saat env belum diisi. JANGAN
// hardcode salah satu dari tiga URL ini di tempat lain — selalu impor
// dari sini.
export const BUILDER_URL =
  process.env.NEXT_PUBLIC_BUILDER_URL ||
  (process.env.NODE_ENV === "production" ? "https://builder.kalamekar.id" : "http://localhost:5173");

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? "https://kalamekar.id" : "http://localhost:3000");

// URL dashboard mitra (workspace apps/dashboard) — dipakai untuk link
// "Masuk Dashboard Mitra" dari storefront.
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === "production" ? "https://app.kalamekar.id" : "http://localhost:3100");
