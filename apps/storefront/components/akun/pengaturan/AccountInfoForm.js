"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { notifyProfileChanged } from "@/lib/profileEvents";
import { useToast } from "@/components/ToastProvider";

const fieldStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--rk-line)",
  background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--rk-ink)",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };

export default function AccountInfoForm({ userId, email, nama, phone }) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ nama: nama || "", phone: phone || "", email: email || "" });
  const [saving, setSaving] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nama.trim()) {
      toast.error("Nama tidak boleh kosong.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ nama: form.nama.trim(), phone: form.phone.trim() || null })
      .eq("id", userId);

    if (profileError) {
      setSaving(false);
      toast.error("Gagal menyimpan informasi akun.");
      return;
    }

    let emailNotice = "";
    if (form.email.trim() && form.email.trim() !== email) {
      const { error: emailError } = await supabase.auth.updateUser({ email: form.email.trim() });
      if (emailError) {
        setSaving(false);
        toast.error("Gagal memperbarui email: " + emailError.message);
        return;
      }
      emailNotice = " Cek email barumu untuk konfirmasi perubahan.";
    }

    setSaving(false);
    notifyProfileChanged();
    toast.success("Informasi akun tersimpan." + emailNotice);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <div>
        <label style={labelStyle} htmlFor="set-nama">Nama</label>
        <input id="set-nama" className="rk-field" style={fieldStyle} value={form.nama} onChange={update("nama")} placeholder="Nama lengkap" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="set-phone">Nomor Telepon</label>
        <input id="set-phone" className="rk-field" style={fieldStyle} value={form.phone} onChange={update("phone")} placeholder="08xx xxxx xxxx" inputMode="tel" />
      </div>
      <div>
        <label style={labelStyle} htmlFor="set-email">Email</label>
        <input id="set-email" type="email" className="rk-field" style={fieldStyle} value={form.email} onChange={update("email")} placeholder="nama@email.com" />
        <span style={{ fontSize: 12, color: "var(--rk-ink-soft)", marginTop: 4, display: "block" }}>
          Mengubah email butuh konfirmasi lewat tautan yang dikirim ke alamat baru.
        </span>
      </div>
      <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "12px 20px", fontSize: 14, justifyContent: "center" }} disabled={saving}>
        <Save size={16} /> {saving ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}
