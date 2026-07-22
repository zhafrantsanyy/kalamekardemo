export type OrderStatus =
  | "baru"
  | "matching"
  | "dikonfirmasi"
  | "dirakit"
  | "diantar"
  | "selesai"
  | "batal";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  baru: "Baru",
  matching: "Menunggu Konfirmasi",
  dikonfirmasi: "Dikonfirmasi",
  dirakit: "Sedang Dirakit",
  diantar: "Diantar",
  selesai: "Selesai",
  batal: "Dibatalkan",
};

// Nilai warna sama persis dengan --dm-status-*-{bg,fg} di globals.css dan
// STATUS_COLORS di packages/shared/tokens.js — satu palet, tiga tempat
// baca (CSS var di sini karena badge dirender lewat class, bukan style
// inline, biar gampang di-theme nanti).
export default function Badge({ status }: { status: OrderStatus }) {
  return (
    <span
      className="dm-badge"
      style={{
        background: `var(--dm-status-${status === "baru" ? "matching" : status}-bg)`,
        color: `var(--dm-status-${status === "baru" ? "matching" : status}-fg)`,
      }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
