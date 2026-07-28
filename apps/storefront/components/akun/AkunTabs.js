"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AKUN_NAV_ITEMS } from "@/components/akun/DashboardSidebar";

export default function AkunTabs() {
  const pathname = usePathname();

  return (
    <div className="rk-tab-scroll">
      {AKUN_NAV_ITEMS.map((item) => {
        const active = item.href === "/akun" ? pathname === "/akun" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={"rk-tab-link" + (active ? " rk-tab-link-active" : "")}
            aria-current={active ? "page" : undefined}
          >
            <item.icon size={15} /> {item.label}
          </Link>
        );
      })}
    </div>
  );
}
