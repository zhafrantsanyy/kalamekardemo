import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Flower2, Trash2, RotateCw, Plus, Minus, Copy, ArrowUp, Sparkles,
  ShoppingBag, MapPin, Star, Truck, Camera, Check, ChevronLeft, ChevronRight,
  MessageCircle, Wand2, Eraser, Store, Route, CreditCard, Leaf, Heart,
  BadgeCheck, Search, ShieldCheck
} from "lucide-react";
import { supabase, ADMIN_WA } from "./lib/supabase";

/* ============================================================
   KALAMEKAR — Marketplace Florist dengan Custom Bouquet Builder
   Fase 1 (Concierge) demo
   Palet: maroon · dusty rose · teal · gold · cream
   ============================================================ */

const C = {
  maroon: "#B93365",     // bloom
  maroonDeep: "#173D28", // green-900 (dark bg bands: header logo ink, footer, ribbon, join banner)
  bloomDark: "#8F2450",  // bloom-dark (hover state for bloom-colored buttons)
  maroonSoft: "#C97290", // muted bloom (decorative strokes)
  rose: "#D98CAA",       // soft bloom accent (hover borders, dashed guides)
  roseSoft: "#F6DCE6",   // petal (light pink icon-chip backgrounds)
  teal: "#275C3B",       // green-700
  tealDeep: "#173D28",   // green-900
  gold: "#E6A93B",       // marigold
  goldSoft: "#F0C36B",   // lighter marigold (numerals/icons on dark bg)
  cream: "#EEF4EC",      // green-100 (page bg / light neutral panels / fields)
  card: "#FFFFFF",       // paper
  ink: "#1C2A20",         // ink
  inkSoft: "#49584D",     // ink-soft
  line: "#E4E9E2",        // line
};

const serif = "'Bricolage Grotesque', Georgia, 'Times New Roman', serif";
const sans = "'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const rupiah = (n) => "Rp" + new Intl.NumberFormat("id-ID").format(n);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
let __id = 1;
const uid = () => "it" + __id++;

/* ---------------- Catalog ---------------- */

