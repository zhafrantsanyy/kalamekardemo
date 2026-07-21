import { useMemo, useRef, useState } from "react";
import {
  Heart, Flower2, Store, GraduationCap, PartyPopper, Sparkles,
  ChevronLeft, ChevronRight, Check, MessageCircle, ShoppingBag, Info, LayoutTemplate, LayoutGrid,
} from "lucide-react";
import { C } from "../lib/theme";
import { supabase, ADMIN_WA } from "../lib/supabase";
import { sanitizeText, sanitizeForMessage } from "../lib/sanitize";
import {
  KATEGORI_ACARA, UKURAN_PAPAN, BENTUK_PAPAN, TEXT_FIELD_LIMITS, TEKS_UCAPAN_DEFAULT,
  rupiahRange, hargaEstimasi,
} from "../data/papanBungaTemplates";
import PapanBungaIllustration from "../components/papanBunga/PapanBungaIllustration";

const KATEGORI_ICON = { Heart, Flower2, Store, GraduationCap, PartyPopper, Sparkles };
const CATATAN_MAX = 400;
const CUSTOM_UCAPAN = "__custom__";

function countLines(text) {
  return (text || "").split(/\r\n|\r|\n/).length;
}

// Rumpun bunga terlihat sedikit lebih penuh untuk papan yang lebih tinggi
// (efek visual ringan, bukan simulasi jumlah tangkai presisi).
function densityScaleFor(ukuran) {
  if (!ukuran) return 1;
  const idx = UKURAN_PAPAN.findIndex((u) => u.id === ukuran.id);
  if (idx < 0) return 1;
  return 0.8 + (idx / (UKURAN_PAPAN.length - 1)) * 0.4;
}

/* ---------------- Step 1: Acara & Spesifikasi ---------------- */

function StepAcaraSpek({ form, setForm }) {
  const ukuran = UKURAN_PAPAN.find((u) => u.id === form.ukuranId) || null;

  return (
    <div style={{ display: "grid", gap: 26 }}>
      <div>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4, color: C.maroon }}>Kategori acara</div>
        <p style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 12 }}>Pilih jenis acara supaya kami sesuaikan ucapan yang disarankan.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
          {KATEGORI_ACARA.map((k) => {
            const Icon = KATEGORI_ICON[k.icon] || Sparkles;
            const on = form.kategoriId === k.id;
            return (
              <button
                key={k.id}
                className={"rk-chip" + (on ? " rk-chip-on" : "")}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px 10px", textAlign: "center" }}
                onClick={() => setForm((f) => ({ ...f, kategoriId: k.id }))}
              >
                <Icon size={22} color={on ? C.maroon : C.inkSoft} />
                <span style={{ fontSize: 13, fontWeight: 700, color: on ? C.maroon : C.ink }}>{k.label}</span>
              </button>
            );
          })}
        </div>
        {form.kategoriId === "lainnya" && (
          <input
            className="rk-input"
            style={{ marginTop: 10 }}
            placeholder="Sebutkan jenis acaranya…"
            value={form.kategoriLainnyaText}
            maxLength={60}
            onChange={(e) => setForm((f) => ({ ...f, kategoriLainnyaText: e.target.value }))}
          />
        )}
      </div>

      <div>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4, color: C.maroon }}>Ukuran papan</div>
        <p style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 12 }}>Tinggi papan dari dasar ke puncak.</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          {UKURAN_PAPAN.map((u) => (
            <button
              key={u.id}
              className={"rk-chip" + (form.ukuranId === u.id ? " rk-chip-on" : "")}
              style={{ flex: 1, padding: "10px 4px", fontWeight: 800, fontSize: 15, color: form.ukuranId === u.id ? C.maroon : C.inkSoft }}
              onClick={() => setForm((f) => ({ ...f, ukuranId: u.id }))}
            >
              {u.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.inkSoft }}>
          {ukuran ? `Estimasi dasar ${rupiahRange(ukuran.hargaBaseMin, ukuran.hargaBaseMax)} — belum termasuk bentuk papan.` : "Pilih ukuran untuk lihat estimasi dasar."}
        </div>
        <div style={{ fontSize: 10.5, color: C.inkSoft, marginTop: 4, lineHeight: 1.4 }}>Harga final dikonfirmasi floris setelah pesanan diterima.</div>
      </div>
    </div>
  );
}

