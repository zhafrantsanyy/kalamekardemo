const BASE_URL = "https://kalamekar.id";

const CITIES = ["jakarta", "bandung", "surabaya", "yogyakarta", "medan"];

export default function sitemap() {
  const staticPages = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/toko-bunga`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/momen`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/kategori`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/bunga-wisuda`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/papan-bunga-grand-opening`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/untuk-florist`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tentang-kami`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/cara-pesan`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/kontak`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/kebijakan-privasi`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/syarat-ketentuan`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const cityPages = CITIES.map((kota) => ({
    url: `${BASE_URL}/toko-bunga/${kota}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...cityPages];
}
