import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import type { Florist } from "@/lib/types";

export default async function AdminFloristsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("florists").select("*").order("created_at", { ascending: false });
  const florists = (data || []) as Florist[];

  if (florists.length === 0) {
    return <EmptyState message="Belum ada floris terdaftar." />;
  }

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--dm-cream)", textAlign: "left" }}>
              {["Nama toko", "Kota", "Verifikasi", "Aktif", ""].map((h) => (
                <th key={h} style={{ padding: "10px 14px", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--dm-ink-soft)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {florists.map((f) => (
              <tr key={f.id} style={{ borderTop: "1px solid var(--dm-line)" }}>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--dm-forest)" }}>{f.nama}</td>
                <td style={{ padding: "10px 14px" }}>{f.area || "-"}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span
                    className="dm-badge"
                    style={{
                      background: f.verified ? "var(--dm-status-selesai-bg)" : "var(--dm-status-matching-bg)",
                      color: f.verified ? "var(--dm-status-selesai-fg)" : "var(--dm-status-matching-fg)",
                    }}
                  >
                    {f.verified ? "Terverifikasi" : "Menunggu verifikasi"}
                  </span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span
                    className="dm-badge"
                    style={{
                      background: f.aktif ? "var(--dm-status-diantar-bg)" : "var(--dm-status-batal-bg)",
                      color: f.aktif ? "var(--dm-status-diantar-fg)" : "var(--dm-status-batal-fg)",
                    }}
                  >
                    {f.aktif ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td style={{ padding: "10px 14px", textAlign: "right" }}>
                  <Link href={`/admin/florists/${f.id}`} className="dm-btn dm-btn-ghost" style={{ padding: "6px 14px", fontSize: 12.5, textDecoration: "none" }}>
                    Kelola
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
