"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/akun", label: "Riwayat" },
  { href: "/akun/profil", label: "Profil" },
  { href: "/akun/klaim", label: "Klaim Order" },
];

export default function AkunTabs() {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", gap: 6, borderBottom: "1.5px solid var(--rk-line)", flexWrap: "wrap" }}>
      {TABS.map((t) => {
        const active = t.href === "/akun" ? pathname === "/akun" : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={"rk-tab-link" + (active ? " rk-tab-link-active" : "")}>
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
