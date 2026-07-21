import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DndContext, PointerSensor, useDraggable, useSensor, useSensors } from "@dnd-kit/core";
import {
  Trash2, RotateCw, Plus, Minus, Copy, ArrowUp, Wand2, Eraser,
  ShoppingBag, MapPin, Star, Truck, Camera, Check, ChevronLeft,
  MessageCircle, Store, Route, CreditCard, LayoutGrid, Heart, LayoutTemplate,
} from "lucide-react";
import { C, serif, rupiah, clamp, uid } from "../lib/theme";
import { ONGKIR } from "../lib/catalog";
import { FREEFORM_CATEGORIES, FREEFORM_SKU_MAP, getSkusByCategory } from "../data/freeformSkus";
import { supabase, ADMIN_WA } from "../lib/supabase";
import Thumb from "../components/Thumb";
import FreeformStage from "../components/freeform/FreeformStage";

const FLORISTS = [
  { nama: "Kirana Bloom Studio", area: "Kemang", jarak: "2,3 km", rating: 4.8, order: 214 },
  { nama: "Sekar Ayu Florist", area: "Tebet", jarak: "3,1 km", rating: 4.9, order: 187 },
  { nama: "Flora Kayu Manis", area: "Cipete", jarak: "4,0 km", rating: 4.7, order: 156 },
];

function newInstanceId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : uid();
}

/* ---------------- Palet SKU (draggable) ---------------- */

