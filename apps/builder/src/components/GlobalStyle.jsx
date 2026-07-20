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
    .rk-tool { background:${C.maroon}; color:#fff; border:none; border-radius:10px; width:34px; height:34px;
      display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .rk-tool:hover { background:${C.bloomDark}; }
    .rk-tool-danger { background:#a13d3d; }
    .rk-input { width:100%; padding:11px 13px; border:1.5px solid ${C.line}; border-radius:12px; background:#fff;
      font-family:${sans}; font-size:14.5px; color:${C.ink}; }
    .rk-input:focus { outline:none; border-color:${C.maroon}; box-shadow:0 0 0 3px rgba(185,51,101,.12); }
    .rk-builder-grid { display:grid; grid-template-columns: 250px 1fr 300px; gap:18px; align-items:start; }
    @media (max-width: 1020px) {
      .rk-builder-grid { grid-template-columns: 1fr; }
      .rk-palette-col { order: 2; }
      .rk-stage-col { order: 1; }
      .rk-price-col { order: 3; }
      .rk-pal-scroll { display:grid; grid-template-columns: repeat(auto-fill,minmax(86px,1fr)); }
    }
    @keyframes rk-pulse { 0%,100% { opacity:1;} 50% { opacity:.35;} }
    .rk-pulse { animation: rk-pulse 1.4s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .rk-pulse { animation: none; }
      .rk-btn, .rk-pal-item { transition: none; }
    }
  `}</style>
  );
}
