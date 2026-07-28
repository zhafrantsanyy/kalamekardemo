"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam ToastProvider");
  return ctx;
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, { type = "success", duration = 3800 } = {}) => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, message, type }]);
      window.setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const toast = {
    success: (message, opts) => showToast(message, { ...opts, type: "success" }),
    error: (message, opts) => showToast(message, { ...opts, type: "error" }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="rk-toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={"rk-toast" + (t.type === "error" ? " rk-toast-error" : " rk-toast-success")}>
            {t.type === "error" ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Tutup notifikasi" className="rk-toast-close">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
