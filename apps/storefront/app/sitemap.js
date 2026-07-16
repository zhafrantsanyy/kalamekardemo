import { LIVE_KOTA_SLUGS, JAKARTA_SUBAREA_SLUGS } from "@/lib/data/kota";
import { MOMEN_LIST } from "@/lib/data/momen";
import { blogPosts } from "@/lib/data/blog";

const BASE_URL = "https://kalamekar.id";

export default function sitemap() {
  const staticPages = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/toko-bunga`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/momen`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/kategori`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/untuk-florist`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tentang-kami`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/cara-pesan`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/kontak`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/kebijakan-privasi`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/syarat-ketentuan`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const cityPages = LIVE_KOTA_SLUGS.map((slug) => ({
    url: `${BASE_URL}/toko-bunga/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const subAreaPages = JAKARTA_SUBAREA_SLUGS.map((slug) => ({
    url: `${BASE_URL}/toko-bunga/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const momenPages = MOMEN_LIST.map((m) => ({
    url: `${BASE_URL}/${m.slug}`,
    changeFrequency: "monthly",
    priority: m.kelompok === "personal" || m.kelompok === "formal" ? 0.8 : 0.7,
  }));

  const blogPages = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: post.tanggalUpdate || post.tanggalPublish,
  }));

  return [...staticPages, ...cityPages, ...subAreaPages, ...momenPages, ...blogPages];
}
