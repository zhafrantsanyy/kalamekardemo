"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

const MAX_DIM = 1200;

function resizeToJpegBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Gagal memproses gambar."))), "image/jpeg", 0.85);
      };
      img.onerror = () => reject(new Error("Gagal membaca gambar."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
}

export default function UploadFotoForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setBusy(true);
    try {
      const blob = await resizeToJpegBlob(file);
      const path = `orders/${orderId}/${Date.now()}.jpg`;
      const supabase = createClient();
      const { error: upErr } = await supabase.storage.from("foto-rakitan").upload(path, blob, {
        contentType: "image/jpeg",
        upsert: false,
      });
      if (upErr) throw upErr;

      const res = await fetch(`/api/mitra/orders/${orderId}/foto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan foto.");

      router.refresh();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Terjadi kesalahan saat mengunggah.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input ref={inputRef} id={`foto-${orderId}`} type="file" accept="image/*" onChange={handleFile} disabled={busy} style={{ display: "none" }} />
      <label htmlFor={`foto-${orderId}`} className="dm-btn dm-btn-primary" style={{ padding: "11px 18px", fontSize: 13.5, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
        <UploadCloud size={16} /> {busy ? "Mengunggah…" : "Unggah foto rakitan"}
      </label>
      {err && <p style={{ fontSize: 12.5, color: "#a13d3d", fontWeight: 600, marginTop: 8 }}>{err}</p>}
    </div>
  );
}
