import { Link, useNavigate } from "react-router-dom";
import { Eye, Target, Check, ShieldCheck, Heart, List, TrendingUp } from "lucide-react";
import { C } from "../lib/theme";

/* ---------------- Decorative flower mark ---------------- */

const FlowerMark = ({ color = C.maroon, size = 40 }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
    <g fill={color}>
      <ellipse cx="20" cy="9" rx="5.5" ry="8" />
      <ellipse cx="20" cy="9" rx="5.5" ry="8" transform="rotate(72 20 20)" />
      <ellipse cx="20" cy="9" rx="5.5" ry="8" transform="rotate(144 20 20)" />
      <ellipse cx="20" cy="9" rx="5.5" ry="8" transform="rotate(216 20 20)" />
      <ellipse cx="20" cy="9" rx="5.5" ry="8" transform="rotate(288 20 20)" />
    </g>
  </svg>
);

/* ---------------- Content ---------------- */

const STATS = [
  ["500+", "Florist lokal terverifikasi"],
  ["25+", "Kota di seluruh Indonesia"],
  ["10.000+", "Momen yang telah dimekarkan"],
  ["4.9/5", "Rata-rata rating pembeli"],
];

const MISI = [
  "Memberdayakan UMKM florist dengan etalase online, tanpa biaya masuk yang memberatkan.",
  "Menghadirkan pengalaman membeli bunga yang transparan — harga jelas, ulasan asli, kualitas terjaga.",
  "Menjaga standar layanan melalui kurasi dan verifikasi setiap florist yang bergabung.",
  "Memperluas jangkauan ke seluruh Indonesia, satu kota dalam satu waktu.",
];

const VALUES = [
  [ShieldCheck, "Kepercayaan dulu", "Kurasi ketat, galeri asli, dan ulasan nyata. Kepercayaan pembeli adalah modal utama setiap florist."],
  [Heart, "Lokal adalah kekuatan", "Kami tidak punya gudang bunga. Setiap rangkaian dibuat segar oleh tangan florist di kotamu."],
  [List, "Transparan selalu", "Harga dari florist, tanpa markup tersembunyi. Apa yang kamu lihat, itu yang kamu bayar."],
  [TrendingUp, "Tumbuh bersama", "Kalamekar hanya berhasil jika floristnya berhasil. Pertumbuhan kami diukur dari pertumbuhan mereka."],
];

const FOUNDERS = [
  {
    nama: "Zhafran",
    bio: "Zhafran memimpin arah produk dan teknologi Kalamekar. Ia merancang platform yang sederhana bagi pembeli namun bertenaga bagi florist — dari sistem pencarian per kota hingga etalase digital setiap toko. Baginya, teknologi terbaik adalah yang tidak terasa: cukup cari, pilih, dan bunga pun sampai.",
    quote: "Setiap florist lokal punya karya yang luar biasa. Tugas kami hanya memastikan dunia bisa menemukannya.",
    bg: C.roseSoft, fg: C.maroon, overlay: C.bloomDark, accent: C.gold, leaf: C.teal,
  },
  {
    nama: "Riswan",
    bio: "Riswan memimpin kemitraan dan operasional florist. Ia turun langsung ke pasar bunga dan toko-toko di berbagai kota — mendengarkan, memverifikasi, dan memastikan setiap florist yang bergabung siap memberikan layanan terbaik. Jaringan florist Kalamekar tumbuh dari pintu ke pintu yang ia ketuk.",
    quote: "Kami tidak sedang membangun aplikasi. Kami sedang membangun kepercayaan — satu florist dalam satu waktu.",
    bg: C.cream, fg: C.teal, overlay: C.maroonDeep, accent: C.gold, leaf: C.maroon,
  },
];

const MILESTONES = [
  ["Awal 2026", "Ide yang berakar", "Zhafran dan Riswan memulai riset ke pasar bunga dan puluhan florist lokal, memetakan tantangan mereka untuk hadir secara online."],
  ["Pertengahan 2026", "Kalamekar diluncurkan", "Platform tayang perdana dengan florist-florist terverifikasi pertama di Jakarta, Bandung, dan Surabaya."],
  ["Selanjutnya", "Mekar ke seluruh Indonesia", "Ekspansi ke 25+ kota, fitur pemesanan terintegrasi, dan program pemberdayaan untuk ribuan UMKM florist di seluruh negeri."],
];

