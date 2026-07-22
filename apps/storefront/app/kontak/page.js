import { MessageCircle, Mail, Clock, MapPin, Store, Newspaper } from "lucide-react";
import { WA_NUMBER, SITE_URL } from "@kalamekar/shared/tokens";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: { absolute: "Kontak Kami — Kalamekar" },
  description:
    "Hubungi tim Kalamekar untuk pertanyaan, kerja sama florist, atau bantuan pemesanan. Respon cepat lewat WhatsApp.",
  alternates: { canonical: "/kontak" },
  openGraph: {
    title: "Kontak Kami — Kalamekar",
    description:
      "Hubungi tim Kalamekar untuk pertanyaan, kerja sama florist, atau bantuan pemesanan. Respon cepat lewat WhatsApp.",
    url: `${SITE_URL}/kontak`,
    type: "website",
  },
};

const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Kalamekar, saya ingin bertanya.")}`;

const CHANNELS = [
  { icon: Store, t: "Untuk pemesanan", d: "Chat langsung ke WhatsApp kami atau florist pilihanmu untuk detail dan konfirmasi pesanan." },
  { icon: Mail, t: "Untuk kerja sama florist", d: "Isi form di halaman ini atau kirim email — tim kami akan menghubungimu untuk proses verifikasi." },
  { icon: Newspaper, t: "Untuk media / press", d: "Kirim email ke press@kalamekar.id untuk pertanyaan liputan atau kerja sama media." },
];

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Kontak Kalamekar",
  url: `${SITE_URL}/kontak`,
  about: {
    "@type": "Organization",
    name: "Kalamekar",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+" + WA_NUMBER,
      contactType: "customer service",
      areaServed: "ID",
      availableLanguage: "Indonesian",
    },
  },
};

export default function KontakPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }} />

      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "72px 20px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span className="rk-eyebrow"><MessageCircle size={13} /> Kontak</span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(32px, 5vw, 46px)", color: "var(--rk-maroon-deep)", margin: "14px 0 16px" }}>
            Hubungi Kami
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--rk-ink-soft)", maxWidth: 640, marginBottom: 24 }}>
            Ada pertanyaan soal pemesanan, mau kerja sama sebagai florist partner, atau butuh bantuan lain?
            Cara tercepat menghubungi kami adalah lewat WhatsApp.
          </p>
          <a
            className="rk-btn rk-btn-primary"
            style={{ padding: "15px 28px", fontSize: 15.5, textDecoration: "none" }}
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} /> Chat via WhatsApp
          </a>
        </div>
      </section>

      <section style={{ padding: "48px 20px 72px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 40 }}>
          <ContactForm />

          <div>
            <h2 className="rk-serif" style={{ fontSize: 22, color: "var(--rk-ink)", marginBottom: 16 }}>Info operasional</h2>
            <div style={{ display: "grid", gap: 18, marginBottom: 28 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <Clock size={20} color="var(--rk-maroon)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>Jam layanan</div>
                  <div style={{ fontSize: 13.5, color: "var(--rk-ink-soft)" }}>Setiap hari, 08.00 – 20.00 WIB</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <MapPin size={20} color="var(--rk-maroon)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>Area cakupan</div>
                  <div style={{ fontSize: 13.5, color: "var(--rk-ink-soft)" }}>25+ kota di seluruh Indonesia dan terus bertambah</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <MessageCircle size={20} color="var(--rk-maroon)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>Estimasi respon</div>
                  <div style={{ fontSize: 13.5, color: "var(--rk-ink-soft)" }}>Biasanya dalam 1–2 jam pada jam layanan</div>
                </div>
              </div>
            </div>

            <h2 className="rk-serif" style={{ fontSize: 18, color: "var(--rk-ink)", marginBottom: 12 }}>Pilih channel sesuai kebutuhan</h2>
            <div style={{ display: "grid", gap: 14 }}>
              {CHANNELS.map((c) => (
                <div key={c.t} className="rk-card" style={{ padding: 16, display: "flex", gap: 12 }}>
                  <c.icon size={18} color="var(--rk-maroon)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{c.t}</div>
                    <div style={{ fontSize: 13, color: "var(--rk-ink-soft)", marginTop: 2 }}>{c.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
