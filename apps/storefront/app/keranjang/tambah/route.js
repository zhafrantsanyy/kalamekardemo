import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { addToCart } from "@/lib/cart";

// Titik masuk redirect dari builder setelah komposisi disimpan ke
// builder_compositions: builder.kalamekar.id/... -> redirect ke
// /keranjang/tambah?composition_id=xxx&source=builder (lihat catatan
// integrasi builder di migration 09_cart_checkout.sql — sisi builder
// TIDAK diubah di fase ini).
//
// Proteksi login sudah ditangani middleware (matcher /keranjang/:path*
// mencakup route ini juga), jadi di sini langsung pakai user.id seperti
// halaman /keranjang & /checkout — bukan pengulangan cek di setiap
// Route Handler seperti pola /api/** (yang memang tidak kena matcher).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const compositionId = searchParams.get("composition_id");

  if (!compositionId) {
    return NextResponse.redirect(new URL("/keranjang", request.url));
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    await addToCart(supabase, {
      userId: user.id,
      itemType: "builder_composition",
      compositionId,
      quantity: 1,
    });
  } catch {
    const url = new URL("/keranjang", request.url);
    url.searchParams.set("error", "komposisi_gagal");
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(new URL("/keranjang", request.url));
}
