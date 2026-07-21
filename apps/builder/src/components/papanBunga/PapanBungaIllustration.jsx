import { forwardRef, useImperativeHandle, useRef } from "react";
import { C, serif, sans } from "../../lib/theme";

/* ============================================================
   Ilustrasi generik papan bunga — SVG lanskap (bukan potret),
   compositing otomatis: papan tanda + rumpun bunga + kaki
   penyangga, dengan overlay teks yang re-render tiap keystroke
   (tidak perlu tombol refresh, karena ini React biasa, bukan
   canvas yang butuh redraw manual).

   Bukan aset desain final — ini ilustrasi generik yang scalable
   (viewBox-based) supaya ringan & mudah di-tweak warnanya nanti.
   ============================================================ */

const VB_W = 420;
const VB_H = 300;
const BOARD_TOP = 10;
const BOARD_HEIGHT = 204; // ~68% dari tinggi kartu
const BOARD_BOTTOM = BOARD_TOP + BOARD_HEIGHT;
const BOARD_LEFT = 80;
const BOARD_RIGHT = 340;
const LEGS_BOTTOM = VB_H - 10;

const RASTER_SCALE = 3;

/* ---------------- Bentuk papan: path badan papan ---------------- */

function boardPath(bentukId) {
  const L = BOARD_LEFT, R = BOARD_RIGHT, T = BOARD_TOP, B = BOARD_BOTTOM;
  const w = R - L;
  switch (bentukId) {
    case "love_shape":
      return `M ${L} ${B} L ${L} ${T + 40} C ${L} ${T - 8} ${L + w * 0.25} ${T - 8} ${(L + R) / 2} ${T + 28} C ${R - w * 0.25} ${T - 8} ${R} ${T - 8} ${R} ${T + 40} L ${R} ${B} Z`;
    case "mahkota":
      return `M ${L} ${B} L ${L} ${T + 30} L ${L + w * 0.25} ${T + 6} L ${L + w * 0.5} ${T - 16} L ${L + w * 0.75} ${T + 6} L ${R} ${T + 30} L ${R} ${B} Z`;
    case "kotak_modern":
      return `M ${L} ${T} L ${R} ${T} L ${R} ${B} L ${L} ${B} Z`;
    case "lengkung_klasik":
    default:
      return `M ${L} ${B} L ${L} ${T + 26} Q ${(L + R) / 2} ${T - 12} ${R} ${T + 26} L ${R} ${B} Z`;
  }
}

/* ---------------- Rumpun bunga (kipas kelopak) ---------------- */

function FlowerCluster({ cx, cy, scale = 1, flip = false, keyPrefix }) {
  const petalColors = [C.maroon, C.gold, C.bloomDark, C.roseSoft];
  const petals = [];
  const count = 6;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const angle = (flip ? -1 : 1) * (t * 80 - 40);
    const rad = (angle * Math.PI) / 180;
    const len = (15 + (i % 2) * 5) * scale;
    const px = cx + Math.sin(rad) * len;
    const py = cy - Math.cos(rad) * len;
    petals.push(
      <ellipse
        key={`${keyPrefix}-p${i}`}
        cx={(cx + px) / 2}
        cy={(cy + py) / 2}
        rx={6.5 * scale}
        ry={3.6 * scale}
        transform={`rotate(${angle} ${(cx + px) / 2} ${(cy + py) / 2})`}
        fill={petalColors[i % petalColors.length]}
        opacity={0.94}
      />
    );
  }
  return (
    <g>
      {petals}
      <ellipse cx={cx - 9 * scale} cy={cy + 5 * scale} rx={8 * scale} ry={3.4 * scale} fill={C.teal} transform={`rotate(-25 ${cx - 9 * scale} ${cy + 5 * scale})`} />
      <ellipse cx={cx + 9 * scale} cy={cy + 5 * scale} rx={8 * scale} ry={3.4 * scale} fill={C.teal} transform={`rotate(25 ${cx + 9 * scale} ${cy + 5 * scale})`} />
      <circle cx={cx} cy={cy} r={4.5 * scale} fill={C.tealDeep} />
    </g>
  );
}

