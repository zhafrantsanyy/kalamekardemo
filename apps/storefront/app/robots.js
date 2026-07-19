export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/akun", "/mitra", "/admin", "/masuk", "/daftar"],
    },
    sitemap: "https://kalamekar.id/sitemap.xml",
  };
}
