export default function PengaturanLoading() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <section className="rk-settings-section">
        <div className="rk-skeleton" style={{ height: 14, width: "40%" }} />
        <div className="rk-skeleton" style={{ height: 40, marginTop: 12 }} />
      </section>
    </div>
  );
}
