import type { Order } from "@/lib/types";

export const DEFAULT_COMMISSION_RATE = 20;

// Basis nilai order untuk payout — sama persis dengan logic numerik
// OrderPriceDisplay (components/PapanBungaOrderSummary.tsx): subtotal
// untuk krans/buket, harga_final untuk papan_bunga. Return null kalau
// papan_bunga belum ada harga_final (belum bisa dihitung payout-nya).
export function orderValue(order: Pick<Order, "product_type" | "subtotal" | "total" | "harga_final">): number | null {
  if (order.product_type !== "papan_bunga") {
    return order.subtotal ?? order.total ?? 0;
  }
  return order.harga_final ?? null;
}

export function computeCommission(value: number, rate: number): { commission: number; payout: number } {
  const commission = Math.round((value * rate) / 100);
  return { commission, payout: value - commission };
}