/* ---------------- Step 2: Bentuk papan ---------------- */

function StepBentuk({ form, setForm }) {
  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4, color: C.maroon }}>Bentuk papan</div>
      <p style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 12 }}>Siluet papan tanda yang akan dirakit floris.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        {BENTUK_PAPAN.map((b) => {
          const on = form.bentukId === b.id;
          return (
            <button
              key={b.id}
              className={"rk-chip" + (on ? " rk-chip-on" : "")}
              style={{ padding: 8, display: "grid", gap: 6, textAlign: "left" }}
              onClick={() => setForm((f) => ({ ...f, bentukId: b.id }))}
            >
              <PapanBungaIllustration bentukId={b.id} densityScale={1} values={{}} style={{ borderRadius: 8, pointerEvents: "none" }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.maroon : C.ink }}>{b.label}</span>
              <span style={{ fontSize: 11, color: C.inkSoft, lineHeight: 1.35 }}>{b.deskripsi}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Step 3: Isi Teks ---------------- */

function CharCounter({ value, max }) {
  const over = value.length > max;
  return <span style={{ fontSize: 11, color: over ? "#a13d3d" : C.inkSoft, fontWeight: 600 }}>{value.length}/{max}</span>;
}

function StepIsiTeks({ form, setForm }) {
  const { ucapan: lUcapan, nama_utama: lNama, teks_pendukung: lPendukung, nama_pengirim: lPengirim } = TEXT_FIELD_LIMITS;

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div>
        <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Teks ucapan</label>
        <select
          className="rk-input"
          value={form.ucapanPilihan || ""}
          onChange={(e) => setForm((f) => ({ ...f, ucapanPilihan: e.target.value }))}
          style={{ marginBottom: form.ucapanPilihan === CUSTOM_UCAPAN ? 8 : 0 }}
        >
          <option value="" disabled>Pilih ucapan…</option>
          {TEKS_UCAPAN_DEFAULT.map((t) => <option key={t} value={t}>{t}</option>)}
          <option value={CUSTOM_UCAPAN}>Tulis sendiri…</option>
        </select>
        {form.ucapanPilihan === CUSTOM_UCAPAN && (
          <>
            <input
              className="rk-input"
              placeholder="Tulis ucapanmu…"
              value={form.ucapanCustom}
              maxLength={lUcapan.maxChars}
              onChange={(e) => setForm((f) => ({ ...f, ucapanCustom: e.target.value }))}
            />
            <div style={{ textAlign: "right", marginTop: 3 }}>
              <CharCounter value={form.ucapanCustom} max={lUcapan.maxChars} />
            </div>
          </>
        )}
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Nama penerima / teks utama <span style={{ color: "#a13d3d" }}>*</span></label>
        <textarea
          className="rk-input"
          rows={2}
          style={{ resize: "vertical" }}
          placeholder="cth. Bpk. Andi Wijaya & Keluarga"
          value={form.namaUtama}
          maxLength={lNama.maxChars}
          onChange={(e) => setForm((f) => ({ ...f, namaUtama: e.target.value }))}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.inkSoft, cursor: "pointer" }}>
            <input type="checkbox" checked={form.namaUtamaUppercase} onChange={(e) => setForm((f) => ({ ...f, namaUtamaUppercase: e.target.checked }))} />
            Gunakan Huruf Kapital Semua
          </label>
          <CharCounter value={form.namaUtama} max={lNama.maxChars} />
        </div>
        {countLines(form.namaUtama) > lNama.maxLines && (
          <div style={{ fontSize: 11, color: "#a13d3d", marginTop: 3 }}>Maksimal {lNama.maxLines} baris.</div>
        )}
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Teks pendukung (opsional)</label>
        <input
          className="rk-input"
          placeholder="cth. Semoga bahagia selalu"
          value={form.teksPendukung}
          maxLength={lPendukung.maxChars}
          onChange={(e) => setForm((f) => ({ ...f, teksPendukung: e.target.value }))}
        />
        <div style={{ textAlign: "right", marginTop: 3 }}>
          <CharCounter value={form.teksPendukung} max={lPendukung.maxChars} />
        </div>
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Nama pengirim <span style={{ color: "#a13d3d" }}>*</span></label>
        <textarea
          className="rk-input"
          rows={2}
          style={{ resize: "vertical" }}
          placeholder="cth. Keluarga Besar Hartono"
          value={form.namaPengirim}
          maxLength={lPengirim.maxChars}
          onChange={(e) => setForm((f) => ({ ...f, namaPengirim: e.target.value }))}
        />
        <div style={{ textAlign: "right", marginTop: 3 }}>
          <CharCounter value={form.namaPengirim} max={lPengirim.maxChars} />
        </div>
        {countLines(form.namaPengirim) > lPengirim.maxLines && (
          <div style={{ fontSize: 11, color: "#a13d3d", marginTop: 3 }}>Maksimal {lPengirim.maxLines} baris.</div>
        )}
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Catatan khusus untuk floris (opsional)</label>
        <p style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 6 }}>Instruksi internal ke floris — bukan bagian dari desain papan, tidak akan tercetak.</p>
        <textarea
          className="rk-input"
          rows={3}
          style={{ resize: "vertical" }}
          placeholder="cth. Tolong pita warna merah maroon, kirim sebelum jam 8 pagi"
          value={form.catatanFloris}
          maxLength={CATATAN_MAX}
          onChange={(e) => setForm((f) => ({ ...f, catatanFloris: e.target.value }))}
        />
        <div style={{ textAlign: "right", marginTop: 3 }}>
          <CharCounter value={form.catatanFloris} max={CATATAN_MAX} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Preview + estimasi panel ---------------- */

