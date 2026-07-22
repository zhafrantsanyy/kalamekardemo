"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Boxes,
  History,
  Sprout,
  BarChart3,
  UserCircle,
  HelpCircle,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

const NAV = [
  { href: "/mitra", label: "Ringkasan", icon: LayoutDashboard, exact: true },
  { href: "/mitra/order-masuk", label: "Order Masuk", icon: Truck, badge: true },
  { href: "/mitra/proses", label: "Sedang Diproses", icon: Boxes },
  { href: "/mitra/riwayat", label: "Riwayat", icon: History },
  { href: "/mitra/katalog", label: "Katalog & Stok", icon: Sprout },
  { href: "/mitra/analitik", label: "Analitik", icon: BarChart3 },
];

const NAV_FOOTER = [
  { href: "/mitra/profil", label: "Profil Toko", icon: UserCircle },
  { href: "/mitra/bantuan", label: "Bantuan", icon: HelpCircle },
];

interface SidebarProps {
  storeName: string;
  storeArea: string;
  newOrdersCount: number;
}

export default function Sidebar({ storeName, storeArea, newOrdersCount }: SidebarProps) {
  const pathname = usePathname();
  const initials = storeName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div
      style={{
        width: 236,
        flex: "none",
        background: "var(--dm-forest)",
        color: "var(--dm-cream)",
        display: "flex",
        flexDirection: "column",
        padding: "22px 16px",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 8px 22px" }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: "var(--dm-magenta)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flex: "none",
          }}
        >
          🌸
        </div>
        <div>
          <div className="dm-serif" style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.1 }}>
            Kalamekar
          </div>
          <div style={{ fontSize: 10.5, color: "var(--dm-sidebar-fg-soft)", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2 }}>
            Dashboard Mitra
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 6 }}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="dm-nav-link"
            data-active={isActive(item.href, item.exact)}
          >
            <item.icon size={17} />
            {item.label}
            {item.badge && newOrdersCount > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  background: "var(--dm-gold)",
                  color: "var(--dm-forest)",
                  fontSize: 10.5,
                  fontWeight: 800,
                  padding: "1px 7px",
                  borderRadius: 999,
                }}
              >
                {newOrdersCount}
              </span>
            )}
          </Link>
        ))}
        <div style={{ height: 1, background: "rgba(255,255,255,.12)", margin: "10px 6px" }} />
        {NAV_FOOTER.map((item) => (
          <Link key={item.href} href={item.href} className="dm-nav-link" data-active={isActive(item.href)}>
            <item.icon size={17} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: "auto", paddingTop: 14 }}>
        <div
          style={{
            background: "rgba(255,255,255,.06)",
            borderRadius: 14,
            padding: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            className="dm-serif"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "var(--dm-badge-avatar)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "var(--dm-forest)",
              flex: "none",
            }}
          >
            {initials || "?"}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {storeName}
            </div>
            <div style={{ fontSize: 10.5, color: "var(--dm-sidebar-fg-soft)" }}>{storeArea || "—"}</div>
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
