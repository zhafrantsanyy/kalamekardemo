import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

export async function POST(request, { params }) {
  const { id } = await params;
  const { user, error: authErr } = await requireAdmin();
  if (authErr) return NextResponse.json({ error: authErr }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const florisId = body?.florisId;
  if (!florisId) {
    return NextResponse.json({ error: "florisId wajib diisi." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: floris } = await admin
    .from("florists")
    .select("id, nama, aktif")
    .eq("id", florisId)
    .maybeSingle();
  if (!floris || !floris.aktif) {
    return NextResponse.json({ error: "Floris tidak ditemukan atau tidak aktif." }, { status: 404 });
  }

  const { data: order } = await admin
    .from("orders")
    .select("id, status, status_log")
    .eq("id", id)
    .maybeSingle();
  if (!order) {
    return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });
  }
  if (order.status === "batal" || order.status === "selesai") {
    return NextResponse.json({ error: "Order yang sudah selesai/batal tidak bisa di-assign." }, { status: 409 });
  }

  const prevLog = Array.isArray(order.status_log) ? order.status_log : [];
  const { error } = await admin
    .from("orders")
    .update({
      floris_id: floris.id,
      status: "matching",
      status_log: [...prevLog, { status: "matching", at: new Date().toISOString(), by: user.email, aksi: `assign:${floris.nama}` }],
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Gagal assign floris." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
