import { FMAP } from "@kalamekar/shared/catalog";

interface CanvasItem {
  type: string;
  x?: number;
  y?: number;
  size?: number;
  rot?: number;
}

// Render read-only dari state kanvas builder: setiap item items[] punya
// { type, x, y, size, rot } dalam persen relatif terhadap kotak ini (sama
// seperti komponen Stage di apps/builder/src/pages/BouquetBuilder.jsx dan
// apps/storefront/components/OrderCanvasPreview.js).
export default function OrderCanvasPreview({ items = [], mode = "bouquet" }: { items?: CanvasItem[]; mode?: string }) {
  const list = Array.isArray(items) ? items : [];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: mode === "bouquet" ? "100 / 125" : "1 / 1",
        background: "linear-gradient(180deg, #fffdf8 0%, var(--dm-cream) 100%)",
        border: "1px solid var(--dm-line)",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      {list.map((it, idx) => {
        const f = FMAP[it.type];
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: (it.x ?? 50) + "%",
              top: (it.y ?? 50) + "%",
              width: (it.size ?? 16) + "%",
              aspectRatio: "1 / 1",
              transform: `translate(-50%, -50%) rotate(${it.rot ?? 0}deg)`,
              zIndex: idx + 1,
            }}
          >
            {f ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={f.img}
                alt={f.nama}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block", border: "2px solid #fff", boxShadow: "0 3px 4px rgba(59,42,48,.18)" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#fff", border: "2px dashed var(--dm-line)" }} />
            )}
          </div>
        );
      })}
      {list.length === 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dm-ink-soft)", fontSize: 13, textAlign: "center", padding: 16 }}>
          Tidak ada data rancangan untuk order ini.
        </div>
      )}
    </div>
  );
}
