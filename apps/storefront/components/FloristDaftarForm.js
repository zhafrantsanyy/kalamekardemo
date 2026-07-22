"use client";

import { useEffect, useMemo, useState } from "react";
import { Store, User, Mail, Phone, MapPin, Landmark, Home, Instagram, FileText, Send, Loader2, CheckCircle2 } from "lucide-react";
import { fetchAllKota, fetchKecamatanByKota, getPopularKota } from "@/lib/wilayah";
import SearchableSelect from "@/components/SearchableSelect";

const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };
// padding kiri 40px menyisakan ruang untuk ikon di .rk-input-icon (left:13px) —
// style inline ini menang atas aturan CSS .rk-input-wrap .rk-field, jadi
// left-padding-nya harus disertakan eksplisit di sini, bukan cuma di CSS.
const fieldBase = {
  width: "100%",
  borderRadius: 11,
  border: "1.5px solid var(--rk-line)",
  background: "#fff",
  fontFamily: "var(--font-body)",
  fontSize: 14.5,
  color: "var(--rk-ink)",
  padding: "12px 14px 12px 40px",
};

const initialForm = {
  namaToko: "",
  namaPemilik: "",
  email: "",
  wa: "",
  kotaId: "",
  kota: "",
  kecamatanId: "",
  kecamatan: "",
  alamat: "",
  instagram: "",
  pengalaman: "",
};

export default function FloristDaftarForm() {
  const [form, setForm] = useState(initialForm);
  const [kotaOptions, setKotaOptions] = useState([]);
  const [kotaLoading, setKotaLoading] = useState(true);
  const [kecamatanOptions, setKecamatanOptions] = useState([]);
  const [kecamatanLoading, setKecamatanLoading] = useState(false);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetchAllKota()
      .then(setKotaOptions)
      .catch(() => setErr("Gagal memuat daftar kota. Muat ulang halaman untuk coba lagi."))
      .finally(() => setKotaLoading(false));
  }, []);

  const popularKota = useMemo(() => getPopularKota(kotaOptions), [kotaOptions]);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleKotaChange(opt) {
    setForm((f) => ({ ...f, kotaId: opt.id, kota: opt.name, kecamatanId: "", kecamatan: "" }));
    setKecamatanOptions([]);

    setKecamatanLoading(true);
    fetchKecamatanByKota(opt.id)
      .then(setKecamatanOptions)
      .catch(() => setErr("Gagal memuat daftar kecamatan. Coba pilih ulang kotanya."))
      .finally(() => setKecamatanLoading(false));
  }

  function handleKecamatanChange(opt) {
    setForm((f) => ({ ...f, kecamatanId: opt.id, kecamatan: opt.name }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setSending(true);
    try {
      const res = await fetch("/api/florist-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal mengirim pendaftaran.");
      setDone(true);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="rk-card" style={{ padding: 28, display: "grid", gap: 10, textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <CheckCircle2 size={32} style={{ color: "var(--rk-teal)", margin: "0 auto" }} />
        <h2 className="rk-serif" style={{ fontSize: 20, color: "var(--rk-maroon-deep)" }}>Pendaftaran diterima</h2>
        <p style={{ fontSize: 14, color: "var(--rk-ink-soft)", lineHeight: 1.6 }}>
          Tim Kalamekar akan meninjau data tokomu dan menghubungi lewat WhatsApp dalam 2–3 hari kerja.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18, maxWidth: 520, margin: "0 auto" }}>
      <div>
        <label style={labelStyle} htmlFor="ff-nama-toko">Nama toko/studio</label>
        <div className="rk-input-wrap">
          <Store size={16} className="rk-input-icon" />
          <input id="ff-nama-toko" className="rk-field" style={fieldBase} type="text" required value={form.namaToko} onChange={update("namaToko")} placeholder="cth. Melati Florist" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-nama-pemilik">Nama pemilik/PIC</label>
        <div className="rk-input-wrap">
          <User size={16} className="rk-input-icon" />
          <input id="ff-nama-pemilik" className="rk-field" style={fieldBase} type="text" required value={form.namaPemilik} onChange={update("namaPemilik")} placeholder="Nama lengkap" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-email">Email</label>
        <div className="rk-input-wrap">
          <Mail size={16} className="rk-input-icon" />
          <input id="ff-email" className="rk-field" style={fieldBase} type="email" required autoComplete="email" value={form.email} onChange={update("email")} placeholder="nama@email.com" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-wa">Nomor WhatsApp</label>
        <div className="rk-input-wrap">
          <Phone size={16} className="rk-input-icon" />
          <input id="ff-wa" className="rk-field" style={fieldBase} type="tel" required inputMode="tel" value={form.wa} onChange={update("wa")} placeholder="08xx xxxx xxxx" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-kota">Kota/Kabupaten</label>
        <SearchableSelect
          id="ff-kota"
          icon={MapPin}
          options={kotaOptions}
          topOptions={popularKota}
          topLabel="Kota Populer"
          value={form.kotaId}
          onChange={handleKotaChange}
          loading={kotaLoading}
          loadingPlaceholder="Memuat daftar kota…"
          placeholder="Cari kota/kabupaten…"
          required
          fieldStyle={fieldBase}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-kecamatan">Kecamatan</label>
        <SearchableSelect
          id="ff-kecamatan"
          icon={Landmark}
          options={kecamatanOptions}
          value={form.kecamatanId}
          onChange={handleKecamatanChange}
          loading={kecamatanLoading}
          loadingPlaceholder="Memuat daftar kecamatan…"
          placeholder={form.kotaId ? "Cari kecamatan…" : "Pilih kota dulu"}
          disabled={!form.kotaId}
          required
          fieldStyle={fieldBase}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-alamat">Alamat operasional</label>
        <div className="rk-input-wrap">
          <Home size={16} className="rk-input-icon" />
          <input id="ff-alamat" className="rk-field" style={fieldBase} type="text" required value={form.alamat} onChange={update("alamat")} placeholder="Alamat lengkap toko/workshop" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-instagram">Instagram (opsional)</label>
        <div className="rk-input-wrap">
          <Instagram size={16} className="rk-input-icon" />
          <input id="ff-instagram" className="rk-field" style={fieldBase} type="text" value={form.instagram} onChange={update("instagram")} placeholder="@namatoko" />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ff-pengalaman">Ceritakan pengalaman merangkaimu (opsional)</label>
        <div className="rk-input-wrap">
          <FileText size={16} className="rk-input-icon" style={{ top: 14, transform: "none" }} />
          <textarea
            id="ff-pengalaman"
            className="rk-field"
            style={{ ...fieldBase, minHeight: 90, resize: "vertical", fontFamily: "var(--font-body)" }}
            value={form.pengalaman}
            onChange={update("pengalaman")}
            placeholder="Lama usaha, jenis produk andalan, dsb."
          />
        </div>
      </div>

      {err && <p role="alert" style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}

      <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "13px 22px", fontSize: 14.5, justifyContent: "center" }} disabled={sending}>
        {sending ? <Loader2 size={16} className="rk-spin" /> : <Send size={16} />} {sending ? "Mengirim…" : "Kirim Pendaftaran"}
      </button>
    </form>
  );
}
