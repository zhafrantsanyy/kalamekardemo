"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SIZES } from "@/lib/catalog";
import { BUILDER_URL } from "@kalamekar/shared/tokens";

const CATEGORIES = [
  { id: "hand-bouquet", nama: "Hand Bouquet" },
  { id: "papan-bunga", nama: "Papan Bunga" },
  { id: "standing-flower", nama: "Standing Flower" },
  { id: "bunga-meja", nama: "Bunga Meja" },
  { id: "parcel-hampers", nama: "Parcel & Hampers" },
  { id: "dekorasi-acara", nama: "Dekorasi Acara" },
];

export default function HeroSearch() {
  const [kategori, setKategori] = useState(CATEGORIES[0].id);
  const [ukuran, setUkuran] = useState("M");

  return (
    <form
      className="rk-search-panel"
      action={BUILDER_URL}
      method="get"
      aria-label="Mulai merangkai bunga"
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <div className="rk-search-field" style={{ flex: "1 1 160px" }}>
          <label htmlFor="kategori-select">Kategori</label>
          <select id="kategori-select" name="kategori" value={kategori} onChange={(e) => setKategori(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
          </select>
        </div>
        <div className="rk-search-field" style={{ flex: "1 1 120px" }}>
          <label htmlFor="ukuran-select">Ukuran</label>
          <select id="ukuran-select" name="ukuran" value={ukuran} onChange={(e) => setUkuran(e.target.value)}>
            {SIZES.map((s) => <option key={s.id} value={s.id}>{s.nama} · {s.saran}</option>)}
          </select>
        </div>
        <button className="rk-btn" type="submit" style={{ background: "var(--rk-maroon)", color: "#fff", padding: "13px 20px", fontSize: 14.5, flex: "0 0 auto" }}>
          <Search size={16} /> Mulai Merangkai
        </button>
      </div>
    </form>
  );
}
