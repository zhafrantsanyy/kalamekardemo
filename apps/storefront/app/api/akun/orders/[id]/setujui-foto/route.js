import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

export async function POST(request, { params }) {
  const { id } = await params;

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, user_id, foto_rakitan_url")
    .eq("id", id)
    .maybeSingle();

  if (!order || order.user_id !== user.id) {
    return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });
  }
  if (!order.foto_rakitan_url) {
    return NextResponse.json({ error: "Belum ada foto rakitan untuk order ini." }, { status: 409 });
  }

  const { error } = await admin
    .from("orders")
    .update({ foto_disetujui: true })
    .eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal menyetujui foto." }, { status: 500 });

  return NextResponse.json({ ok: true });
}
