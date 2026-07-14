import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Flower2, Trash2, RotateCw, Plus, Minus, Copy, ArrowUp, Sparkles,
  ShoppingBag, MapPin, Star, Truck, Camera, Check, ChevronLeft,
  MessageCircle, Wand2, Eraser, Store, Route, CreditCard, Heart,
} from "lucide-react";
import { C, serif, rupiah, clamp, uid } from "../lib/theme";
import { FLOWERS, FMAP, WRAPS, BASES, SIZES, ONGKIR } from "../lib/catalog";
import { supabase, ADMIN_WA } from "../lib/supabase";
import Thumb from "../components/Thumb";
import { BouquetGuide, WreathGuide } from "../components/BouquetGuide";

const FLORISTS = [
  { nama: "Kirana Bloom Studio", area: "Kemang", jarak: "2,3 km", rating: 4.8, order: 214 },
  { nama: "Sekar Ayu Florist", area: "Tebet", jarak: "3,1 km", rating: 4.9, order: 187 },
  { nama: "Flora Kayu Manis", area: "Cipete", jarak: "4,0 km", rating: 4.7, order: 156 },
];

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

function BuilderCanvasStep({ design, setDesign, go }) {
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

/* ---------------- Builder checkout step ---------------- */

function BuilderCheckoutStep({ design, go, setOrder }) {
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

/* ---------------- Builder tracking step ---------------- */

const TRACK_STEPS = [
  { icon: Route, t: "Mencari floris", d: "Mencocokkan order dengan floris terdekat berdasar lokasi, stok & rating." },
  { icon: Store, t: "Floris menerima order", d: "Stok dikonfirmasi. Rangkaianmu masuk antrean rakit." },
  { icon: Camera, t: "Rakit + foto konfirmasi", d: "Floris mengirim foto hasil rakitan untuk kamu setujui." },
  { icon: Truck, t: "Sedang diantar", d: "Kurir menuju alamat penerima." },
  { icon: Check, t: "Selesai", d: "Bunga diterima. Dana escrow diteruskan ke floris." },
];

function BuilderTrackingStep({ design, order, go }) {
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

/* ---------------- Bouquet builder page (route: /builder) ---------------- */

export default function BouquetBuilder() {
  const location = useLocation();
  const [design, setDesign] = useState(() => ({
    items: [],
    mode: location.state?.mode || "bouquet",
    wrapId: "kraft",
    baseId: "rotan",
    sizeId: location.state?.sizeId || "M",
  }));
  const [order, setOrder] = useState(null);
  const [step, setStep] = useState("builder");

  const goStep = (s) => { setStep(s); window.scrollTo({ top: 0 }); };

  return (
    <>
      {step === "builder" && <BuilderCanvasStep design={design} setDesign={setDesign} go={goStep} />}
      {step === "checkout" && <BuilderCheckoutStep design={design} go={goStep} setOrder={setOrder} />}
      {step === "tracking" && order && <BuilderTrackingStep design={design} order={order} go={goStep} />}
    </>
  );
}
