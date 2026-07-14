import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://kalamekar.id"),
  title: {
    default: "Kalamekar — Marketplace Florist Lokal Indonesia",
    template: "%s | Kalamekar",
  },
  description:
    "Kalamekar menghubungkan Anda dengan ratusan florist lokal terverifikasi di 25+ kota — hand bouquet, papan bunga, hingga dekorasi pernikahan. Pesan langsung, dikirim di hari yang sama.",
  openGraph: {
    title: "Kalamekar — Marketplace Florist Lokal Indonesia",
    description:
      "Temukan toko bunga & florist terpercaya di kotamu. Ratusan florist lokal terverifikasi di 25+ kota Indonesia.",
    siteName: "Kalamekar",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${bricolageGrotesque.variable} ${plusJakartaSans.variable}`}>
      <body className="rk-root">{children}</body>
    </html>
  );
}
