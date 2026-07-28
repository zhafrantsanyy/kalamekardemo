"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Settings, PackageSearch, LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

const INITIAL_STYLES = [
  { background: "var(--rk-rose-soft)", color: "var(--rk-maroon)" },
  { background: "var(--rk-gold-soft)", color: "var(--rk-maroon-deep)" },
  { background: "var(--rk-cream)", color: "var(--rk-teal-deep)" },
];

function initialStyleFor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return INITIAL_STYLES[hash % INITIAL_STYLES.length];
}

function Avatar({ nama, avatarUrl, userId, size = 32 }) {
  const initial = (nama || "?").trim().charAt(0).toUpperCase() || "?";
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flex: "none" }}
      />
    );
  }
  const style = initialStyleFor(userId || nama || "kalamekar");
  return (
    <span
      aria-hidden="true"
      style={{
        width: size, height: size, borderRadius: "50%", flex: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: size * 0.42,
        ...style,
      }}
    >
      {initial}
    </span>
  );
}

const MENU_ITEMS = [
  { href: "/akun", label: "Dashboard Akun", icon: LayoutDashboard },
  { href: "/akun/pengaturan", label: "Pengaturan Akun", icon: Settings },
  { href: "/akun", label: "Riwayat Pesanan", icon: PackageSearch },
];

export default function UserMenuDropdown({ nama, avatarUrl, userId, dashboardHref, onNavigate }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const router = useRouter();
  const firstName = (nama || "").trim().split(/\s+/)[0] || "";

  useEffect(() => {
    function onClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  async function handleLogout() {
    setOpen(false);
    onNavigate?.();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const items = dashboardHref === "/akun" ? MENU_ITEMS : [{ href: dashboardHref, label: "Dashboard", icon: LayoutDashboard }];

  return (
    <div ref={rootRef} className="rk-nav-dropdown">
      <button
        type="button"
        className="rk-user-menu-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Menu akun"
      >
        <Avatar nama={nama} avatarUrl={avatarUrl} userId={userId} />
        {firstName && <span>{firstName}</span>}
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform .15s" }} />
      </button>
      {open && (
        <div className="rk-nav-dropdown-panel rk-user-menu-panel" role="menu">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              role="menuitem"
              className="rk-navlink rk-navlink-onlight"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              <item.icon size={15} /> {item.label}
            </Link>
          ))}
          <div className="rk-nav-mobile-divider" />
          <button type="button" role="menuitem" className="rk-navlink rk-navlink-onlight rk-user-menu-logout" onClick={handleLogout}>
            <LogOut size={15} /> Keluar
          </button>
        </div>
      )}
    </div>
  );
}