function PreviewPanel({ bentukId, densityScale, previewValues, uppercaseZones, estimasi }) {
  return (
    <div className="rk-card" style={{ padding: 16, position: "sticky", top: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 14, color: C.maroon, marginBottom: 10 }}>Preview papan bunga</div>
      {bentukId ? (
        <PapanBungaIllustration bentukId={bentukId} densityScale={densityScale} values={previewValues} uppercaseZones={uppercaseZones} />
      ) : (
        <div style={{ aspectRatio: "420 / 300", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream, border: `1px dashed ${C.line}`, borderRadius: 18, color: C.inkSoft, fontSize: 12.5, textAlign: "center", padding: 16 }}>
          Pilih bentuk papan untuk melihat preview.
        </div>
      )}
      {estimasi && (
        <div style={{ marginTop: 14, borderTop: `1px dashed ${C.line}`, paddingTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 800, fontSize: 13.5 }}>Estimasi biaya</span>
            <span className="rk-serif" style={{ fontWeight: 800, fontSize: 18, color: C.maroon }}>{rupiahRange(estimasi.min, estimasi.max)}</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, fontSize: 11, color: C.inkSoft, lineHeight: 1.5 }}>
            <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Harga final akan dikonfirmasi floris melalui WhatsApp sebelum pembayaran. Biaya tambahan untuk elemen kustom (logo, kain beludru, dll.) menyesuaikan.</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Wizard orchestrator ---------------- */

function PapanBungaWizard({ form, setForm, onSubmit, onSwitchProduk }) {
  const [step, setStep] = useState(1);

  const ukuran = UKURAN_PAPAN.find((u) => u.id === form.ukuranId) || null;
  const bentuk = BENTUK_PAPAN.find((b) => b.id === form.bentukId) || null;
  const estimasi = useMemo(() => hargaEstimasi(ukuran, bentuk), [ukuran, bentuk]);
  const densityScale = densityScaleFor(ukuran);

  const { ucapan: lUcapan, nama_utama: lNama, teks_pendukung: lPendukung, nama_pengirim: lPengirim } = TEXT_FIELD_LIMITS;

  const effectiveUcapan = form.ucapanPilihan === CUSTOM_UCAPAN ? form.ucapanCustom : (form.ucapanPilihan || "");

  const step1Valid = !!form.kategoriId && (form.kategoriId !== "lainnya" || form.kategoriLainnyaText.trim().length > 0) && !!form.ukuranId;
  const step2Valid = !!form.bentukId;
  const step3Valid =
    effectiveUcapan.trim().length > 0 &&
    form.namaUtama.trim().length > 0 &&
    countLines(form.namaUtama) <= lNama.maxLines &&
    form.namaPengirim.trim().length > 0 &&
    countLines(form.namaPengirim) <= lPengirim.maxLines;

  const previewValues = useMemo(
    () => ({
      ucapan: sanitizeText(effectiveUcapan, { maxChars: lUcapan.maxChars, maxLines: 1, singleLine: true }),
      nama_utama: sanitizeText(form.namaUtama, { maxChars: lNama.maxChars, maxLines: lNama.maxLines }),
      teks_pendukung: sanitizeText(form.teksPendukung, { maxChars: lPendukung.maxChars, maxLines: 1, singleLine: true }),
      nama_pengirim: sanitizeText(form.namaPengirim, { maxChars: lPengirim.maxChars, maxLines: lPengirim.maxLines }),
    }),
    [effectiveUcapan, form.namaUtama, form.teksPendukung, form.namaPengirim, lUcapan, lNama, lPendukung, lPengirim]
  );
  const uppercaseZones = form.namaUtamaUppercase ? ["nama_utama"] : [];

  const canNext = step === 1 ? step1Valid : step === 2 ? step2Valid : step3Valid;

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 16px 60px" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 className="rk-serif" style={{ fontSize: 28, color: C.maroon }}>Rangkai papan bunga</h2>
            <p style={{ color: C.inkSoft, fontSize: 13.5, marginTop: 2 }}>Langkah {step} dari 3</p>
          </div>
          {step === 1 && onSwitchProduk && (
            <div style={{ display: "flex", gap: 8 }}>
              <button className="rk-chip rk-chip-on" style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 14, color: C.maroon }}>
                <LayoutTemplate size={16} /> Papan Bunga
              </button>
              <button className="rk-chip" style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 14, color: C.inkSoft }} onClick={() => onSwitchProduk("bouquet_krans")}>
                <Heart size={16} /> Buket & Krans
              </button>
              <button className="rk-chip" style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 14, color: C.inkSoft }} onClick={() => onSwitchProduk("kustom")}>
                <LayoutGrid size={16} /> Rangkai Bebas
              </button>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, background: s <= step ? C.maroon : C.line }} />
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: step === 1 ? "1fr" : "1fr 300px", gap: 20, alignItems: "start" }}>
        <div className="rk-card" style={{ padding: 20 }}>
          {step === 1 && <StepAcaraSpek form={form} setForm={setForm} />}
          {step === 2 && <StepBentuk form={form} setForm={setForm} />}
          {step === 3 && <StepIsiTeks form={form} setForm={setForm} />}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 18, borderTop: `1px solid ${C.line}` }}>
            <button className="rk-btn rk-btn-ghost" style={{ padding: "10px 18px", fontSize: 13.5, visibility: step === 1 ? "hidden" : "visible" }} onClick={() => setStep((s) => s - 1)}>
              <ChevronLeft size={16} /> Kembali
            </button>
            {step < 3 ? (
              <button className="rk-btn rk-btn-primary" style={{ padding: "10px 20px", fontSize: 13.5 }} disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                Lanjut <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="rk-btn rk-btn-primary"
                style={{ padding: "10px 20px", fontSize: 13.5 }}
                disabled={!canNext}
                onClick={() =>
                  onSubmit({
                    ukuran, bentuk, estimasi, densityScale, previewValues, uppercaseZones,
                  })
                }
              >
                <ShoppingBag size={16} /> Lanjut ke checkout
              </button>
            )}
          </div>
        </div>

        {step > 1 && (
          <PreviewPanel bentukId={form.bentukId} densityScale={densityScale} previewValues={previewValues} uppercaseZones={uppercaseZones} estimasi={estimasi} />
        )}
      </div>
    </div>
  );
}

