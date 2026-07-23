"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, StickyNote, ArrowRight, CalendarDays, Clock } from "lucide-react";

const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 };
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

const WAKTU_OPTIONS = ["08:00 – 10:00", "10:00 – 12:00", "13:00 – 15:00", "15:00 – 17:00", "17:00 – 19:00"];

const today = () => new Date().toISOString().slice(0, 10);

const initialForm = {
  recipientName: "",
  recipientPhone: "",
  address: "",
  notes: "",
  deliveryDate: "",
  deliveryTime: WAKTU_OPTIONS[1],
};

// Data form disimpan sementara di sessionStorage (bukan DB) — order baru
// benar-benar dibuat di /checkout/pembayaran setelah "pembayaran" dummy
// dikonfirmasi (Fase 5). Ini sengaja hindari kompleksitas server session
// untuk data yang cuma perlu bertahan satu langkah checkout.
const STORAGE_KEY = "kalamekar_checkout";

export default function CheckoutForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [err, setErr] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    const recipientName = form.recipientName.trim();
    const recipientPhone = form.recipientPhone.trim();
    const address = form.address.trim();
    const deliveryDate = form.deliveryDate;

    if (!recipientName || !recipientPhone || !address) {
      setErr("Nama penerima, nomor telepon, dan alamat wajib diisi.");
      return;
    }
    if (!deliveryDate) {
      setErr("Tanggal kirim wajib diisi.");
      return;
    }

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        recipientName,
        recipientPhone,
        address,
        notes: form.notes.trim(),
        deliveryDate,
        deliveryTime: form.deliveryTime,
      }),
    );
    router.push("/checkout/pembayaran");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
      <div>
        <label style={labelStyle} htmlFor="co-nama">Nama penerima bunga</label>
        <div className="rk-input-wrap">
          <User size={16} className="rk-input-icon" />
          <input
            id="co-nama"
            className="rk-field"
            style={fieldBase}
            type="text"
            required
            value={form.recipientName}
            onChange={update("recipientName")}
            placeholder="Nama lengkap penerima"
          />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="co-telepon">Nomor telepon penerima</label>
        <div className="rk-input-wrap">
          <Phone size={16} className="rk-input-icon" />
          <input
            id="co-telepon"
            className="rk-field"
            style={fieldBase}
            type="tel"
            required
            inputMode="tel"
            value={form.recipientPhone}
            onChange={update("recipientPhone")}
            placeholder="08xx xxxx xxxx"
          />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="co-alamat">Alamat pengiriman lengkap</label>
        <div className="rk-input-wrap">
          <MapPin size={16} className="rk-input-icon" style={{ top: 14, transform: "none" }} />
          <textarea
            id="co-alamat"
            className="rk-field"
            style={{ ...fieldBase, minHeight: 90, resize: "vertical" }}
            required
            rows={3}
            value={form.address}
            onChange={update("address")}
            placeholder="Jalan, nomor, kelurahan, kecamatan, kota, patokan…"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle} htmlFor="co-tanggal">Tanggal kirim</label>
          <div className="rk-input-wrap">
            <CalendarDays size={16} className="rk-input-icon" />
            <input
              id="co-tanggal"
              className="rk-field"
              style={fieldBase}
              type="date"
              required
              min={today()}
              value={form.deliveryDate}
              onChange={update("deliveryDate")}
            />
          </div>
        </div>
        <div>
          <label style={labelStyle} htmlFor="co-jam">Jam kirim</label>
          <div className="rk-input-wrap">
            <Clock size={16} className="rk-input-icon" />
            <select
              id="co-jam"
              className="rk-field"
              style={fieldBase}
              value={form.deliveryTime}
              onChange={update("deliveryTime")}
            >
              {WAKTU_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="co-catatan">Catatan/ucapan (opsional)</label>
        <div className="rk-input-wrap">
          <StickyNote size={16} className="rk-input-icon" style={{ top: 14, transform: "none" }} />
          <textarea
            id="co-catatan"
            className="rk-field"
            style={{ ...fieldBase, minHeight: 70, resize: "vertical" }}
            rows={2}
            value={form.notes}
            onChange={update("notes")}
            placeholder="cth. Selamat wisuda! Bangga sama kamu."
          />
        </div>
      </div>

      {err && <p role="alert" style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}

      <button type="submit" className="rk-btn rk-btn-primary" style={{ padding: "13px 22px", fontSize: 14.5, justifyContent: "center" }}>
        Lanjut ke Pembayaran <ArrowRight size={16} />
      </button>
    </form>
  );
}
