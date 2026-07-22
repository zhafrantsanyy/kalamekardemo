import { rupiah } from "@kalamekar/shared/catalog";
import type { Order } from "@/lib/types";

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ color: "var(--dm-ink-soft)" }}>{label}</span>
      <span style={{ fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}

// Baris kartu "Rancangan" untuk order papan_bunga — port dari
// apps/storefront/components/PapanBungaOrderSummary.js, dipakai floris
// untuk menilai kompleksitas sebelum menetapkan harga final.
export default function PapanBungaOrderSummary({ order }: { order: Order }) {
  const c = order.papan_bunga_config || {};
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {order.desain_preview_url && (
        <div style={{ maxWidth: 240, margin: "0 auto" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={order.desain_preview_url} alt="Preview papan bunga" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--dm-line)", display: "block" }} />
        </div>
      )}
      <div style={{ display: "grid", gap: 6, fontSize: 13.5 }}>
        <Row label="Kategori" value={c.kategoriLabel} />
        <Row label="Ukuran" value={c.ukuranLabel} />
        <Row label="Bentuk" value={c.bentukLabel} />
        <Row label="Ucapan" value={c.ucapan} />
        <Row label="Teks utama" value={c.namaUtamaUppercase ? c.namaUtama?.toUpperCase() : c.namaUtama} />
        <Row label="Teks pendukung" value={c.teksPendukung} />
        <Row label="Nama pengirim" value={c.namaPengirim} />
      </div>
      {c.catatanFloris && (
        <div style={{ background: "var(--dm-cream)", border: "1px solid var(--dm-line)", borderRadius: 12, padding: "10px 12px", fontSize: 12.5, lineHeight: 1.5 }}>
          <strong>Catatan untuk floris:</strong> {c.catatanFloris}
        </div>
      )}
    </div>
  );
}

// Satu komponen harga dipakai di semua tampilan floris supaya tidak ada
// tempat yang menampilkan angka pasti untuk order papan_bunga sebelum
// harga_final ditetapkan.
export function OrderPriceDisplay({ order }: { order: Order }) {
  if (order.product_type !== "papan_bunga") {
    return <>{rupiah(order.subtotal ?? order.total ?? 0)}</>;
  }
  if (order.harga_final != null) {
    return <>{rupiah(order.harga_final)}</>;
  }
  if (order.harga_estimasi_min != null && order.harga_estimasi_max != null) {
    return (
      <>
        {rupiah(order.harga_estimasi_min)} – {rupiah(order.harga_estimasi_max)}{" "}
        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--dm-ink-soft)" }}>(estimasi)</span>
      </>
    );
  }
  return <span style={{ color: "var(--dm-ink-soft)" }}>Menunggu estimasi</span>;
}
