"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Power, ImageOff } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

const fieldStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };

const EMPTY_FORM = { nama: "", kategori_id: "", harga: "", deskripsi: "", image_url: "" };

export default function ProdukFlorisManager({ florisId, produkAwal, kategoriList }) {
  const router = useRouter();
  const [produk, setProduk] = useState(produkAwal);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState(null);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    const harga = parseInt(form.harga, 10);
    if (!form.nama.trim() || !harga || harga <= 0) {
      setErr("Nama dan harga produk wajib diisi.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("florist_products")
      .insert({
        florist_id: florisId,
        kategori_id: form.kategori_id || null,
        nama: form.nama.trim(),
        deskripsi: form.deskripsi.trim() || null,
        harga,
        image_url: form.image_url.trim() || null,
      })
      .select("id, nama, deskripsi, harga, image_url, aktif, kategori_id")
      .single();

    setSaving(false);
    if (error || !data) {
      setErr("Gagal menyimpan produk. Coba lagi.");
      return;
    }

    setProduk((list) => [data, ...list]);
    setForm(EMPTY_FORM);
    router.refresh();
  }

  async function handleToggleAktif(p) {
    setBusyId(p.id);
    const supabase = createClient();
    const { error } = await supabase.from("florist_products").update({ aktif: !p.aktif }).eq("id", p.id);
    setBusyId(null);
    if (error) return;
    setProduk((list) => list.map((x) => (x.id === p.id ? { ...x, aktif: !x.aktif } : x)));
    router.refresh();
  }

  async function handleDelete(p) {
    setBusyId(p.id);
    const supabase = createClient();
    const { error } = await supabase.from("florist_products").delete().eq("id", p.id);
    setBusyId(null);
    if (error) return;
    setProduk((list) => list.filter((x) => x.id !== p.id));
    router.refresh();
  }

  function kategoriNama(id) {
    return kategoriList.find((k) => k.id === id)?.nama || "Lainnya";
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <form onSubmit={handleSubmit} className="rk-card" style={{ padding: 20, display: "grid", gap: 14 }}>
        <div style={{ fontWeight: 800, color: "var(--rk-maroon)" }}>Tambah produk</div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle} htmlFor="produk-nama">Nama produk</label>
            <input id="produk-nama" className="rk-field" style={fieldStyle} value={form.nama} onChange={update("nama")} placeholder="cth. Buket Mawar Merah" required />
          </div>
          <div>
            <label style={labelStyle} htmlFor="produk-harga">Harga (Rp)</label>
            <input id="produk-harga" className="rk-field" style={fieldStyle} type="number" min="0" value={form.harga} onChange={update("harga")} placeholder="185000" required />
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="produk-kategori">Kategori</label>
          <select id="produk-kategori" className="rk-field" style={fieldStyle} value={form.kategori_id} onChange={update("kategori_id")}>
            <option value="">Lainnya</option>
            {kategoriList.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle} htmlFor="produk-deskripsi">Deskripsi</label>
          <textarea id="produk-deskripsi" className="rk-field" style={{ ...fieldStyle, minHeight: 72, resize: "vertical" }} value={form.deskripsi} onChange={update("deskripsi")} placeholder="Deskripsi singkat produk" />
        </div>

        <div>
          <label style={labelStyle} htmlFor="produk-foto">URL foto produk</label>
          <input id="produk-foto" className="rk-field" style={fieldStyle} value={form.image_url} onChange={update("image_url")} placeholder="https://..." inputMode="url" />
          <p style={{ fontSize: 12, color: "var(--rk-ink-soft)", marginTop: 6 }}>
            Kosongkan untuk pakai ikon bawaan di halaman profil tokomu.
          </p>
        </div>

        {err && <p style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}

        <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "12px 20px", fontSize: 14, justifyContent: "center" }} disabled={saving}>
          <Plus size={16} /> {saving ? "Menyimpan…" : "Tambah produk"}
        </button>
      </form>

      {produk.length === 0 ? (
        <div className="rk-card" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ color: "var(--rk-ink-soft)", fontSize: 14 }}>Belum ada produk. Tambahkan produk pertamamu di atas.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {produk.map((p) => (
            <div key={p.id} className="rk-card" style={{ padding: 16, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: 64, height: 64, borderRadius: 12, overflow: "hidden", background: "var(--rk-rose-soft)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <ImageOff size={20} color="var(--rk-maroon)" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--rk-ink)" }}>{p.nama}</div>
                <div style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", marginTop: 2 }}>
                  {kategoriNama(p.kategori_id)} · Rp {Number(p.harga).toLocaleString("id-ID")}
                </div>
              </div>
              <span
                style={{
                  fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
                  background: p.aktif ? "#e9f5e6" : "#fbe9e9", color: p.aktif ? "#2f7d3b" : "#a13d3d",
                }}
              >
                {p.aktif ? "Aktif" : "Nonaktif"}
              </span>
              <button
                type="button"
                className={"rk-btn " + (p.aktif ? "rk-btn-ghost" : "rk-btn-primary")}
                style={{ padding: "8px 14px", fontSize: 13 }}
                disabled={busyId === p.id}
                onClick={() => handleToggleAktif(p)}
              >
                <Power size={14} /> {p.aktif ? "Nonaktifkan" : "Aktifkan"}
              </button>
              <button
                type="button"
                className="rk-btn rk-btn-ghost"
                style={{ padding: "8px 14px", fontSize: 13 }}
                disabled={busyId === p.id}
                onClick={() => handleDelete(p)}
              >
                <Trash2 size={14} /> Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
