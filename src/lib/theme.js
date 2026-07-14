/* ============================================================
   KALAMEKAR — shared design tokens & small helpers
   Palet: bloom pink · green-900/700 · marigold · ink
   ============================================================ */

export const C = {
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

export const serif = "'Bricolage Grotesque', Georgia, 'Times New Roman', serif";
export const sans = "'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

export const rupiah = (n) => "Rp" + new Intl.NumberFormat("id-ID").format(n);
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

let __id = 1;
export const uid = () => "it" + __id++;
