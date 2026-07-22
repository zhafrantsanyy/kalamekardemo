import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ChevronRight } from "lucide-react";
import { SITE_URL as BASE_URL } from "@kalamekar/shared/tokens";
import { blogPosts } from "@/lib/data/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: { absolute: `${post.judul} | Blog Kalamekar` },
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.judul,
      description: post.excerpt,
      url: `${BASE_URL}/blog/${slug}`,
      type: "article",
      publishedTime: post.tanggalPublish,
      ...(post.tanggalUpdate && { modifiedTime: post.tanggalUpdate }),
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const trail = [
    { name: "Beranda", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.judul, href: `/blog/${post.slug}` },
  ];

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.judul,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: post.tanggalPublish,
    ...(post.tanggalUpdate && { dateModified: post.tanggalUpdate }),
    image: post.coverImageAlt,
    publisher: { "@type": "Organization", name: "Kalamekar", url: BASE_URL },
    url: `${BASE_URL}/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${post.slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${BASE_URL}${t.href}`,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "40px 20px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", fontSize: 13, color: "var(--rk-ink-soft)", marginBottom: 20 }}>
            {trail.map((t, i) => (
              <span key={t.href} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                {i > 0 && <ChevronRight size={12} />}
                {i === trail.length - 1 ? (
                  <span style={{ color: "var(--rk-maroon)", fontWeight: 700 }}>{t.name}</span>
                ) : (
                  <Link href={t.href} className="rk-navlink rk-navlink-onlight" style={{ padding: 0 }}>{t.name}</Link>
                )}
              </span>
            ))}
          </nav>

          <h1 className="rk-serif" style={{ fontSize: "clamp(28px, 4.5vw, 40px)", color: "var(--rk-maroon-deep)", margin: "0 0 16px" }}>
            {post.judul}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 13.5, color: "var(--rk-ink-soft)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <User size={13} /> {post.author}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Calendar size={13} />
              {new Date(post.tanggalPublish).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: "8px 20px 56px" }}>
        <div
          style={{ maxWidth: 760, margin: "0 auto", fontSize: 15.5, lineHeight: 1.75, color: "var(--rk-ink)" }}
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </section>

      {post.relatedLinks.length > 0 && (
        <section style={{ background: "var(--rk-cream)", padding: "40px 20px 56px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 className="rk-serif" style={{ fontSize: 20, color: "var(--rk-maroon)", marginBottom: 14 }}>
              Baca juga
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {post.relatedLinks.map((l) => (
                <Link key={l.href} href={l.href} className="rk-link-chip rk-link-chip-active" style={{ justifyContent: "space-between" }}>
                  {l.label} <ChevronRight size={13} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
