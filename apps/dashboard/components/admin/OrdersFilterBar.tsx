"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { ALL_STATUSES, STATUS_LABEL } from "@/lib/orderFlow";
import Input from "@/components/ui/Input";

// Pola sama dengan components/mitra/RiwayatFilterBar.tsx — query-param
// filter, TANPA Suspense (halaman ini sudah dinamis lewat cookies()).
export default function OrdersFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const status = searchParams.get("status") || "";

  function applyParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyParams({ q: q.trim() });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      <select
        className="dm-input"
        style={{ width: "auto" }}
        value={status}
        onChange={(e) => applyParams({ status: e.target.value })}
      >
        <option value="">Semua status</option>
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <div style={{ display: "flex", gap: 6, flex: 1, minWidth: 200 }}>
        <div style={{ flex: 1 }}>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama pembeli atau kode…" />
        </div>
        <button type="submit" className="dm-btn dm-btn-ghost" style={{ padding: "10px 16px", fontSize: 13.5 }}>
          <Search size={15} /> Cari
        </button>
      </div>
    </form>
  );
}
