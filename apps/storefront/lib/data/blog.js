// Data source artikel blog. Kosong untuk sekarang — task ini hanya membangun struktur
// hub (/blog) dan template artikel (/blog/[slug]), belum menulis konten.
//
// @typedef {"tips-perawatan" | "inspirasi" | "panduan-pemesanan" | "etika-budaya"} BlogKategori
//
// @typedef {Object} BlogPost
// @property {string} slug
// @property {string} judul
// @property {string} excerpt            - 1-2 kalimat untuk card & meta description
// @property {BlogKategori} kategori
// @property {string} tanggalPublish      - ISO date
// @property {string} [tanggalUpdate]
// @property {string} coverImageAlt       - deskripsi alt text, gambar aktual ditambah nanti
// @property {string} author
// @property {string} contentHtml         - HTML artikel (atau ganti ke MDX kalau setup berubah nanti)
// @property {{ label: string, href: string }[]} relatedLinks - link ke momen/kota/kategori terkait

export const BLOG_KATEGORI = [
  { id: "tips-perawatan", label: "Tips Perawatan" },
  { id: "inspirasi", label: "Inspirasi" },
  { id: "panduan-pemesanan", label: "Panduan Pemesanan" },
  { id: "etika-budaya", label: "Etika & Budaya" },
];

/** @type {BlogPost[]} */
export const blogPosts = []; // diisi manual saat artikel pertama ditulis
