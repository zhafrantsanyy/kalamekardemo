import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ShoppingBag, Check } from "lucide-react";
import { C, rupiah } from "../lib/theme";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setAdded(false);
    async function load() {
      if (!supabase) { setLoading(false); return; }
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      if (!active) return;
      if (error) setError(error.message);
      else setProduct(data);
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    addItem({ id: product.id, slug: product.slug, nama: product.nama, harga: product.harga || 0, img: product.image_url }, 1);
    setAdded(true);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "26px 20px 60px" }}>
      <Link
        to="/produk"
        className="rk-btn rk-btn-ghost"
        style={{ padding: "8px 16px", fontSize: 13.5, marginBottom: 18, textDecoration: "none", display: "inline-flex" }}
      >
        <ChevronLeft size={16} /> Kembali ke produk
      </Link>

      {!supabase && (
        <div className="rk-card" style={{ padding: 20, color: C.inkSoft }}>
          Mode demo — koneksi Supabase belum diisi.
        </div>
      )}
      {supabase && loading && <div style={{ color: C.inkSoft }}>Memuat produk…</div>}
      {supabase && !loading && (error || !product) && (
        <div className="rk-card" style={{ padding: 20, color: C.inkSoft }}>
          Produk tidak ditemukan.
        </div>
      )}

      {product && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
          <div className="rk-card" style={{ aspectRatio: "1/1", overflow: "hidden", background: C.cream }}>
            {product.image_url && <img src={product.image_url} alt={product.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
          <div>
            <h1 className="rk-serif" style={{ fontSize: 28, color: C.maroon, marginBottom: 8 }}>{product.nama}</h1>
            <div className="rk-serif" style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>{rupiah(product.harga || 0)}</div>
            <p style={{ color: C.inkSoft, lineHeight: 1.6, marginBottom: 24 }}>
              {product.deskripsi || "Deskripsi produk belum ditambahkan."}
            </p>
            <button className="rk-btn rk-btn-primary" style={{ padding: "13px 24px", fontSize: 15 }} onClick={handleAdd}>
              {added ? <><Check size={17} /> Ditambahkan ke keranjang</> : <><ShoppingBag size={17} /> Tambah ke Keranjang</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
