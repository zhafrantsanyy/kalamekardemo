import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { addToCart } from "@/lib/cart";

export async function POST(request) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Belum masuk." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const itemType = body?.itemType;
  const productId = typeof body?.productId === "string" ? body.productId : null;
  const compositionId = typeof body?.compositionId === "string" ? body.compositionId : null;
  const quantity = Number.isInteger(body?.quantity) && body.quantity > 0 ? body.quantity : 1;

  try {
    const result = await addToCart(supabase, {
      userId: user.id,
      itemType,
      productId,
      compositionId,
      quantity,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Gagal menambahkan ke keranjang." }, { status: 400 });
  }
}