// Border tipis bunga kecil di sekeliling tepi papan — dipakai khusus
// bentuk Kotak Modern ("bunga hanya sebagai border tipis di tepi").
function FlowerBorder({ scale }) {
  const L = BOARD_LEFT + 6, R = BOARD_RIGHT - 6, T = BOARD_TOP + 6, B = BOARD_BOTTOM - 6;
  const pts = [];
  const stepsX = 4;
  for (let i = 0; i <= stepsX; i++) {
    const x = L + ((R - L) * i) / stepsX;
    pts.push([x, T], [x, B]);
  }
  const stepsY = 2;
  for (let i = 1; i < stepsY; i++) {
    const y = T + ((B - T) * i) / stepsY;
    pts.push([L, y], [R, y]);
  }
  return (
    <g>
      {pts.map(([x, y], i) => (
        <FlowerCluster key={i} cx={x} cy={y} scale={0.42 * scale} flip={i % 2 === 0} keyPrefix={`b${i}`} />
      ))}
    </g>
  );
}

function FlowerClusters({ bentukId, densityScale }) {
  if (bentukId === "kotak_modern") return <FlowerBorder scale={densityScale} />;
  const y = BOARD_TOP + 30;
  return (
    <>
      <FlowerCluster cx={BOARD_LEFT + 14} cy={y} scale={0.95 * densityScale} flip={false} keyPrefix="left" />
      <FlowerCluster cx={BOARD_RIGHT - 14} cy={y} scale={0.95 * densityScale} flip={true} keyPrefix="right" />
    </>
  );
}

/* ---------------- Auto-fit & wrap teks (berbasis panjang karakter) ---------------- */

function fitFontSize(text, base, min) {
  if (!text) return base;
  const steps = Math.floor(text.length / 20);
  return Math.max(min, Math.round(base - steps * base * 0.12));
}

const AVG_CHAR_WIDTH_FACTOR = 0.56;

function wrapText(text, fontSize, maxWidth, maxLines) {
  if (!text) return [];
  const maxChars = Math.max(4, Math.floor(maxWidth / (fontSize * AVG_CHAR_WIDTH_FACTOR)));
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines = [];
  let current = words[0];
  for (let i = 1; i < words.length; i++) {
    const test = current + " " + words[i];
    if (test.length <= maxChars) current = test;
    else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (last.length > 1 && last.length + 1 > maxChars) last = last.slice(0, -1);
    kept[maxLines - 1] = last.trimEnd() + "…";
    return kept;
  }
  return lines;
}

/* ---------------- Overlay teks (dipakai sama untuk semua bentuk) ---------------- */

function TextOverlay({ values, uppercaseZones }) {
  const L = BOARD_LEFT, R = BOARD_RIGHT, T = BOARD_TOP, B = BOARD_BOTTOM;
  const cx = (L + R) / 2;
  const innerW = (R - L) - 56;
  const uppercaseSet = new Set(uppercaseZones);

  const ucapan = values.ucapan || "";
  const namaUtamaRaw = values.nama_utama || "";
  const namaUtama = uppercaseSet.has("nama_utama") ? namaUtamaRaw.toUpperCase() : namaUtamaRaw;
  const teksPendukung = values.teks_pendukung || "";
  const namaPengirim = values.nama_pengirim || "";

  const namaSize = fitFontSize(namaUtama, 30, 14);
  const namaLines = wrapText(namaUtama, namaSize, innerW, 3);
  const namaLineHeight = namaSize * 1.16;
  const namaCenterY = T + BOARD_HEIGHT * 0.46;
  const namaStartY = namaCenterY - ((namaLines.length - 1) * namaLineHeight) / 2;

  const pendukungSize = fitFontSize(teksPendukung, 15, 10);
  const pendukungLines = wrapText(teksPendukung, pendukungSize, innerW, 1);
  const pendukungY = T + BOARD_HEIGHT * 0.68;

  const pengirimSize = fitFontSize(namaPengirim, 13, 9);
  const pengirimLines = wrapText(namaPengirim, pengirimSize, innerW - 20, 2);
  const pengirimLineHeight = pengirimSize * 1.15;
  const ribbonPad = 6;
  const ribbonH = pengirimLines.length ? pengirimLines.length * pengirimLineHeight + ribbonPad * 2 : 0;
  const ribbonBottom = B - 12;
  const ribbonTop = ribbonBottom - ribbonH;
  const ribbonCenterY = ribbonTop + ribbonH / 2;

  return (
    <g>
      {ucapan && (
        <g>
          <rect
            x={cx - (ucapan.length * 3.6 + 20) / 2}
            y={T + 6}
            width={ucapan.length * 3.6 + 20}
            height={20}
            rx={10}
            fill={C.roseSoft}
            stroke={C.rose}
            strokeWidth={1}
          />
          <text x={cx} y={T + 20} textAnchor="middle" fontFamily={sans} fontSize={12} fontWeight={700} fill={C.maroon}>
            {ucapan}
          </text>
        </g>
      )}

      {namaLines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={namaStartY + i * namaLineHeight}
          textAnchor="middle"
          fontFamily={serif}
          fontSize={namaSize}
          fontWeight={700}
          fill={C.ink}
        >
          {line}
        </text>
      ))}

      {pendukungLines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={pendukungY + i * pendukungSize * 1.2}
          textAnchor="middle"
          fontFamily={sans}
          fontStyle="italic"
          fontSize={pendukungSize}
          fill={C.inkSoft}
        >
          {line}
        </text>
      ))}

      {pengirimLines.length > 0 && (
        <g>
          <rect x={L + 20} y={ribbonTop} width={R - L - 40} height={ribbonH} fill={C.maroon} opacity={0.92} rx={3} />
          {pengirimLines.map((line, i) => (
            <text
              key={i}
              x={cx}
              y={ribbonCenterY - ((pengirimLines.length - 1) * pengirimLineHeight) / 2 + i * pengirimLineHeight + pengirimSize * 0.35}
              textAnchor="middle"
              fontFamily={sans}
              fontSize={pengirimSize}
              fontWeight={700}
              fill="#fff"
            >
              {line}
            </text>
          ))}
        </g>
      )}
    </g>
  );
}

