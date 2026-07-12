import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Flower2, Trash2, RotateCw, Plus, Minus, Copy, ArrowUp, Sparkles,
  ShoppingBag, MapPin, Star, Truck, Camera, Check, ChevronLeft,
  MessageCircle, Wand2, Eraser, Store, Route, CreditCard, Leaf, Heart
} from "lucide-react";
import { supabase, ADMIN_WA } from "./lib/supabase";

/* ============================================================
   KALAMEKAR — Marketplace Florist dengan Custom Bouquet Builder
   Fase 1 (Concierge) demo
   Palet: maroon · dusty rose · teal · gold · cream
   ============================================================ */

const C = {
  maroon: "#5c1f33",
  maroonDeep: "#471728",
  maroonSoft: "#7a3a50",
  rose: "#c08484",
  roseSoft: "#e3c6c6",
  teal: "#6fa294",
  tealDeep: "#4f7d72",
  gold: "#c9a24b",
  goldSoft: "#e6cf9a",
  cream: "#f5efe4",
  card: "#fdfaf3",
  ink: "#3b2a30",
  inkSoft: "#82717a",
  line: "#e7dcc9",
};

const serif = "Georgia, 'Times New Roman', serif";
const sans = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const rupiah = (n) => "Rp" + new Intl.NumberFormat("id-ID").format(n);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
let __id = 1;
const uid = () => "it" + __id++;

/* ---------------- SVG helpers & flower illustrations ---------------- */

const ring = (n, rx, ry, dist, fill, opacity = 1, seed = 0) =>
  Array.from({ length: n }).map((_, i) => (
    <ellipse
      key={i}
      cx="50"
      cy={50 - dist}
      rx={rx}
      ry={ry}
      fill={fill}
      opacity={opacity}
      transform={`rotate(${(360 / n) * i + seed} 50 50)`}
    />
  ));

const Rose = ({ a, b, c }) => (
  <>
    {ring(7, 15, 21, 17, a)}
    {ring(6, 12, 16, 10, b)}
    <circle cx="50" cy="50" r="13" fill={a} />
    <path d="M50 40 a10 10 0 1 1 -10 10 a6.5 6.5 0 1 0 10 -10" fill={b} />
    <circle cx="50" cy="50" r="4" fill={c} />
  </>
);

