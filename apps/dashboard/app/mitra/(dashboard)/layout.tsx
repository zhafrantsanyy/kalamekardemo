import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";

export const metadata = {
  title: { absolute: "Dashboard Mitra — Kalamekar" },
  robots: { index: false, follow: false },
};

export default async function MitraLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = user
    ? await supabase.from("florists").select("id, nama, area").eq("user_id", user.id).maybeSingle()
    : { data: null };

  const { count: newOrdersCount } = floris
    ? await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("floris_id", floris.id)
        .eq("status", "matching")
    : { count: 0 };

  const storeName = floris?.nama || user?.email || "Mitra";
  const storeArea = floris?.area || "";

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <Sidebar storeName={storeName} storeArea={storeArea} newOrdersCount={newOrdersCount || 0} />
      <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 32px 60px" }}>
          <Topbar storeName={storeName} notificationCount={newOrdersCount || 0} />
          {children}
        </div>
      </div>
    </div>
  );
}
