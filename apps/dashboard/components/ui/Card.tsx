import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
  delayMs?: number;
}

export default function Card({ animate = false, delayMs = 0, className = "", style, ...props }: CardProps) {
  return (
    <div
      className={`dm-card ${animate ? "dm-card-anim" : ""} ${className}`}
      style={{ padding: 20, animationDelay: animate ? `${delayMs}ms` : undefined, ...style }}
      {...props}
    />
  );
}
