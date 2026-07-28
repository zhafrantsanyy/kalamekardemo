import Link from "next/link";

export default function StatCard({ label, value, href, active }) {
  return (
    <Link
      href={href}
      className={"rk-card rk-stat-card" + (active ? " rk-stat-card-active" : "")}
      style={{ padding: 18, textDecoration: "none", display: "block" }}
    >
      <div style={{ fontSize: 12, color: "var(--rk-ink-soft)", fontWeight: 600 }}>{label}</div>
      <div className="rk-serif" style={{ fontSize: 26, fontWeight: 700, color: "var(--rk-maroon-deep)", marginTop: 6 }}>{value}</div>
    </Link>
  );
}
