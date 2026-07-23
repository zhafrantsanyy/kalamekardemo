import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Flower2, Trash2, RotateCw, Plus, Minus, Copy, ArrowUp,
  ShoppingBag, Wand2, Eraser, Heart, LayoutTemplate, LayoutGrid,
} from "lucide-react";
import { C, rupiah, clamp, uid } from "../lib/theme";
import { FLOWERS, FMAP, WRAPS, BASES, SIZES } from "../lib/catalog";
import { supabase } from "../lib/supabase";
import { SITE_URL } from "../lib/urls";
import Thumb from "../components/Thumb";
import { BouquetGuide, WreathGuide } from "../components/BouquetGuide";

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

/* ---------------- Builder canvas step ---------------- */

function BuilderCanvasStep({ design, setDesign, onSwitchProduk }) {
  const { items, mode, wrapId, baseId, sizeId } = design;
  const [selectedId, setSelectedId] = useState(null);
  const wrap = WRAPS.find((w) => w.id === wrapId);
  const base = BASES.find((b) => b.id === baseId);
  const sizeCfg = SIZES.find((s) => s.id === sizeId);
  const [kat, setKat] = useState("bunga");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

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

  const submitToCheckout = async () => {
    if (items.length === 0) return;
    setErr("");
    if (!supabase) {
      setErr("Checkout builder butuh koneksi Supabase aktif (env belum diisi).");
      return;
    }
    setSending(true);
    const { data, error } = await supabase
      .from("builder_compositions")
      .insert({
        product_type: mode === "bouquet" ? "buket" : "krans",
        mode,
        ukuran: sizeId,
        wrapping: mode === "bouquet" ? wrapId : null,
        ring_dasar: mode === "wreath" ? baseId : null,
        items: items.map(({ type, x, y, size, rot }) => ({ type, x, y, size, rot })),
        harga: total,
      })
      .select("id")
      .single();
    if (error || !data) {
      setSending(false);
      setErr("Gagal menyimpan rangkaian: " + (error?.message || "Coba lagi ya."));
      return;
    }
    window.location.href = `${SITE_URL}/keranjang/tambah?composition_id=${data.id}&source=builder`;
  };

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
          {onSwitchProduk && (
            <>
              <button className="rk-chip"
                style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 14, color: C.inkSoft }}
                onClick={() => onSwitchProduk("papan_bunga")}>
                <LayoutTemplate size={16} /> Papan Bunga
              </button>
              <button className="rk-chip"
                style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 14, color: C.inkSoft }}
                onClick={() => onSwitchProduk("kustom")}>
                <LayoutGrid size={16} /> Rangkai Bebas
              </button>
            </>
          )}
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
          {err && <div style={{ color: "#a13d3d", fontSize: 12.5, fontWeight: 600, marginBottom: 10 }}>{err}</div>}
          <button className="rk-btn rk-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 15.5 }}
            disabled={items.length === 0 || sending}
            onClick={submitToCheckout}>
            <ShoppingBag size={17} /> {sending ? "Menyimpan…" : "Lanjut ke checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Bouquet builder page (route: /builder) ---------------- */

export default function BouquetBuilder({ onSwitchProduk }) {
  const [design, setDesign] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const sizeId = params.get("size");
    return {
      items: [],
      mode: mode === "wreath" ? "wreath" : "bouquet",
      wrapId: "kraft",
      baseId: "rotan",
      sizeId: SIZES.some((s) => s.id === sizeId) ? sizeId : "M",
    };
  });

  return <BuilderCanvasStep design={design} setDesign={setDesign} onSwitchProduk={onSwitchProduk} />;
}
