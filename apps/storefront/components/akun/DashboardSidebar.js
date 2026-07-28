"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PackageSearch, User, Settings, Link2 } from "lucide-react";

export const AKUN_NAV_ITEMS = [
  { href: "/akun", label: "Riwayat Pesanan", icon: PackageSearch },
  { href: "/akun/profil", label: "Profil", icon: User },
  { href: "/akun/pengaturan", label: "Pengaturan Akun", icon: Settings },
  { href: "/akun/klaim", label: "Klaim Order", icon: Link2 },
];

function isActiveHref(pathname, href) {
  return href === "/akun" ? pathname === "/akun" : pathname.startsWith(href);
}

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className="rk-dash-sidebar" aria-label="Navigasi akun">
      {AKUN_NAV_ITEMS.map((item) => {
        const active = isActiveHref(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={"rk-dash-sidebar-link" + (active ? " rk-dash-sidebar-link-active" : "")}
            aria-current={active ? "page" : undefined}
          >
            <item.icon size={17} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
