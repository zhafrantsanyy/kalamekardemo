import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const path = body?.path;

  if (!path || typeof path !== "string" || !path.startsWith(`orders/${id}/`)) {
    return NextResponse.json({ error: "Path foto tidak valid untuk order ini." }, { status: 400 });
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
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!floris) {
    return NextResponse.json({ error: "Akun ini bukan akun mitra floris." }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, status, floris_id")
    .eq("id", id)
    .maybeSingle();

  if (!order || order.floris_id !== floris.id) {
    return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });
  }
  if (order.status !== "dirakit") {
    return NextResponse.json({ error: 'Foto hanya bisa diunggah saat status "Sedang Dirakit".' }, { status: 409 });
  }

  const { data: pub } = admin.storage.from("foto-rakitan").getPublicUrl(path);

  const { error } = await admin
    .from("orders")
    .update({ foto_rakitan_url: pub.publicUrl })
    .eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal menyimpan foto." }, { status: 500 });

  return NextResponse.json({ ok: true, url: pub.publicUrl });
}
