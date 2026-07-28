"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Star, Save, X } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { useToast } from "@/components/ToastProvider";

const EMPTY_FORM = { label: "Rumah", penerima: "", telepon: "", alamat: "", kota: "", kecamatan: "", kode_pos: "" };

const fieldStyle = {
  width: "100%", padding: "11px 13px", borderRadius: 10, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--rk-ink)",
};
const labelStyle = { display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 5 };

function AddressForm({ initial, onCancel, onSubmit, saving }) {
  const [form, setForm] = useState(initial);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.penerima.trim() || !form.alamat.trim()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="rk-address-card" style={{ borderStyle: "dashed" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Label</label>
          <input className="rk-field" style={fieldStyle} value={form.label} onChange={update("label")} placeholder="Rumah, Kantor, dll" />
        </div>
        <div>
          <label style={labelStyle}>Nama Penerima</label>
          <input className="rk-field" style={fieldStyle} value={form.penerima} onChange={update("penerima")} required />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Nomor Telepon</label>
        <input className="rk-field" style={fieldStyle} value={form.telepon} onChange={update("telepon")} inputMode="tel" />
      </div>
      <div>
        <label style={labelStyle}>Alamat Lengkap</label>
        <textarea rows={2} className="rk-field" style={{ ...fieldStyle, resize: "vertical" }} value={form.alamat} onChange={update("alamat")} required />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Kota</label>
          <input className="rk-field" style={fieldStyle} value={form.kota} onChange={update("kota")} />
        </div>
        <div>
          <label style={labelStyle}>Kecamatan</label>
          <input className="rk-field" style={fieldStyle} value={form.kecamatan} onChange={update("kecamatan")} />
        </div>
        <div>
          <label style={labelStyle}>Kode Pos</label>
          <input className="rk-field" style={fieldStyle} value={form.kode_pos} onChange={update("kode_pos")} inputMode="numeric" />
        </div>
      </div>
      <div className="rk-address-actions">
        <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "9px 16px", fontSize: 13.5 }} disabled={saving}>
          <Save size={14} /> {saving ? "Menyimpan…" : "Simpan Alamat"}
        </button>
        <button type="button" className="rk-icon-btn" onClick={onCancel}>
          <X size={13} /> Batal
        </button>
      </div>
    </form>
  );
}

export default function AddressBookSection({ userId, initialAddresses }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  async function handleAdd(form) {
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("addresses")
      .insert({ ...form, user_id: userId, is_default: addresses.length === 0 })
      .select()
      .single();

    setSaving(false);
    if (error) {
      toast.error("Gagal menambah alamat.");
      return;
    }
    setAddresses((list) => [data, ...list]);
    setShowAddForm(false);
    toast.success("Alamat baru tersimpan.");
  }

  async function handleUpdate(id, form) {
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("addresses").update(form).eq("id", id).select().single();

    setSaving(false);
    if (error) {
      toast.error("Gagal menyimpan perubahan alamat.");
      return;
    }
    setAddresses((list) => list.map((a) => (a.id === id ? data : a)));
    setEditingId(null);
    toast.success("Alamat diperbarui.");
  }

  async function handleDelete(id) {
    if (!window.confirm("Hapus alamat ini?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus alamat.");
      return;
    }
    setAddresses((list) => list.filter((a) => a.id !== id));
    toast.success("Alamat dihapus.");
  }

  async function handleSetDefault(id) {
    const supabase = createClient();
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    if (error) {
      toast.error("Gagal mengatur alamat utama.");
      return;
    }
    setAddresses((list) => list.map((a) => ({ ...a, is_default: a.id === id })));
    toast.success("Alamat utama diperbarui.");
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {addresses.length === 0 && !showAddForm && (
        <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)" }}>Belum ada alamat tersimpan.</p>
      )}

      {addresses.map((a) =>
        editingId === a.id ? (
          <AddressForm
            key={a.id}
            initial={{
              label: a.label || "",
              penerima: a.penerima || "",
              telepon: a.telepon || "",
              alamat: a.alamat || "",
              kota: a.kota || "",
              kecamatan: a.kecamatan || "",
              kode_pos: a.kode_pos || "",
            }}
            saving={saving}
            onCancel={() => setEditingId(null)}
            onSubmit={(form) => handleUpdate(a.id, form)}
          />
        ) : (
          <div key={a.id} className={"rk-address-card" + (a.is_default ? " rk-address-card-default" : "")}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, fontSize: 14 }}>{a.label}</span>
              {a.is_default && (
                <span className="rk-badge" style={{ position: "static", color: "var(--rk-teal)" }}>
                  <Star size={11} /> Utama
                </span>
              )}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700 }}>{a.penerima}{a.telepon ? ` · ${a.telepon}` : ""}</div>
            <div style={{ fontSize: 13, color: "var(--rk-ink-soft)" }}>
              {a.alamat}
              {(a.kecamatan || a.kota || a.kode_pos) && (
                <>, {[a.kecamatan, a.kota, a.kode_pos].filter(Boolean).join(", ")}</>
              )}
            </div>
            <div className="rk-address-actions">
              {!a.is_default && (
                <button type="button" className="rk-icon-btn" onClick={() => handleSetDefault(a.id)}>
                  <Star size={13} /> Jadikan Utama
                </button>
              )}
              <button type="button" className="rk-icon-btn" onClick={() => setEditingId(a.id)}>
                <Pencil size={13} /> Edit
              </button>
              <button type="button" className="rk-icon-btn rk-icon-btn-danger" onClick={() => handleDelete(a.id)}>
                <Trash2 size={13} /> Hapus
              </button>
            </div>
          </div>
        ),
      )}

      {showAddForm ? (
        <AddressForm initial={EMPTY_FORM} saving={saving} onCancel={() => setShowAddForm(false)} onSubmit={handleAdd} />
      ) : (
        <button type="button" className="rk-btn rk-btn-ghost" style={{ padding: "10px 18px", fontSize: 13.5, justifySelf: "start" }} onClick={() => setShowAddForm(true)}>
          <Plus size={15} /> Tambah Alamat
        </button>
      )}
    </div>
  );
}