const Lily = () => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <path
        key={i}
        d="M50 50 C 42 36, 44 18, 50 8 C 56 18, 58 36, 50 50 Z"
        fill="#fbf6ec"
        stroke="#e8ddc8"
        strokeWidth="1"
        transform={`rotate(${60 * i} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="7" fill={C.goldSoft} />
    {Array.from({ length: 6 }).map((_, i) => (
      <circle key={i} cx="50" cy="38" r="2.4" fill={C.gold} transform={`rotate(${60 * i + 30} 50 50)`} />
    ))}
  </>
);

const Tulip = ({ a, b }) => (
  <>
    <path d="M26 44 C 24 76, 40 88, 50 90 C 60 88, 76 76, 74 44 C 66 52, 60 52, 58 46 C 55 53, 45 53, 42 46 C 40 52, 34 52, 26 44 Z" fill={a} />
    <path d="M42 46 C 45 53, 55 53, 58 46 C 58 66, 54 80, 50 86 C 46 80, 42 66, 42 46 Z" fill={b} />
    <path d="M26 44 C 30 36, 40 32, 50 33 C 60 32, 70 36, 74 44 C 66 52, 60 52, 58 46 C 55 53, 45 53, 42 46 C 40 52, 34 52, 26 44 Z" fill={b} opacity="0.55" />
  </>
);

const Sunflower = () => (
  <>
    {ring(14, 7, 20, 26, "#e8b53a")}
    {ring(14, 6, 16, 22, "#f2c957", 1, 13)}
    <circle cx="50" cy="50" r="17" fill="#6b4423" />
    <circle cx="50" cy="50" r="17" fill="none" stroke="#4e2f16" strokeWidth="3" strokeDasharray="2 3" />
    <circle cx="45" cy="45" r="2" fill="#8a5a2e" />
    <circle cx="55" cy="48" r="2" fill="#8a5a2e" />
    <circle cx="49" cy="55" r="2" fill="#8a5a2e" />
  </>
);

const Peony = ({ a, b }) => (
  <>
    {ring(8, 16, 19, 18, a)}
    {ring(8, 13, 15, 12, b, 1, 22)}
    {ring(7, 9, 11, 7, a, 1, 8)}
    <circle cx="50" cy="50" r="8" fill={b} />
    <circle cx="50" cy="50" r="3.5" fill={C.goldSoft} />
  </>
);

const Krisan = ({ a, b }) => (
  <>
    {ring(18, 3.6, 17, 20, a)}
    {ring(16, 3.2, 13, 14, b, 1, 10)}
    {ring(12, 3, 9, 9, a, 1, 5)}
    <circle cx="50" cy="50" r="6" fill={b} />
  </>
);

const Orchid = () => (
  <>
    <ellipse cx="50" cy="27" rx="10" ry="18" fill="#e9d7ee" />
    <ellipse cx="30" cy="44" rx="17" ry="10" fill="#e9d7ee" transform="rotate(-20 30 44)" />
    <ellipse cx="70" cy="44" rx="17" ry="10" fill="#e9d7ee" transform="rotate(20 70 44)" />
    <ellipse cx="36" cy="62" rx="13" ry="9" fill="#d9b7e2" transform="rotate(25 36 62)" />
    <ellipse cx="64" cy="62" rx="13" ry="9" fill="#d9b7e2" transform="rotate(-25 64 62)" />
    <path d="M50 46 C 42 52, 42 64, 50 70 C 58 64, 58 52, 50 46 Z" fill="#a24b8f" />
    <circle cx="50" cy="52" r="3.5" fill={C.goldSoft} />
    <circle cx="46" cy="58" r="1.5" fill="#7c2f6c" />
    <circle cx="54" cy="58" r="1.5" fill="#7c2f6c" />
  </>
);

const jag = (cx, cy, r, teeth) => {
  let d = "";
  for (let i = 0; i <= teeth * 2; i++) {
    const ang = (Math.PI * 2 * i) / (teeth * 2) - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.82;
    const x = cx + Math.cos(ang) * rr;
    const y = cy + Math.sin(ang) * rr;
    d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
  }
  return d + "Z";
};

const Carnation = ({ a, b }) => (
  <>
    <path d={jag(50, 50, 34, 14)} fill={a} />
    <path d={jag(50, 50, 25, 12)} fill={b} />
    <path d={jag(50, 50, 16, 10)} fill={a} />
    <path d={jag(50, 50, 8, 8)} fill={b} />
  </>
);

const Daisy = () => (
  <>
    {ring(12, 6, 17, 21, "#fdfbf4")}
    {ring(12, 5, 14, 17, "#f3ecda", 1, 15)}
    <circle cx="50" cy="50" r="11" fill="#eebc3f" />
    <circle cx="47" cy="47" r="2" fill="#d9a52a" />
    <circle cx="54" cy="51" r="2" fill="#d9a52a" />
  </>
);

const Lavender = () => (
  <>
    <path d="M50 92 C 50 70, 50 55, 50 38" stroke="#7f9a6d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    {[
      [50, 16], [43, 24], [57, 24], [46, 33], [54, 33], [50, 28],
      [42, 42], [58, 42], [50, 40], [45, 51], [55, 51], [50, 49], [50, 60],
    ].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="5.5" ry="7" fill={i % 3 === 0 ? "#8f7cc0" : "#a794d6"} />
    ))}
  </>
);

const floret = (x, y, s, a, b) => (
  <g key={x + "-" + y} transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx="0" cy="-6" r="5" fill={a} />
    <circle cx="0" cy="6" r="5" fill={a} />
    <circle cx="-6" cy="0" r="5" fill={a} />
    <circle cx="6" cy="0" r="5" fill={a} />
    <circle cx="0" cy="0" r="2.6" fill={b} />
  </g>
);

const Hydrangea = () => (
  <>
    <circle cx="50" cy="50" r="31" fill="#b9c4e6" opacity="0.5" />
    {floret(50, 32, 1.1, "#aab8e4", "#7d8fc7")}
    {floret(33, 44, 1.05, "#c3cdee", "#8fa0d3")}
    {floret(67, 44, 1.05, "#aab8e4", "#7d8fc7")}
    {floret(41, 61, 1.1, "#b6c2ea", "#8598cd")}
    {floret(59, 61, 1.0, "#c3cdee", "#8fa0d3")}
    {floret(50, 48, 1.15, "#9fb0e0", "#7487c2")}
  </>
);

const BabysBreath = () => (
  <>
    {[
      [50, 82, 30, 30], [50, 82, 62, 26], [50, 82, 46, 18],
    ].map(([x1, y1, x2, y2], i) => (
      <path key={i} d={`M${x1} ${y1} Q ${(x1 + x2) / 2 + 6} ${(y1 + y2) / 2}, ${x2} ${y2}`} stroke="#93a97f" strokeWidth="1.6" fill="none" />
    ))}
    {[
      [30, 27], [38, 20], [46, 15], [56, 18], [64, 23], [70, 32],
      [34, 38], [44, 30], [54, 28], [62, 36], [48, 42], [58, 46], [38, 48],
    ].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="4.5" fill="#fdfcf7" stroke="#e7e0cd" strokeWidth="0.8" />
        <circle cx={x} cy={y} r="1.3" fill="#e4d9b8" />
      </g>
    ))}
  </>
);

const Eucalyptus = () => (
  <>
    <path d="M50 94 C 48 70, 52 40, 46 10" stroke="#7c9a8e" strokeWidth="3" fill="none" strokeLinecap="round" />
    {[
      [49, 78, -1], [49, 66, 1], [50, 55, -1], [50, 44, 1], [49, 33, -1], [48, 22, 1], [47, 13, -1],
    ].map(([x, y, s], i) => (
      <circle key={i} cx={x + s * 11} cy={y} r={8 - i * 0.55} fill={i % 2 ? "#9dbcae" : "#8bafa0"} />
    ))}
  </>
);

const Fern = () => (
  <>
    <path d="M50 94 C 50 66, 50 38, 50 10" stroke="#5f7d54" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    {Array.from({ length: 9 }).map((_, i) => {
      const y = 84 - i * 8.6;
      const len = 20 - i * 1.9;
      return (
        <g key={i}>
          <path d={`M50 ${y} Q ${50 - len * 0.7} ${y - 4}, ${50 - len} ${y - 7}`} stroke="#6f9160" strokeWidth={4.5 - i * 0.3} fill="none" strokeLinecap="round" />
          <path d={`M50 ${y} Q ${50 + len * 0.7} ${y - 4}, ${50 + len} ${y - 7}`} stroke="#7ba26b" strokeWidth={4.5 - i * 0.3} fill="none" strokeLinecap="round" />
        </g>
      );
    })}
  </>
);

const Monstera = () => (
  <>
    <path d="M50 92 C 50 78, 50 70, 50 62" stroke="#3f6b4f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M50 64 C 20 60, 12 34, 26 18 C 38 6, 62 6, 74 18 C 88 34, 80 60, 50 64 Z" fill="#4e8060" />
    {[-28, -14, 14, 28].map((dx, i) => (
      <path
        key={i}
        d={`M50 60 Q ${50 + dx * 0.6} ${44 - Math.abs(dx) * 0.3}, ${50 + dx} ${26 - Math.abs(dx) * 0.2}`}
        stroke={C.card}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    ))}
    <path d="M50 62 C 50 46, 50 32, 50 18" stroke="#3f6b4f" strokeWidth="2.4" fill="none" />
  </>
);

/* ---------------- Catalog ---------------- */

const FLOWERS = [
  { id: "mawar_merah", nama: "Mawar Merah", harga: 15000, kat: "bunga", el: <Rose a="#b03a4d" b="#8e2b3d" c="#e3899a" /> },
  { id: "mawar_putih", nama: "Mawar Putih", harga: 15000, kat: "bunga", el: <Rose a="#f6f1e6" b="#e6dcc8" c="#fbf8f0" /> },
  { id: "mawar_pink", nama: "Mawar Pink", harga: 15000, kat: "bunga", el: <Rose a="#e3a1b0" b="#cf7f93" c="#f3cfd8" /> },
  { id: "peony", nama: "Peony", harga: 35000, kat: "bunga", el: <Peony a="#eeb8c4" b="#f7dbe2" /> },
  { id: "lily", nama: "Lily Putih", harga: 22000, kat: "bunga", el: <Lily /> },
  { id: "tulip", nama: "Tulip", harga: 25000, kat: "bunga", el: <Tulip a="#d96a5f" b="#eb8f80" /> },
  { id: "matahari", nama: "Bunga Matahari", harga: 18000, kat: "bunga", el: <Sunflower /> },
  { id: "anggrek", nama: "Anggrek Bulan", harga: 30000, kat: "bunga", el: <Orchid /> },
  { id: "krisan", nama: "Krisan Kuning", harga: 8000, kat: "bunga", el: <Krisan a="#e9c25a" b="#f4d98c" /> },
  { id: "anyelir", nama: "Anyelir", harga: 10000, kat: "bunga", el: <Carnation a="#df97a8" b="#f0bcc8" /> },
  { id: "daisy", nama: "Daisy", harga: 9000, kat: "bunga", el: <Daisy /> },
  { id: "lavender", nama: "Lavender", harga: 12000, kat: "bunga", el: <Lavender /> },
  { id: "hydrangea", nama: "Hortensia", harga: 28000, kat: "bunga", el: <Hydrangea /> },
  { id: "babys", nama: "Baby's Breath", harga: 7000, kat: "filler", el: <BabysBreath /> },
  { id: "eucalyptus", nama: "Eukaliptus", harga: 8000, kat: "filler", el: <Eucalyptus /> },
  { id: "pakis", nama: "Daun Pakis", harga: 6000, kat: "filler", el: <Fern /> },
  { id: "monstera", nama: "Monstera", harga: 12000, kat: "filler", el: <Monstera /> },
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
    .rk-root { font-family: ${sans}; color: ${C.ink}; background: ${C.cream}; min-height: 100vh; }
    .rk-serif { font-family: ${serif}; }
    .rk-btn { border: none; cursor: pointer; font-family: ${sans}; font-weight: 600; border-radius: 999px;
      display: inline-flex; align-items: center; gap: 8px; transition: transform .12s ease, box-shadow .12s ease, background .12s ease; }
    .rk-btn:hover { transform: translateY(-1px); }
    .rk-btn:focus-visible { outline: 3px solid ${C.gold}; outline-offset: 2px; }
    .rk-btn:active { transform: translateY(0); }
    .rk-btn-primary { background: ${C.maroon}; color: ${C.cream}; box-shadow: 0 6px 16px rgba(92,31,51,.28); }
    .rk-btn-primary:hover { background: ${C.maroonDeep}; }
    .rk-btn-ghost { background: transparent; color: ${C.maroon}; border: 1.5px solid ${C.maroon}; }
    .rk-btn-ghost:hover { background: rgba(92,31,51,.06); }
    .rk-btn-teal { background: ${C.tealDeep}; color: #fff; }
    .rk-chip { border: 1.5px solid ${C.line}; background: ${C.card}; border-radius: 12px; cursor: pointer;
      transition: border-color .12s, box-shadow .12s; font-family: ${sans}; }
    .rk-chip:hover { border-color: ${C.rose}; }
    .rk-chip:focus-visible { outline: 3px solid ${C.gold}; outline-offset: 2px; }
    .rk-chip-on { border-color: ${C.maroon}; box-shadow: 0 0 0 2px ${C.maroon} inset; }
    .rk-card { background: ${C.card}; border: 1px solid ${C.line}; border-radius: 18px; }
    .rk-pal-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px 8px;
      border: 1.5px solid ${C.line}; border-radius: 14px; background: ${C.card}; cursor: pointer; transition: all .12s; }
    .rk-pal-item:hover { border-color: ${C.rose}; transform: translateY(-2px); box-shadow: 0 8px 18px rgba(92,31,51,.10); }
    .rk-pal-item:focus-visible { outline: 3px solid ${C.gold}; outline-offset: 2px; }
    .rk-navlink { background:none; border:none; cursor:pointer; font-family:${sans}; font-size:14.5px; font-weight:600;
      color:${C.cream}; opacity:.85; padding:6px 2px; }
    .rk-navlink:hover { opacity:1; text-decoration: underline; text-underline-offset: 4px; }
    .rk-tool { background:${C.maroon}; color:${C.cream}; border:none; border-radius:10px; width:34px; height:34px;
      display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .rk-tool:hover { background:${C.maroonDeep}; }
    .rk-tool-danger { background:#a13d3d; }
    .rk-input { width:100%; padding:11px 13px; border:1.5px solid ${C.line}; border-radius:12px; background:#fff;
      font-family:${sans}; font-size:14.5px; color:${C.ink}; }
    .rk-input:focus { outline:none; border-color:${C.maroon}; box-shadow:0 0 0 3px rgba(92,31,51,.12); }
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
  `}</style>
);