/* ---------------- Page ---------------- */

export default function About() {
  const navigate = useNavigate();
  const goSection = (id) => {
    navigate("/");
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  return (
    <div>
      {/* Page hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "88px 20px 72px", textAlign: "center" }}>
        <div style={{ position: "absolute", top: -140, left: -140, width: 380, height: 380, opacity: 0.09, pointerEvents: "none" }}>
          <FlowerMark color={C.maroon} size={380} />
        </div>
        <div style={{ position: "absolute", bottom: -180, right: -140, width: 380, height: 380, opacity: 0.09, pointerEvents: "none" }}>
          <FlowerMark color={C.teal} size={380} />
        </div>
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <span className="rk-eyebrow" style={{ justifyContent: "center" }}>
            <FlowerMark color={C.maroon} size={14} /> Tentang Kalamekar
          </span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(38px, 5.4vw, 60px)", letterSpacing: "-.015em", color: C.maroonDeep, maxWidth: 760, margin: "18px auto 0" }}>
            Membuat setiap momen{" "}
            <em style={{ fontStyle: "normal", color: C.maroon, position: "relative", whiteSpace: "nowrap" }}>
              <span style={{ position: "absolute", left: 0, right: 0, bottom: 5, height: 11, background: C.roseSoft, zIndex: -1, borderRadius: 6 }} />
              mekar
            </em>
          </h1>
          <p style={{ margin: "22px auto 0", fontSize: 17.5, color: C.inkSoft, maxWidth: 640 }}>
            Kalamekar lahir dari keyakinan sederhana: di balik setiap momen penting orang Indonesia, ada florist
            lokal yang layak ditemukan. Kami membangun jembatan antara keduanya.
          </p>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: "88px 20px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 64, alignItems: "center" }}>
          <div>
            <span className="rk-eyebrow">Cerita Kami</span>
            <h2 className="rk-serif" style={{ marginTop: 14, color: C.ink }}>Berawal dari pasar bunga</h2>
            <p style={{ color: C.inkSoft, marginTop: 16, fontSize: 16.5, lineHeight: 1.65 }}>
              Nama <strong style={{ color: C.ink }}>Kalamekar</strong> berasal dari kata <em>kala</em> (waktu) dan <em>mekar</em> — waktu ketika
              bunga sedang berada di puncak keindahannya. Bagi kami, itu juga gambaran momen-momen terbaik dalam
              hidup: kelulusan, pernikahan, pembukaan usaha, hingga ucapan perpisahan yang tulus.
            </p>
            <p style={{ color: C.inkSoft, marginTop: 16, fontSize: 16.5, lineHeight: 1.65 }}>
              Kami melihat sebuah kesenjangan: <strong style={{ color: C.ink }}>ribuan florist lokal berbakat</strong> di
              seluruh Indonesia masih sulit ditemukan secara online, sementara pembeli kesulitan menemukan toko
              bunga yang terpercaya, transparan harganya, dan bisa mengirim tepat waktu.
            </p>
            <p style={{ color: C.inkSoft, marginTop: 16, fontSize: 16.5, lineHeight: 1.65 }}>
              Kalamekar hadir untuk menutup kesenjangan itu — bukan menggantikan florist lokal, melainkan{" "}
              <strong style={{ color: C.ink }}>memekarkan usaha mereka</strong>. Setiap pesanan di Kalamekar adalah
              dukungan langsung untuk UMKM florist di kotamu.
            </p>
          </div>
          <div aria-hidden="true">
            <svg viewBox="0 0 460 400" style={{ width: "100%" }}>
              <rect x="30" y="40" width="400" height="320" rx="24" fill={C.roseSoft} />
              <g fill={C.maroon}>
                <ellipse cx="230" cy="130" rx="26" ry="42" />
                <ellipse cx="230" cy="130" rx="26" ry="42" transform="rotate(72 230 200)" />
                <ellipse cx="230" cy="130" rx="26" ry="42" transform="rotate(144 230 200)" />
                <ellipse cx="230" cy="130" rx="26" ry="42" transform="rotate(216 230 200)" />
                <ellipse cx="230" cy="130" rx="26" ry="42" transform="rotate(288 230 200)" />
              </g>
              <circle cx="230" cy="200" r="24" fill={C.gold} />
              <g fill={C.teal}>
                <ellipse cx="110" cy="320" rx="8" ry="20" transform="rotate(-30 110 320)" />
                <ellipse cx="350" cy="320" rx="8" ry="20" transform="rotate(30 350 320)" />
                <ellipse cx="80" cy="90" rx="6" ry="15" transform="rotate(40 80 90)" />
                <ellipse cx="382" cy="88" rx="6" ry="15" transform="rotate(-40 382 88)" />
              </g>
              <circle cx="95" cy="300" r="10" fill={C.bloomDark} />
              <circle cx="365" cy="300" r="10" fill={C.bloomDark} />
              <circle cx="70" cy="115" r="7" fill={C.gold} />
              <circle cx="392" cy="112" r="7" fill={C.gold} />
            </svg>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: C.maroonDeep, color: "#fff" }} aria-label="Kalamekar dalam angka">
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 32, padding: "56px 20px" }}>
          {STATS.map(([n, l]) => (
            <div key={l}>
              <strong className="rk-serif" style={{ fontSize: "clamp(30px, 3.6vw, 42px)", fontWeight: 700, display: "block", color: C.gold }}>{n}</strong>
              <span style={{ fontSize: 14, color: "#CBD8CC" }}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Visi & Misi */}
      <section style={{ padding: "88px 20px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <span className="rk-eyebrow">Arah Kami</span>
          <h2 className="rk-serif" style={{ marginTop: 14, marginBottom: 44, color: C.ink }}>Visi &amp; misi Kalamekar</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            <div style={{ background: C.roseSoft, borderRadius: 18, padding: 38 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, color: C.bloomDark }}>
                <Eye size={26} strokeWidth={1.8} />
                <h3 className="rk-serif" style={{ fontSize: 23 }}>Visi</h3>
              </div>
              <p style={{ color: C.inkSoft, fontSize: 15.5 }}>
                Menjadi rumah digital bagi industri floristri Indonesia — tempat setiap orang menemukan bunga
                terbaik untuk momen pentingnya, dan setiap florist lokal, dari kota besar hingga kabupaten,
                mendapat panggung yang setara untuk tumbuh dan mekar.
              </p>
            </div>
            <div style={{ background: C.cream, borderRadius: 18, padding: 38 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, color: C.maroonDeep }}>
                <Target size={26} strokeWidth={1.8} />
                <h3 className="rk-serif" style={{ fontSize: 23 }}>Misi</h3>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {MISI.map((m) => (
                  <div key={m} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Check size={17} style={{ flexShrink: 0, marginTop: 4, color: C.teal }} />
                    <span style={{ color: C.inkSoft, fontSize: 15.5 }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: C.cream, padding: "88px 20px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <span className="rk-eyebrow">Nilai Kami</span>
          <h2 className="rk-serif" style={{ marginTop: 14, marginBottom: 44, color: C.ink }}>Yang kami pegang setiap hari</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {VALUES.map(([Ic, t, d]) => (
              <div key={t} className="rk-card" style={{ padding: 28 }}>
                <span style={{ width: 44, height: 44, borderRadius: "50%", background: C.roseSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Ic size={22} color={C.maroon} strokeWidth={1.8} />
                </span>
                <h3 style={{ fontSize: 17.5, marginBottom: 6, color: C.ink }}>{t}</h3>
                <p style={{ fontSize: 14, color: C.inkSoft }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section style={{ padding: "88px 20px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <span className="rk-eyebrow">Di Balik Kalamekar</span>
          <h2 className="rk-serif" style={{ marginTop: 14, color: C.ink }}>Para pendiri</h2>
          <p style={{ color: C.inkSoft, marginTop: 14, marginBottom: 44, maxWidth: 620 }}>
            Dua sahabat dengan satu keyakinan: teknologi seharusnya memekarkan usaha lokal, bukan menggantikannya.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 28, maxWidth: 920 }}>
            {FOUNDERS.map((f) => (
              <article key={f.nama} className="rk-founder-card">
                <div style={{ height: 240, position: "relative" }} aria-hidden="true">
                  <svg viewBox="0 0 460 240" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
                    <rect width="460" height="240" fill={f.bg} />
                    <circle cx="230" cy="105" r="46" fill={f.fg} />
                    <path d="M140 240c8-52 46-80 90-80s82 28 90 80z" fill={f.fg} />
                    <circle cx="230" cy="105" r="46" fill={f.overlay} opacity=".25" />
                    <g fill={f.accent}><circle cx="70" cy="60" r="9" /><circle cx="395" cy="185" r="9" /></g>
                    <g fill={f.leaf}>
                      <ellipse cx="52" cy="190" rx="6" ry="14" transform="rotate(-30 52 190)" />
                      <ellipse cx="408" cy="55" rx="6" ry="14" transform="rotate(30 408 55)" />
                    </g>
                  </svg>
                </div>
                <div style={{ padding: 28 }}>
                  <h3 className="rk-serif" style={{ fontSize: 22, color: C.ink }}>{f.nama}</h3>
                  <span style={{ display: "inline-block", marginTop: 8, fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.maroon, background: C.roseSoft, padding: "5px 12px", borderRadius: 999 }}>
                    Co-Founder
                  </span>
                  <p style={{ marginTop: 16, fontSize: 14.5, color: C.inkSoft, lineHeight: 1.6 }}>{f.bio}</p>
                  <p className="rk-serif" style={{ marginTop: 18, paddingLeft: 14, borderLeft: `3px solid ${C.gold}`, fontSize: 15.5, fontWeight: 500, color: C.maroonDeep, fontStyle: "italic" }}>
                    "{f.quote}"
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: "0 20px 88px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <span className="rk-eyebrow">Perjalanan Kami</span>
          <h2 className="rk-serif" style={{ marginTop: 14, marginBottom: 44, color: C.ink }}>Jejak yang terus mekar</h2>
          <div style={{ maxWidth: 720, position: "relative", paddingLeft: 36 }}>
            <div style={{ position: "absolute", left: 10, top: 8, bottom: 8, width: 2, background: C.line }} />
            {MILESTONES.map(([when, t, d], i) => (
              <div key={t} style={{ position: "relative", paddingBottom: i < MILESTONES.length - 1 ? 36 : 0 }}>
                <span style={{ position: "absolute", left: -33, top: 6, width: 16, height: 16, borderRadius: "50%", background: C.maroon, border: `3px solid ${C.roseSoft}` }} />
                <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.teal }}>{when}</div>
                <h3 className="rk-serif" style={{ fontSize: 19, marginTop: 6, color: C.ink }}>{t}</h3>
                <p style={{ fontSize: 14.5, color: C.inkSoft, marginTop: 6, maxWidth: 560 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 20px 88px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ background: C.maroonDeep, borderRadius: 24, color: "#fff", textAlign: "center", padding: "64px 40px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", width: 300, height: 300, opacity: 0.1, right: -90, top: -90, pointerEvents: "none" }}>
              <FlowerMark color={C.gold} size={300} />
            </div>
            <h2 className="rk-serif" style={{ color: "#fff", maxWidth: 620, margin: "0 auto", position: "relative" }}>
              Ikut membuat Indonesia <em style={{ fontStyle: "normal", color: C.gold }}>mekar</em>?
            </h2>
            <p style={{ color: "#CBD8CC", margin: "16px auto 0", maxWidth: 520, position: "relative" }}>
              Temukan florist terbaik di kotamu, atau daftarkan toko bungamu dan jangkau ribuan pembeli baru.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Link className="rk-btn" style={{ background: C.gold, color: C.maroonDeep, textDecoration: "none" }} to="/">
                Cari Florist di Kotamu
              </Link>
              <button
                type="button"
                className="rk-btn"
                style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.5)" }}
                onClick={() => goSection("untuk-floris")}
              >
                Gabung Sebagai Florist
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
