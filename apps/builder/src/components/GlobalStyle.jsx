import { C, serif, sans } from "../lib/theme";

export default function GlobalStyle() {
  return (
    <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
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
    .rk-nav-toggle { display:none; background:none; border:none; cursor:pointer; padding:6px; align-items:center; justify-content:center; }
    .rk-nav-mobile { display:none; }
    @media (max-width: 760px) {
      .rk-steps-grid { grid-template-columns: 1fr; }
      .rk-arch-grid { grid-template-columns: 1fr; }
      .rk-hero-title { font-size: 34px !important; }
      .rk-hide-sm { display:none !important; }
      .rk-nav-toggle { display:flex; }
      .rk-nav-mobile {
        display:flex; flex-direction:column; gap:4px;
        position:absolute; top:100%; left:0; right:0; background:#fff;
        border-bottom:1px solid ${C.line}; box-shadow:0 12px 24px -18px rgba(28,42,32,.35);
        padding:16px 18px;
      }
      .rk-nav-mobile .rk-navlink { padding:10px 2px; font-size:15.5px; }
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

    /* ---------- about page ---------- */
    .rk-founder-card { border:1px solid ${C.line}; border-radius:20px; overflow:hidden; background:#fff; transition:transform .15s, border-color .15s; }
    .rk-founder-card:hover { transform:translateY(-3px); border-color:${C.maroon}; }

    /* ---------- kategori page ---------- */
    .rk-jump-pill { padding:8px 16px; border-radius:999px; border:1px solid ${C.line}; background:#fff; cursor:pointer;
      font-family:${sans}; font-size:13.5px; font-weight:600; color:${C.maroonDeep}; transition:border-color .15s, color .15s; }
    .rk-jump-pill:hover { border-color:${C.maroon}; color:${C.maroon}; }
    .rk-kat-card { border:1px solid ${C.line}; border-radius:20px; background:#fff; overflow:hidden;
      display:grid; grid-template-columns:300px 1fr; }
    .rk-kat-card.is-even{ grid-template-columns:1fr 300px; }
    .rk-kat-card.is-even .rk-kat-visual{ order:2; }
    .rk-kat-visual { position:relative; min-height:260px; }
    .rk-kat-visual svg { width:100%; height:100%; position:absolute; inset:0; }
    .rk-kat-chip { display:inline-block; padding:6px 14px; border-radius:999px; font-size:13px; font-weight:600;
      background:${C.roseSoft}; color:${C.bloomDark}; border:none; cursor:default; font-family:${sans}; }
    .rk-kat-chip-link { cursor:pointer; transition:background .15s; }
    .rk-kat-chip-link:hover { background:#F5DCE7; }
    .rk-kat-chip-leaf { background:${C.cream}; color:${C.maroonDeep}; }
    .rk-occ-card { background:#fff; border:1px solid ${C.line}; border-radius:14px; padding:24px; width:100%;
      text-align:left; cursor:pointer; font-family:${sans}; transition:transform .15s, border-color .15s; }
    .rk-occ-card:hover { transform:translateY(-3px); border-color:${C.maroon}; }
    .rk-flower-card { border:1px solid ${C.line}; border-radius:14px; padding:24px; background:#fff;
      transition:transform .15s, border-color .15s; }
    .rk-flower-card:hover { transform:translateY(-3px); border-color:${C.teal}; }
    @media (max-width:960px) {
      .rk-kat-card, .rk-kat-card.is-even { grid-template-columns:1fr; }
      .rk-kat-card.is-even .rk-kat-visual { order:0; }
      .rk-kat-visual { min-height:180px; }
    }
  `}</style>
  );
}
