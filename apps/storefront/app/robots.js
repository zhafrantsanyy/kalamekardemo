export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/akun", "/mitra", "/admin", "/masuk", "/daftar", "/reset-password"],
    },
    sitemap: "https://kalamekar.id/sitemap.xml",
  };
}
