import { C } from "../lib/theme";

export const BouquetGuide = ({ wrap, r }) => (
  <svg viewBox="0 0 100 125" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
    {/* stems */}
    {[-14, -7, 0, 7, 14].map((dx, i) => (
      <line key={i} x1={50 + dx} y1={48} x2={50 + dx * 0.25} y2={92} stroke="#7f9a6d" strokeWidth="1.1" opacity="0.7" />
    ))}
    {/* back paper */}
    <path d={`M50 108 L 15 40 Q 50 58 85 40 Z`} fill={wrap.warna} />
    <path d={`M50 108 L 15 40 Q 50 58 85 40 Z`} fill="#000" opacity="0.05" />
    {/* front paper */}
    <path d={`M50 108 L 26 52 Q 50 66 74 52 Z`} fill={wrap.warna2} />
    <path d="M50 108 L 26 52 Q 50 66 74 52 Z" fill="#fff" opacity="0.08" />
    {/* ribbon */}
    <circle cx="50" cy="84" r="3.4" fill={C.gold} />
    <path d="M50 84 L 42 78 L 44 86 Z" fill={C.gold} />
    <path d="M50 84 L 58 78 L 56 86 Z" fill={C.gold} />
    <path d="M50 84 L 45 94 L 49 92 Z" fill={C.goldSoft} />
    <path d="M50 84 L 55 94 L 51 92 Z" fill={C.goldSoft} />
    {/* dome guide */}
    <circle cx="50" cy="40" r={r} fill="none" stroke={C.rose} strokeWidth="0.7" strokeDasharray="2.5 2.5" opacity="0.8" />
  </svg>
);

export const WreathGuide = ({ base, r }) => (
  <svg viewBox="0 0 100 125" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
    <path d="M50 10 L 44 20 L 56 20 Z" fill={C.gold} />
    <line x1="50" y1="18" x2="50" y2="30" stroke={C.gold} strokeWidth="1.4" />
    <circle cx="50" cy={62} r={r} fill="none" stroke={base.warna} strokeWidth="13" />
    <circle cx="50" cy={62} r={r} fill="none" stroke={base.warna2} strokeWidth="13" strokeDasharray="4 7" opacity="0.7" />
    <circle cx="50" cy={62} r={r} fill="none" stroke={C.rose} strokeWidth="0.7" strokeDasharray="2.5 2.5" opacity="0.9" />
  </svg>
);
