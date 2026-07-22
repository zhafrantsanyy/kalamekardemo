"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, Sprout, Wallet, History } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

const NAV = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Order", icon: Truck },
  { href: "/admin/florists", label: "Floris", icon: Sprout },
  { href: "/admin/payout", label: "Payout", icon: Wallet },
  { href: "/admin/audit-log", label: "Audit Log", icon: History },
];

interface AdminSidebarProps {
  adminLabel: string;
}

export default function AdminSidebar({ adminLabel }: AdminSidebarProps) {
  const pathname = usePathname();

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
            Dashboard Admin
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
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: "auto", paddingTop: 14 }}>
        <div
          style={{
            background: "rgba(255,255,255,.06)",
            borderRadius: 14,
            padding: 12,
            fontSize: 12.5,
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {adminLabel}
        </div>
        <LogoutButton redirectTo="/admin/login" />
      </div>
    </div>
  );
}
