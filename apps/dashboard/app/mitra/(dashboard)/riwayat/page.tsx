import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { rupiah } from "@kalamekar/shared/catalog";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import RiwayatFilterBar from "@/components/mitra/RiwayatFilterBar";
import type { OrderStatus } from "@/lib/orderFlow";

interface SearchParams {
  status?: string;
  q?: string;
}

export default async function MitraRiwayatPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const status = sp?.status || "";
  const q = (sp?.q || "").trim().toLowerCase();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: floris } = user
    ? await supabase.from("florists").select("id").eq("user_id", user.id).maybeSingle()
    : { data: null };

  let query = floris
    ? supabase
        .from("orders")
        .select("id, kode, tanggal, subtotal, status")
        .eq("floris_id", floris.id)
        .in("status", ["selesai", "batal"])
        .order("tanggal", { ascending: false })
    : null;

  if (query && status) query = query.eq("status", status);

  const { data: orders } = query ? await query : { data: [] };
  let list = orders || [];
  if (q) list = list.filter((o) => o.kode.toLowerCase().includes(q));

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <RiwayatFilterBar />
      {list.length === 0 ? (
        <EmptyState message="Belum ada riwayat order yang cocok." />
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {list.map((o) => (
            <Link
              key={o.id}
              href={`/mitra/pesanan/${o.id}`}
              className="dm-card"
              style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", gap: 12, flexWrap: "wrap" }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 14.5, color: "var(--dm-forest)" }}>{o.kode}</div>
                <div style={{ fontSize: 12.5, color: "var(--dm-ink-soft)", marginTop: 2 }}>
                  {new Date(o.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--dm-magenta)" }}>{rupiah(o.subtotal ?? 0)}</span>
                <Badge status={o.status as OrderStatus} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
