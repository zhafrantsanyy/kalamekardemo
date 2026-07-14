import { useNavigate } from "react-router-dom";
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

/* ---------------- Repeated petal ring (for flower icons) ---------------- */

const Petals = ({ count, fill, cy, rx, ry }) =>
  Array.from({ length: count }, (_, i) => (
    <ellipse key={i} cx="23" cy={cy} rx={rx} ry={ry} fill={fill} transform={`rotate(${(360 / count) * i} 23 23)`} />
  ));

/* ---------------- Category illustrations ---------------- */

const HandBouquetArt = () => (
  <svg viewBox="0 0 300 260" preserveAspectRatio="xMidYMid slice">
    <rect width="300" height="260" fill={C.roseSoft} />
    <path d="M150 245l-26-70h52z" fill="#F0DCB8" />
    <line x1="150" y1="175" x2="150" y2="140" stroke={C.teal} strokeWidth="4" />
    <circle cx="150" cy="112" r="30" fill={C.maroon} />
    <circle cx="112" cy="128" r="22" fill={C.bloomDark} />
    <circle cx="188" cy="128" r="22" fill={C.gold} />
    <circle cx="126" cy="95" r="16" fill="#E58BB0" />
    <circle cx="174" cy="95" r="16" fill="#F2BD59" />
    <ellipse cx="96" cy="100" rx="7" ry="17" fill={C.teal} transform="rotate(-35 96 100)" />
    <ellipse cx="204" cy="100" rx="7" ry="17" fill={C.teal} transform="rotate(35 204 100)" />
  </svg>
);

const PapanBungaArt = () => (
  <svg viewBox="0 0 300 260" preserveAspectRatio="xMidYMid slice">
    <rect width="300" height="260" fill={C.cream} />
    <rect x="55" y="40" width="190" height="140" rx="10" fill="#fff" stroke={C.teal} strokeWidth="2.5" />
    <line x1="105" y1="180" x2="85" y2="235" stroke={C.teal} strokeWidth="5" strokeLinecap="round" />
    <line x1="195" y1="180" x2="215" y2="235" stroke={C.teal} strokeWidth="5" strokeLinecap="round" />
    <text x="150" y="105" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontSize="17" fontWeight="700" fill={C.bloomDark}>Selamat &amp; Sukses</text>
    <text x="150" y="130" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="600" fill={C.teal}>Grand Opening</text>
    <g fill={C.maroon}><circle cx="58" cy="45" r="11" /><circle cx="242" cy="45" r="11" /><circle cx="58" cy="175" r="9" /><circle cx="242" cy="175" r="9" /></g>
    <g fill={C.gold}><circle cx="76" cy="38" r="6" /><circle cx="224" cy="38" r="6" /></g>
  </svg>
);

const StandingFlowerArt = () => (
  <svg viewBox="0 0 300 260" preserveAspectRatio="xMidYMid slice">
    <rect width="300" height="260" fill={C.roseSoft} />
    <line x1="150" y1="130" x2="150" y2="225" stroke={C.teal} strokeWidth="5" />
    <path d="M118 225h64l8 14h-80z" fill={C.teal} />
    <circle cx="150" cy="85" r="34" fill={C.maroon} />
    <circle cx="115" cy="105" r="20" fill={C.gold} />
    <circle cx="185" cy="105" r="20" fill={C.bloomDark} />
    <circle cx="130" cy="65" r="14" fill="#E58BB0" />
    <circle cx="170" cy="65" r="14" fill="#F2BD59" />
    <ellipse cx="100" cy="80" rx="6" ry="16" fill={C.teal} transform="rotate(-35 100 80)" />
    <ellipse cx="200" cy="80" rx="6" ry="16" fill={C.teal} transform="rotate(35 200 80)" />
  </svg>
);