const FLOWERS = [
  { id: "mawar_merah", nama: "Mawar Merah", harga: 15000, kat: "bunga", img: "https://images.pexels.com/photos/1820567/pexels-photo-1820567.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "mawar_putih", nama: "Mawar Putih", harga: 15000, kat: "bunga", img: "https://images.pexels.com/photos/8634917/pexels-photo-8634917.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "mawar_pink", nama: "Mawar Pink", harga: 15000, kat: "bunga", img: "https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "peony", nama: "Peony", harga: 35000, kat: "bunga", img: "https://images.pexels.com/photos/8051675/pexels-photo-8051675.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "lily", nama: "Lily Putih", harga: 22000, kat: "bunga", img: "https://images.pexels.com/photos/1033141/pexels-photo-1033141.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "tulip", nama: "Tulip", harga: 25000, kat: "bunga", img: "https://images.pexels.com/photos/2480072/pexels-photo-2480072.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "matahari", nama: "Bunga Matahari", harga: 18000, kat: "bunga", img: "https://images.pexels.com/photos/18503542/pexels-photo-18503542.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "anggrek", nama: "Anggrek Bulan", harga: 30000, kat: "bunga", img: "https://images.pexels.com/photos/14100860/pexels-photo-14100860.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "krisan", nama: "Krisan Kuning", harga: 8000, kat: "bunga", img: "https://images.pexels.com/photos/2179204/pexels-photo-2179204.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "anyelir", nama: "Anyelir", harga: 10000, kat: "bunga", img: "https://images.pexels.com/photos/3392718/pexels-photo-3392718.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "daisy", nama: "Daisy", harga: 9000, kat: "bunga", img: "https://images.pexels.com/photos/8974827/pexels-photo-8974827.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "lavender", nama: "Lavender", harga: 12000, kat: "bunga", img: "https://images.pexels.com/photos/4984547/pexels-photo-4984547.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "hydrangea", nama: "Hortensia", harga: 28000, kat: "bunga", img: "https://images.pexels.com/photos/53135/hydrangea-blossom-bloom-flower-53135.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "babys", nama: "Baby's Breath", harga: 7000, kat: "filler", img: "https://images.pexels.com/photos/296678/pexels-photo-296678.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "eucalyptus", nama: "Eukaliptus", harga: 8000, kat: "filler", img: "https://images.pexels.com/photos/6068432/pexels-photo-6068432.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "pakis", nama: "Daun Pakis", harga: 6000, kat: "filler", img: "https://images.pexels.com/photos/1226302/pexels-photo-1226302.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
  { id: "monstera", nama: "Monstera", harga: 12000, kat: "filler", img: "https://images.pexels.com/photos/7354633/pexels-photo-7354633.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
];
const FMAP = Object.fromEntries(FLOWERS.map((f) => [f.id, f]));

const WRAPS = [
  { id: "kraft", nama: "Kertas Kraft", harga: 25000, warna: "#c8a878", warna2: "#b8946a" },
  { id: "korean", nama: "Korean Style", harga: 45000, warna: "#efdfe0", warna2: "#e0c9cb" },
  { id: "satin", nama: "Satin Premium", harga: 65000, warna: "#8d5468", warna2: "#7a4458" },
];
const BASES = [
  { id: "rotan", nama: "Ring Rotan", harga: 60000, warna: "#a97e4f", warna2: "#8f6437" },
  { id: "foam", nama: "Ring Foam + Moss", harga: 85000, warna: "#7d9a6c", warna2: "#66815a" },
  { id: "premium", nama: "Ring Premium", harga: 130000, warna: "#6d4b3a", warna2: "#553827" },
];
const SIZES = [
  { id: "S", nama: "S", fee: 0, saran: "6–10 tangkai", r: 22 },
  { id: "M", nama: "M", fee: 20000, saran: "10–18 tangkai", r: 28 },
  { id: "L", nama: "L", fee: 40000, saran: "18–30 tangkai", r: 34 },
];
const ONGKIR = 15000;

const FLORISTS = [
  { nama: "Kirana Bloom Studio", area: "Kemang", jarak: "2,3 km", rating: 4.8, order: 214 },
  { nama: "Sekar Ayu Florist", area: "Tebet", jarak: "3,1 km", rating: 4.9, order: 187 },
  { nama: "Flora Kayu Manis", area: "Cipete", jarak: "4,0 km", rating: 4.7, order: 156 },
];

/* ---------------- Global CSS ---------------- */

const GlobalStyle = () => (
  <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .rk-root { font-family: ${sans}; color: ${C.ink}; background: ${C.card}; min-height: 100vh; }
    .rk-serif { font-family: ${serif}; }
    .rk-btn { border: none; cursor: pointer; font-family: ${sans}; font-weight: 600; border-radius: 999px;
      display: inline-flex; align-items: center; gap: 8px; transition: transform .12s ease, box-shadow .12s ease, background .12s ease; }
    .rk-btn:hover { transform: translateY(-1px); }
    .rk-btn:focus-visible { outline: 3px solid ${C.gold}; outline-offset: 2px; }
    .rk-btn:active { transform: translateY(0); }
    .rk-btn-primary { background: ${C.maroon}; color: #fff; box-shadow: 0 6px 16px rgba(185,51,101,.28); }
    .rk-btn-primary:hover { background: ${C.bloomDark}; }
    .rk-btn-ghost { background: transparent; color: ${C.maroon}; border: 1.5px solid ${C.maroon}; }
    .rk-btn-ghost:hover { background: rgba(185,51,101,.06); }
    .rk-btn-teal { background: ${C.tealDeep}; color: #fff; }
    .rk-chip { border: 1.5px solid ${C.line}; background: ${C.card}; border-radius: 12px; cursor: pointer;
      transition: border-color .12s, box-shadow .12s; font-family: ${sans}; }
    .rk-chip:hover { border-color: ${C.rose}; }
    .rk-chip:focus-visible { outline: 3px solid ${C.gold}; outline-offset: 2px; }
    .rk-chip-on { border-color: ${C.maroon}; box-shadow: 0 0 0 2px ${C.maroon} inset; }
    .rk-card { background: ${C.card}; border: 1px solid ${C.line}; border-radius: 18px; }
    .rk-pal-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px 8px;
      border: 1.5px solid ${C.line}; border-radius: 14px; background: ${C.card}; cursor: pointer; transition: all .12s; }
    .rk-pal-item:hover { border-color: ${C.rose}; transform: translateY(-2px); box-shadow: 0 8px 18px rgba(185,51,101,.10); }
    .rk-pal-item:focus-visible { outline: 3px solid ${C.gold}; outline-offset: 2px; }
    .rk-navlink { background:none; border:none; cursor:pointer; font-family:${sans}; font-size:14.5px; font-weight:600;
      padding:6px 2px; text-decoration:none; transition:color .15s, opacity .15s; }
    .rk-navlink-onlight { color:${C.inkSoft}; }
    .rk-navlink-onlight:hover { color:${C.maroon}; }
    .rk-navlink-ondark { color:${C.cream}; opacity:.85; }
    .rk-navlink-ondark:hover { opacity:1; color:${C.gold}; }
    .rk-tool { background:${C.maroon}; color:#fff; border:none; border-radius:10px; width:34px; height:34px;
      display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .rk-tool:hover { background:${C.bloomDark}; }
    .rk-tool-danger { background:#a13d3d; }
    .rk-input { width:100%; padding:11px 13px; border:1.5px solid ${C.line}; border-radius:12px; background:#fff;
      font-family:${sans}; font-size:14.5px; color:${C.ink}; }
    .rk-input:focus { outline:none; border-color:${C.maroon}; box-shadow:0 0 0 3px rgba(185,51,101,.12); }
    .rk-builder-grid { display:grid; grid-template-columns: 250px 1fr 300px; gap:18px; align-items:start; }
    .rk-steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    .rk-arch-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
    @media (max-width: 1020px) {
      .rk-builder-grid { grid-template-columns: 1fr; }
      .rk-palette-col { order: 2; }
      .rk-stage-col { order: 1; }
      .rk-price-col { order: 3; }
      .rk-pal-scroll { display:grid; grid-template-columns: repeat(auto-fill,minmax(86px,1fr)); }
    }
    @media (max-width: 760px) {
      .rk-steps-grid { grid-template-columns: 1fr; }
      .rk-arch-grid { grid-template-columns: 1fr; }
      .rk-hero-title { font-size: 34px !important; }
      .rk-hide-sm { display:none !important; }
    }
    @keyframes rk-spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
    @keyframes rk-float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
    @keyframes rk-pulse { 0%,100% { opacity:1;} 50% { opacity:.35;} }
    .rk-wreath-hero { animation: rk-spin 70s linear infinite; transform-origin: 50% 50%; }
    .rk-float { animation: rk-float 5s ease-in-out infinite; }
    .rk-pulse { animation: rk-pulse 1.4s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .rk-wreath-hero, .rk-float, .rk-pulse { animation: none; }
      .rk-btn, .rk-pal-item { transition: none; }
    }

    /* ---------- homepage marketplace sections ---------- */
    .rk-eyebrow { font-size:12px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:${C.maroon}; display:inline-flex; align-items:center; gap:7px; }
    .rk-search-panel { margin-top:24px; background:#fff; border:1px solid ${C.line}; border-radius:16px;
      box-shadow:0 18px 40px -24px rgba(28,42,32,.35); padding:12px; max-width:600px; }
    .rk-search-field { display:flex; flex-direction:column; gap:2px; padding:6px 12px; border-radius:11px; background:${C.cream}; }
    .rk-search-field label { font-size:10.5px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:${C.maroon}; }
    .rk-search-field select { width:100%; border:none; background:transparent; font-family:${sans}; font-size:14.5px;
      font-weight:600; color:${C.ink}; padding:4px 0; cursor:pointer; }
    .rk-quick-pill { border:1px solid ${C.line}; background:#fff; color:${C.maroonDeep}; padding:6px 14px;
      border-radius:999px; font-family:${sans}; font-weight:600; font-size:13px; cursor:pointer; transition:border-color .15s, color .15s; }
    .rk-quick-pill:hover { border-color:${C.maroon}; color:${C.maroon}; }
    .rk-ribbon { background:${C.maroonDeep}; color:${C.cream}; overflow:hidden; padding:13px 0; border-top:3px solid ${C.gold}; border-bottom:3px solid ${C.gold}; }
    .rk-ribbon-track { display:flex; gap:44px; white-space:nowrap; width:max-content; font-family:${serif}; font-weight:700; font-size:14.5px; letter-spacing:.02em; }
    @media (prefers-reduced-motion:no-preference){
      .rk-ribbon-track { animation: rk-ribbon-slide 32s linear infinite; }
      @keyframes rk-ribbon-slide { to { transform: translateX(-50%); } }
    }
    .rk-cat-card { border:1px solid ${C.line}; border-radius:16px; padding:22px; background:#fff; cursor:pointer;
      text-align:left; width:100%; font-family:${sans}; transition:border-color .15s, transform .15s; }
    .rk-cat-card:hover { border-color:${C.maroon}; transform:translateY(-3px); }
    .rk-cat-card:focus-visible { outline:3px solid ${C.gold}; outline-offset:2px; }
    .rk-cat-icon { width:42px; height:42px; border-radius:11px; background:${C.roseSoft}; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
    .rk-florist-card { border:1px solid ${C.line}; border-radius:16px; overflow:hidden; background:#fff; cursor:pointer;
      width:100%; font-family:${sans}; transition:transform .15s, border-color .15s; }
    .rk-florist-card:hover { transform:translateY(-3px); border-color:${C.maroon}; }
    .rk-florist-card:focus-visible { outline:3px solid ${C.gold}; outline-offset:2px; }
    .rk-florist-photo { height:110px; position:relative; }
    .rk-badge { position:absolute; top:10px; left:10px; background:#fff; color:${C.maroon}; font-size:10.5px; font-weight:700;
      letter-spacing:.05em; text-transform:uppercase; padding:4px 9px; border-radius:999px; display:inline-flex; align-items:center; gap:4px; }
    .rk-link-chip { display:inline-flex; align-items:center; gap:6px; padding:9px 14px; border-radius:11px; font-size:13.5px;
      font-weight:600; border:1px solid ${C.line}; background:#fff; color:${C.inkSoft}; font-family:${sans}; }
    .rk-link-chip-active { cursor:pointer; color:${C.maroon}; transition:border-color .15s; }
    .rk-link-chip-active:hover { border-color:${C.maroon}; }
    .rk-link-chip-active:focus-visible { outline:3px solid ${C.gold}; outline-offset:2px; }
    .rk-join-card { background:${C.maroonDeep}; color:${C.cream}; border-radius:22px; padding:44px; position:relative; overflow:hidden; }
    .rk-faq-item { border-bottom:1px solid ${C.line}; }
    .rk-faq-item summary { cursor:pointer; list-style:none; display:flex; justify-content:space-between; align-items:center;
      gap:16px; padding:20px 2px; font-family:${serif}; font-weight:700; font-size:17px; color:${C.maroon}; }
    .rk-faq-item summary::-webkit-details-marker{ display:none; }
    .rk-faq-chev { width:18px; height:18px; flex:none; transition:transform .2s; color:${C.gold}; }
    .rk-faq-item[open] .rk-faq-chev { transform:rotate(45deg); }
    .rk-faq-answer { padding:0 2px 22px; color:${C.inkSoft}; font-size:14.5px; line-height:1.6; }
  `}</style>
);

/* ---------------- Mini flower thumbnail ---------------- */

const Thumb = ({ f, size = 44 }) => (
  <img
    src={f.img}
    alt={f.nama}
    loading="lazy"
    draggable={false}
    style={{
      width: size, height: size, borderRadius: "50%", objectFit: "cover",
      display: "block", boxShadow: "0 2px 4px rgba(59,42,48,.22)",
    }}
  />
);

/* ---------------- Stage guides ---------------- */

const BouquetGuide = ({ wrap, r }) => (
  <svg viewBox="0 0 100 125" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
    {/* stems */}
    {[-14, -7, 0, 7, 14].map((dx, i) => (
      <line key={i} x1={50 + dx} y1={48} x2={50 + dx * 0.25} y2={92} stroke="#7f9a6d" strokeWidth="1.1" opacity="0.7" />
    ))}
    {/* back paper */}
    <path d={`M50 108 L 15 40 Q 50 58 85 40 Z`} fill={wrap.warna} />
    <path d={`M50 108 L 15 40 Q 50 58 85 40 Z`} fill="#000" opacity="0.05" />
    {/* front paper */}
    <path d={`M50 108 L 26 52 Q 50 66 74 52 Z`} fill={wrap.warna2} />
    <path d="M50 108 L 26 52 Q 50 66 74 52 Z" fill="#fff" opacity="0.08" />
    {/* ribbon */}
    <circle cx="50" cy="84" r="3.4" fill={C.gold} />
    <path d="M50 84 L 42 78 L 44 86 Z" fill={C.gold} />
    <path d="M50 84 L 58 78 L 56 86 Z" fill={C.gold} />
    <path d="M50 84 L 45 94 L 49 92 Z" fill={C.goldSoft} />
    <path d="M50 84 L 55 94 L 51 92 Z" fill={C.goldSoft} />
    {/* dome guide */}
    <circle cx="50" cy="40" r={r} fill="none" stroke={C.rose} strokeWidth="0.7" strokeDasharray="2.5 2.5" opacity="0.8" />
  </svg>
);

const WreathGuide = ({ base, r }) => (
  <svg viewBox="0 0 100 125" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
    <path d="M50 10 L 44 20 L 56 20 Z" fill={C.gold} />
    <line x1="50" y1="18" x2="50" y2="30" stroke={C.gold} strokeWidth="1.4" />
    <circle cx="50" cy={62} r={r} fill="none" stroke={base.warna} strokeWidth="13" />
    <circle cx="50" cy={62} r={r} fill="none" stroke={base.warna2} strokeWidth="13" strokeDasharray="4 7" opacity="0.7" />
    <circle cx="50" cy={62} r={r} fill="none" stroke={C.rose} strokeWidth="0.7" strokeDasharray="2.5 2.5" opacity="0.9" />
  </svg>
);

/* ---------------- Stage (canvas) ---------------- */

function Stage({ items, mode, wrap, base, sizeCfg, selectedId, onSelect, onDragTo, readonly, height }) {
  const ref = useRef(null);
  const dragRef = useRef(null);

  const toPct = (e) => {
    const rect = ref.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const onDown = (e, it) => {
    if (readonly) return;
    e.stopPropagation();
    const p = toPct(e);
    dragRef.current = { id: it.id, dx: p.x - it.x, dy: p.y - it.y };
    onSelect(it.id);
  };

  useEffect(() => {
    if (readonly) return;
    const move = (e) => {
      const d = dragRef.current;
      if (!d || !ref.current) return;
      e.preventDefault();
      const p = toPct(e);
      onDragTo(d.id, clamp(p.x - d.dx, 3, 97), clamp(p.y - d.dy, 3, 97));
    };
    const up = () => (dragRef.current = null);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [onDragTo, readonly]);

  const guideR = sizeCfg.r;

  return (
    <div
      ref={ref}
      onPointerDown={() => !readonly && onSelect(null)}
      style={{
        position: "relative",
        width: "100%",
        height: height || undefined,
        aspectRatio: height ? undefined : "100 / 125",
        background: `linear-gradient(180deg, #fffdf8 0%, ${C.card} 100%)`,
        border: `1px solid ${C.line}`,
        borderRadius: 18,
        overflow: "hidden",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {mode === "bouquet" ? <BouquetGuide wrap={wrap} r={guideR} /> : <WreathGuide base={base} r={guideR} />}
      {items.map((it, idx) => {
        const f = FMAP[it.type];
        const sel = it.id === selectedId && !readonly;
        return (
          <div
            key={it.id}
            onPointerDown={(e) => onDown(e, it)}
            role={readonly ? undefined : "button"}
            aria-label={readonly ? undefined : f.nama}
            style={{
              position: "absolute",
              left: it.x + "%",
              top: it.y + "%",
              width: it.size + "%",
              aspectRatio: "1 / 1",
              transform: `translate(-50%, -50%) rotate(${it.rot}deg)`,
              zIndex: idx + 1,
              cursor: readonly ? "default" : "grab",
              filter: sel ? "drop-shadow(0 0 5px rgba(201,162,75,.95))" : "drop-shadow(0 3px 4px rgba(59,42,48,.18))",
            }}
          >
            <img
              src={f.img}
              alt={f.nama}
              draggable={false}
              style={{
                width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover",
                display: "block", border: "2px solid #fff",
              }}
            />
          </div>
        );
      })}
      {!readonly && items.length === 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ textAlign: "center", color: C.inkSoft, background: "rgba(253,250,243,.85)", padding: "14px 20px", borderRadius: 14, border: `1px dashed ${C.rose}` }}>
            <Flower2 size={26} style={{ color: C.rose }} />
            <div style={{ fontSize: 13.5, marginTop: 6, maxWidth: 220 }}>
              Ketuk bunga di panel katalog untuk menambahkannya, lalu geser ke posisi yang kamu mau.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Hero wreath decoration ---------------- */

const HeroWreath = () => {
  const picks = ["mawar_merah", "daisy", "eucalyptus", "mawar_pink", "krisan", "babys", "anyelir", "eucalyptus", "mawar_putih", "lavender", "daisy", "mawar_merah"];
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, aspectRatio: "1 / 1" }} aria-hidden="true">
      <div className="rk-wreath-hero" style={{ position: "absolute", inset: 0 }}>
        <svg viewBox="0 0 240 240" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <circle cx="120" cy="120" r="78" fill="none" stroke={C.maroonSoft} strokeWidth="10" opacity="0.5" />
        </svg>
        {picks.map((pid, i) => {
          const a = (Math.PI * 2 * i) / picks.length;
          const x = 50 + Math.cos(a) * 32.5;
          const y = 50 + Math.sin(a) * 32.5;
          return (
            <img
              key={i}
              src={FMAP[pid].img}
              alt=""
              style={{
                position: "absolute", left: x + "%", top: y + "%", width: "15%", aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)", borderRadius: "50%", objectFit: "cover",
                border: `2px solid ${C.card}`, boxShadow: "0 3px 10px rgba(28,42,32,.18)",
              }}
            />
          );
        })}
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 17, color: C.maroon, lineHeight: 1.3 }}>kala</span>
        <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 17, color: C.maroonDeep, lineHeight: 1.3 }}>mekar</span>
      </div>
    </div>
  );
};

