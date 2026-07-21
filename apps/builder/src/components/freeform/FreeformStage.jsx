import { forwardRef, useEffect, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Flower2 } from "lucide-react";
import { C, clamp } from "../../lib/theme";
import { FREEFORM_SKU_MAP } from "../../data/freeformSkus";

/**
 * Kanvas free-form: kosong tanpa ilustrasi bentuk (bukan potongan buket
 * tertentu) supaya bisa jadi kanvas bebas untuk aksen custom apa pun.
 * Reposisi via pointer drag (pola sama dengan Stage di BouquetBuilder),
 * plus droppable target dnd-kit untuk drop dari palet.
 * `items` = composition.items (instanceId/skuId/x/y/rotation/scale/zIndex).
 */
const FreeformStage = forwardRef(function FreeformStage(
  { items, selectedId, onSelect, onDragTo, readonly, height, droppableId = "freeform-canvas" },
  forwardedRef
) {
  const innerRef = useRef(null);
  const dragRef = useRef(null);
  const { setNodeRef, isOver } = useDroppable({ id: droppableId, disabled: readonly });

  const setRefs = (node) => {
    innerRef.current = node;
    setNodeRef(node);
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const toPct = (e) => {
    const rect = innerRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const onDown = (e, it) => {
    if (readonly) return;
    e.stopPropagation();
    const p = toPct(e);
    dragRef.current = { id: it.instanceId, dx: p.x - it.x, dy: p.y - it.y };
    onSelect(it.instanceId);
  };

  useEffect(() => {
    if (readonly) return;
    const move = (e) => {
      const d = dragRef.current;
      if (!d || !innerRef.current) return;
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

  const sorted = [...items].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={setRefs}
      onPointerDown={() => !readonly && onSelect(null)}
      style={{
        position: "relative",
        width: "100%",
        height: height || undefined,
        aspectRatio: height ? undefined : "100 / 115",
        background: `linear-gradient(180deg, #fffdf8 0%, ${C.card} 100%)`,
        border: `${!readonly && isOver ? "2px dashed " + C.rose : "1px solid " + C.line}`,
        borderRadius: 18,
        overflow: "hidden",
        touchAction: "none",
        userSelect: "none",
        transition: "border-color .12s",
      }}
    >
      {sorted.map((it) => {
        const sku = FREEFORM_SKU_MAP[it.skuId];
        if (!sku) return null;
        const sel = it.instanceId === selectedId && !readonly;
        return (
          <div
            key={it.instanceId}
            onPointerDown={(e) => onDown(e, it)}
            role={readonly ? undefined : "button"}
            aria-label={readonly ? undefined : sku.nama}
            style={{
              position: "absolute",
              left: it.x + "%",
              top: it.y + "%",
              width: 16 * it.scale + "%",
              aspectRatio: "1 / 1",
              transform: `translate(-50%, -50%) rotate(${it.rotation}deg)`,
              zIndex: it.zIndex,
              cursor: readonly ? "default" : "grab",
              filter: sel ? "drop-shadow(0 0 5px rgba(201,162,75,.95))" : "drop-shadow(0 3px 4px rgba(59,42,48,.18))",
            }}
          >
            <img
              src={sku.img}
              alt={sku.nama}
              draggable={false}
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block", border: "2px solid #fff" }}
            />
          </div>
        );
      })}
      {!readonly && items.length === 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ textAlign: "center", color: C.inkSoft, background: "rgba(253,250,243,.85)", padding: "14px 20px", borderRadius: 14, border: `1px dashed ${C.rose}` }}>
            <Flower2 size={26} style={{ color: C.rose }} />
            <div style={{ fontSize: 13.5, marginTop: 6, maxWidth: 220 }}>
              Seret item dari panel katalog ke kanvas, atau ketuk untuk menambah di tengah.
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default FreeformStage;
