import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { createClient as createAdminClient } from "@/lib/supabase/admin";
import { ALL_STATUSES } from "@/lib/orderFlow";
import { orderValue, computeCommission } from "@/lib/payout";
import { logAdminAction } from "@/lib/auditLog";

// Mutasi admin (override status bebas, assign/reassign floris, catatan
// internal, payout) lewat satu Route Handler PATCH — beda dari mutasi
// floris yang tervalidasi sekuensial (lihat api/mitra/orders/[id]/status),
// karena admin sengaja butuh override bebas untuk kasus manual/edge case.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const { user, error: authError } = await requireRole("admin");
  if (!user) {
    return NextResponse.json({ error: authError }, { status: authError === "Belum masuk." ? 401 : 403 });
  }

  const hasStatus = typeof body?.status === "string";
  const hasFloristId = "floris_id" in body;
  const hasNotes = typeof body?.internal_notes === "string";
  const hasCommissionRate = typeof body?.commission_rate === "number";
  const hasPayoutStatus = typeof body?.payout_status === "string";

  if (!hasStatus && !hasFloristId && !hasNotes && !hasCommissionRate && !hasPayoutStatus) {
    return NextResponse.json({ error: "Tidak ada perubahan yang dikirim." }, { status: 400 });
  }
  if (hasStatus && !(ALL_STATUSES as readonly string[]).includes(body.status)) {
    return NextResponse.json({ error: "Status tidak dikenali." }, { status: 400 });
  }
  if (hasCommissionRate && (body.commission_rate < 0 || body.commission_rate > 100)) {
    return NextResponse.json({ error: "Rate komisi harus 0-100." }, { status: 400 });
  }
  if (hasPayoutStatus && body.payout_status !== "belum_dibayar" && body.payout_status !== "dibayar") {
    return NextResponse.json({ error: "Status payout tidak dikenali." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: order, error: orderErr } = await admin
    .from("orders")
    .select("id, status, status_log, floris_id, internal_notes, subtotal, total, harga_final, product_type, commission_rate, payout_status, commission_amount, payout_amount, payout_paid_at")
    .eq("id", id)
    .maybeSingle();
  if (orderErr || !order) {
    return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });
  }

  const update: Record<string, unknown> = {};
  const before: Record<string, unknown> = {};

  if (hasFloristId) {
    const floristId = body.floris_id;
    if (floristId !== null) {
      const { data: floris } = await admin.from("florists").select("id").eq("id", floristId).maybeSingle();
      if (!floris) {
        return NextResponse.json({ error: "Floris tidak ditemukan." }, { status: 404 });
      }
    }
    update.floris_id = floristId;
    before.floris_id = order.floris_id;
  }

  let nextStatusValue: string | null = null;
  if (hasStatus) {
    nextStatusValue = body.status;
  } else if (hasFloristId && body.floris_id !== null && order.status === "baru") {
    // Assign floris ke order baru otomatis majukan ke "matching" supaya
    // muncul di Order Masuk floris — kalau admin sekaligus set status
    // eksplisit di request yang sama, itu yang menang (lihat hasStatus).
    nextStatusValue = "matching";
  }

  if (nextStatusValue && nextStatusValue !== order.status) {
    const prevLog = Array.isArray(order.status_log) ? order.status_log : [];
    update.status = nextStatusValue;
    update.status_log = [...prevLog, { status: nextStatusValue, at: new Date().toISOString(), by: `admin:${user.email}`, aksi: "admin-override" }];
    before.status = order.status;
  }

  if (hasNotes) {
    update.internal_notes = body.internal_notes;
    before.internal_notes = order.internal_notes;
  }

  if (hasCommissionRate) {
    update.commission_rate = body.commission_rate;
    before.commission_rate = order.commission_rate;
  }

  if (hasPayoutStatus) {
    if (body.payout_status === "dibayar") {
      if (!order.floris_id) {
        return NextResponse.json({ error: "Order belum di-assign ke floris, tidak bisa ditandai dibayar." }, { status: 409 });
      }
      const rate = hasCommissionRate ? body.commission_rate : order.commission_rate;
      const value = orderValue(order);
      if (value == null) {
        return NextResponse.json({ error: "Harga final belum diisi, tidak bisa hitung payout." }, { status: 409 });
      }
      const { commission, payout } = computeCommission(value, rate);
      update.payout_status = "dibayar";
      update.commission_amount = commission;
      update.payout_amount = payout;
      update.payout_paid_at = new Date().toISOString();
    } else {
      update.payout_status = "belum_dibayar";
      update.commission_amount = null;
      update.payout_amount = null;
      update.payout_paid_at = null;
    }
    before.payout_status = order.payout_status;
    before.commission_amount = order.commission_amount;
    before.payout_amount = order.payout_amount;
    before.payout_paid_at = order.payout_paid_at;
  }

  const { error } = await admin.from("orders").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: "Gagal menyimpan perubahan." }, { status: 500 });

  const after: Record<string, unknown> = {};
  for (const key of Object.keys(before)) after[key] = update[key];

  await logAdminAction(user, { action: "order.update", entityType: "order", entityId: id, before, after });

  return NextResponse.json({ ok: true });
}
