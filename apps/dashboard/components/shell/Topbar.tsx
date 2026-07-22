"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { WA_SUPPORT_NUMBER } from "@/lib/site-config";

const TITLE_BY_PREFIX: [string, string][] = [
  ["/mitra/order-masuk", "Order Masuk"],
  ["/mitra/proses", "Sedang Diproses"],
  ["/mitra/riwayat", "Riwayat Pesanan"],
  ["/mitra/katalog", "Katalog & Stok"],
  ["/mitra/analitik", "Analitik & Reputasi"],
  ["/mitra/profil", "Profil Toko"],
  ["/mitra/bantuan", "Pusat Bantuan"],
];

function titleFor(pathname: string, storeName: string) {
  const match = TITLE_BY_PREFIX.find(([prefix]) => pathname.startsWith(prefix));
  if (match) return match[1];
  return `Halo, ${storeName}`;
}

interface TopbarProps {
  storeName: string;
  notificationCount?: number;
}

export default function Topbar({ storeName, notificationCount = 0 }: TopbarProps) {
  const pathname = usePathname();
  const title = titleFor(pathname, storeName);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 22 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--dm-magenta)", display: "flex", alignItems: "center", gap: 6 }}>
          🌸 Dashboard Mitra
        </div>
        <h1 className="dm-serif" style={{ fontSize: 26, margin: "8px 0 0", color: "var(--dm-forest)" }}>
          {title}
        </h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          aria-label="Notifikasi"
          style={{ background: "#fff", border: "1.5px solid var(--dm-line)", borderRadius: 12, padding: 9, cursor: "pointer", position: "relative", display: "flex" }}
        >
          <Bell size={17} color="var(--dm-ink-soft)" />
          {notificationCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "var(--dm-magenta)",
                color: "#fff",
                fontSize: 9.5,
                fontWeight: 800,
                padding: "1px 5px",
                borderRadius: 999,
              }}
            >
              {notificationCount}
            </span>
          )}
        </button>
        <a
          href={`https://wa.me/${WA_SUPPORT_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="dm-btn dm-btn-dark"
          style={{ padding: "10px 18px", fontSize: 13 }}
        >
          WhatsApp Support
        </a>
      </div>
    </div>
  );
}
