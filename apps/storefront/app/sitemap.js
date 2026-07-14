const BASE_URL = "https://kalamekar.id";

const CITIES = ["jakarta", "bandung", "surabaya", "yogyakarta", "medan"];

export default function sitemap() {
  const staticPages = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/tentang`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/bunga-wisuda`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/papan-bunga-grand-opening`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const cityPages = CITIES.map((kota) => ({
    url: `${BASE_URL}/toko-bunga/${kota}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...cityPages];
}
