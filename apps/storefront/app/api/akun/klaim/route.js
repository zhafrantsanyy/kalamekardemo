import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

const MAX_PERCOBAAN_PER_JAM = 5;

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const kode = typeof body?.kode === "string" ? body.kode.trim() : "";
  const wa = typeof body?.wa === "string" ? body.wa.trim() : "";

  if (!kode || !wa) {
    return NextResponse.json({ error: "Kode order dan nomor WhatsApp wajib diisi." }, { status: 400 });
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  }

  const admin = createAdminClient();

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: countErr } = await admin
    .from("klaim_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", oneHourAgo);

  if (countErr) {
    return NextResponse.json({ error: "Gagal memproses permintaan." }, { status: 500 });
  }
  if ((count || 0) >= MAX_PERCOBAAN_PER_JAM) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi dalam 1 jam." }, { status: 429 });
  }

  await admin.from("klaim_attempts").insert({ user_id: user.id });

  const { data: order } = await admin
    .from("orders")
    .select("id, user_id")
    .eq("kode", kode)
    .eq("wa", wa)
    .maybeSingle();

  // Pesan generik untuk kode salah maupun order sudah diklaim orang lain —
  // supaya tidak membocorkan mana yang benar (kode ada tapi WA salah, dst).
  const genericError = "Kode order atau nomor WhatsApp tidak cocok.";

  if (!order || order.user_id) {
    return NextResponse.json({ error: genericError }, { status: 404 });
  }

  const { data: updated, error: updateErr } = await admin
    .from("orders")
    .update({ user_id: user.id })
    .eq("id", order.id)
    .is("user_id", null)
    .select("id")
    .maybeSingle();

  if (updateErr || !updated) {
    return NextResponse.json({ error: genericError }, { status: 409 });
  }

  return NextResponse.json({ ok: true, orderId: updated.id });
}
