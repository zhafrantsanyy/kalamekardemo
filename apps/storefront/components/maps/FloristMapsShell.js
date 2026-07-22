"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { LocateFixed, MapPin, Star, MessageCircle, Loader2, SearchX, Navigation } from "lucide-react";
import { FLORIST_MAP_KOTA, KOTA_COLOR_BY_SLUG, DEFAULT_MARKER_COLOR } from "@/lib/data/floristMapKota";

const FloristMap = dynamic(() => import("./FloristMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--rk-cream)" }}>
      <span style={{ fontSize: 13.5, color: "var(--rk-ink-soft)" }}>Memuat peta…</span>
    </div>
  ),
});

// Titik & zoom default supaya semua wilayah seed (5 wilayah Jakarta +
// Bekasi) langsung terlihat begitu peta dibuka, sebelum GPS terdeteksi.
const DEFAULT_CENTER = [-6.205, 106.87];
const DEFAULT_ZOOM = 10;
const NEARBY_RADIUS_M = 10000;

function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatJarak(distanceM) {
  if (typeof distanceM !== "number") return null;
  if (distanceM < 1000) return `${Math.round(distanceM)} m`;
  return `${(distanceM / 1000).toFixed(1)} km`;
}

function waLink(florist) {
  const pesan = `Halo ${florist.nama}, saya menemukan toko Anda lewat peta florist Kalamekar. Saya ingin bertanya soal pemesanan bunga.`;
  return `https://wa.me/${florist.wa}?text=${encodeURIComponent(pesan)}`;
}

