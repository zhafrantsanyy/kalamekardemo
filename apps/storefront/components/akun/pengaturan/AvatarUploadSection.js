"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { notifyProfileChanged } from "@/lib/profileEvents";
import { useToast } from "@/components/ToastProvider";

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const INITIAL_STYLES = [
  { background: "var(--rk-rose-soft)", color: "var(--rk-maroon)" },
  { background: "var(--rk-gold-soft)", color: "var(--rk-maroon-deep)" },
  { background: "var(--rk-cream)", color: "var(--rk-teal-deep)" },
];

function initialStyleFor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return INITIAL_STYLES[hash % INITIAL_STYLES.length];
}

export default function AvatarUploadSection({ userId, nama, avatarUrl: initialAvatarUrl }) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const toast = useToast();

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Ukuran file maksimal 2MB.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setUploading(false);
      toast.error("Gagal mengunggah foto. Coba lagi.");
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${publicUrlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", userId);

    setUploading(false);
    if (updateError) {
      toast.error("Foto terunggah, tapi gagal menyimpan ke profil.");
      return;
    }

    setAvatarUrl(url);
    notifyProfileChanged();
    toast.success("Foto profil berhasil diperbarui.");
  }

  const initial = (nama || "?").trim().charAt(0).toUpperCase() || "?";
  const style = initialStyleFor(userId);

  return (
    <div className="rk-avatar-row">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="" className="rk-avatar-preview" />
      ) : (
        <span className="rk-avatar-preview" aria-hidden="true" style={style}>{initial}</span>
      )}
      <div style={{ display: "grid", gap: 6 }}>
        <button
          type="button"
          className="rk-btn rk-btn-ghost"
          style={{ padding: "9px 16px", fontSize: 13.5 }}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload size={15} /> {uploading ? "Mengunggah…" : "Ganti Foto"}
        </button>
        <span style={{ fontSize: 12, color: "var(--rk-ink-soft)" }}>JPG, PNG, atau WebP. Maksimal 2MB.</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
