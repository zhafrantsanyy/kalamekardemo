import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@/lib/supabase/admin";
import { nextStatus } from "@/lib/orderFlow";

export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const action = body?.action;

  if (action !== "maju" && action !== "tolak") {
    return NextResponse.json({ error: "Aksi tidak dikenali." }, { status: 400 });
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  }

  const { data: floris } = await supabase
    .from("florists")
    .select("id, nama")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!floris) {
    return NextResponse.json({ error: "Akun ini bukan akun mitra floris." }, { status: 403 });
  }

  // Pakai service key dari sini — validasi kepemilikan & transisi status
  // dilakukan manual di bawah karena tidak ada policy UPDATE untuk floris.
  const admin = createAdminClient();
  const { data: order, error: orderErr } = await admin
    .from("orders")
    .select("id, status, floris_id, status_log")
    .eq("id", id)
    .maybeSingle();

  if (orderErr || !order) {
    return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });
  }
  if (order.floris_id !== floris.id) {
    return NextResponse.json({ error: "Order ini bukan milikmu." }, { status: 403 });
  }
  if (order.status === "batal") {
    return NextResponse.json({ error: "Order sudah dibatalkan." }, { status: 409 });
  }

  const now = new Date().toISOString();
  const prevLog = Array.isArray(order.status_log) ? order.status_log : [];

  if (action === "tolak") {
    if (order.status !== "matching") {
      return NextResponse.json({ error: "Order yang sudah dikonfirmasi tidak bisa ditolak." }, { status: 409 });
    }
    const { error } = await admin
      .from("orders")
      .update({
        floris_id: null,
        status: "matching",
        status_log: [...prevLog, { status: "matching", at: now, by: floris.nama, aksi: "tolak" }],
      })
      .eq("id", id);
    if (error) return NextResponse.json({ error: "Gagal menolak order." }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const next = nextStatus(order.status);
  if (!next) {
    return NextResponse.json({ error: "Tidak ada tahap berikutnya." }, { status: 409 });
  }
  const { error } = await admin
    .from("orders")
    .update({
      status: next,
      status_log: [...prevLog, { status: next, at: now, by: floris.nama }],
    })
    .eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal memperbarui status." }, { status: 500 });
  return NextResponse.json({ ok: true, status: next });
}
