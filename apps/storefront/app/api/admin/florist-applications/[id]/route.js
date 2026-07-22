import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

const STATUSES = ["baru", "dihubungi", "disetujui", "ditolak"];

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { error: authErr } = await requireAdmin();
  if (authErr) return NextResponse.json({ error: authErr }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const status = typeof body?.status === "string" ? body.status : "";
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("florist_applications").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal memperbarui status pendaftaran." }, { status: 500 });

  return NextResponse.json({ ok: true, status });
}
