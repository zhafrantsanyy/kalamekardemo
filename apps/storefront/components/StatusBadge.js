import { STATUS_LABEL } from "@/lib/orderFlow";

const STATUS_STYLE = {
  matching: { bg: "#fdf1e0", fg: "#a3720f" },
  dikonfirmasi: { bg: "#e7effb", fg: "#2c548f" },
  dirakit: { bg: "#f3e8fb", fg: "#7a3ea0" },
  diantar: { bg: "#e5f3ee", fg: "#1c6b4c" },
  selesai: { bg: "#e9f5e6", fg: "#2f7d3b" },
  batal: { bg: "#fbe9e9", fg: "#a13d3d" },
};

export default function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: "var(--rk-cream)", fg: "var(--rk-ink-soft)" };
  return (
    <span
      style={{
        background: s.bg, color: s.fg, fontSize: 11.5, fontWeight: 700,
        padding: "4px 10px", borderRadius: 999, display: "inline-block", whiteSpace: "nowrap",
      }}
    >
      {STATUS_LABEL[status] || status}
    </span>
  );
}
