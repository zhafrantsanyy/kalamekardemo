import type { ReactNode } from "react";
import { PackageSearch } from "lucide-react";

export default function EmptyState({ message, icon }: { message: string; icon?: ReactNode }) {
  return (
    <div className="dm-card" style={{ padding: 36, textAlign: "center", color: "var(--dm-ink-soft)" }}>
      {icon ?? <PackageSearch size={26} style={{ color: "var(--dm-ink-soft)" }} />}
      <p style={{ fontSize: 14, marginTop: 10 }}>{message}</p>
    </div>
  );
}
