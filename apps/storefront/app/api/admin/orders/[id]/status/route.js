import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { createClient as createAdminClient } from "@/lib/supabase/admin";
import { ALL_STATUSES } from "@/lib/orderFlow";

export async function POST(request, { params }) {
  const { id } = await params;
  const { user, error: authErr } = await requireAdmin();
  if (authErr) return NextResponse.json({ error: authErr }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const status = body?.status;
  if (!ALL_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Status tidak dikenali." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, status_log")
    .eq("id", id)
    .maybeSingle();
  if (!order) {
    return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });
  }

  const prevLog = Array.isArray(order.status_log) ? order.status_log : [];
  const { error } = await admin
    .from("orders")
    .update({
      status,
      status_log: [...prevLog, { status, at: new Date().toISOString(), by: user.email, aksi: "override-admin" }],
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Gagal memperbarui status." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
