"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/masuk");
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className="rk-btn rk-btn-ghost" style={{ padding: "10px 18px", fontSize: 13.5 }}>
      <LogOut size={15} /> Keluar
    </button>
  );
}
