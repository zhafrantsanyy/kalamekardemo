import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

export async function POST(request, { params }) {
  const { id } = await params;
  const { error: authErr } = await requireAdmin();
  if (authErr) return NextResponse.json({ error: authErr }, { status: 403 });

  const admin = createAdminClient();
  const { data: floris } = await admin.from("florists").select("id, aktif").eq("id", id).maybeSingle();
  if (!floris) {
    return NextResponse.json({ error: "Floris tidak ditemukan." }, { status: 404 });
  }

  const { error } = await admin.from("florists").update({ aktif: !floris.aktif }).eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal memperbarui status floris." }, { status: 500 });

  return NextResponse.json({ ok: true, aktif: !floris.aktif });
}
