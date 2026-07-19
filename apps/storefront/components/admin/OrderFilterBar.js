"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { ALL_STATUSES, STATUS_LABEL } from "@/lib/orderFlow";

const fieldStyle = {
  padding: "10px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--rk-ink)",
};

export default function OrderFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const status = searchParams.get("status") || "";

  function applyParams(next) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleStatusChange(e) {
    applyParams({ status: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    applyParams({ q: q.trim() });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      <select className="rk-field" style={fieldStyle} value={status} onChange={handleStatusChange}>
        <option value="">Semua status</option>
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
        ))}
      </select>
      <div style={{ display: "flex", gap: 6, flex: 1, minWidth: 220 }}>
        <input
          className="rk-field"
          style={{ ...fieldStyle, flex: 1 }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari kode atau nama…"
        />
        <button type="submit" className="rk-btn rk-btn-ghost" style={{ padding: "10px 16px", fontSize: 13.5 }}>
          <Search size={15} /> Cari
        </button>
      </div>
    </form>
  );
}
