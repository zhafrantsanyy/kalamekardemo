import { SITE_URL } from "@kalamekar/shared/tokens";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/akun", "/mitra", "/admin", "/masuk", "/daftar", "/reset-password"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