/* ---------------- Checkout ---------------- */

function PapanBungaCheckoutStep({ form, snapshot, go, setOrder }) {
  const { ukuran, bentuk, estimasi, densityScale, previewValues, uppercaseZones } = snapshot;
  const canvasRef = useRef(null);
  const [shipping, setShipping] = useState({ nama: "", wa: "", alamat: "", tanggal: "", waktu: "10:00 – 12:00" });
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setShipping((s) => ({ ...s, [k]: e.target.value }));

  const kategori = KATEGORI_ACARA.find((k) => k.id === form.kategoriId);
  const kategoriLabel = form.kategoriId === "lainnya" && form.kategoriLainnyaText.trim() ? form.kategoriLainnyaText.trim() : kategori?.label;

  const submit = async () => {
    if (!shipping.nama.trim() || !shipping.alamat.trim() || !shipping.tanggal) {
      setErr("Nama penerima, alamat, dan tanggal kirim wajib diisi.");
      return;
    }
    setErr("");
    setSending(true);

    const kode = "KM-" + Math.floor(1000 + Math.random() * 9000);
    const catatanFloris = sanitizeText(form.catatanFloris, { maxChars: CATATAN_MAX, maxLines: 8 });

    const config = {
      kategoriId: form.kategoriId,
      kategoriLabel,
      ukuranId: ukuran?.id,
      ukuranLabel: ukuran?.label,
      bentukId: bentuk?.id,
      bentukLabel: bentuk?.label,
      ucapan: previewValues.ucapan,
      namaUtama: previewValues.nama_utama,
      namaUtamaUppercase: uppercaseZones.includes("nama_utama"),
      teksPendukung: previewValues.teks_pendukung,
      namaPengirim: previewValues.nama_pengirim,
      catatanFloris,
    };

    let previewUrl = null;
    try {
      if (supabase && canvasRef.current) {
        const blob = await new Promise((resolve) => canvasRef.current.toBlob(resolve, "image/png"));
        if (blob) {
          const path = `orders/${kode}/preview.png`;
          const { error: upErr } = await supabase.storage.from("papan-bunga-preview").upload(path, blob, { contentType: "image/png", upsert: true });
          if (!upErr) {
            previewUrl = supabase.storage.from("papan-bunga-preview").getPublicUrl(path).data.publicUrl;
          }
        }
      }
    } catch {
      // Upload preview gagal tidak boleh menggagalkan pembuatan order —
      // floris tetap bisa lihat detail lewat papan_bunga_config.
    }

    if (supabase) {
      const { error } = await supabase.from("orders").insert({
        kode,
        nama: shipping.nama.trim(),
        wa: shipping.wa.trim() || null,
        alamat: shipping.alamat.trim(),
        tanggal: shipping.tanggal,
        waktu: shipping.waktu,
        metode_bayar: null,
        mode: null,
        product_type: "papan_bunga",
        ukuran: ukuran?.id,
        wrapping: null,
        ring_dasar: null,
        items: [],
        subtotal: null,
        ongkir: null,
        total: null,
        harga_estimasi_min: estimasi?.min ?? null,
        harga_estimasi_max: estimasi?.max ?? null,
        harga_final: null,
        desain_preview_url: previewUrl,
        papan_bunga_config: config,
      });
      setSending(false);
      if (error) {
        setErr("Pesanan gagal disimpan: " + error.message + ". Coba lagi ya.");
        return;
      }
    } else {
      setSending(false);
    }

    setOrder({ ...shipping, kode, estimasi, previewUrl, config });
    go("confirmation");
  };

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "26px 16px 60px" }}>
      <button className="rk-btn rk-btn-ghost" style={{ padding: "8px 16px", fontSize: 13.5, marginBottom: 18 }} onClick={() => go("wizard")}>
        <ChevronLeft size={16} /> Kembali ke wizard
      </button>
      <h2 className="rk-serif" style={{ fontSize: 28, color: C.maroon, marginBottom: 20 }}>Checkout papan bunga</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        <div className="rk-card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 800, color: C.maroon, marginBottom: 14 }}>Pengiriman</div>
          <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Nama penerima</label>
          <input className="rk-input" value={shipping.nama} onChange={set("nama")} placeholder="cth. Panitia Acara" style={{ marginBottom: 12 }} />
          <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Nomor WhatsApp penerima</label>
          <input className="rk-input" value={shipping.wa} onChange={set("wa")} placeholder="08xx xxxx xxxx" style={{ marginBottom: 12 }} inputMode="tel" />
          <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Alamat lengkap</label>
          <textarea className="rk-input" rows={3} value={shipping.alamat} onChange={set("alamat")} placeholder="Jalan, nomor, gedung, patokan…" style={{ marginBottom: 12, resize: "vertical" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Tanggal kirim</label>
              <input className="rk-input" type="date" value={shipping.tanggal} onChange={set("tanggal")} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 5 }}>Jam kirim</label>
              <select className="rk-input" value={shipping.waktu} onChange={set("waktu")}>
                {["08:00 – 10:00", "10:00 – 12:00", "13:00 – 15:00", "15:00 – 17:00", "17:00 – 19:00"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="rk-card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 800, color: C.maroon, marginBottom: 14 }}>Ringkasan pesanan</div>
          <div style={{ maxWidth: 260, margin: "0 auto 14px" }}>
            <PapanBungaIllustration ref={canvasRef} bentukId={bentuk?.id} densityScale={densityScale} values={previewValues} uppercaseZones={uppercaseZones} />
          </div>
          <div style={{ fontSize: 13.5, display: "grid", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Kategori</span><span style={{ fontWeight: 600 }}>{kategoriLabel}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Ukuran</span><span style={{ fontWeight: 600 }}>{ukuran?.label}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Bentuk</span><span style={{ fontWeight: 600 }}>{bentuk?.label}</span></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: `2px solid ${C.maroon}`, marginTop: 10, paddingTop: 10 }}>
            <span style={{ fontWeight: 800 }}>Estimasi biaya</span>
            <span className="rk-serif" style={{ fontWeight: 800, fontSize: 20, color: C.maroon }}>{estimasi ? rupiahRange(estimasi.min, estimasi.max) : "-"}</span>
          </div>
          <div style={{ fontSize: 11.5, color: C.inkSoft, margin: "8px 0 14px", lineHeight: 1.5 }}>
            Ongkos kirim & harga final dikonfirmasi floris via WhatsApp sebelum pembayaran — belum termasuk di estimasi ini.
          </div>
          {err && <div style={{ color: "#a13d3d", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{err}</div>}
          <button className="rk-btn rk-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 15.5 }} onClick={submit} disabled={sending}>
            <Check size={17} /> {sending ? "Menyimpan pesanan…" : "Buat pesanan"}
          </button>
          <div style={{ fontSize: 11, color: C.inkSoft, textAlign: "center", marginTop: 8 }}>
            {supabase ? "Fase pilot: harga & status dikonfirmasi floris via WhatsApp." : "Mode demo — pesanan tidak disimpan (env Supabase belum diisi)."}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Confirmation ---------------- */

function buildWaMessage(order) {
  const c = order.config;
  const lines = [
    `Halo Kalamekar! Saya baru membuat pesanan papan bunga ${order.kode}.`,
    ``,
    `Kategori: ${sanitizeForMessage(c.kategoriLabel || "-")}`,
    `Ukuran: ${sanitizeForMessage(c.ukuranLabel || "-")}`,
    `Bentuk: ${sanitizeForMessage(c.bentukLabel || "-")}`,
    `Ucapan: ${sanitizeForMessage(c.ucapan || "-")}`,
    `Teks utama: ${sanitizeForMessage(c.namaUtama || "-")}${c.namaUtamaUppercase ? " (KAPITAL)" : ""}`,
    c.teksPendukung ? `Teks pendukung: ${sanitizeForMessage(c.teksPendukung)}` : null,
    `Nama pengirim: ${sanitizeForMessage(c.namaPengirim || "-")}`,
    c.catatanFloris ? `Catatan untuk floris: ${sanitizeForMessage(c.catatanFloris, 400)}` : null,
    ``,
    `Estimasi biaya: ${order.estimasi ? rupiahRange(order.estimasi.min, order.estimasi.max) : "-"}`,
    order.previewUrl ? `Preview desain: ${order.previewUrl}` : null,
    ``,
    `Kirim ${order.tanggal} (${order.waktu}) ke ${sanitizeForMessage(order.alamat, 300)}.`,
    `Mohon balas dengan harga final ya sebelum pesanan lanjut ke tahap dikonfirmasi 🌸`,
  ].filter(Boolean);
  return lines.join("\n");
}

function PapanBungaConfirmationStep({ order, go }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "26px 16px 60px", textAlign: "center" }}>
      <h2 className="rk-serif" style={{ fontSize: 26, color: C.maroon, marginBottom: 6 }}>Pesanan {order.kode} diterima</h2>
      <p style={{ color: C.inkSoft, fontSize: 14, marginBottom: 20 }}>
        Kirim ke {order.nama} · {order.tanggal} · {order.waktu}
      </p>

      {order.previewUrl && (
        <div style={{ maxWidth: 280, margin: "0 auto 20px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={order.previewUrl} alt="Preview papan bunga" style={{ width: "100%", borderRadius: 14, border: `1px solid ${C.line}` }} />
        </div>
      )}

      <div className="rk-card" style={{ padding: 20, textAlign: "left", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, fontSize: 13, color: C.inkSoft, lineHeight: 1.6 }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: 2, color: C.maroon }} />
          <span>
            Estimasi biaya: <strong>{order.estimasi ? rupiahRange(order.estimasi.min, order.estimasi.max) : "-"}</strong>.
            Floris akan meninjau detail pesananmu dan mengirim harga final via WhatsApp — pesananmu baru berstatus &ldquo;Dikonfirmasi&rdquo; setelah harga disepakati.
          </span>
        </div>
      </div>

      {ADMIN_WA && (
        <a
          className="rk-btn rk-btn-teal"
          style={{ padding: "13px 22px", fontSize: 14, textDecoration: "none", marginBottom: 14, display: "inline-flex" }}
          href={"https://wa.me/" + ADMIN_WA + "?text=" + encodeURIComponent(buildWaMessage(order))}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={17} /> Kirim detail & minta harga final via WhatsApp
        </a>
      )}

      <div>
        <button className="rk-btn rk-btn-ghost" style={{ padding: "10px 18px", fontSize: 13.5 }} onClick={() => go("wizard")}>
          Rangkai papan bunga lagi
        </button>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function PapanBungaBuilder({ onSwitchProduk }) {
  const [form, setForm] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const kategoriParam = params.get("kategori");
    const kategoriId = KATEGORI_ACARA.some((k) => k.id === kategoriParam) ? kategoriParam : null;
    return {
      kategoriId,
      kategoriLainnyaText: "",
      ukuranId: null,
      bentukId: null,
      ucapanPilihan: null,
      ucapanCustom: "",
      namaUtama: "",
      namaUtamaUppercase: false,
      teksPendukung: "",
      namaPengirim: "",
      catatanFloris: "",
    };
  });
  const [page, setPage] = useState("wizard");
  const [snapshot, setSnapshot] = useState(null);
  const [order, setOrder] = useState(null);

  const goPage = (p) => { setPage(p); window.scrollTo({ top: 0 }); };

  return (
    <>
      {page === "wizard" && (
        <PapanBungaWizard form={form} setForm={setForm} onSubmit={(snap) => { setSnapshot(snap); goPage("checkout"); }} onSwitchProduk={onSwitchProduk} />
      )}
      {page === "checkout" && snapshot && (
        <PapanBungaCheckoutStep form={form} snapshot={snapshot} go={goPage} setOrder={setOrder} />
      )}
      {page === "confirmation" && order && <PapanBungaConfirmationStep order={order} go={goPage} />}
    </>
  );
}
