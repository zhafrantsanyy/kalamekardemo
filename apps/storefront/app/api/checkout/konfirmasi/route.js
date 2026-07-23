import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@/lib/supabase/admin";
import { getCartWithItems } from "@/lib/cart";

export async function POST(request) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const paymentMethod = body?.paymentMethod;
  const recipientName = typeof body?.recipientName === "string" ? body.recipientName.trim() : "";
  const recipientPhone = typeof body?.recipientPhone === "string" ? body.recipientPhone.trim() : "";
  const address = typeof body?.address === "string" ? body.address.trim() : "";
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";
  const deliveryDate = typeof body?.deliveryDate === "string" ? body.deliveryDate.trim() : "";
  const deliveryTime = typeof body?.deliveryTime === "string" ? body.deliveryTime.trim() : "";

  if (paymentMethod !== "transfer_bank" && paymentMethod !== "qris") {
    return NextResponse.json({ error: "Metode pembayaran tidak valid." }, { status: 400 });
  }
  if (!recipientName || !recipientPhone || !address) {
    return NextResponse.json({ error: "Data penerima belum lengkap. Kembali ke halaman checkout." }, { status: 400 });
  }
  if (!deliveryDate) {
    return NextResponse.json({ error: "Tanggal kirim belum diisi. Kembali ke halaman checkout." }, { status: 400 });
  }

  // Ambil cart dari sesi user sendiri (lewat RLS) — BUKAN dari body request,
  // supaya isi & harga order selalu berdasar data server, bukan input client.
  const { cart, items } = await getCartWithItems(supabase, user.id);
  if (!cart || items.length === 0) {
    return NextResponse.json({ error: "Keranjang kosong." }, { status: 400 });
  }

  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const kode = "KM-" + Math.floor(1000 + Math.random() * 9000);

  // Mutasi privileged (create order) lewat service role — sama presedennya
  // dengan Route Handler /api/mitra/orders/[id]/status, bukan insert RLS
  // langsung dari client.
  const admin = createAdminClient();

  const { data: order, error: orderErr } = await admin
    .from("orders")
    .insert({
      kode,
      user_id: user.id,
      cart_id: cart.id,
      nama: recipientName,
      wa: recipientPhone,
      alamat: address,
      tanggal: deliveryDate,
      waktu: deliveryTime || null,
      kartu: notes || null,
      metode_bayar: paymentMethod,
      // TODO: Ganti dengan integrasi Midtrans/Xendit sungguhan — payment_status
      // di sini langsung "paid" karena payment gateway masih dummy (belum ada
      // callback/webhook verifikasi pembayaran asli).
      payment_status: "paid",
      status: "baru",
      // Order dari cart terpadu bisa berisi campuran katalog + rangkaian
      // custom, jadi tidak cocok masuk satu kategori product_type lama
      // (krans/buket/papan_bunga) — detail per-item sebenarnya ada di
      // order_items, kolom items/ukuran di sini cuma diisi placeholder
      // untuk memenuhi constraint NOT NULL lama.
      product_type: "kustom",
      ukuran: "-",
      items: [],
      total,
    })
    .select("id, kode")
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ error: "Gagal membuat pesanan." }, { status: 500 });
  }

  const orderItemsPayload = items.map((item) => ({
    order_id: order.id,
    item_type: item.item_type,
    product_id: item.product_id,
    composition_id: item.composition_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    item_snapshot: item.item_snapshot,
  }));

  const { error: itemsErr } = await admin.from("order_items").insert(orderItemsPayload);
  if (itemsErr) {
    return NextResponse.json({ error: "Gagal menyimpan detail pesanan." }, { status: 500 });
  }

  const { error: cartErr } = await admin
    .from("carts")
    .update({ status: "checked_out", updated_at: new Date().toISOString() })
    .eq("id", cart.id);
  if (cartErr) {
    return NextResponse.json({ error: "Gagal memperbarui status keranjang." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, orderId: order.id });
}