export default function FloristMapsShell() {
  const [geoStatus, setGeoStatus] = useState("idle"); // idle | requesting | granted | denied | unsupported
  const [userPos, setUserPos] = useState(null);
  const [flyTo, setFlyTo] = useState(null);
  const [jumpKota, setJumpKota] = useState("");

  const [florists, setFlorists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoStatus("unsupported");
      return;
    }
    setGeoStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(next);
        setGeoStatus("granted");
        setFlyTo({ lat: next.lat, lng: next.lng, zoom: 13, nonce: Date.now() });
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Semua florist aktif diambil sekali di awal — peta tidak memfilter
  // berdasarkan kota/radius, supaya florist wilayah lain tetap kelihatan
  // begitu peta digeser. GPS/kota cuma dipakai untuk urutan & posisi awal.
  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/florists/nearby");
        const json = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setError(json.error || "Gagal memuat data florist.");
          setFlorists([]);
        } else {
          setFlorists(json.florists || []);
        }
      } catch {
        if (!cancelled) {
          setError("Gagal memuat data florist. Periksa koneksi internetmu.");
          setFlorists([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const floristsWithDistance = useMemo(() => {
    const withDistance = florists.map((f) => ({
      ...f,
      distance_m: userPos ? haversineMeters(userPos.lat, userPos.lng, f.lat, f.lng) : null,
    }));
    if (userPos) {
      withDistance.sort((a, b) => a.distance_m - b.distance_m);
    }
    return withDistance;
  }, [florists, userPos]);

  const nearbyCount = userPos ? floristsWithDistance.filter((f) => f.distance_m <= NEARBY_RADIUS_M).length : null;

  function handleJumpKota(slug) {
    setJumpKota(slug);
    if (!slug) return;
    const kota = FLORIST_MAP_KOTA.find((k) => k.slug === slug);
    if (kota) {
      setFlyTo({ lat: kota.lat, lng: kota.lng, zoom: 13, nonce: Date.now() });
    }
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 18 }}>
        {geoStatus === "granted" && userPos && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "var(--rk-teal)" }}>
            <LocateFixed size={15} /> Peta dipusatkan di lokasimu
            {nearbyCount !== null && ` — ${nearbyCount} florist dalam 10 km`}
          </span>
        )}
        {geoStatus === "requesting" && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "var(--rk-ink-soft)" }}>
            <Loader2 size={15} className="rk-spin" /> Mendeteksi lokasimu…
          </span>
        )}
        {(geoStatus === "denied" || geoStatus === "unsupported") && (
          <span style={{ fontSize: 13.5, color: "var(--rk-ink-soft)" }}>
            {geoStatus === "unsupported"
              ? "Browser ini tidak mendukung deteksi lokasi. Semua florist tetap bisa dilihat di peta — geser atau loncat ke wilayah di bawah."
              : "Izin lokasi tidak diberikan. Semua florist tetap bisa dilihat di peta — geser atau loncat ke wilayah di bawah."}
          </span>
        )}

        {geoStatus !== "requesting" && (
          <button
            type="button"
            onClick={requestLocation}
            className="rk-navlink rk-navlink-onlight"
            style={{ padding: 0, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13.5 }}
          >
            <LocateFixed size={13} /> Deteksi ulang lokasiku
          </button>
        )}

        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "var(--rk-ink-soft)", marginLeft: "auto" }}>
          <Navigation size={13} />
          <select
            value={jumpKota}
            onChange={(e) => handleJumpKota(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: 13,
              borderRadius: 8,
              border: "1.5px solid var(--rk-line)",
              background: "var(--rk-card)",
              color: "var(--rk-ink)",
              fontFamily: "var(--font-body)",
            }}
          >
            <option value="">Loncat ke wilayah…</option>
            {FLORIST_MAP_KOTA.map((k) => (
              <option key={k.slug} value={k.slug}>
                {k.nama}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginBottom: 14 }}>
        {FLORIST_MAP_KOTA.map((k) => (
          <span key={k.slug} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--rk-ink-soft)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: k.warna, display: "inline-block" }} />
            {k.nama}
          </span>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(280px, 1fr)", gap: 20 }} className="rk-maps-grid">
        <div className="rk-card" style={{ overflow: "hidden", height: 520 }}>
          <FloristMap
            center={userPos ? [userPos.lat, userPos.lng] : DEFAULT_CENTER}
            zoom={userPos ? 13 : DEFAULT_ZOOM}
            florists={floristsWithDistance}
            userPosition={userPos}
            radiusMeters={userPos ? NEARBY_RADIUS_M : null}
            flyTo={flyTo}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 520, overflowY: "auto" }}>
          {loading && (
            <div className="rk-card" style={{ padding: 20, textAlign: "center", fontSize: 13.5, color: "var(--rk-ink-soft)" }}>
              <Loader2 size={18} className="rk-spin" style={{ marginBottom: 8 }} />
              <div>Memuat daftar florist…</div>
            </div>
          )}

          {!loading && error && (
            <div className="rk-card" style={{ padding: 20, textAlign: "center", fontSize: 13.5, color: "var(--rk-maroon)" }}>
              {error}
            </div>
          )}

          {!loading && !error && floristsWithDistance.length === 0 && (
            <div className="rk-card" style={{ padding: "28px 20px", textAlign: "center" }}>
              <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--rk-rose-soft)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <SearchX size={18} color="var(--rk-maroon)" />
              </span>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--rk-ink)", marginBottom: 6 }}>
                Belum ada florist ditemukan
              </p>
              <p style={{ fontSize: 13, color: "var(--rk-ink-soft)", lineHeight: 1.55 }}>
                Florist partner Kalamekar di peta ini sedang kami lengkapi kembali. Coba muat ulang halaman.
              </p>
            </div>
          )}

          {!loading &&
            floristsWithDistance.map((f) => (
              <div
                key={f.id}
                className="rk-card"
                style={{ padding: 16, borderLeft: `4px solid ${KOTA_COLOR_BY_SLUG[f.kota_slug] || DEFAULT_MARKER_COLOR}` }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div className="rk-serif" style={{ fontSize: 15, fontWeight: 700, color: "var(--rk-ink)" }}>
                    {f.nama}
                  </div>
                  {f.rating && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12.5, fontWeight: 700, color: "var(--rk-ink)", flexShrink: 0 }}>
                      <Star size={12} fill="var(--rk-gold)" color="var(--rk-gold)" /> {f.rating}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "var(--rk-ink-soft)", marginTop: 4 }}>
                  <MapPin size={12} /> {f.area}
                </div>
                {typeof f.distance_m === "number" && (
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--rk-teal)", marginTop: 4 }}>
                    {formatJarak(f.distance_m)} dari lokasimu
                  </div>
                )}
                {f.deskripsi && (
                  <p style={{ fontSize: 12.5, color: "var(--rk-ink-soft)", marginTop: 8, lineHeight: 1.5 }}>{f.deskripsi}</p>
                )}
                {f.wa && (
                  <a
                    href={waLink(f)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rk-btn rk-btn-teal"
                    style={{ marginTop: 12, padding: "8px 14px", fontSize: 12.5 }}
                  >
                    <MessageCircle size={13} /> Chat via WhatsApp
                  </a>
                )}
              </div>
            ))}
        </div>
      </div>

      <style>{`
        .rk-spin { animation: rk-spin-anim 1s linear infinite; }
        @keyframes rk-spin-anim { to { transform: rotate(360deg); } }
        @media (max-width: 820px) {
          .rk-maps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