const BungaMejaArt = () => (
  <svg viewBox="0 0 300 260" preserveAspectRatio="xMidYMid slice">
    <rect width="300" height="260" fill={C.cream} />
    <path d="M120 150h60l-8 60a10 10 0 0 1-10 9h-24a10 10 0 0 1-10-9z" fill="#fff" stroke={C.teal} strokeWidth="2.5" />
    <circle cx="150" cy="112" r="24" fill={C.maroon} />
    <circle cx="122" cy="126" r="16" fill={C.gold} />
    <circle cx="178" cy="126" r="16" fill={C.bloomDark} />
    <circle cx="134" cy="92" r="11" fill="#E58BB0" />
    <circle cx="166" cy="92" r="11" fill="#F2BD59" />
    <ellipse cx="110" cy="102" rx="5" ry="13" fill={C.teal} transform="rotate(-35 110 102)" />
    <ellipse cx="190" cy="102" rx="5" ry="13" fill={C.teal} transform="rotate(35 190 102)" />
  </svg>
);

const ParcelArt = () => (
  <svg viewBox="0 0 300 260" preserveAspectRatio="xMidYMid slice">
    <rect width="300" height="260" fill={C.roseSoft} />
    <rect x="90" y="120" width="120" height="90" rx="8" fill="#fff" stroke={C.teal} strokeWidth="2.5" />
    <line x1="90" y1="150" x2="210" y2="150" stroke={C.teal} strokeWidth="2.5" />
    <line x1="150" y1="120" x2="150" y2="210" stroke={C.maroon} strokeWidth="5" />
    <path d="M150 120c-14 0-24-8-24-18 0-8 6-12 12-12 8 0 12 12 12 30zm0 0c14 0 24-8 24-18 0-8-6-12-12-12-8 0-12 12-12 30z" fill="none" stroke={C.maroon} strokeWidth="4" />
    <circle cx="112" cy="108" r="9" fill={C.gold} />
    <circle cx="190" cy="108" r="9" fill={C.bloomDark} />
  </svg>
);

const DekorasiArt = () => (
  <svg viewBox="0 0 300 260" preserveAspectRatio="xMidYMid slice">
    <rect width="300" height="260" fill={C.cream} />
    <path d="M70 90a90 90 0 0 1 160 0" fill="none" stroke={C.teal} strokeWidth="4" />
    <line x1="70" y1="90" x2="70" y2="210" stroke={C.teal} strokeWidth="4" />
    <line x1="230" y1="90" x2="230" y2="210" stroke={C.teal} strokeWidth="4" />
    <g fill={C.maroon}><circle cx="70" cy="92" r="11" /><circle cx="230" cy="92" r="11" /><circle cx="150" cy="42" r="12" /><circle cx="104" cy="58" r="9" /><circle cx="196" cy="58" r="9" /></g>
    <g fill={C.gold}><circle cx="126" cy="47" r="7" /><circle cx="174" cy="47" r="7" /><circle cx="70" cy="130" r="7" /><circle cx="230" cy="130" r="7" /></g>
    <g fill={C.bloomDark}><circle cx="70" cy="165" r="8" /><circle cx="230" cy="165" r="8" /></g>
  </svg>
);