/* ---------------- Mini flower thumbnail ---------------- */

const Thumb = ({ f, size = 44 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">{f.el}</svg>
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
              transform: `translate(-50%, -50%) rotate(${it.rot}deg)`,
              zIndex: idx + 1,
              cursor: readonly ? "default" : "grab",
              filter: sel ? "drop-shadow(0 0 5px rgba(201,162,75,.95))" : "drop-shadow(0 3px 4px rgba(59,42,48,.18))",
            }}
          >
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "auto", display: "block" }}>{f.el}</svg>
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
    <svg viewBox="0 0 240 240" width="100%" style={{ maxWidth: 340 }} aria-hidden="true">
      <g className="rk-wreath-hero">
        <circle cx="120" cy="120" r="78" fill="none" stroke={C.maroonSoft} strokeWidth="10" opacity="0.5" />
        {picks.map((pid, i) => {
          const a = (Math.PI * 2 * i) / picks.length;
          const x = 120 + Math.cos(a) * 78;
          const y = 120 + Math.sin(a) * 78;
          return (
            <g key={i} transform={`translate(${x - 19} ${y - 19}) scale(0.38)`}>
              {FMAP[pid].el}
            </g>
          );
        })}
      </g>
      <text x="120" y="114" textAnchor="middle" fill={C.goldSoft} fontFamily={serif} fontSize="17" fontStyle="italic">kala</text>
      <text x="120" y="136" textAnchor="middle" fill={C.cream} fontFamily={serif} fontSize="17" fontStyle="italic">mekar</text>
    </svg>
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