/* ---------------- Home page ---------------- */

const STEPS = [
  { icon: Wand2, t: "1 · Rangkai", d: "Pilih bunga, geser & susun di kanvas. Harga terhitung real-time." },
  { icon: ShoppingBag, t: "2 · Checkout", d: "Isi alamat, waktu kirim, dan pesan kartu ucapan." },
  { icon: Route, t: "3 · Matching", d: "Order diteruskan ke floris terdekat berdasar lokasi, stok & rating." },
  { icon: Store, t: "4 · Konfirmasi", d: "Floris menerima order. Jika penuh, otomatis dialihkan ke floris lain." },
  { icon: Camera, t: "5 · Rakit + Foto", d: "Floris merakit lalu mengirim foto hasil untuk kamu setujui." },
  { icon: Truck, t: "6 · Antar", d: "Kurir mengantar. Dana escrow diteruskan ke floris setelah diterima." },
];

const CATEGORIES = [
  { id: "hand-bouquet", nama: "Hand Bouquet", desc: "Buket tangan segar untuk anniversary, wisuda, dan hadiah spesial.", mode: "bouquet", icon: Flower2 },
  { id: "papan-bunga", nama: "Papan Bunga", desc: "Ucapan selamat, duka cita, dan grand opening — kirim di hari yang sama.", mode: "wreath", icon: Heart },
  { id: "standing-flower", nama: "Standing Flower", desc: "Rangkaian berdiri yang elegan untuk acara resmi dan seremonial.", mode: "wreath", icon: Sparkles },
  { id: "bunga-meja", nama: "Bunga Meja", desc: "Vas dan rangkaian meja untuk kantor, resepsionis, dan rumah.", mode: "bouquet", icon: Leaf },
  { id: "parcel-hampers", nama: "Parcel & Hampers", desc: "Bingkisan bunga, buah, dan hampers untuk hari raya dan perayaan.", mode: "bouquet", icon: ShoppingBag },
  { id: "dekorasi-acara", nama: "Dekorasi Acara", desc: "Dekorasi pernikahan, lamaran, dan acara korporat oleh floris profesional.", mode: "wreath", icon: Store },
];

const OCCASIONS = [
  { nama: "Bunga Wisuda", mode: "bouquet" },
  { nama: "Bunga Duka Cita", mode: "wreath" },
  { nama: "Papan Bunga Pernikahan", mode: "wreath" },
  { nama: "Bunga Anniversary", mode: "bouquet" },
  { nama: "Papan Bunga Grand Opening", mode: "wreath" },
  { nama: "Bunga Ulang Tahun", mode: "bouquet" },
  { nama: "Bunga Valentine", mode: "bouquet" },
  { nama: "Bunga untuk Ibu", mode: "bouquet" },
];

const CITIES = [
  { nama: "Jakarta Selatan", live: true },
  { nama: "Jakarta", live: false },
  { nama: "Bandung", live: false },
  { nama: "Surabaya", live: false },
  { nama: "Medan", live: false },
  { nama: "Semarang", live: false },
  { nama: "Yogyakarta", live: false },
  { nama: "Denpasar", live: false },
  { nama: "Makassar", live: false },
  { nama: "Tangerang", live: false },
  { nama: "Bekasi", live: false },
  { nama: "Bogor", live: false },
];

const RIBBON_TAGS = ["Bunga Wisuda", "Papan Bunga Pernikahan", "Bunga Duka Cita", "Grand Opening", "Anniversary", "Hand Bouquet Valentine"];

const FEATURED_FLORISTS = [
  { nama: "Melati Kirana Florist", meta: "Jakarta Selatan · Same-day", rating: 4.9, ulasan: 212, colors: ["#B93365", "#E6A93B", "#8F2450"] },
  { nama: "Sekar Ayu Flora", meta: "Bandung · Same-day", rating: 4.8, ulasan: 167, colors: ["#275C3B", "#B93365", "#E6A93B"] },
  { nama: "Bunga Nusantara", meta: "Surabaya · Papan bunga", rating: 4.9, ulasan: 324, colors: ["#E6A93B", "#B93365", "#275C3B"] },
  { nama: "Dahlia Bali Florist", meta: "Denpasar · Dekorasi", rating: 5.0, ulasan: 98, colors: ["#B93365", "#8F2450", "#E6A93B"] },
];