const CATEGORIES_DETAIL = [
  {
    id: "hand-bouquet", title: "Hand Bouquet", harga: "Mulai Rp 150 rb", mode: "bouquet", Art: HandBouquetArt,
    desc: "Buket tangan yang dirangkai segar dan dibungkus rapi — bentuk paling personal untuk menyampaikan perasaan. Tersedia gaya round bouquet, korean wrap, hingga buket artificial dan buket uang.",
    cocok: [{ label: "Wisuda", mode: "bouquet" }, { label: "Anniversary", mode: "bouquet" }, { label: "Valentine", mode: "bouquet" }, { label: "Ulang Tahun", mode: "bouquet" }, { label: "Lamaran" }, { label: "Kelahiran Bayi" }],
    bunga: ["Mawar", "Lily", "Tulip", "Baby's Breath", "Peony"],
    ctaLabel: "Lihat florist hand bouquet",
  },
  {
    id: "papan-bunga", title: "Papan Bunga", harga: "Mulai Rp 400 rb", mode: "wreath", Art: PapanBungaArt,
    desc: "Ikon floristri Indonesia — papan besar berhias bunga segar atau styrofoam dengan tulisan ucapan. Cara paling terlihat untuk menyampaikan selamat, dukungan, atau belasungkawa atas nama pribadi maupun perusahaan.",
    cocok: [{ label: "Grand Opening", mode: "wreath" }, { label: "Pernikahan", mode: "wreath" }, { label: "Duka Cita", mode: "wreath" }, { label: "Selamat & Sukses" }, { label: "Promosi Jabatan" }],
    bunga: ["Krisan", "Mawar", "Anggrek", "Sedap Malam", "Anyelir"],
    ctaLabel: "Lihat florist papan bunga",
  },
  {
    id: "standing-flower", title: "Standing Flower", harga: "Mulai Rp 350 rb", mode: "wreath", Art: StandingFlowerArt,
    desc: "Rangkaian bunga segar di atas tripod atau standar besi — lebih elegan dan personal dibanding papan, namun tetap mencolok di venue acara. Pilihan favorit untuk acara formal dan seremonial.",
    cocok: [{ label: "Grand Opening", mode: "wreath" }, { label: "Duka Cita", mode: "wreath" }, { label: "Seminar & Peresmian" }, { label: "Pernikahan" }, { label: "Acara Korporat" }],
    bunga: ["Lily", "Krisan", "Gerbera", "Mawar", "Anggrek"],
    ctaLabel: "Lihat florist standing flower",
  },
  {
    id: "bunga-meja", title: "Bunga Meja", harga: "Mulai Rp 100 rb", mode: "bouquet", Art: BungaMejaArt,
    desc: "Rangkaian dalam vas atau box untuk mempercantik ruangan — dari meja resepsionis kantor hingga meja makan di rumah. Tersedia juga langganan mingguan untuk kantor dan kafe.",
    cocok: [{ label: "Dekor Kantor" }, { label: "Hadiah Rumah Baru" }, { label: "Meja Resepsionis" }, { label: "Restoran & Kafe" }, { label: "Hadiah untuk Ibu", mode: "bouquet" }],
    bunga: ["Hydrangea", "Tulip", "Aster", "Matahari", "Anggrek Bulan"],
    ctaLabel: "Lihat florist bunga meja",
  },
  {
    id: "parcel", title: "Parcel & Hampers", harga: "Mulai Rp 250 rb", mode: "bouquet", Art: ParcelArt,
    desc: "Bingkisan bunga yang dipadukan dengan buah segar, camilan premium, atau perawatan diri — hadiah lengkap dalam satu keranjang cantik. Favorit saat hari raya dan momen syukuran.",
    cocok: [{ label: "Lebaran & Natal" }, { label: "Imlek" }, { label: "Jenguk Orang Sakit" }, { label: "Kelahiran Bayi" }, { label: "Hadiah Klien" }],
    bunga: ["Mawar", "Anyelir", "Baby's Breath", "Aster"],
    ctaLabel: "Lihat florist parcel & hampers",
  },
  {
    id: "dekorasi", title: "Dekorasi Acara", harga: "Sesuai Konsultasi", mode: "wreath", Art: DekorasiArt,
    desc: "Dekorasi bunga menyeluruh untuk momen besar — gerbang pelaminan, backdrop lamaran, centerpiece meja tamu, hingga instalasi bunga untuk peluncuran produk. Dikerjakan langsung oleh tim florist berpengalaman.",
    cocok: [{ label: "Pernikahan", mode: "wreath" }, { label: "Lamaran & Tunangan" }, { label: "Akad & Resepsi" }, { label: "Peluncuran Produk" }, { label: "Gala & Korporat" }],
    bunga: ["Mawar", "Hydrangea", "Anggrek", "Peony", "Baby's Breath"],
    ctaLabel: "Lihat florist dekorasi",
  },
];

/* ---------------- Occasion icons ---------------- */

