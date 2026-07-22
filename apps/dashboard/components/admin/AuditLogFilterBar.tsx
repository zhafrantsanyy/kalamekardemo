"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function AuditLogFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const entityType = searchParams.get("entity_type") || "";

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
      value={entityType}
      onChange={(e) => applyParams({ entity_type: e.target.value })}
    >
      <option value="">Semua entity</option>
      <option value="order">Order</option>
      <option value="florist">Floris</option>
    </select>
  );
}
