import type { InputHTMLAttributes, ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

export default function Input({ label, id, className = "", ...props }: InputFieldProps) {
  return (
    <div>
      {label && (
        <label className="dm-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className={`dm-input ${className}`} {...props} />
    </div>
  );
}
