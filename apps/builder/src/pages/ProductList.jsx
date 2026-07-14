import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { C, rupiah } from "../lib/theme";
import { supabase } from "../lib/supabase";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) { setLoading(false); return; }
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (!active) return;
      if (error) setError(error.message);
      else setProducts(data || []);
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, []);

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 20px 60px" }}>
      <h1 className="rk-serif" style={{ fontSize: 32, color: C.maroon, marginBottom: 8 }}>Produk</h1>
      <p style={{ color: C.inkSoft, marginBottom: 28, fontSize: 15 }}>
        Rangkaian siap pesan dari florist partner kami.
      </p>

      {!supabase && (
        <div className="rk-card" style={{ padding: 20, color: C.inkSoft }}>
          Mode demo — koneksi Supabase belum diisi, katalog produk belum bisa dimuat.
        </div>
      )}
      {supabase && loading && <div style={{ color: C.inkSoft }}>Memuat produk…</div>}
      {supabase && !loading && error && (
        <div className="rk-card" style={{ padding: 20, color: C.inkSoft }}>
          Produk belum tersedia saat ini. Coba{" "}
          <Link to="/builder" style={{ color: C.maroon, fontWeight: 700 }}>rangkai sendiri</Link> sementara.
        </div>
      )}
      {supabase && !loading && !error && products.length === 0 && (
        <div className="rk-card" style={{ padding: 20, color: C.inkSoft }}>
          Belum ada produk yang ditambahkan. Coba{" "}
          <Link to="/builder" style={{ color: C.maroon, fontWeight: 700 }}>rangkai sendiri</Link> sementara ini.
        </div>
      )}

      {products.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/produk/${p.slug}`}
              className="rk-card"
              style={{ display: "block", overflow: "hidden", textDecoration: "none", color: "inherit" }}
            >
              <div style={{ aspectRatio: "1/1", background: C.cream, overflow: "hidden" }}>
                {p.image_url && <img src={p.image_url} alt={p.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.nama}</div>
                <div style={{ color: C.maroon, fontWeight: 700, marginTop: 4 }}>{rupiah(p.harga || 0)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