const KENAPA_FEATURES = [
  [ShieldCheck, "Florist terverifikasi", "Setiap toko dikurasi tim kami — alamat nyata, galeri asli, tanpa foto curian."],
  [Route, "Pengiriman same-day", "Pesan sebelum jam 3 sore, bunga tiba di hari yang sama di kota-kota besar."],
  [CreditCard, "Harga transparan", "Harga langsung dari florist, tanpa markup tersembunyi atau biaya kejutan."],
  [MessageCircle, "Chat langsung", "Diskusikan rangkaian, warna, dan kartu ucapan langsung dengan floristnya."],
];

const FAQS = [
  { q: "Apa itu Kalamekar?", a: "Kalamekar adalah marketplace yang menghubungkan Anda dengan toko bunga dan florist lokal terverifikasi di seluruh Indonesia. Anda bisa membandingkan galeri, harga, dan ulasan, lalu memesan langsung ke florist pilihan Anda — termasuk lewat kanvas rangkai custom kami." },
  { q: "Bagaimana cara memesan bunga di Kalamekar?", a: "Cari florist di kota Anda, pilih produk dari galeri florist, lalu klik tombol Pesan via WhatsApp — atau klik \"Mulai Merangkai\" untuk menyusun buket/krans Anda sendiri di kanvas drag-and-drop kami." },
  { q: "Apakah bisa kirim bunga di hari yang sama?", a: "Bisa. Sebagian besar florist di Kalamekar melayani pengiriman same-day untuk pemesanan sebelum pukul 15.00 waktu setempat. Cari badge Same-Day pada profil florist." },
  { q: "Kota mana saja yang sudah terjangkau Kalamekar?", a: "Kalamekar tersedia di 25+ kota termasuk Jakarta, Bandung, Surabaya, Medan, Semarang, Yogyakarta, Denpasar, dan Makassar — dan terus bertambah setiap bulan." },
  { q: "Bagaimana cara bergabung sebagai florist di Kalamekar?", a: "Daftarkan toko bunga Anda secara gratis melalui tombol WhatsApp pada bagian \"Punya toko bunga?\" di halaman ini. Tim kami akan memverifikasi toko Anda dalam 2–3 hari kerja sebelum etalase Anda tayang." },
];

