import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { createClient as createAdminClient } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/auditLog";

const STRING_FIELDS = ["nama", "area", "wa", "kategori"] as const;
const BOOL_FIELDS = ["aktif", "verified"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const { user, error: authError } = await requireRole("admin");
  if (!user) {
    return NextResponse.json({ error: authError }, { status: authError === "Belum masuk." ? 401 : 403 });
  }

  const update: Record<string, unknown> = {};

  for (const field of STRING_FIELDS) {
    if (field in body) {
      if (body[field] !== null && typeof body[field] !== "string") {
        return NextResponse.json({ error: `Field ${field} tidak valid.` }, { status: 400 });
      }
      update[field] = body[field];
    }
  }
  if (update.nama !== undefined && !update.nama) {
    return NextResponse.json({ error: "Nama floris wajib diisi." }, { status: 400 });
  }

  for (const field of BOOL_FIELDS) {
    if (field in body) {
      if (typeof body[field] !== "boolean") {
        return NextResponse.json({ error: `Field ${field} tidak valid.` }, { status: 400 });
      }
      update[field] = body[field];
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Tidak ada perubahan yang dikirim." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: existing } = await admin.from("florists").select("*").eq("id", id).maybeSingle();
  if (!existing) {
    return NextResponse.json({ error: "Floris tidak ditemukan." }, { status: 404 });
  }

  const { error } = await admin.from("florists").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal menyimpan perubahan." }, { status: 500 });

  const before: Record<string, unknown> = {};
  const existingRecord = existing as Record<string, unknown>;
  for (const key of Object.keys(update)) before[key] = existingRecord[key];

  await logAdminAction(user, {
    action: "florist.update",
    entityType: "florist",
    entityId: id,
    before,
    after: update,
  });

  return NextResponse.json({ ok: true });
}