function Home({ go }) {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: `linear-gradient(160deg, ${C.maroon} 0%, ${C.maroonDeep} 100%)`, color: C.cream, padding: "0 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32, padding: "64px 0 72px" }}>
          <div style={{ flex: "1 1 420px", minWidth: 280 }}>
            <div style={{ letterSpacing: 3, fontSize: 12.5, fontWeight: 700, color: C.goldSoft, textTransform: "uppercase", marginBottom: 18 }}>
              Rangkai sendiri · Dirakit floris lokal
            </div>
            <h1 className="rk-serif rk-hero-title" style={{ fontSize: 46, lineHeight: 1.12, fontWeight: 700, marginBottom: 18 }}>
              Buket & krans impianmu,
              <br />
              kamu yang merangkai.
            </h1>
            <p style={{ fontSize: 16.5, lineHeight: 1.65, opacity: 0.88, maxWidth: 520, marginBottom: 28 }}>
              Susun bunga tangkai demi tangkai lewat kanvas drag-and-drop, lihat harga langsung,
              lalu biarkan floris partner terdekat merakit dan mengantarnya untukmu.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="rk-btn rk-btn-primary" style={{ background: C.gold, color: C.maroonDeep, padding: "14px 26px", fontSize: 15.5 }} onClick={() => go("builder")}>
                <Wand2 size={18} /> Mulai merangkai
              </button>
              <button className="rk-btn rk-btn-ghost" style={{ borderColor: C.cream, color: C.cream, padding: "14px 22px", fontSize: 15 }}
                onClick={() => document.getElementById("cara-kerja")?.scrollIntoView({ behavior: "smooth" })}>
                Lihat cara kerja
              </button>
            </div>
            <div style={{ display: "flex", gap: 22, marginTop: 34, flexWrap: "wrap" }}>
              {[["17", "jenis bunga & daun"], ["3–5", "floris partner pilot"], ["100%", "escrow terlindungi"]].map(([n, l]) => (
                <div key={l}>
                  <div className="rk-serif" style={{ fontSize: 26, fontWeight: 700, color: C.goldSoft }}>{n}</div>
                  <div style={{ fontSize: 12.5, opacity: 0.75 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rk-float" style={{ flex: "0 1 340px", minWidth: 260, display: "flex", justifyContent: "center" }}>
            <HeroWreath />
          </div>
        </div>
      </section>

      {/* Cara kerja */}
      <section id="cara-kerja" style={{ padding: "64px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 32, color: C.maroon, marginBottom: 8 }}>Cara kerja</h2>
          <p style={{ color: C.inkSoft, marginBottom: 28, fontSize: 15 }}>
            Dari rangkai sampai bunga sampai — dengan pengalihan otomatis bila floris sedang penuh.
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

      {/* Untuk floris */}
      <section style={{ background: C.maroon, color: C.cream, padding: "56px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="rk-serif" style={{ fontSize: 30, marginBottom: 8 }}>Punya toko bunga? Jadi floris partner.</h2>
          <p style={{ opacity: 0.85, fontSize: 15, maxWidth: 640, marginBottom: 22, lineHeight: 1.6 }}>
            Tanpa biaya di muka. Kamu terima 75–85% dari nilai order, pembayaran dilindungi escrow,
            dan kamu tetap pegang kendali penuh untuk menerima atau menolak order.
          </p>
          <div className="rk-arch-grid" style={{ maxWidth: 760 }}>
            {[
              [CreditCard, "Escrow & payout otomatis", "Dana pelanggan ditahan platform, diteruskan begitu bunga diterima."],
              [MessageCircle, "Koordinasi via WhatsApp", "Order masuk lewat WA — tanpa perlu belajar aplikasi baru di fase pilot."],
            ].map(([Ic, t, d]) => (
              <div key={t} style={{ background: "rgba(255,255,255,.07)", borderRadius: 14, padding: 18, display: "flex", gap: 14 }}>
                <Ic size={22} style={{ color: C.goldSoft, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{t}</div>
                  <div style={{ fontSize: 13.5, opacity: 0.8, lineHeight: 1.5 }}>{d}</div>
                </div>
              </div>
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

  return (
    <div className="rk-root">
      <GlobalStyle />
      {/* Nav */}
      <header style={{ background: C.maroonDeep, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(71,23,40,.35)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 18px", display: "flex", alignItems: "center", gap: 18 }}>
          <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: C.rose, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={17} color={C.maroonDeep} />
            </span>
            <span className="rk-serif" style={{ color: C.cream, fontSize: 20, fontWeight: 700, letterSpacing: 0.4 }}>Kalamekar</span>
          </button>
          <nav style={{ display: "flex", gap: 16, marginLeft: "auto", alignItems: "center" }}>
            <button className="rk-navlink rk-hide-sm" onClick={() => go("home")}>Beranda</button>
            <button className="rk-navlink rk-hide-sm" onClick={() => { go("home"); setTimeout(() => document.getElementById("cara-kerja")?.scrollIntoView({ behavior: "smooth" }), 60); }}>Cara kerja</button>
            <button className="rk-btn" style={{ background: C.gold, color: C.maroonDeep, padding: "9px 18px", fontSize: 14 }} onClick={() => go("builder")}>
              <Flower2 size={16} /> Rangkai
            </button>
          </nav>
        </div>
      </header>

      {page === "home" && <Home go={go} />}
      {page === "builder" && <Builder design={design} setDesign={setDesign} go={go} />}
      {page === "checkout" && <Checkout design={design} go={go} setOrder={setOrder} />}
      {page === "tracking" && order && <Tracking design={design} order={order} go={go} />}

      <footer style={{ background: C.maroonDeep, color: C.cream, padding: "28px 20px", marginTop: 10 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="rk-serif" style={{ fontSize: 18, fontWeight: 700 }}>Kalamekar</span>
            <span style={{ opacity: 0.6, fontSize: 12.5, marginLeft: 10 }}>Marketplace floris dengan custom bouquet builder</span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.65, maxWidth: 420, lineHeight: 1.5 }}>
            Pilot Fase 1 — order dikoordinasikan manual oleh tim kami bersama floris partner via WhatsApp,
            supaya kualitas terjaga sebelum semuanya otomatis.
          </div>
        </div>
      </footer>
    </div>
  );
}