function Home({ go, setDesign }) {
  const [kategori, setKategori] = useState(CATEGORIES[0].id);
  const [ukuran, setUkuran] = useState("M");

  const openBuilder = (mode, size) => {
    setDesign((d) => ({ ...d, mode: mode || d.mode, sizeId: size || d.sizeId }));
    go("builder");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cat = CATEGORIES.find((c) => c.id === kategori) || CATEGORIES[0];
    openBuilder(cat.mode, ukuran);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{ background: "linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 70%)", padding: "0 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32, padding: "60px 0 68px" }}>
          <div style={{ flex: "1 1 420px", minWidth: 280 }}>
            <span className="rk-eyebrow"><Leaf size={13} /> Marketplace florist lokal Indonesia</span>
            <h1 className="rk-serif rk-hero-title" style={{ fontSize: 44, lineHeight: 1.14, fontWeight: 700, margin: "16px 0", color: C.maroonDeep }}>
              Temukan toko bunga & florist terpercaya{" "}
              <em style={{ fontStyle: "normal", color: C.maroon, position: "relative", whiteSpace: "nowrap" }}>
                <span style={{ position: "absolute", left: 0, right: 0, bottom: 4, height: 10, background: C.roseSoft, zIndex: -1, borderRadius: 6 }} />
                di kotamu
              </em>
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: C.inkSoft, maxWidth: 500, marginBottom: 8 }}>
              Kalamekar menghubungkan Anda dengan ratusan florist lokal terverifikasi di 25+ kota — hand bouquet,
              papan bunga, hingga dekorasi pernikahan. Susun sendiri lewat kanvas drag-and-drop kami, pesan langsung,
              dikirim di hari yang sama.
            </p>

            <form className="rk-search-panel" onSubmit={handleSearchSubmit} aria-label="Mulai merangkai bunga">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <div className="rk-search-field" style={{ flex: "1 1 160px" }}>
                  <label htmlFor="kategori-select">Kategori</label>
                  <select id="kategori-select" value={kategori} onChange={(e) => setKategori(e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
                  </select>
                </div>
                <div className="rk-search-field" style={{ flex: "1 1 120px" }}>
                  <label htmlFor="ukuran-select">Ukuran</label>
                  <select id="ukuran-select" value={ukuran} onChange={(e) => setUkuran(e.target.value)}>
                    {SIZES.map((s) => <option key={s.id} value={s.id}>{s.nama} · {s.saran}</option>)}
                  </select>
                </div>
                <button className="rk-btn" type="submit" style={{ background: C.maroon, color: "#fff", padding: "13px 20px", fontSize: 14.5, flex: "0 0 auto" }}>
                  <Search size={16} /> Mulai Merangkai
                </button>
              </div>
            </form>

            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", fontSize: 13.5, color: C.inkSoft }}>
              Populer:
              {OCCASIONS.slice(0, 4).map((o) => (
                <button key={o.nama} type="button" className="rk-quick-pill" onClick={() => openBuilder(o.mode)}>{o.nama}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 22, marginTop: 30, flexWrap: "wrap" }}>
              {[["500+", "Florist terverifikasi"], ["25+", "Kota Indonesia"], ["4.9/5", "Rating pembeli"]].map(([n, l]) => (
                <div key={l}>
                  <div className="rk-serif" style={{ fontSize: 24, fontWeight: 700, color: C.maroonDeep }}>{n}</div>
                  <div style={{ fontSize: 12.5, color: C.inkSoft }}>{l}</div>
                </div>
              ))}
            </div>

            <button className="rk-btn rk-btn-ghost" style={{ padding: "12px 20px", fontSize: 14, marginTop: 22 }}
              onClick={() => document.getElementById("cara-kerja")?.scrollIntoView({ behavior: "smooth" })}>
              Lihat cara kerja
            </button>
          </div>
          <div className="rk-float" style={{ flex: "0 1 320px", minWidth: 240, display: "flex", justifyContent: "center" }}>
            <HeroWreath />
          </div>
        </div>
      </section>

      {/* Ribbon marquee */}
      <div className="rk-ribbon" aria-hidden="true">
        <div className="rk-ribbon-track">
          {[...RIBBON_TAGS, ...RIBBON_TAGS].map((t, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              {t} <Sparkles size={12} color={C.gold} />
            </span>
          ))}
        </div>
      </div>

      {/* Kategori */}
      <section id="kategori" style={{ padding: "72px 20px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>Kategori</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0" }}>Rangkaian bunga untuk setiap momen</h2>
          <p style={{ color: C.inkSoft, marginBottom: 24, fontSize: 15, maxWidth: 640 }}>
            Dari buket wisuda hingga papan bunga grand opening — semua dibuat segar oleh florist lokal di kotamu.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" className="rk-cat-card" onClick={() => openBuilder(c.mode)}>
                <span className="rk-cat-icon"><c.icon size={20} color={C.maroon} /></span>
                <div className="rk-serif" style={{ fontSize: 17.5, fontWeight: 700, color: C.ink, marginBottom: 5 }}>{c.nama}</div>
                <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5 }}>{c.desc}</div>
                <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: C.maroon, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Mulai rangkai <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cara kerja */}
      <section id="cara-kerja" style={{ background: C.cream, padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>Cara Pesan</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0" }}>Dari rangkai sampai bunga sampai</h2>
          <p style={{ color: C.inkSoft, marginBottom: 28, fontSize: 15 }}>
            Enam langkah, dengan pengalihan otomatis bila floris sedang penuh.
          </p>
          <div className="rk-steps-grid">
            {STEPS.map((s) => (
              <div key={s.t} className="rk-card" style={{ padding: 20 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <s.icon size={20} color="#fff" />
                </div>
                <div className="rk-serif" style={{ fontSize: 18.5, fontWeight: 700, color: C.maroon, marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.55 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Florist Pilihan */}
      <section id="florist" style={{ padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>Florist Pilihan</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0" }}>Florist terverifikasi minggu ini</h2>
          <p style={{ color: C.inkSoft, marginBottom: 28, fontSize: 15, maxWidth: 640 }}>
            Setiap florist di Kalamekar melewati proses kurasi — galeri asli, alamat jelas, dan ulasan pembeli nyata.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
            {FEATURED_FLORISTS.map((f) => (
              <button key={f.nama} type="button" className="rk-florist-card" onClick={() => openBuilder()}>
                <div className="rk-florist-photo" style={{ background: `linear-gradient(135deg, ${f.colors[0]}22, ${f.colors[1]}44, ${f.colors[2]}33)` }}>
                  <span className="rk-badge"><BadgeCheck size={12} /> Terverifikasi</span>
                </div>
                <div style={{ padding: 16, textAlign: "left" }}>
                  <div className="rk-serif" style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{f.nama}</div>
                  <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3 }}>{f.meta}</div>
                  <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 5 }}>
                    <Star size={13} fill={C.gold} color={C.gold} /> {f.rating} <span style={{ fontWeight: 400, color: C.inkSoft }}>({f.ulasan} ulasan)</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Katalog preview */}
      <section style={{ padding: "8px 20px 64px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, marginBottom: 8 }}>Katalog bunga</h2>
          <p style={{ color: C.inkSoft, marginBottom: 24, fontSize: 15 }}>
            SKU universal — nama & grade yang sama di semua floris partner, jadi rangkaianmu pasti bisa dipenuhi.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
            {FLOWERS.map((f) => (
              <div key={f.id} className="rk-card" style={{ padding: "14px 8px", textAlign: "center" }}>
                <Thumb f={f} size={54} />
                <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 6 }}>{f.nama}</div>
                <div style={{ fontSize: 12.5, color: C.tealDeep, fontWeight: 600 }}>{rupiah(f.harga)}<span style={{ color: C.inkSoft, fontWeight: 400 }}>/tangkai</span></div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <button className="rk-btn rk-btn-primary" style={{ padding: "14px 28px", fontSize: 15.5 }} onClick={() => go("builder")}>
              <Sparkles size={18} /> Rangkai sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Kenapa Kalamekar */}
      <section style={{ padding: "8px 20px 64px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>Kenapa Kalamekar</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0 32px" }}>Cara paling tenang mengirim bunga</h2>
          <div className="rk-arch-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {KENAPA_FEATURES.map(([Ic, t, d]) => (
              <div key={t}>
                <span style={{ width: 44, height: 44, borderRadius: "50%", background: C.roseSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic size={20} color={C.maroon} />
                </span>
                <div className="rk-serif" style={{ fontSize: 17, fontWeight: 700, color: C.ink, margin: "10px 0 4px" }}>{t}</div>
                <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jangkauan kota */}
      <section id="kota" style={{ background: C.cream, padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>Jangkauan Kami</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0" }}>Toko bunga di kota-kota Indonesia</h2>
          <p style={{ color: C.inkSoft, marginBottom: 24, fontSize: 15, maxWidth: 640 }}>
            Pilih kotamu untuk melihat daftar florist lokal, harga, dan estimasi pengiriman.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {CITIES.map((c) => c.live ? (
              <button key={c.nama} type="button" className="rk-link-chip rk-link-chip-active" onClick={() => openBuilder()}>
                <MapPin size={13} /> {c.nama} <span style={{ fontSize: 11, color: C.tealDeep, fontWeight: 700 }}>· aktif</span>
              </button>
            ) : (
              <span key={c.nama} className="rk-link-chip" style={{ opacity: 0.7 }}>
                <MapPin size={13} /> {c.nama} <span style={{ fontSize: 11 }}>· segera</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Berdasarkan momen */}
      <section style={{ padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>Berdasarkan Momen</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0" }}>Bunga untuk setiap kesempatan</h2>
          <p style={{ color: C.inkSoft, marginBottom: 24, fontSize: 15, maxWidth: 640 }}>
            Rangkaian yang tepat untuk setiap momen — dipandu florist berpengalaman.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {OCCASIONS.map((o) => (
              <button key={o.nama} type="button" className="rk-link-chip rk-link-chip-active" style={{ justifyContent: "space-between" }} onClick={() => openBuilder(o.mode)}>
                {o.nama} <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Untuk floris */}
      <section id="untuk-floris" style={{ padding: "8px 20px 64px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="rk-join-card">
            <h2 className="rk-serif" style={{ fontSize: 28, color: "#fff", marginBottom: 10 }}>
              Punya toko bunga? Saatnya <em style={{ fontStyle: "normal", color: C.goldSoft }}>mekar</em> bersama kami.
            </h2>
            <p style={{ opacity: 0.85, fontSize: 15, maxWidth: 560, marginBottom: 20, lineHeight: 1.6 }}>
              Buka etalase online gratis, jangkau pembeli baru di kotamu, dan terima pesanan langsung ke WhatsApp —
              tanpa perlu bikin website sendiri.
            </p>
            <div style={{ display: "grid", gap: 10, marginBottom: 26, maxWidth: 520 }}>
              {[
                "Pendaftaran gratis, verifikasi 2–3 hari kerja",
                "Etalase dengan galeri, harga, dan ulasan pembeli",
                "Pesanan masuk langsung ke WhatsApp tokomu",
              ].map((t) => (
                <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14.5 }}>
                  <Check size={17} style={{ color: C.goldSoft, flexShrink: 0, marginTop: 3 }} />
                  {t}
                </div>
              ))}
            </div>
            {ADMIN_WA ? (
              <a
                className="rk-btn"
                style={{ background: C.gold, color: C.maroonDeep, padding: "13px 24px", fontSize: 14.5, textDecoration: "none", display: "inline-flex" }}
                href={"https://wa.me/" + ADMIN_WA + "?text=" + encodeURIComponent("Halo Kalamekar, saya ingin mendaftarkan toko bunga saya sebagai floris partner.")}
                target="_blank" rel="noreferrer"
              >
                <MessageCircle size={17} /> Daftar via WhatsApp
              </a>
            ) : (
              <a
                className="rk-btn"
                style={{ background: C.gold, color: C.maroonDeep, padding: "13px 24px", fontSize: 14.5, textDecoration: "none", display: "inline-flex" }}
                href="mailto:halo@kalamekar.id"
              >
                <MessageCircle size={17} /> Daftar Sebagai Floris
              </a>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "8px 20px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span className="rk-eyebrow" style={{ color: C.maroon }}>FAQ</span>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, margin: "8px 0 24px" }}>Pertanyaan yang sering diajukan</h2>
          <div>
            {FAQS.map((f) => (
              <details key={f.q} className="rk-faq-item">
                <summary>
                  {f.q}
                  <svg className="rk-faq-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </summary>
                <p className="rk-faq-answer">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Builder page ---------------- */

function Builder({ design, setDesign, go }) {
  const { items, mode, wrapId, baseId, sizeId } = design;
  const [selectedId, setSelectedId] = useState(null);
  const wrap = WRAPS.find((w) => w.id === wrapId);
  const base = BASES.find((b) => b.id === baseId);
  const sizeCfg = SIZES.find((s) => s.id === sizeId);
  const [kat, setKat] = useState("bunga");

  const setItems = (fn) => setDesign((d) => ({ ...d, items: typeof fn === "function" ? fn(d.items) : fn }));

  const addFlower = (f) => {
    const isLeaf = f.kat === "filler";
    const it = {
      id: uid(), type: f.id,
      x: 50 + (Math.random() * 18 - 9),
      y: (mode === "bouquet" ? 32 : 40) + (Math.random() * 14 - 7),
      size: isLeaf ? 20 : 16,
      rot: Math.round(Math.random() * 24 - 12),
    };
    setItems((prev) => [...prev, it]);
    setSelectedId(it.id);
  };

  const onDragTo = useCallback((id, x, y) => {
    setDesign((d) => ({ ...d, items: d.items.map((it) => (it.id === id ? { ...it, x, y } : it)) }));
  }, [setDesign]);

  const mut = (fn) => setItems((prev) => prev.map((it) => (it.id === selectedId ? fn(it) : it)));
  const removeSel = () => { setItems((prev) => prev.filter((it) => it.id !== selectedId)); setSelectedId(null); };
  const dupSel = () => {
    const src = items.find((it) => it.id === selectedId);
    if (!src) return;
    const it = { ...src, id: uid(), x: clamp(src.x + 5, 3, 97), y: clamp(src.y + 5, 3, 97) };
    setItems((prev) => [...prev, it]);
    setSelectedId(it.id);
  };
  const layerUp = () => setItems((prev) => {
    const i = prev.findIndex((it) => it.id === selectedId);
    if (i < 0 || i === prev.length - 1) return prev;
    const cp = [...prev]; const [it] = cp.splice(i, 1); cp.push(it); return cp;
  });

  const autoArrange = () => {
    setItems((prev) => {
      const arr = [...prev];
      if (mode === "bouquet") {
        const cx = 50, cy = 33, rings = [[1, 0], [6, 10], [10, 18], [14, 26]];
        let idx = 0;
        for (const [count, rad] of rings) {
          for (let k = 0; k < count && idx < arr.length; k++, idx++) {
            const a = (Math.PI * 2 * k) / count - Math.PI / 2;
            arr[idx] = { ...arr[idx], x: clamp(cx + Math.cos(a) * rad, 3, 97), y: clamp(cy + Math.sin(a) * rad * 0.85, 3, 97), rot: Math.round((a * 180) / Math.PI / 6) };
          }
        }
        for (; idx < arr.length; idx++) {
          arr[idx] = { ...arr[idx], x: 30 + Math.random() * 40, y: 22 + Math.random() * 24 };
        }
      } else {
        const cx = 50, cy = 49.5, rad = sizeCfg.r;
        arr.forEach((it, i) => {
          const a = (Math.PI * 2 * i) / arr.length - Math.PI / 2;
          arr[i] = { ...it, x: clamp(cx + Math.cos(a) * rad, 3, 97), y: clamp(cy + Math.sin(a) * rad * 0.8, 3, 97), rot: Math.round(((a + Math.PI / 2) * 180) / Math.PI) };
        });
      }
      return arr;
    });
  };

  const counts = useMemo(() => {
    const m = {};
    items.forEach((it) => (m[it.type] = (m[it.type] || 0) + 1));
    return Object.entries(m).map(([t, n]) => ({ f: FMAP[t], n }));
  }, [items]);

  const stemTotal = counts.reduce((s, c) => s + c.f.harga * c.n, 0);
  const baseHarga = mode === "bouquet" ? wrap.harga : base.harga;
  const total = stemTotal + baseHarga + sizeCfg.fee;

  const sel = items.find((it) => it.id === selectedId);
  const palette = FLOWERS.filter((f) => (kat === "bunga" ? f.kat === "bunga" : f.kat === "filler"));

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 16px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div>
          <h2 className="rk-serif" style={{ fontSize: 28, color: C.maroon }}>Kanvas rangkaian</h2>
          <p style={{ color: C.inkSoft, fontSize: 13.5, marginTop: 2 }}>
            Ketuk untuk menambah · geser untuk memindah · ketuk item untuk mengubahnya
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["bouquet", "Buket", Flower2], ["wreath", "Krans", Heart]].map(([m, l, Ic]) => (
            <button key={m} className={"rk-chip" + (mode === m ? " rk-chip-on" : "")}
              style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 14, color: mode === m ? C.maroon : C.inkSoft }}
              onClick={() => setDesign((d) => ({ ...d, mode: m }))}>
              <Ic size={16} /> {l}
            </button>
          ))}
        </div>
      </div>

      <div className="rk-builder-grid">
        {/* Palette */}
        <div className="rk-palette-col rk-card" style={{ padding: 14 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[["bunga", "Bunga"], ["filler", "Daun & filler"]].map(([k, l]) => (
              <button key={k} className={"rk-chip" + (kat === k ? " rk-chip-on" : "")}
                style={{ flex: 1, padding: "8px 4px", fontSize: 13, fontWeight: 700, color: kat === k ? C.maroon : C.inkSoft }}
                onClick={() => setKat(k)}>{l}</button>
            ))}
          </div>
          <div className="rk-pal-scroll" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 470, overflowY: "auto" }}>
            {palette.map((f) => (
              <button key={f.id} className="rk-pal-item" onClick={() => addFlower(f)} aria-label={`Tambah ${f.nama}`}>
                <Thumb f={f} size={44} />
                <div style={{ fontSize: 11.5, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{f.nama}</div>
                <div style={{ fontSize: 11, color: C.tealDeep, fontWeight: 600 }}>{rupiah(f.harga)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Stage */}
        <div className="rk-stage-col">
          <Stage items={items} mode={mode} wrap={wrap} base={base} sizeCfg={sizeCfg}
            selectedId={selectedId} onSelect={setSelectedId} onDragTo={onDragTo} />
          {/* toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 6, minHeight: 34 }}>
              {sel ? (
                <>
                  <button className="rk-tool" title="Perkecil" aria-label="Perkecil" onClick={() => mut((it) => ({ ...it, size: clamp(it.size - 2, 8, 36) }))}><Minus size={16} /></button>
                  <button className="rk-tool" title="Perbesar" aria-label="Perbesar" onClick={() => mut((it) => ({ ...it, size: clamp(it.size + 2, 8, 36) }))}><Plus size={16} /></button>
                  <button className="rk-tool" title="Putar" aria-label="Putar" onClick={() => mut((it) => ({ ...it, rot: it.rot + 15 }))}><RotateCw size={16} /></button>
                  <button className="rk-tool" title="Gandakan" aria-label="Gandakan" onClick={dupSel}><Copy size={16} /></button>
                  <button className="rk-tool" title="Bawa ke depan" aria-label="Bawa ke depan" onClick={layerUp}><ArrowUp size={16} /></button>
                  <button className="rk-tool rk-tool-danger" title="Hapus" aria-label="Hapus" onClick={removeSel}><Trash2 size={16} /></button>
                </>
              ) : (
                <span style={{ fontSize: 12.5, color: C.inkSoft, alignSelf: "center" }}>
                  {items.length > 0 ? "Ketuk sebuah bunga di kanvas untuk mengubah ukuran, memutar, atau menghapusnya." : ""}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="rk-btn rk-btn-teal" style={{ padding: "9px 16px", fontSize: 13.5 }} onClick={autoArrange} disabled={items.length === 0}>
                <Wand2 size={15} /> Rapikan otomatis
              </button>
              <button className="rk-btn rk-btn-ghost" style={{ padding: "9px 16px", fontSize: 13.5 }} onClick={() => { setItems([]); setSelectedId(null); }}>
                <Eraser size={15} /> Bersihkan
              </button>
            </div>
          </div>
        </div>

        {/* Price panel */}
        <div className="rk-price-col rk-card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12, color: C.maroon }}>Ukuran</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            {SIZES.map((s) => (
              <button key={s.id} className={"rk-chip" + (sizeId === s.id ? " rk-chip-on" : "")}
                style={{ flex: 1, padding: "10px 4px", fontWeight: 800, fontSize: 15, color: sizeId === s.id ? C.maroon : C.inkSoft }}
                onClick={() => setDesign((d) => ({ ...d, sizeId: s.id }))}>{s.nama}</button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 16 }}>
            Saran ukuran {sizeCfg.nama}: {sizeCfg.saran} · saat ini {items.length} tangkai
          </div>

          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10, color: C.maroon }}>
            {mode === "bouquet" ? "Wrapping" : "Ring dasar"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 }}>
            {(mode === "bouquet" ? WRAPS : BASES).map((w) => {
              const on = mode === "bouquet" ? wrapId === w.id : baseId === w.id;
              return (
                <button key={w.id} className={"rk-chip" + (on ? " rk-chip-on" : "")}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", textAlign: "left" }}
                  onClick={() => setDesign((d) => (mode === "bouquet" ? { ...d, wrapId: w.id } : { ...d, baseId: w.id }))}>
                  <span style={{ width: 18, height: 18, borderRadius: 6, background: w.warna, border: `1px solid ${w.warna2}`, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: on ? C.maroon : C.ink }}>{w.nama}</span>
                  <span style={{ fontSize: 12.5, color: C.inkSoft }}>{rupiah(w.harga)}</span>
                </button>
              );
            })}
          </div>

          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8, color: C.maroon }}>Rincian harga</div>
          <div style={{ maxHeight: 150, overflowY: "auto", marginBottom: 8 }}>
            {counts.length === 0 && <div style={{ fontSize: 13, color: C.inkSoft }}>Belum ada tangkai di kanvas.</div>}
            {counts.map(({ f, n }) => (
              <div key={f.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "3.5px 0" }}>
                <span>{f.nama} × {n}</span>
                <span style={{ fontWeight: 600 }}>{rupiah(f.harga * n)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px dashed ${C.line}`, paddingTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "3px 0" }}>
              <span>{mode === "bouquet" ? wrap.nama : base.nama}</span><span style={{ fontWeight: 600 }}>{rupiah(baseHarga)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "3px 0" }}>
              <span>Biaya ukuran {sizeCfg.nama}</span><span style={{ fontWeight: 600 }}>{rupiah(sizeCfg.fee)}</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: `2px solid ${C.maroon}`, marginTop: 10, paddingTop: 10 }}>
            <span style={{ fontWeight: 800, fontSize: 14.5 }}>Perkiraan total</span>
            <span className="rk-serif" style={{ fontWeight: 800, fontSize: 22, color: C.maroon }}>{rupiah(total)}</span>
          </div>
          <div style={{ fontSize: 11.5, color: C.inkSoft, margin: "10px 0 14px", lineHeight: 1.5 }}>
            Hasil rakitan dapat sedikit bervariasi dari preview. Floris akan mengirim foto konfirmasi sebelum bunga diantar.
          </div>
          <button className="rk-btn rk-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 15.5 }}
            disabled={items.length === 0}
            onClick={() => items.length > 0 && go("checkout")}>
            <ShoppingBag size={17} /> Lanjut ke checkout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Checkout ---------------- */

function Checkout({ design, go, setOrder }) {
  const { items, mode, wrapId, baseId, sizeId } = design;
  const wrap = WRAPS.find((w) => w.id === wrapId);
  const base = BASES.find((b) => b.id === baseId);
  const sizeCfg = SIZES.find((s) => s.id === sizeId);
  const stemTotal = items.reduce((s, it) => s + FMAP[it.type].harga, 0);
  const subtotal = stemTotal + (mode === "bouquet" ? wrap.harga : base.harga) + sizeCfg.fee;
  const grand = subtotal + ONGKIR;

  const [form, setForm] = useState({ nama: "", wa: "", alamat: "", tanggal: "", waktu: "10:00 – 12:00", kartu: "", bayar: "qris" });
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.nama.trim() || !form.alamat.trim() || !form.tanggal) {
      setErr("Nama penerima, alamat, dan tanggal kirim wajib diisi.");
      return;
    }
    setErr("");
    const kode = "KM-" + Math.floor(1000 + Math.random() * 9000);
    if (supabase) {
      setSending(true);
      const { error } = await supabase.from("orders").insert({
        kode,
        nama: form.nama.trim(),
        wa: form.wa.trim() || null,
        alamat: form.alamat.trim(),
        tanggal: form.tanggal,
        waktu: form.waktu,
        kartu: form.kartu.trim() || null,
        metode_bayar: form.bayar,
        mode,
        ukuran: sizeId,
        wrapping: mode === "bouquet" ? wrapId : null,
        ring_dasar: mode === "wreath" ? baseId : null,
        items: items.map(({ type, x, y, size, rot }) => ({ type, x, y, size, rot })),
        subtotal,
        ongkir: ONGKIR,
        total: grand,
      });
      setSending(false);
      if (error) {
        setErr("Pesanan gagal disimpan: " + error.message + ". Coba lagi ya.");
        return;
      }
    }
    setOrder({ ...form, total: grand, kode });
    go("tracking");
  };

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "26px 16px 60px" }}>
      <button className="rk-btn rk-btn-ghost" style={{ padding: "8px 16px", fontSize: 13.5, marginBottom: 18 }} onClick={() => go("builder")}>
        <ChevronLeft size={16} /> Kembali ke kanvas
      </button>
      <h2 className="rk-serif" style={{ fontSize: 28, color: C.maroon, marginBottom: 20 }}>Checkout</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {/* Form */}
          <div className="rk-card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 800, color: C.maroon, marginBottom: 14 }}>Pengiriman</div>
            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Nama penerima</label>
            <input className="rk-input" value={form.nama} onChange={set("nama")} placeholder="cth. Salsabila Putri" style={{ marginBottom: 12 }} />
            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Nomor WhatsApp penerima</label>
            <input className="rk-input" value={form.wa} onChange={set("wa")} placeholder="08xx xxxx xxxx" style={{ marginBottom: 12 }} inputMode="tel" />
            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Alamat lengkap</label>
            <textarea className="rk-input" rows={3} value={form.alamat} onChange={set("alamat")} placeholder="Jalan, nomor, kelurahan, patokan…" style={{ marginBottom: 12, resize: "vertical" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Tanggal kirim</label>
                <input className="rk-input" type="date" value={form.tanggal} onChange={set("tanggal")} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Jam kirim</label>
                <select className="rk-input" value={form.waktu} onChange={set("waktu")}>
                  {["08:00 – 10:00", "10:00 – 12:00", "13:00 – 15:00", "15:00 – 17:00", "17:00 – 19:00"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Pesan kartu ucapan (opsional)</label>
            <textarea className="rk-input" rows={2} value={form.kartu} onChange={set("kartu")} placeholder="cth. Selamat wisuda! Bangga sama kamu." style={{ resize: "vertical" }} />
          </div>

          {/* Ringkasan */}
          <div className="rk-card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 800, color: C.maroon, marginBottom: 14 }}>Ringkasan pesanan</div>
            <div style={{ maxWidth: 210, margin: "0 auto 14px" }}>
              <Stage items={items} mode={mode} wrap={wrap} base={base} sizeCfg={sizeCfg} readonly selectedId={null} onSelect={() => {}} onDragTo={() => {}} />
            </div>
            <div style={{ fontSize: 13.5 }}>
              {[
                [`${mode === "bouquet" ? "Buket" : "Krans"} custom · ukuran ${sizeCfg.nama} · ${items.length} tangkai`, rupiah(subtotal)],
                ["Ongkos kirim (dalam kota)", rupiah(ONGKIR)],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                  <span style={{ paddingRight: 10 }}>{l}</span><span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: `2px solid ${C.maroon}`, marginTop: 8, paddingTop: 8, alignItems: "baseline" }}>
                <span style={{ fontWeight: 800 }}>Total dibayar</span>
                <span className="rk-serif" style={{ fontWeight: 800, fontSize: 21, color: C.maroon }}>{rupiah(grand)}</span>
              </div>
            </div>
            <div style={{ fontWeight: 800, color: C.maroon, margin: "16px 0 8px", fontSize: 14 }}>Metode pembayaran</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[["qris", "QRIS"], ["va", "Virtual Account"], ["kartu", "Kartu"]].map(([k, l]) => (
                <button key={k} className={"rk-chip" + (form.bayar === k ? " rk-chip-on" : "")}
                  style={{ flex: 1, padding: "9px 4px", fontSize: 12.5, fontWeight: 700, color: form.bayar === k ? C.maroon : C.inkSoft }}
                  onClick={() => setForm((f) => ({ ...f, bayar: k }))}>{l}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, background: "#eef4f1", border: `1px solid ${C.teal}`, borderRadius: 12, padding: "10px 12px", fontSize: 12.5, color: C.tealDeep, lineHeight: 1.5, marginBottom: 14 }}>
              <CreditCard size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>Pembayaranmu ditahan di escrow dan baru diteruskan ke floris setelah bunga diterima.</span>
            </div>
            {err && <div style={{ color: "#a13d3d", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{err}</div>}
            <button className="rk-btn rk-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 15.5 }} onClick={submit} disabled={sending}>
              <Check size={17} /> {sending ? "Menyimpan pesanan…" : "Bayar & buat pesanan"}
            </button>
            <div style={{ fontSize: 11, color: C.inkSoft, textAlign: "center", marginTop: 8 }}>
              {supabase
                ? "Fase pilot: pembayaran & status dikonfirmasi tim kami via WhatsApp."
                : "Mode demo — pesanan tidak disimpan (env Supabase belum diisi)."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Tracking ---------------- */

const TRACK_STEPS = [
  { icon: Route, t: "Mencari floris", d: "Mencocokkan order dengan floris terdekat berdasar lokasi, stok & rating." },
  { icon: Store, t: "Floris menerima order", d: "Stok dikonfirmasi. Rangkaianmu masuk antrean rakit." },
  { icon: Camera, t: "Rakit + foto konfirmasi", d: "Floris mengirim foto hasil rakitan untuk kamu setujui." },
  { icon: Truck, t: "Sedang diantar", d: "Kurir menuju alamat penerima." },
  { icon: Check, t: "Selesai", d: "Bunga diterima. Dana escrow diteruskan ke floris." },
];

function Tracking({ design, order, go }) {
  const { items, mode, wrapId, baseId, sizeId } = design;
  const wrap = WRAPS.find((w) => w.id === wrapId);
  const base = BASES.find((b) => b.id === baseId);
  const sizeCfg = SIZES.find((s) => s.id === sizeId);
  const florist = useMemo(() => FLORISTS[Math.floor(Math.random() * FLORISTS.length)], []);
  const [step, setStep] = useState(0);
  const [approved, setApproved] = useState(false);
  const [rating, setRating] = useState(0);
  const [revisi, setRevisi] = useState(false);

  useEffect(() => {
    if (step === 0) { const t = setTimeout(() => setStep(1), 2400); return () => clearTimeout(t); }
    if (step === 1) { const t = setTimeout(() => setStep(2), 2400); return () => clearTimeout(t); }
    if (step === 3) { const t = setTimeout(() => setStep(4), 3000); return () => clearTimeout(t); }
  }, [step]);

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "26px 16px 60px" }}>
      <h2 className="rk-serif" style={{ fontSize: 28, color: C.maroon, marginBottom: 4 }}>Pesanan {order.kode}</h2>
      <p style={{ color: C.inkSoft, fontSize: 14, marginBottom: 14 }}>
        Kirim ke {order.nama} · {order.tanggal} · {order.waktu}
      </p>
      {ADMIN_WA && (
        <a
          className="rk-btn rk-btn-teal"
          style={{ padding: "11px 20px", fontSize: 14, textDecoration: "none", marginBottom: 22, display: "inline-flex" }}
          href={"https://wa.me/" + ADMIN_WA + "?text=" + encodeURIComponent(
            "Halo Kalamekar! Saya baru membuat pesanan " + order.kode + " atas nama " + order.nama +
            ", kirim " + order.tanggal + " (" + order.waktu + "), total " + rupiah(order.total) + ". Mohon konfirmasinya ya 🌸"
          )}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={17} /> Konfirmasi pesanan via WhatsApp
        </a>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {/* Timeline */}
        <div className="rk-card" style={{ padding: 20 }}>
          {TRACK_STEPS.map((s, i) => {
            const done = i < step || (i === 4 && step === 4);
            const active = i === step && step < 4;
            return (
              <div key={s.t} style={{ display: "flex", gap: 14, position: "relative", paddingBottom: i < TRACK_STEPS.length - 1 ? 26 : 0 }}>
                {i < TRACK_STEPS.length - 1 && (
                  <div style={{ position: "absolute", left: 19, top: 40, bottom: 2, width: 2, background: i < step ? C.tealDeep : C.line }} />
                )}
                <div className={active ? "rk-pulse" : ""} style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? C.tealDeep : active ? C.gold : C.line, color: done || active ? "#fff" : C.inkSoft, zIndex: 1,
                }}>
                  {done ? <Check size={18} /> : <s.icon size={18} />}
                </div>
                <div style={{ paddingTop: 2 }}>
                  <div style={{ fontWeight: 800, fontSize: 14.5, color: done || active ? C.ink : C.inkSoft }}>{s.t}</div>
                  <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.5, marginTop: 2 }}>{s.d}</div>
                  {i === 1 && step >= 1 && (
                    <div style={{ marginTop: 8, background: C.cream, border: `1px solid ${C.line}`, borderRadius: 12, padding: "10px 12px", display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: C.maroon, color: C.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontWeight: 700 }}>
                        {florist.nama[0]}
                      </div>
                      <div style={{ fontSize: 12.5, lineHeight: 1.45 }}>
                        <div style={{ fontWeight: 800 }}>{florist.nama}</div>
                        <div style={{ color: C.inkSoft, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><MapPin size={12} /> {florist.area} · {florist.jarak}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Star size={12} fill={C.gold} color={C.gold} /> {florist.rating} · {florist.order} order</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: foto konfirmasi / selesai */}
        <div>
          <div className="rk-card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 800, color: C.maroon, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <Camera size={17} /> {step >= 2 ? "Foto rakitan dari floris" : "Preview rancanganmu"}
            </div>
            <div style={{
              maxWidth: 250, margin: "0 auto", padding: 10, background: "#fff",
              border: `1px solid ${C.line}`, borderRadius: 6, boxShadow: "0 8px 20px rgba(59,42,48,.12)",
              transform: "rotate(-1.2deg)",
              filter: step >= 2 ? "none" : "grayscale(.15) opacity(.85)",
            }}>
              <Stage items={items} mode={mode} wrap={wrap} base={base} sizeCfg={sizeCfg} readonly selectedId={null} onSelect={() => {}} onDragTo={() => {}} />
              <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 12, color: C.inkSoft, textAlign: "center", paddingTop: 8 }}>
                {step >= 2 ? `dirakit oleh ${florist.nama}` : "menunggu floris merakit…"}
              </div>
            </div>
            {step === 2 && !approved && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 10, lineHeight: 1.5 }}>
                  Hasil dapat sedikit bervariasi dari preview. Setujui untuk melanjutkan ke pengantaran, atau minta revisi ke floris.
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="rk-btn rk-btn-primary" style={{ flex: 1, justifyContent: "center", padding: "11px 0", fontSize: 14 }}
                    onClick={() => { setApproved(true); setStep(3); }}>
                    <Check size={16} /> Setujui & kirim
                  </button>
                  <button className="rk-btn rk-btn-ghost" style={{ flex: 1, justifyContent: "center", padding: "11px 0", fontSize: 14 }}
                    onClick={() => setRevisi(true)}>
                    <MessageCircle size={16} /> Minta revisi
                  </button>
                </div>
                {revisi && (
                  <div style={{ marginTop: 10, background: C.cream, border: `1px solid ${C.gold}`, borderRadius: 12, padding: "10px 12px", fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>
                    Permintaan revisi terkirim. Di fase pilot, tim kami meneruskannya ke floris via WhatsApp dan foto baru akan muncul di sini.
                  </div>
                )}
              </div>
            )}
          </div>

          {step === 4 && (
            <div className="rk-card" style={{ padding: 20, textAlign: "center" }}>
              <div className="rk-serif" style={{ fontSize: 20, fontWeight: 700, color: C.maroon, marginBottom: 6 }}>Bunga sudah diterima 🌷</div>
              <div style={{ fontSize: 13.5, color: C.inkSoft, marginBottom: 12 }}>Beri nilai untuk {florist.nama}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRating(n)} aria-label={`${n} bintang`}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                    <Star size={30} fill={n <= rating ? C.gold : "none"} color={C.gold} />
                  </button>
                ))}
              </div>
              {rating > 0 && <div style={{ fontSize: 13.5, color: C.tealDeep, fontWeight: 700, marginBottom: 12 }}>Terima kasih atas penilaianmu!</div>}
              <button className="rk-btn rk-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14.5 }} onClick={() => go("builder")}>
                <Sparkles size={16} /> Rangkai lagi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- App shell ---------------- */

export default function KalamekarApp() {
  const [page, setPage] = useState("home");
  const [design, setDesign] = useState({ items: [], mode: "bouquet", wrapId: "kraft", baseId: "rotan", sizeId: "M" });
  const [order, setOrder] = useState(null);

  const go = (p) => { setPage(p); window.scrollTo({ top: 0 }); };
  const goSection = (id) => { go("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60); };

  return (
    <div className="rk-root">
      <GlobalStyle />
      {/* Nav */}
      <header style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 18px", display: "flex", alignItems: "center", gap: 18 }}>
          <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: C.roseSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={17} color={C.maroon} />
            </span>
            <span className="rk-serif" style={{ color: C.maroonDeep, fontSize: 20, fontWeight: 700, letterSpacing: 0.4 }}>Kalamekar</span>
          </button>
          <nav style={{ display: "flex", gap: 16, marginLeft: "auto", alignItems: "center" }}>
            <button className="rk-navlink rk-navlink-onlight rk-hide-sm" onClick={() => go("home")}>Beranda</button>
            <button className="rk-navlink rk-navlink-onlight rk-hide-sm" onClick={() => goSection("kategori")}>Kategori</button>
            <button className="rk-navlink rk-navlink-onlight rk-hide-sm" onClick={() => goSection("florist")}>Florist</button>
            <button className="rk-navlink rk-navlink-onlight rk-hide-sm" onClick={() => goSection("cara-kerja")}>Cara kerja</button>
            <button className="rk-navlink rk-navlink-onlight rk-hide-sm" onClick={() => goSection("faq")}>FAQ</button>
            <button className="rk-btn rk-btn-ghost rk-hide-sm" style={{ padding: "8px 16px", fontSize: 13.5 }} onClick={() => goSection("untuk-floris")}>
              Untuk Florist
            </button>
            <button className="rk-btn" style={{ background: C.gold, color: C.maroonDeep, padding: "9px 18px", fontSize: 14 }} onClick={() => go("builder")}>
              <Flower2 size={16} /> Rangkai
            </button>
          </nav>
        </div>
      </header>

      {page === "home" && <Home go={go} setDesign={setDesign} />}
      {page === "builder" && <Builder design={design} setDesign={setDesign} go={go} />}
      {page === "checkout" && <Checkout design={design} go={go} setOrder={setOrder} />}
      {page === "tracking" && order && <Tracking design={design} order={order} go={go} />}

      <footer style={{ background: "#122B1C", color: "#B9C9BB", padding: "44px 20px 24px", marginTop: 10 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "space-between", paddingBottom: 26, borderBottom: "1px solid rgba(255,255,255,.12)" }}>
            <div style={{ maxWidth: 320 }}>
              <span className="rk-serif" style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Kalamekar</span>
              <p style={{ opacity: 0.85, fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
                Marketplace florist lokal Indonesia dengan kanvas rangkai custom — susun sendiri, floris partner
                yang merakit dan mengirimkan.
              </p>
            </div>
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#fff", marginBottom: 12 }}>Jelajahi</div>
                <div style={{ display: "grid", gap: 9, fontSize: 13.5 }}>
                  <button className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} onClick={() => goSection("kategori")}>Kategori</button>
                  <button className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} onClick={() => goSection("florist")}>Florist Pilihan</button>
                  <button className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} onClick={() => goSection("cara-kerja")}>Cara kerja</button>
                  <button className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} onClick={() => goSection("faq")}>FAQ</button>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#fff", marginBottom: 12 }}>Untuk Floris</div>
                <div style={{ display: "grid", gap: 9, fontSize: 13.5 }}>
                  <button className="rk-navlink rk-navlink-ondark" style={{ padding: 0, textAlign: "left" }} onClick={() => goSection("untuk-floris")}>Gabung sebagai partner</button>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#fff", marginBottom: 12 }}>Sosial</div>
                <div style={{ display: "grid", gap: 9, fontSize: 13.5 }}>
                  <a className="rk-navlink rk-navlink-ondark" href="https://www.instagram.com/kalamekar.id" target="_blank" rel="noreferrer">Instagram</a>
                  <a className="rk-navlink rk-navlink-ondark" href="https://www.tiktok.com/@kalamekar.id" target="_blank" rel="noreferrer">TikTok</a>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, paddingTop: 18, fontSize: 12.5, opacity: 0.65 }}>
            <span>© {new Date().getFullYear()} Kalamekar. Seluruh hak cipta dilindungi.</span>
            <span>Pilot Fase 1 — order dikoordinasikan manual bersama floris partner via WhatsApp.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
