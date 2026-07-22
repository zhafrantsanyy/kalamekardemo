"use client";

import { usePathname } from "next/navigation";

const TITLE_BY_PREFIX: [string, string][] = [
  ["/admin/orders", "Kelola Order"],
  ["/admin/florists", "Kelola Floris"],
  ["/admin/payout", "Payout Floris"],
  ["/admin/audit-log", "Audit Log Admin"],
];

function titleFor(pathname: string) {
  const match = TITLE_BY_PREFIX.find(([prefix]) => pathname.startsWith(prefix));
  return match ? match[1] : "Ringkasan";
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = titleFor(pathname);

  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--dm-magenta)" }}>
        🌸 Dashboard Admin
      </div>
      <h1 className="dm-serif" style={{ fontSize: 26, margin: "8px 0 0", color: "var(--dm-forest)" }}>
        {title}
      </h1>
    </div>
  );
}
