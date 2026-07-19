import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

function generateTempPassword() {
  return randomBytes(6).toString("base64url");
}

export async function POST(request) {
  const { error: authErr } = await requireAdmin();
  if (authErr) return NextResponse.json({ error: authErr }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const nama = typeof body?.nama === "string" ? body.nama.trim() : "";
  const area = typeof body?.area === "string" ? body.area.trim() : "";
  const wa = typeof body?.wa === "string" ? body.wa.trim() : "";

  if (!email || !nama) {
    return NextResponse.json({ error: "Email dan nama wajib diisi." }, { status: 400 });
  }

  const admin = createAdminClient();
  const tempPassword = generateTempPassword();

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });
  if (createErr) {
    const msg = createErr.message?.includes("already been registered")
      ? "Email ini sudah terdaftar."
      : "Gagal membuat akun floris.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { error: florisErr } = await admin.from("florists").insert({
    user_id: created.user.id,
    nama,
    area: area || null,
    wa: wa || null,
    aktif: true,
  });
  if (florisErr) {
    return NextResponse.json({ error: "Akun dibuat tapi gagal menyimpan data floris." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, tempPassword });
}
