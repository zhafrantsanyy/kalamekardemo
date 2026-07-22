import type { CSSProperties } from "react";

export default function Skeleton({ width = "100%", height = 16, style }: { width?: number | string; height?: number | string; style?: CSSProperties }) {
  return <div className="dm-skeleton" style={{ width, height, ...style }} />;
}
