"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/mitra/masuk");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        width: "100%",
        marginTop: 8,
        background: "transparent",
        border: "1px solid rgba(255,255,255,.18)",
        color: "#e6ede6",
        fontSize: 12.5,
        fontWeight: 600,
        padding: 8,
        borderRadius: 10,
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <LogOut size={14} /> Keluar
    </button>
  );
}
