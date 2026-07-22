import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "dark" | "ghost" | "danger-ghost";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "dm-btn-primary",
  dark: "dm-btn-dark",
  ghost: "dm-btn-ghost",
  "danger-ghost": "dm-btn-danger-ghost",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({ variant = "primary", className = "", style, ...props }: ButtonProps) {
  return (
    <button
      className={`dm-btn ${VARIANT_CLASS[variant]} ${className}`}
      style={{ padding: "10px 20px", fontSize: 13.5, ...style }}
      {...props}
    />
  );
}
