export default function AkunLoading() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[1, 2, 3].map((n) => (
          <div key={n} className="rk-card" style={{ padding: 18 }}>
            <div className="rk-skeleton" style={{ height: 12, width: "60%" }} />
            <div className="rk-skeleton" style={{ height: 26, width: "40%", marginTop: 10 }} />
          </div>
        ))}
      </div>
      <div className="rk-skeleton" style={{ height: 44 }} />
      <div style={{ display: "grid", gap: 14 }}>
        {[1, 2, 3].map((n) => (
          <div key={n} className="rk-card" style={{ padding: 20 }}>
            <div className="rk-skeleton" style={{ height: 16, width: "30%" }} />
            <div className="rk-skeleton" style={{ height: 12, width: "50%", marginTop: 10 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
