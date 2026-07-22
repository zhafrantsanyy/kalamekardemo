import { BookOpen } from "lucide-react";
import { SITE_URL as BASE_URL } from "@kalamekar/shared/tokens";
import BlogGrid from "@/components/blog/BlogGrid";
import { blogPosts } from "@/lib/data/blog";

export function generateMetadata() {
  const hasPosts = blogPosts.length > 0;
  return {
    title: { absolute: "Blog Kalamekar — Tips, Inspirasi, dan Panduan Seputar Bunga" },
    description:
      "Tips perawatan bunga, inspirasi rangkaian, dan panduan pemesanan dari tim Kalamekar. Baca artikel terbaru seputar dunia florist Indonesia.",
    alternates: { canonical: "/blog" },
    // Halaman kosong secara teknis valid untuk index, tapi kurang ideal — sembunyikan
    // dari index sampai minimal ada 1 artikel, lalu otomatis jadi indexable.
    robots: { index: hasPosts, follow: true },
    openGraph: {
      title: "Blog Kalamekar — Tips, Inspirasi, dan Panduan Seputar Bunga",
      description:
        "Tips perawatan bunga, inspirasi rangkaian, dan panduan pemesanan dari tim Kalamekar. Baca artikel terbaru seputar dunia florist Indonesia.",
      url: `${BASE_URL}/blog`,
      type: "website",
    },
  };
}

export default function BlogPage() {
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Kalamekar",
    url: `${BASE_URL}/blog`,
    description: "Tips perawatan bunga, inspirasi rangkaian, dan panduan pemesanan dari tim Kalamekar.",
    ...(blogPosts.length > 0 && {
      blogPost: blogPosts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.judul,
        url: `${BASE_URL}/blog/${post.slug}`,
        datePublished: post.tanggalPublish,
        ...(post.tanggalUpdate && { dateModified: post.tanggalUpdate }),
      })),
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "72px 20px 56px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span className="rk-eyebrow"><BookOpen size={13} /> Blog</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            Blog Kalamekar
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 680 }}>
            Kumpulan tips perawatan bunga, inspirasi rangkaian, dan panduan pemesanan dari tim Kalamekar dan
            florist partner kami — supaya kamu makin percaya diri setiap kali memilih atau merawat bunga.
          </p>
        </div>
      </section>

      <section style={{ padding: "8px 20px 80px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <BlogGrid posts={blogPosts} />
        </div>
      </section>
    </div>
  );
}
