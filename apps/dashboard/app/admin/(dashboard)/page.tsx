import { createClient } from "@/lib/supabase/server";
import { ALL_STATUSES, STATUS_LABEL } from "@/lib/orderFlow";
import Card from "@/components/ui/Card";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));

  const [{ data: weekOrders }, { count: activeFloristCount }] = await Promise.all([
    supabase.from("orders").select("status, created_at").gte("created_at", weekStart.toISOString()),
    supabase.from("florists").select("id", { count: "exact", head: true }).eq("aktif", true),
  ]);

  const list = weekOrders || [];
  const todayCounts: Record<string, number> = {};
  const weekCounts: Record<string, number> = {};
  for (const status of ALL_STATUSES) {
    todayCounts[status] = 0;
    weekCounts[status] = 0;
  }
  for (const o of list) {
    if (!(o.status in weekCounts)) continue;
    weekCounts[o.status]++;
    if (new Date(o.created_at) >= todayStart) todayCounts[o.status]++;
  }
  const todayTotal = Object.values(todayCounts).reduce((a, b) => a + b, 0);
  const weekTotal = list.length;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 11.5, color: "var(--dm-ink-soft)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Order hari ini</div>
          <div className="dm-serif" style={{ fontSize: 30, fontWeight: 700, color: "var(--dm-forest)", marginTop: 6 }}>{todayTotal}</div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 11.5, color: "var(--dm-ink-soft)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Order minggu ini</div>
          <div className="dm-serif" style={{ fontSize: 30, fontWeight: 700, color: "var(--dm-forest)", marginTop: 6 }}>{weekTotal}</div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 11.5, color: "var(--dm-ink-soft)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Floris aktif</div>
          <div className="dm-serif" style={{ fontSize: 30, fontWeight: 700, color: "var(--dm-forest)", marginTop: 6 }}>{activeFloristCount || 0}</div>
        </Card>
      </div>

      <Card style={{ padding: 20 }}>
        <div style={{ fontWeight: 800, color: "var(--dm-magenta)", marginBottom: 14 }}>Order per status (minggu ini)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          {ALL_STATUSES.map((status) => (
            <div key={status} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--dm-cream)", borderRadius: 10 }}>
              <span style={{ fontSize: 12.5, color: "var(--dm-ink-soft)" }}>{STATUS_LABEL[status]}</span>
              <span style={{ fontWeight: 800, color: "var(--dm-forest)" }}>{weekCounts[status]}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
