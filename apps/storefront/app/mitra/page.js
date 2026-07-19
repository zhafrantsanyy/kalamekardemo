import { Flower2, MapPin, PackageSearch } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { rupiah } from "@/lib/catalog";
import { areaKasar } from "@/lib/maskAlamat";
import { TerimaTolakButtons } from "@/components/mitra/OrderActionButtons";

export default async function MitraOrderMasukPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = await supabase
    .from("florists")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: orders } = floris
    ? await supabase
        .from("orders")
        .select("id, kode, alamat, tanggal, mode, ukuran, subtotal, created_at")
        .eq("floris_id", floris.id)
        .eq("status", "matching")
        .order("created_at", { ascending: true })
    : { data: [] };

  if (!orders || orders.length === 0) {
    return (
      <div className="rk-card" style={{ padding: 32, textAlign: "center" }}>
        <PackageSearch size={26} style={{ color: "var(--rk-ink-soft)" }} />
        <p style={{ color: "var(--rk-ink-soft)", fontSize: 14, marginTop: 10 }}>
          Belum ada order masuk yang menunggu konfirmasimu.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {orders.map((o, i) => (
        <div key={o.id} className="rk-card rk-dash-card" style={{ padding: 20, display: "grid", gap: 12, animationDelay: `${Math.min(i, 10) * 30}ms` }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "var(--rk-maroon-deep)" }}>{o.kode}</div>
              <div style={{ fontSize: 13, color: "var(--rk-ink-soft)", marginTop: 2 }}>
                Kirim {new Date(o.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "var(--rk-maroon)" }}>{rupiah(o.subtotal)}</div>
              <div style={{ fontSize: 11.5, color: "var(--rk-ink-soft)" }}>Nilai untuk floris</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "var(--rk-ink-soft)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Flower2 size={14} /> {o.mode === "bouquet" ? "Buket" : "Krans"} · {o.ukuran}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <MapPin size={14} /> {areaKasar(o.alamat)}
            </span>
          </div>
          <TerimaTolakButtons orderId={o.id} />
        </div>
      ))}
    </div>
  );
}
