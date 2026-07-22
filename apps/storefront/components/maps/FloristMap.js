"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { KOTA_COLOR_BY_SLUG, DEFAULT_MARKER_COLOR } from "@/lib/data/floristMapKota";

const userIcon = L.divIcon({
  className: "rk-user-location-marker",
  html: `
    <span class="rk-user-dot-pulse"></span>
    <span style="position:relative;display:block;width:16px;height:16px;border-radius:50%;background:#2c7be5;border:3px solid #fff;box-shadow:0 0 0 2px rgba(44,123,229,.5)"></span>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Marker berbentuk pin teardrop berwarna per wilayah, dengan emoji bunga
// di tengah — dibuat sekali per warna lalu di-cache supaya tidak
// membuat ulang ikon di setiap render.
const iconCache = new Map();
function getFloristIcon(color) {
  const key = color || DEFAULT_MARKER_COLOR;
  if (iconCache.has(key)) return iconCache.get(key);
  const icon = L.divIcon({
    className: "rk-florist-pin",
    html: `
      <div style="
        width:30px; height:30px; border-radius:50% 50% 50% 0;
        transform: rotate(-45deg);
        background:${key}; border:2px solid #fff;
        box-shadow:0 2px 6px rgba(0,0,0,.35);
        display:flex; align-items:center; justify-content:center;
      ">
        <span style="transform:rotate(45deg); font-size:14px; line-height:1;">🌸</span>
      </div>
    `,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34],
  });
  iconCache.set(key, icon);
  return icon;
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

// Peta Leaflet tidak re-render ulang lewat prop `center` setelah mount —
// komponen ini yang menggerakkan peta (flyTo) tiap kali targetnya berubah,
// tanpa remount MapContainer, supaya posisi geser pengguna tidak direset.
function FlyToController({ target }) {
  const map = useMap();
  const lastNonce = useRef(null);

  useEffect(() => {
    if (!target || target.nonce === lastNonce.current) return;
    lastNonce.current = target.nonce;
    map.flyTo([target.lat, target.lng], target.zoom ?? map.getZoom(), { duration: 1 });
  }, [target, map]);

  return null;
}

export default function FloristMap({ center, zoom = 12, florists = [], userPosition = null, radiusMeters = null, flyTo = null }) {
  const markerIcons = useMemo(
    () => florists.map((f) => getFloristIcon(KOTA_COLOR_BY_SLUG[f.kota_slug])),
    [florists],
  );

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />

      <FlyToController target={flyTo} />

      {userPosition && (
        <>
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
            <Popup>Lokasimu saat ini</Popup>
          </Marker>
          {radiusMeters && (
            <Circle
              center={[userPosition.lat, userPosition.lng]}
              radius={radiusMeters}
              pathOptions={{ color: "#B93365", fillColor: "#B93365", fillOpacity: 0.06, weight: 1 }}
            />
          )}
        </>
      )}

      {florists.map((f, i) => (
        <Marker key={f.id} position={[f.lat, f.lng]} icon={markerIcons[i]}>
          <Popup>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{f.nama}</div>
              <div style={{ fontSize: 12.5, color: "#49584D", marginBottom: 6 }}>{f.area}</div>
              {typeof f.distance_m === "number" && (
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  {formatJarak(f.distance_m)} dari lokasimu
                </div>
              )}
              {f.wa && (
                <a
                  href={waLink(f)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "#fff",
                    background: "#275C3B",
                    padding: "6px 12px",
                    borderRadius: 999,
                    textDecoration: "none",
                  }}
                >
                  Chat via WhatsApp
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      <style>{`
        .rk-user-dot-pulse {
          position: absolute;
          top: -7px;
          left: -7px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(44, 123, 229, 0.35);
          animation: rk-pulse 1.8s ease-out infinite;
        }
        @keyframes rk-pulse {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .rk-florist-pin:hover { z-index: 1000 !important; }
      `}</style>
    </MapContainer>
  );
}
