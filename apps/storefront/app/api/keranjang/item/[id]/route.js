import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { updateCartItemQuantity, removeCartItem } from "@/lib/cart";

export async function POST(request, { params }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const action = body?.action;

  try {
    if (action === "ubah") {
      const quantity = Number.isInteger(body?.quantity) ? body.quantity : null;
      if (quantity === null) {
        return NextResponse.json({ error: "Jumlah tidak valid." }, { status: 400 });
      }
      await updateCartItemQuantity(supabase, { userId: user.id, cartItemId: id, quantity });
      return NextResponse.json({ ok: true });
    }

    if (action === "hapus") {
      await removeCartItem(supabase, { userId: user.id, cartItemId: id });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Aksi tidak dikenali." }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Gagal memperbarui keranjang." }, { status: 400 });
  }
}
