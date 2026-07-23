import { useCallback, useMemo, useRef, useState } from "react";
import { DndContext, PointerSensor, useDraggable, useSensor, useSensors } from "@dnd-kit/core";
import {
  Trash2, RotateCw, Plus, Minus, Copy, ArrowUp, Wand2, Eraser,
  ShoppingBag, Heart, LayoutTemplate,
} from "lucide-react";
import { C, rupiah, clamp, uid } from "../lib/theme";
import { FREEFORM_CATEGORIES, FREEFORM_SKU_MAP, getSkusByCategory } from "../data/freeformSkus";
import { supabase } from "../lib/supabase";
import { SITE_URL } from "../lib/urls";
import Thumb from "../components/Thumb";
import FreeformStage from "../components/freeform/FreeformStage";

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

function FreeformCanvasStep({ composition, setComposition }) {
  const { items } = composition;
  const [selectedId, setSelectedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState(FREEFORM_CATEGORIES[0].id);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
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
        product_type: "kustom",
        items: items.map(({ instanceId, skuId, category, x, y, rotation, scale, zIndex }) => ({ instanceId, skuId, category, x, y, rotation, scale, zIndex })),
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
            {err && <div style={{ color: "#a13d3d", fontSize: 12.5, fontWeight: 600, marginBottom: 10 }}>{err}</div>}
            <button className="rk-btn rk-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 15.5 }}
              disabled={items.length === 0 || sending}
              onClick={submitToCheckout}>
              <ShoppingBag size={17} /> {sending ? "Menyimpan…" : "Lanjut ke checkout"}
            </button>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

/* ---------------- Page ---------------- */

export default function FreeformBuilder({ onSwitchProduk }) {
  const [composition, setComposition] = useState({ items: [] });

  return (
    <>
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
      <FreeformCanvasStep composition={composition} setComposition={setComposition} />
    </>
  );
}
