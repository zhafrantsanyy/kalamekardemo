"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Pola sama dengan OrdersFilterBar.tsx — query-param filter, TANPA
// Suspense (halaman ini sudah dinamis lewat cookies()).
export default function PayoutFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const payoutStatus = searchParams.get("payout_status") || "belum_dibayar";

  function applyParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      className="dm-input"
      style={{ width: "auto" }}
      value={payoutStatus}
      onChange={(e) => applyParams({ payout_status: e.target.value })}
    >
      <option value="belum_dibayar">Belum dibayar</option>
      <option value="dibayar">Sudah dibayar</option>
      <option value="">Semua</option>
    </select>
  );
}
