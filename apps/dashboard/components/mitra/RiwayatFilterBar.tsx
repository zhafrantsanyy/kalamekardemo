"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import Input from "@/components/ui/Input";

// Pola query-param yang sama dengan AkunOrderFilterBar di storefront —
// TANPA Suspense (lihat catatan bug Fase 2: Suspense+useSearchParams bisa
// macet di Next 16 + Turbopack). Halaman ini sudah dinamis (butuh
// cookies() lewat createClient()), jadi tidak perlu boundary tambahan.
export default function RiwayatFilterBar() {
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
        <option value="selesai">Selesai</option>
        <option value="batal">Dibatalkan</option>
      </select>
      <div style={{ display: "flex", gap: 6, flex: 1, minWidth: 200 }}>
        <div style={{ flex: 1 }}>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kode pesanan…" />
        </div>
        <button type="submit" className="dm-btn dm-btn-ghost" style={{ padding: "10px 16px", fontSize: 13.5 }}>
          <Search size={15} /> Cari
        </button>
      </div>
    </form>
  );
}
