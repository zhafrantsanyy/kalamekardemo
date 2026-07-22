// Urutan status yang bisa dijalani sebuah order setelah di-assign ke floris.
// "batal" sengaja di luar rantai ini — order batal tidak boleh diproses lagi.
// Sama persis dengan apps/storefront/lib/orderFlow.js — satu sumber definisi
// per workspace karena keduanya baca/tulis tabel `orders` yang sama.
export const STATUS_FLOW = ["matching", "dikonfirmasi", "dirakit", "diantar", "selesai"] as const;

export const ALL_STATUSES = ["baru", "matching", "dikonfirmasi", "dirakit", "diantar", "selesai", "batal"] as const;

export type OrderStatus = (typeof ALL_STATUSES)[number];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  baru: "Baru",
  matching: "Menunggu Konfirmasi",
  dikonfirmasi: "Dikonfirmasi",
  dirakit: "Sedang Dirakit",
  diantar: "Diantar",
  selesai: "Selesai",
  batal: "Dibatalkan",
};

export const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  matching: "Terima order",
  dikonfirmasi: "Mulai rakit",
  dirakit: "Sudah dirakit, siap antar",
  diantar: "Tandai sudah diterima",
};

export function nextStatus(current: string): OrderStatus | null {
  const idx = (STATUS_FLOW as readonly string[]).indexOf(current);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}
