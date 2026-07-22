import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

// Floris menetapkan harga final papan bunga sebelum order boleh maju ke
// status "dikonfirmasi" (lihat guard di ../status/route.ts). Sama pola
// dengan foto/route.ts — tidak ada policy UPDATE untuk floris di kolom
// harga_final lewat RLS, jadi pakai service key + validasi manual.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const hargaFinal = Number(body?.harga_final);

  if (!Number.isInteger(hargaFinal) || hargaFinal <= 0) {
    return NextResponse.json({ error: "Harga final tidak valid." }, { status: 400 });
  }

  const { data: floris, error: authError } = await requireRole("florist");
  if (!floris) {
    return NextResponse.json({ error: authError }, { status: authError === "Belum masuk." ? 401 : 403 });
  }

  const admin = createAdminClient();
  const { data: order, error: orderErr } = await admin
    .from("orders")
    .select("id, status, floris_id, product_type, status_log")
    .eq("id", id)
    .maybeSingle();

  if (orderErr || !order || order.floris_id !== floris.id) {
    return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });
  }
  if (order.product_type !== "papan_bunga") {
    return NextResponse.json({ error: "Order ini bukan papan bunga." }, { status: 400 });
  }
  if (order.status !== "matching") {
    return NextResponse.json({ error: "Harga final hanya bisa diisi sebelum order dikonfirmasi." }, { status: 409 });
  }

  const now = new Date().toISOString();
  const prevLog = Array.isArray(order.status_log) ? order.status_log : [];
  const { error } = await admin
    .from("orders")
    .update({
      harga_final: hargaFinal,
      status_log: [...prevLog, { status: order.status, at: now, by: floris.nama, aksi: "set-harga-final" }],
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Gagal menyimpan harga final." }, { status: 500 });
  return NextResponse.json({ ok: true, harga_final: hargaFinal });
}