const OCCASIONS_KATEGORI = [
  { nama: "Wisuda", mode: "bouquet", desc: "Hand bouquet segar atau artificial untuk sang wisudawan.",
    icon: <><path d="M3 9l9-4 9 4-9 4z" /><path d="M7 11v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4" /></> },
  { nama: "Pernikahan", mode: "wreath", desc: "Papan ucapan, buket pengantin, hingga dekorasi pelaminan.",
    icon: <><circle cx="9" cy="14" r="5" /><circle cx="15" cy="14" r="5" /><path d="M12 6l1.5-2h-3z" /></> },
  { nama: "Duka Cita", mode: "wreath", desc: "Papan bunga dan standing flower untuk belasungkawa yang tulus.",
    icon: <path d="M12 21c-4-2.5-8-5.5-8-10a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 4.5-4 7.5-8 10z" /> },
  { nama: "Grand Opening", mode: "wreath", desc: "Papan bunga dan standing flower pembawa doa kesuksesan.",
    icon: <><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-6h6v6" /></> },
  { nama: "Anniversary", mode: "bouquet", desc: "Buket mawar klasik atau rangkaian box mewah untuk pasangan.",
    icon: <><path d="M12 21c-4-2.5-8-5.5-8-10a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 4.5-4 7.5-8 10z" /><path d="M12 7v4l2.5 1.5" /></> },
  { nama: "Ulang Tahun", mode: "bouquet", desc: "Buket ceria warna-warni sesuai kepribadian penerimanya.",
    icon: <path d="M5 21h14M6 21v-8h12v8M12 9v4m0-7a1.5 1.5 0 0 0 1.5-1.5C13.5 3.5 12 2 12 2s-1.5 1.5-1.5 2.5A1.5 1.5 0 0 0 12 6z" /> },
  { nama: "Valentine", mode: "bouquet", desc: "Mawar merah, tulip, dan buket romantis edisi 14 Februari.",
    icon: <path d="M12 21c-4-2.5-8-5.5-8-10a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 4.5-4 7.5-8 10z" /> },
  { nama: "Untuk Ibu", mode: "bouquet", desc: "Anyelir dan lily — bunga penuh makna untuk sosok terkasih.",
    icon: <><circle cx="12" cy="8" r="4" /><path d="M5 21c1-4 3.5-6 7-6s6 2 7 6" /></> },
];

/* ---------------- Flower dictionary ---------------- */

const FLOWERS_DICT = [
  { nama: "Mawar", latin: "Rosa", cocok: "Valentine · Anniversary",
    makna: "cinta, penghargaan, dan keberanian. Merah untuk asmara, putih untuk ketulusan, kuning untuk persahabatan.",
    icon: <><circle cx="23" cy="23" r="13" fill={C.maroon} /><circle cx="23" cy="23" r="8" fill={C.bloomDark} /><circle cx="23" cy="23" r="3.5" fill="#E58BB0" /></> },
  { nama: "Lily", latin: "Lilium", cocok: "Duka Cita · Standing Flower",
    makna: "kesucian, kemurnian, dan simpati. Lily putih adalah bahasa duka yang paling anggun.",
    icon: <><g fill="#F2E8D5"><Petals count={6} fill="#F2E8D5" cy={12} rx={6} ry={11} /></g><circle cx="23" cy="23" r="4" fill={C.gold} /></> },
  { nama: "Tulip", latin: "Tulipa", cocok: "Hand Bouquet · Bunga Meja",
    makna: "cinta yang sempurna dan awal yang baru. Elegan tanpa berlebihan.",
    icon: <><path d="M23 40V22" stroke={C.teal} strokeWidth="3" /><path d="M14 12c0 8 4 13 9 13s9-5 9-13c-3 3-6 3-9 0-3 3-6 3-9 0z" fill="#E05A7A" /></> },
  { nama: "Anggrek", latin: "Orchidaceae", cocok: "Papan Bunga · Hadiah Formal",
    makna: "kemewahan, kekuatan, dan keanggunan. Kebanggaan flora Indonesia, tahan lama sebagai tanaman hias.",
    icon: <><g fill="#C58BD9"><ellipse cx="23" cy="13" rx="7" ry="10" /><ellipse cx="13" cy="26" rx="7" ry="10" transform="rotate(-60 13 26)" /><ellipse cx="33" cy="26" rx="7" ry="10" transform="rotate(60 33 26)" /></g><circle cx="23" cy="22" r="5" fill={C.bloomDark} /></> },
  { nama: "Krisan", latin: "Chrysanthemum", cocok: "Papan Bunga · Duka Cita",
    makna: "kesetiaan, umur panjang, dan penghormatan. Tulang punggung papan bunga Indonesia.",
    icon: <><g fill="#F2BD59"><Petals count={12} fill="#F2BD59" cy={11} rx={4} ry={9} /></g><circle cx="23" cy="23" r="6" fill="#7A4A12" /></> },
  { nama: "Baby's Breath", latin: "Gypsophila", cocok: "Hand Bouquet · Wisuda",
    makna: "cinta yang murni dan abadi. Cantik sebagai pelengkap maupun buket utuh yang lembut.",
    icon: <g fill="#FFFFFF" stroke="#D8E2DA" strokeWidth="1"><circle cx="14" cy="14" r="4.5" /><circle cx="30" cy="11" r="4" /><circle cx="35" cy="24" r="4.5" /><circle cx="24" cy="30" r="4" /><circle cx="11" cy="29" r="4" /><circle cx="22" cy="19" r="4.5" /></g> },
  { nama: "Bunga Matahari", latin: "Helianthus", cocok: "Wisuda · Ulang Tahun",
    makna: "kebahagiaan, semangat, dan kesetiaan. Buket paling ceria untuk merayakan pencapaian.",
    icon: <><g fill={C.gold}><Petals count={8} fill={C.gold} cy={10} rx={4.5} ry={9} /></g><circle cx="23" cy="23" r="7" fill="#5C3D10" /></> },
  { nama: "Peony", latin: "Paeonia", cocok: "Pernikahan · Buket Premium",
    makna: "kemakmuran, pernikahan bahagia, dan kehormatan. Mekar mewah favorit buket premium.",
    icon: <><g fill="#E58BB0"><circle cx="23" cy="23" r="13" /><circle cx="16" cy="18" r="6" opacity=".7" /><circle cx="30" cy="18" r="6" opacity=".7" /><circle cx="17" cy="29" r="6" opacity=".7" /><circle cx="29" cy="29" r="6" opacity=".7" /></g><circle cx="23" cy="23" r="4" fill={C.maroon} /></> },
  { nama: "Hydrangea", latin: "Hydrangea", cocok: "Dekorasi · Bunga Meja",
    makna: "rasa syukur dan ketulusan hati. Gerombolan kelopaknya memberi kesan penuh dan mewah.",
    icon: <g fill="#8FA8D9"><circle cx="16" cy="16" r="6" /><circle cx="30" cy="14" r="6" /><circle cx="34" cy="27" r="6" /><circle cx="23" cy="33" r="6" /><circle cx="12" cy="28" r="6" /><circle cx="23" cy="22" r="6" /></g> },
  { nama: "Gerbera", latin: "Gerbera", cocok: "Standing Flower · Ulang Tahun",
    makna: "keceriaan dan energi positif. Warna-warninya menghidupkan standing flower dan buket.",
    icon: <><g fill="#E05A7A"><Petals count={10} fill="#E05A7A" cy={11} rx={4} ry={9} /></g><circle cx="23" cy="23" r="5.5" fill="#5C1F33" /></> },
  { nama: "Anyelir", latin: "Dianthus caryophyllus", cocok: "Untuk Ibu · Parcel",
    makna: "cinta seorang ibu dan kekaguman. Bunga wajib untuk Hari Ibu dan rangkaian penuh hormat.",
    icon: <><g fill="#E58BB0"><path d="M23 23c-7-2-10-7-8-13 5 1 8 5 8 13zm0 0c7-2 10-7 8-13-5 1-8 5-8 13zm0 0c-8 1-13-2-14-9 6-1 11 2 14 9zm0 0c8 1 13-2 14-9-6-1-11 2-14 9z" /></g><circle cx="23" cy="26" r="6" fill={C.maroon} /></> },
  { nama: "Aster / Daisy", latin: "Asteraceae", cocok: "Hand Bouquet · Bunga Meja",
    makna: "kepolosan, harapan, dan persahabatan. Sederhana, manis, dan ramah di kantong.",
    icon: <><g fill="#F7F3EA"><Petals count={12} fill="#F7F3EA" cy={11} rx={3.5} ry={9} /></g><circle cx="23" cy="23" r="6" fill={C.gold} /></> },
];

/* ---------------- Page ---------------- */

export default function Kategori() {
  const navigate = useNavigate();
  const openBuilder = (mode) => navigate("/builder", { state: { mode } });
  const goSection = (id) => {
    navigate("/");
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
  };
  const jumpTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div>
      {/* Page hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 80%)", padding: "80px 20px 64px", textAlign: "center" }}>
        <div style={{ position: "absolute", top: -140, left: -140, width: 360, height: 360, opacity: 0.09, pointerEvents: "none" }}>
          <FlowerMark color={C.maroon} size={360} />
        </div>
        <div style={{ position: "absolute", bottom: -180, right: -140, width: 360, height: 360, opacity: 0.09, pointerEvents: "none" }}>
          <FlowerMark color={C.teal} size={360} />
        </div>
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <span className="rk-eyebrow" style={{ justifyContent: "center" }}>
            <FlowerMark color={C.maroon} size={14} /> Kategori
          </span>
          <h1 className="rk-serif" style={{ fontSize: "clamp(36px, 5vw, 54px)", letterSpacing: "-.015em", color: C.maroonDeep, maxWidth: 780, margin: "18px auto 0" }}>
            Belanja berdasarkan{" "}
            <em style={{ fontStyle: "normal", color: C.maroon, position: "relative", whiteSpace: "nowrap" }}>
              <span style={{ position: "absolute", left: 0, right: 0, bottom: 5, height: 11, background: C.roseSoft, zIndex: -1, borderRadius: 6 }} />
              kategori
            </em>
          </h1>
          <p style={{ margin: "20px auto 0", fontSize: 17, color: C.inkSoft, maxWidth: 620 }}>
            Setiap momen punya rangkaian yang tepat. Kenali jenis karangan bunga, kesempatan yang cocok, dan
            bunga-bunga di baliknya — lalu pesan dari florist terbaik di kotamu.
          </p>
          <nav aria-label="Lompat ke kategori" style={{ margin: "32px auto 0", display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 720 }}>
            {CATEGORIES_DETAIL.map((c) => (
              <button key={c.id} type="button" className="rk-jump-pill" onClick={() => jumpTo(c.id)}>{c.title}</button>
            ))}
            <button type="button" className="rk-jump-pill" onClick={() => jumpTo("jenis-bunga")}>Jenis Bunga</button>
          </nav>
        </div>
      </section>

      {/* Category details */}
      <section style={{ padding: "88px 20px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <span className="rk-eyebrow">Jenis Karangan</span>
          <h2 className="rk-serif" style={{ marginTop: 14, marginBottom: 8, color: C.ink }}>Enam kategori utama</h2>
          <p style={{ color: C.inkSoft, marginBottom: 44, maxWidth: 640 }}>
            Dari buket di genggaman hingga papan bunga dua meter — pilih bentuk yang paling pas untuk pesanmu.
          </p>
          <div style={{ display: "grid", gap: 28 }}>
            {CATEGORIES_DETAIL.map((c, i) => (
              <article key={c.id} id={c.id} className={"rk-kat-card" + (i % 2 === 1 ? " is-even" : "")}>
                <div className="rk-kat-visual" aria-hidden="true">
                  <c.Art />
                </div>
                <div style={{ padding: "34px 38px" }}>
                  <h3 className="rk-serif" style={{ fontSize: 24, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", color: C.ink }}>
                    {c.title}
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: C.teal, background: C.cream, padding: "5px 12px", borderRadius: 999 }}>
                      {c.harga}
                    </span>
                  </h3>
                  <p style={{ marginTop: 12, color: C.inkSoft, fontSize: 15, maxWidth: 560 }}>{c.desc}</p>
                  <div style={{ marginTop: 20, fontSize: 11.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.maroon }}>Cocok untuk</div>
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {c.cocok.map((item) => item.mode ? (
                      <button key={item.label} type="button" className="rk-kat-chip rk-kat-chip-link" onClick={() => openBuilder(item.mode)}>{item.label}</button>
                    ) : (
                      <span key={item.label} className="rk-kat-chip">{item.label}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, fontSize: 11.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.maroon }}>Bunga andalan</div>
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {c.bunga.map((b) => <span key={b} className="rk-kat-chip rk-kat-chip-leaf">{b}</span>)}
                  </div>
                  <button type="button" className="rk-btn rk-btn-ghost" style={{ marginTop: 24, border: "none", padding: 0, color: C.maroon, fontSize: 14, fontWeight: 700 }} onClick={() => openBuilder(c.mode)}>
                    {c.ctaLabel} →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section style={{ background: C.cream, padding: "88px 20px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <span className="rk-eyebrow">Berdasarkan Momen</span>
          <h2 className="rk-serif" style={{ marginTop: 14, marginBottom: 8, color: C.ink }}>Belum yakin? Mulai dari momennya</h2>
          <p style={{ color: C.inkSoft, marginBottom: 44 }}>Pilih kesempatanmu dan kami tunjukkan kategori serta bunga yang paling tepat.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
            {OCCASIONS_KATEGORI.map((o) => (
              <button key={o.nama} type="button" className="rk-occ-card" onClick={() => openBuilder(o.mode)}>
                <span style={{ width: 40, height: 40, borderRadius: "50%", background: C.roseSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={C.maroon} strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">{o.icon}</svg>
                </span>
                <h3 style={{ fontSize: 16.5, color: C.ink }}>{o.nama}</h3>
                <p style={{ fontSize: 13, color: C.inkSoft, marginTop: 5 }}>{o.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Flower dictionary */}
      <section id="jenis-bunga" style={{ padding: "88px 20px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <span className="rk-eyebrow">Kamus Bunga</span>
          <h2 className="rk-serif" style={{ marginTop: 14, marginBottom: 8, color: C.ink }}>Jenis bunga populer &amp; maknanya</h2>
          <p style={{ color: C.inkSoft, marginBottom: 44 }}>Setiap bunga membawa pesan. Kenali maknanya agar rangkaianmu berbicara lebih dalam.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
            {FLOWERS_DICT.map((f) => (
              <div key={f.nama} className="rk-flower-card">
                <svg viewBox="0 0 46 46" width="46" height="46" style={{ marginBottom: 14 }} aria-hidden="true">{f.icon}</svg>
                <h3 style={{ fontSize: 17, color: C.ink }}>{f.nama}</h3>
                <p style={{ fontSize: 12, fontStyle: "italic", color: C.inkSoft }}>{f.latin}</p>
                <p style={{ marginTop: 10, fontSize: 13.5, color: C.inkSoft }}><strong style={{ color: C.ink, fontWeight: 700 }}>Makna:</strong> {f.makna}</p>
                <span style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: C.teal, background: C.cream, display: "inline-block", padding: "4px 10px", borderRadius: 999 }}>{f.cocok}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 20px 88px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ background: C.maroonDeep, borderRadius: 24, color: "#fff", textAlign: "center", padding: "60px 40px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", width: 280, height: 280, opacity: 0.1, right: -80, top: -80, pointerEvents: "none" }}>
              <FlowerMark color={C.gold} size={280} />
            </div>
            <h2 className="rk-serif" style={{ color: "#fff", maxWidth: 600, margin: "0 auto", position: "relative" }}>
              Sudah tahu kategorinya? <em style={{ fontStyle: "normal", color: C.gold }}>Cari floristnya.</em>
            </h2>
            <p style={{ color: "#CBD8CC", margin: "16px auto 0", maxWidth: 500, position: "relative" }}>
              Ratusan florist terverifikasi di 25+ kota siap merangkai pesananmu hari ini.
            </p>
            <div style={{ marginTop: 30, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <button type="button" className="rk-btn" style={{ background: C.gold, color: C.maroonDeep }} onClick={() => navigate("/")}>
                Cari Florist di Kotamu
              </button>
              <button type="button" className="rk-btn" style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.5)" }} onClick={() => goSection("untuk-floris")}>
                Gabung Sebagai Florist
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
