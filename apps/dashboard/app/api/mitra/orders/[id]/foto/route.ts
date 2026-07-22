import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const path = body?.path;

  if (!path || typeof path !== "string" || !path.startsWith(`orders/${id}/`)) {
    return NextResponse.json({ error: "Path foto tidak valid untuk order ini." }, { status: 400 });
  }

  const { data: floris, error: authError } = await requireRole("florist");
  if (!floris) {
    return NextResponse.json({ error: authError }, { status: authError === "Belum masuk." ? 401 : 403 });
  }

  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("id, status, floris_id").eq("id", id).maybeSingle();

  if (!order || order.floris_id !== floris.id) {
    return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });
  }
  if (order.status !== "dirakit") {
    return NextResponse.json({ error: 'Foto hanya bisa diunggah saat status "Sedang Dirakit".' }, { status: 409 });
  }

  const { data: pub } = admin.storage.from("foto-rakitan").getPublicUrl(path);

  const { error } = await admin.from("orders").update({ foto_rakitan_url: pub.publicUrl }).eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal menyimpan foto." }, { status: 500 });

  return NextResponse.json({ ok: true, url: pub.publicUrl });
}
