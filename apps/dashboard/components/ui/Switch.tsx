interface SwitchProps {
  on: boolean;
  onToggle: () => void;
  label?: string;
}

export default function Switch({ on, onToggle, label }: SwitchProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      aria-label={label}
      className="dm-switch"
      data-on={on}
    >
      <span className="dm-switch-knob" />
    </button>
  );
}
