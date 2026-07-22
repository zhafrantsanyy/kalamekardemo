// Logic keranjang — semua fungsi menerima client Supabase yang sudah
// terikat ke sesi user (bukan admin/service role). Ownership ditegakkan
// dua lapis: RLS di kolom auth.uid() = user_id, DAN pengecekan manual di
// sini supaya pesan error-nya jelas (pola yang sama dipakai requireAdmin
// & Route Handler /api/mitra/orders/[id]/status).

// Label tampilan untuk item bertipe builder_composition, berdasar
// item_snapshot.product_type — dipakai di keranjang & checkout supaya
// labelnya konsisten di kedua tempat.
export const CUSTOM_LABEL = {
  krans: "Krans Custom",
  buket: "Buket Custom",
  papan_bunga: "Papan Bunga Custom",
  kustom: "Rangkaian Custom",
};

export async function getOrCreateActiveCart(supabase, userId) {
  const { data: existing, error: findErr } = await supabase
    .from("carts")
    .select("id, status, created_at, updated_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (findErr) throw new Error("Gagal memuat keranjang.");
  if (existing) return existing;

  const { data: created, error: createErr } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id, status, created_at, updated_at")
    .single();

  if (createErr) throw new Error("Gagal membuat keranjang baru.");
  return created;
}

export async function getCartWithItems(supabase, userId) {
  const { data: cart, error: cartErr } = await supabase
    .from("carts")
    .select("id, status, created_at, updated_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (cartErr) throw new Error("Gagal memuat keranjang.");
  if (!cart) return { cart: null, items: [] };

  const { data: items, error: itemsErr } = await supabase
    .from("cart_items")
    .select("id, item_type, product_id, composition_id, quantity, unit_price, item_snapshot, created_at")
    .eq("cart_id", cart.id)
    .order("created_at", { ascending: true });

  if (itemsErr) throw new Error("Gagal memuat isi keranjang.");
  return { cart, items: items || [] };
}

export async function addToCart(supabase, { userId, itemType, productId, compositionId, quantity = 1 }) {
  if (itemType !== "catalog" && itemType !== "builder_composition") {
    throw new Error("Tipe item tidak dikenali.");
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Jumlah tidak valid.");
  }

  const cart = await getOrCreateActiveCart(supabase, userId);

  let unitPrice;
  let itemSnapshot;

  if (itemType === "catalog") {
    if (!productId) throw new Error("Produk tidak ditemukan.");

    // RLS "publik baca produk floris aktif" otomatis menyaring aktif=true
    // untuk siapa pun, KECUALI floris pemilik produk (yang punya policy
    // baca sendiri tanpa filter aktif) — makanya cek aktif tetap eksplisit
    // di sini supaya floris tidak bisa nambahin produk nonaktif miliknya
    // sendiri ke keranjang lewat jalur ini.
    const { data: product, error } = await supabase
      .from("florist_products")
      .select("id, nama, harga, image_url, deskripsi, florist_id, aktif")
      .eq("id", productId)
      .maybeSingle();

    if (error || !product || !product.aktif) {
      throw new Error("Produk tidak ditemukan atau sudah tidak tersedia.");
    }

    unitPrice = product.harga;
    itemSnapshot = {
      nama: product.nama,
      image_url: product.image_url,
      deskripsi: product.deskripsi,
      florist_id: product.florist_id,
    };
  } else {
    if (!compositionId) throw new Error("Rangkaian kustom tidak ditemukan.");

    const { data: composition, error } = await supabase
      .from("builder_compositions")
      .select("id, product_type, harga, preview_url, ukuran, wrapping")
      .eq("id", compositionId)
      .maybeSingle();

    if (error || !composition) {
      throw new Error("Rangkaian kustom tidak ditemukan.");
    }

    unitPrice = composition.harga;
    itemSnapshot = {
      product_type: composition.product_type,
      preview_url: composition.preview_url,
      ukuran: composition.ukuran,
      wrapping: composition.wrapping,
    };
  }

  // Item identik yang sudah ada di cart -> tambah quantity, bukan bikin
  // baris duplikat.
  const matchColumn = itemType === "catalog" ? "product_id" : "composition_id";
  const matchValue = itemType === "catalog" ? productId : compositionId;

  const { data: existingItem, error: findItemErr } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cart.id)
    .eq("item_type", itemType)
    .eq(matchColumn, matchValue)
    .maybeSingle();

  if (findItemErr) throw new Error("Gagal memeriksa isi keranjang.");

  if (existingItem) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id);
    if (error) throw new Error("Gagal menambah jumlah item.");
  } else {
    const { error } = await supabase.from("cart_items").insert({
      cart_id: cart.id,
      item_type: itemType,
      product_id: itemType === "catalog" ? productId : null,
      composition_id: itemType === "builder_composition" ? compositionId : null,
      quantity,
      unit_price: unitPrice,
      item_snapshot: itemSnapshot,
    });
    if (error) throw new Error("Gagal menambahkan item ke keranjang.");
  }

  await supabase.from("carts").update({ updated_at: new Date().toISOString() }).eq("id", cart.id);

  return { cartId: cart.id };
}

async function getOwnedCartItem(supabase, userId, cartItemId) {
  const { data: item, error } = await supabase
    .from("cart_items")
    .select("id, cart_id, carts!inner(user_id)")
    .eq("id", cartItemId)
    .maybeSingle();

  if (error || !item || item.carts.user_id !== userId) {
    throw new Error("Item keranjang tidak ditemukan.");
  }
  return item;
}

export async function updateCartItemQuantity(supabase, { userId, cartItemId, quantity }) {
  const item = await getOwnedCartItem(supabase, userId, cartItemId);

  if (!Number.isInteger(quantity)) {
    throw new Error("Jumlah tidak valid.");
  }

  if (quantity <= 0) {
    return removeCartItem(supabase, { userId, cartItemId });
  }

  const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId);
  if (error) throw new Error("Gagal memperbarui jumlah.");

  await supabase.from("carts").update({ updated_at: new Date().toISOString() }).eq("id", item.cart_id);
}

export async function removeCartItem(supabase, { userId, cartItemId }) {
  const item = await getOwnedCartItem(supabase, userId, cartItemId);

  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId);
  if (error) throw new Error("Gagal menghapus item.");

  await supabase.from("carts").update({ updated_at: new Date().toISOString() }).eq("id", item.cart_id);
}
