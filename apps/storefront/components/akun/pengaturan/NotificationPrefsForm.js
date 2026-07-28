"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useToast } from "@/components/ToastProvider";

export default function NotificationPrefsForm({ userId, notifWa }) {
  const [checked, setChecked] = useState(notifWa);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  async function handleToggle() {
    const next = !checked;
    setChecked(next);
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ notif_wa: next }).eq("id", userId);

    setSaving(false);
    if (error) {
      setChecked(!next);
      toast.error("Gagal menyimpan preferensi notifikasi.");
      return;
    }
    toast.success(next ? "Notifikasi WhatsApp diaktifkan." : "Notifikasi WhatsApp dinonaktifkan.");
  }

  return (
    <div className="rk-switch-row">
      <div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Update Status Pesanan lewat WhatsApp</div>
        <p style={{ fontSize: 13, color: "var(--rk-ink-soft)", marginTop: 2 }}>
          Terima notifikasi WhatsApp saat status pesananmu berubah.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label="Notifikasi WhatsApp untuk update status pesanan"
        className="rk-switch"
        onClick={handleToggle}
        disabled={saving}
      />
    </div>
  );
}
