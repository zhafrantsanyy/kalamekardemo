// Ilustrasi template buket/toko bunga — ditampilkan selagi floris belum
// mengunggah foto sendiri lewat dashboard mitra (florists.foto_url masih
// kosong). Warna mengikuti palet brand di app/globals.css.
export default function FloristPhotoPlaceholder({ style }) {
  return (
    <svg
      viewBox="0 0 240 110"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block", ...style }}
      aria-hidden="true"
    >
      <rect width="240" height="110" fill="#f6dce6" />
      <circle cx="196" cy="18" r="34" fill="#f0c36b" opacity="0.35" />
      <circle cx="26" cy="98" r="30" fill="#d98caa" opacity="0.25" />

      {/* daun & batang */}
      <path d="M120 108 C118 78 108 60 92 46" stroke="#275c3b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M120 108 C122 76 132 58 146 44" stroke="#275c3b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M120 108 C120 82 120 64 120 40" stroke="#275c3b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="88" cy="52" rx="12" ry="6" fill="#275c3b" transform="rotate(-30 88 52)" />
      <ellipse cx="150" cy="50" rx="12" ry="6" fill="#275c3b" transform="rotate(30 150 50)" />

      {/* kertas pembungkus */}
      <path d="M84 108 L120 62 L156 108 Z" fill="#ffffff" opacity="0.9" />

      {/* kuntum bunga */}
      <g>
        <circle cx="120" cy="40" r="13" fill="#b93365" />
        <circle cx="120" cy="40" r="5" fill="#e6a93b" />
      </g>
      <g>
        <circle cx="98" cy="50" r="10" fill="#d98caa" />
        <circle cx="98" cy="50" r="4" fill="#e6a93b" />
      </g>
      <g>
        <circle cx="143" cy="48" r="10" fill="#c97290" />
        <circle cx="143" cy="48" r="4" fill="#e6a93b" />
      </g>
      <g>
        <circle cx="110" cy="30" r="7" fill="#e6a93b" />
      </g>
      <g>
        <circle cx="132" cy="28" r="7" fill="#f0c36b" />
      </g>
    </svg>
  );
}