/* ---------------- Komponen utama ---------------- */

/**
 * Preview lanskap papan bunga. `bentukId` menentukan siluet papan +
 * pola rumpun bunga, `densityScale` (dari ukuran terpilih) membuat
 * rumpun bunga terlihat lebih penuh untuk papan yang lebih tinggi.
 */
const PapanBungaIllustration = forwardRef(function PapanBungaIllustration(
  { bentukId = "lengkung_klasik", densityScale = 1, values = {}, uppercaseZones = [], style },
  ref
) {
  const svgRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toBlob: (cb, type = "image/png") => exportToBlob(svgRef.current, cb, type),
  }));

  const d = boardPath(bentukId);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: `${VB_W} / ${VB_H}`,
        background: C.cream,
        border: `1px solid ${C.line}`,
        borderRadius: 18,
        overflow: "hidden",
        ...style,
      }}
    >
      <svg ref={svgRef} viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ display: "block" }}>
        <rect width={VB_W} height={VB_H} fill={C.cream} />

        {/* Kaki penyangga */}
        <rect x={BOARD_LEFT + 46} y={BOARD_BOTTOM - 6} width={14} height={LEGS_BOTTOM - (BOARD_BOTTOM - 6)} fill={C.tealDeep} rx={2} />
        <rect x={BOARD_RIGHT - 46 - 14} y={BOARD_BOTTOM - 6} width={14} height={LEGS_BOTTOM - (BOARD_BOTTOM - 6)} fill={C.tealDeep} rx={2} />

        {/* Papan tanda */}
        <path d={d} fill={C.card} stroke={C.line} strokeWidth={2} />

        {/* Rumpun bunga */}
        <FlowerClusters bentukId={bentukId} densityScale={densityScale} />

        {/* Teks */}
        <TextOverlay values={values} uppercaseZones={uppercaseZones} />
      </svg>
    </div>
  );
});

function exportToBlob(svgEl, cb, type) {
  if (!svgEl) {
    cb(null);
    return;
  }
  const rasterW = VB_W * RASTER_SCALE;
  const rasterH = VB_H * RASTER_SCALE;
  const clone = svgEl.cloneNode(true);
  clone.setAttribute("width", String(rasterW));
  clone.setAttribute("height", String(rasterH));
  clone.removeAttribute("style");

  const finish = () => {
    const xml = new XMLSerializer().serializeToString(clone);
    const dataUrl = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = rasterW;
      canvas.height = rasterH;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, rasterW, rasterH);
      ctx.drawImage(img, 0, 0, rasterW, rasterH);
      canvas.toBlob((blob) => cb(blob), type);
    };
    img.onerror = () => cb(null);
    img.src = dataUrl;
  };

  if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(finish).catch(finish);
  } else {
    finish();
  }
}

export default PapanBungaIllustration;
