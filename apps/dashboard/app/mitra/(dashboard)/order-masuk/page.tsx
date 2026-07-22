import { Flower2, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { rupiah } from "@kalamekar/shared/catalog";
import { areaKasar } from "@/lib/maskAlamat";
import EmptyState from "@/components/ui/EmptyState";
import Card from "@/components/ui/Card";
import { TerimaTolakButtons } from "@/components/mitra/OrderActionButtons";

export default async function MitraOrderMasukPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = user
    ? await supabase.from("florists").select("id").eq("user_id", user.id).maybeSingle()
    : { data: null };

  const { data: orders } = floris
    ? await supabase
        .from("orders")
        .select("id, kode, alamat, tanggal, mode, ukuran, subtotal, created_at")
        .eq("floris_id", floris.id)
        .eq("status", "matching")
        .order("created_at", { ascending: true })
    : { data: [] };

  if (!orders || orders.length === 0) {
    return <EmptyState message="Belum ada order masuk yang menunggu konfirmasimu." />;
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {orders.map((o, i) => (
        <Card key={o.id} animate delayMs={i * 30} style={{ padding: 20, display: "grid", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "var(--dm-forest)" }}>{o.kode}</div>
              <div style={{ fontSize: 13, color: "var(--dm-ink-soft)", marginTop: 2 }}>
                Kirim {new Date(o.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "var(--dm-magenta)" }}>{rupiah(o.subtotal ?? 0)}</div>
              <div style={{ fontSize: 11.5, color: "var(--dm-ink-soft)" }}>Nilai untuk floris</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "var(--dm-ink-soft)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Flower2 size={14} /> {o.mode === "bouquet" ? "Buket" : "Krans"} · {o.ukuran}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <MapPin size={14} /> {areaKasar(o.alamat)}
            </span>
          </div>
          <TerimaTolakButtons orderId={o.id} />
        </Card>
      ))}
    </div>
  );
}