function PaletteItem({ sku, onQuickAdd }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${sku.id}`,
    data: { sku },
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, position: "relative", zIndex: 60 }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="rk-pal-item"
      style={{ ...style, opacity: isDragging ? 0.4 : 1 }}
      onClick={() => onQuickAdd(sku)}
      aria-label={`${sku.nama} — seret ke kanvas atau ketuk untuk taruh di tengah`}
    >
      <Thumb f={sku} size={44} />
      <div style={{ fontSize: 11.5, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{sku.nama}</div>
      <div style={{ fontSize: 11, color: C.tealDeep, fontWeight: 600 }}>{rupiah(sku.harga)}</div>
    </button>
  );
}

/* ---------------- Canvas step ---------------- */

function FreeformCanvasStep({ composition, setComposition, go }) {
  const { items } = composition;
  const [selectedId, setSelectedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState(FREEFORM_CATEGORIES[0].id);
  const canvasElRef = useRef(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const setItems = (fn) => setComposition((c) => ({ ...c, items: typeof fn === "function" ? fn(c.items) : fn }));

  const nextZIndex = useCallback((list) => list.reduce((max, it) => Math.max(max, it.zIndex), 0) + 1, []);

  const addItem = useCallback(
    (sku, x, y) => {
      setItems((prev) => {
        const it = {
          instanceId: newInstanceId(),
          skuId: sku.id,
          category: sku.category,
          x: clamp(x, 3, 97),
          y: clamp(y, 3, 97),
          rotation: 0,
          scale: 1,
          zIndex: nextZIndex(prev),
        };
        setSelectedId(it.instanceId);
        return [...prev, it];
      });
    },
    [nextZIndex]
  );

  const onQuickAdd = (sku) => addItem(sku, 50 + (Math.random() * 18 - 9), 45 + (Math.random() * 14 - 7));

  const onDragTo = useCallback((instanceId, x, y) => {
    setComposition((c) => ({ ...c, items: c.items.map((it) => (it.instanceId === instanceId ? { ...it, x, y } : it)) }));
  }, [setComposition]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || over.id !== "freeform-canvas") return;

    const sku = active.data.current?.sku;
    if (!sku) return;
    const canvasEl = canvasElRef.current;
    if (!canvasEl) return;
    const canvasRect = canvasEl.getBoundingClientRect();
    const dragRect = active.rect.current.translated;
    if (!dragRect) return;
    const cx = dragRect.left + dragRect.width / 2;
    const cy = dragRect.top + dragRect.height / 2;
    const x = ((cx - canvasRect.left) / canvasRect.width) * 100;
    const y = ((cy - canvasRect.top) / canvasRect.height) * 100;
    addItem(sku, x, y);
  };

  const mut = (fn) => setItems((prev) => prev.map((it) => (it.instanceId === selectedId ? fn(it) : it)));
  const removeSel = () => { setItems((prev) => prev.filter((it) => it.instanceId !== selectedId)); setSelectedId(null); };
  const dupSel = () => {
    const src = items.find((it) => it.instanceId === selectedId);
    if (!src) return;
    const it = { ...src, instanceId: newInstanceId(), x: clamp(src.x + 5, 3, 97), y: clamp(src.y + 5, 3, 97), zIndex: nextZIndex(items) };
    setItems((prev) => [...prev, it]);
    setSelectedId(it.instanceId);
  };
  const layerUp = () => mut((it) => ({ ...it, zIndex: nextZIndex(items) }));
  const autoArrange = () => {
    setItems((prev) => {
      const arr = [...prev];
      const cx = 50, cy = 46, rings = [[1, 0], [6, 10], [10, 18], [14, 26]];
      let idx = 0;
      for (const [count, rad] of rings) {
        for (let k = 0; k < count && idx < arr.length; k++, idx++) {
          const a = (Math.PI * 2 * k) / count - Math.PI / 2;
          arr[idx] = { ...arr[idx], x: clamp(cx + Math.cos(a) * rad, 3, 97), y: clamp(cy + Math.sin(a) * rad * 0.85, 3, 97), rotation: Math.round((a * 180) / Math.PI / 6) };
        }
      }
      for (; idx < arr.length; idx++) arr[idx] = { ...arr[idx], x: 30 + Math.random() * 40, y: 22 + Math.random() * 24 };
      return arr;
    });
  };

  const counts = useMemo(() => {
    const m = {};
    items.forEach((it) => (m[it.skuId] = (m[it.skuId] || 0) + 1));
    return Object.entries(m).map(([skuId, n]) => ({ sku: FREEFORM_SKU_MAP[skuId], n }));
  }, [items]);

  const total = counts.reduce((s, c) => s + (c.sku?.harga || 0) * c.n, 0);

  const sel = items.find((it) => it.instanceId === selectedId);
  const skus = getSkusByCategory(activeCategory);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 16px 60px" }}>
        <div style={{ marginBottom: 18 }}>
          <h2 className="rk-serif" style={{ fontSize: 28, color: C.maroon }}>Rangkai bebas</h2>
          <p style={{ color: C.inkSoft, fontSize: 13.5, marginTop: 2 }}>
            Seret item dari katalog ke kanvas, atur posisi, ukuran, rotasi, dan urutan lapisan sesuka kamu.
          </p>
        </div>

        <div className="rk-builder-grid">
          {/* Palette */}
          <div className="rk-palette-col rk-card" style={{ padding: 14 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {FREEFORM_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={"rk-chip" + (activeCategory === c.id ? " rk-chip-on" : "")}
                  style={{ padding: "7px 10px", fontSize: 12, fontWeight: 700, color: activeCategory === c.id ? C.maroon : C.inkSoft }}
                  onClick={() => setActiveCategory(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="rk-pal-scroll" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 470, overflowY: "auto" }}>
              {skus.map((sku) => (
                <PaletteItem key={sku.id} sku={sku} onQuickAdd={onQuickAdd} />
              ))}
            </div>
          </div>

          {/* Stage */}
          <div className="rk-stage-col">
            <FreeformStage
              ref={canvasElRef}
              items={items}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDragTo={onDragTo}
              droppableId="freeform-canvas"
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 6, minHeight: 34 }}>
                {sel ? (
                  <>
                    <button className="rk-tool" title="Perkecil" aria-label="Perkecil" onClick={() => mut((it) => ({ ...it, scale: clamp(it.scale - 0.15, 0.5, 2.25) }))}><Minus size={16} /></button>
                    <button className="rk-tool" title="Perbesar" aria-label="Perbesar" onClick={() => mut((it) => ({ ...it, scale: clamp(it.scale + 0.15, 0.5, 2.25) }))}><Plus size={16} /></button>
                    <button className="rk-tool" title="Putar" aria-label="Putar" onClick={() => mut((it) => ({ ...it, rotation: it.rotation + 15 }))}><RotateCw size={16} /></button>
                    <button className="rk-tool" title="Gandakan" aria-label="Gandakan" onClick={dupSel}><Copy size={16} /></button>
                    <button className="rk-tool" title="Bawa ke depan" aria-label="Bawa ke depan" onClick={layerUp}><ArrowUp size={16} /></button>
                    <button className="rk-tool rk-tool-danger" title="Hapus" aria-label="Hapus" onClick={removeSel}><Trash2 size={16} /></button>
                  </>
                ) : (
                  <span style={{ fontSize: 12.5, color: C.inkSoft, alignSelf: "center" }}>
                    {items.length > 0 ? "Ketuk sebuah item di kanvas untuk mengubah ukuran, memutar, atau menghapusnya." : ""}
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
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8, color: C.maroon }}>Rincian harga</div>
            <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: 8 }}>
              {counts.length === 0 && <div style={{ fontSize: 13, color: C.inkSoft }}>Belum ada item di kanvas.</div>}
              {counts.map(({ sku, n }) => sku && (
                <div key={sku.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "3.5px 0" }}>
                  <span>{sku.nama} × {n}</span>
                  <span style={{ fontWeight: 600 }}>{rupiah(sku.harga * n)}</span>
                </div>
              ))}
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
    </DndContext>
  );
}

/* ---------------- Checkout step ---------------- */

function FreeformCheckoutStep({ composition, go, setOrder }) {
  const { items } = composition;
  const subtotal = items.reduce((s, it) => s + (FREEFORM_SKU_MAP[it.skuId]?.harga || 0), 0);
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
        mode: null,
        product_type: "kustom",
        ukuran: null,
        // Wrapping bukan lagi atribut tunggal — jadi SKU kategori
        // "wrapping" biasa di dalam `items` (lihat freeformSkus.js),
        // jadi kolom `wrapping` tidak relevan untuk mode ini.
        wrapping: null,
        ring_dasar: null,
        items: items.map(({ instanceId, skuId, category, x, y, rotation, scale, zIndex }) => ({ instanceId, skuId, category, x, y, rotation, scale, zIndex })),
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
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

        <div className="rk-card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 800, color: C.maroon, marginBottom: 14 }}>Ringkasan pesanan</div>
          <div style={{ maxWidth: 210, margin: "0 auto 14px" }}>
            <FreeformStage items={items} readonly selectedId={null} onSelect={() => {}} onDragTo={() => {}} />
          </div>
          <div style={{ fontSize: 13.5 }}>
            {[
              [`Rangkai bebas custom · ${items.length} item`, rupiah(subtotal)],
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
            {supabase ? "Fase pilot: pembayaran & status dikonfirmasi tim kami via WhatsApp." : "Mode demo — pesanan tidak disimpan (env Supabase belum diisi)."}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Tracking step ---------------- */

const TRACK_STEPS = [
  { icon: Route, t: "Mencari floris", d: "Mencocokkan order dengan floris terdekat berdasar lokasi, stok & rating." },
  { icon: Store, t: "Floris menerima order", d: "Stok dikonfirmasi. Rangkaianmu masuk antrean rakit." },
  { icon: Camera, t: "Rakit + foto konfirmasi", d: "Floris mengirim foto hasil rakitan untuk kamu setujui." },
  { icon: Truck, t: "Sedang diantar", d: "Kurir menuju alamat penerima." },
  { icon: Check, t: "Selesai", d: "Bunga diterima. Dana escrow diteruskan ke floris." },
];

function FreeformTrackingStep({ composition, order, go }) {
  const { items } = composition;
  const florist = useMemo(() => FLORISTS[Math.floor(Math.random() * FLORISTS.length)], []);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= TRACK_STEPS.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 2400);
    return () => clearTimeout(t);
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
        <div className="rk-card" style={{ padding: 20 }}>
          {TRACK_STEPS.map((s, i) => {
            const done = i < step || (i === TRACK_STEPS.length - 1 && step === TRACK_STEPS.length - 1);
            const active = i === step && step < TRACK_STEPS.length - 1;
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

        <div>
          <div className="rk-card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 800, color: C.maroon, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <Camera size={17} /> Preview rancanganmu
            </div>
            <div style={{
              maxWidth: 250, margin: "0 auto", padding: 10, background: "#fff",
              border: `1px solid ${C.line}`, borderRadius: 6, boxShadow: "0 8px 20px rgba(59,42,48,.12)",
              transform: "rotate(-1.2deg)",
            }}>
              <FreeformStage items={items} readonly selectedId={null} onSelect={() => {}} onDragTo={() => {}} />
              <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 12, color: C.inkSoft, textAlign: "center", paddingTop: 8 }}>
                menunggu floris merakit…
              </div>
            </div>
          </div>
          <button className="rk-btn rk-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14.5 }} onClick={() => go("builder")}>
            <LayoutGrid size={16} /> Rangkai lagi
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function FreeformBuilder({ onSwitchProduk }) {
  const [composition, setComposition] = useState({ items: [] });
  const [order, setOrder] = useState(null);
  const [step, setStep] = useState("builder");

  const goStep = (s) => { setStep(s); window.scrollTo({ top: 0 }); };

  return (
    <>
      {step === "builder" && (
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 16px 0", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          {onSwitchProduk && (
            <>
              <button className="rk-chip" style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 14, color: C.inkSoft }} onClick={() => onSwitchProduk("bouquet_krans")}>
                <Heart size={16} /> Buket & Krans
              </button>
              <button className="rk-chip" style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 14, color: C.inkSoft }} onClick={() => onSwitchProduk("papan_bunga")}>
                <LayoutTemplate size={16} /> Papan Bunga
              </button>
            </>
          )}
        </div>
      )}
      {step === "builder" && <FreeformCanvasStep composition={composition} setComposition={setComposition} go={goStep} />}
      {step === "checkout" && <FreeformCheckoutStep composition={composition} go={goStep} setOrder={setOrder} />}
      {step === "tracking" && order && <FreeformTrackingStep composition={composition} order={order} go={goStep} />}
    </>
  );
}
