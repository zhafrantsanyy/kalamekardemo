import { createClient } from "@/lib/supabase/server";
import ToggleAktifButton from "@/components/admin/ToggleAktifButton";
import TambahFlorisForm from "@/components/admin/TambahFlorisForm";

export default async function AdminFlorisPage() {
  const supabase = await createClient();
  const { data: florists } = await supabase
    .from("florists")
    .select("id, nama, area, wa, rating, aktif")
    .order("created_at", { ascending: false });

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <TambahFlorisForm />

      {!florists || florists.length === 0 ? (
        <div className="rk-card" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ color: "var(--rk-ink-soft)", fontSize: 14 }}>Belum ada floris terdaftar.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {florists.map((f, i) => (
            <div
              key={f.id}
              className="rk-card rk-dash-card"
              style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, animationDelay: `${Math.min(i, 10) * 30}ms` }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 14.5, color: "var(--rk-maroon-deep)" }}>{f.nama}</div>
                <div style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", marginTop: 2 }}>
                  {f.area || "-"} · {f.wa || "-"} · ⭐ {f.rating}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
                    background: f.aktif ? "#e9f5e6" : "#fbe9e9", color: f.aktif ? "#2f7d3b" : "#a13d3d",
                  }}
                >
                  {f.aktif ? "Aktif" : "Nonaktif"}
                </span>
                <ToggleAktifButton florisId={f.id} aktif={f.aktif} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
