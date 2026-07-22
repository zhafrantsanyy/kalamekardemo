import Link from "next/link";
import { Leaf, ShoppingBag } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "calc(100dvh - 61px)" }}>
      <div
        className="rk-auth-panel"
        style={{
          flex: "0 0 42%",
          background: "linear-gradient(160deg, var(--rk-maroon-deep) 0%, #0f2a1c 100%)",
          color: "#fff",
          padding: "44px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,140,170,.18) 0%, rgba(217,140,170,0) 70%)",
            top: -120,
            right: -140,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(230,169,59,.14) 0%, rgba(230,169,59,0) 70%)",
            bottom: -100,
            left: -100,
          }}
        />

        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", position: "relative" }}>
          <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={15} color="#fff" />
          </span>
          <span className="rk-serif" style={{ color: "#fff", fontSize: 19, fontWeight: 700, letterSpacing: 0.4 }}>Kalamekar</span>
        </Link>

        <div style={{ position: "relative" }}>
          <h2 className="rk-serif" style={{ fontSize: "clamp(26px, 3vw, 34px)", lineHeight: 1.25, margin: "0 0 14px" }}>
            Bunga segar, dikirim langsung dari florist lokal terpercaya.
          </h2>
          <p style={{ fontSize: 14.5, color: "rgba(238,244,236,.8)", lineHeight: 1.6, maxWidth: 380 }}>
            Ratusan florist terverifikasi di 25+ kota siap merangkai dan mengantar bunga terbaik untuk momen pentingmu — hari ini juga.
          </p>
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "rgba(238,244,236,.75)" }}>
          <ShoppingBag size={15} />
          <span>Kamu tetap bisa memesan tanpa akun — cek juga <Link href="/kategori" style={{ color: "#fff", fontWeight: 700, textDecoration: "underline" }}>katalog bunga</Link>.</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px", background: "#fff" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>{children}</div>
      </div>
    </div>
  );
}
