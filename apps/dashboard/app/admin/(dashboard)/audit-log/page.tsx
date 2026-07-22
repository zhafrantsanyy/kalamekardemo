import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import AuditLogFilterBar from "@/components/admin/AuditLogFilterBar";
import type { AuditLogEntry } from "@/lib/types";

function formatValue(v: unknown) {
  if (v === null || v === undefined) return "-";
  if (typeof v === "boolean") return v ? "ya" : "tidak";
  return String(v);
}

function formatDiff(entry: AuditLogEntry) {
  const keys = Object.keys(entry.before || {});
  if (keys.length === 0) return "-";
  return keys
    .map((k) => `${k}: ${formatValue(entry.before?.[k])} → ${formatValue(entry.after?.[k])}`)
    .join(" · ");
}

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ entity_type?: string }>;
}) {
  const { entity_type } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("admin_audit_log").select("*").order("created_at", { ascending: false }).limit(200);
  if (entity_type) query = query.eq("entity_type", entity_type);

  const { data } = await query;
  const entries = (data || []) as AuditLogEntry[];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <AuditLogFilterBar />

      {entries.length === 0 ? (
        <EmptyState message="Belum ada aksi admin yang tercatat." />
      ) : (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--dm-cream)", textAlign: "left" }}>
                  {["Waktu", "Admin", "Aksi", "Entity", "Perubahan"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--dm-ink-soft)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} style={{ borderTop: "1px solid var(--dm-line)" }}>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      {new Date(e.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ padding: "10px 14px" }}>{e.admin_email}</td>
                    <td style={{ padding: "10px 14px" }}>{e.action}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <Link
                        href={e.entity_type === "order" ? `/admin/orders/${e.entity_id}` : `/admin/florists/${e.entity_id}`}
                        style={{ color: "var(--dm-forest)", fontWeight: 700, textDecoration: "none" }}
                      >
                        {e.entity_type} · {e.entity_id.slice(0, 8)}
                      </Link>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--dm-ink-soft)" }}>{formatDiff(e)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
