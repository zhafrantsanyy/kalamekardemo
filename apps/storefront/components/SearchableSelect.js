"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Combobox sederhana: input teks + panel hasil pencarian, dipakai untuk
// dropdown dengan ratusan opsi (kota/kabupaten se-Indonesia) yang tidak
// nyaman dipilih lewat <select> native.
export default function SearchableSelect({
  id,
  icon: Icon,
  options,
  topOptions = [],
  topLabel = "Populer",
  value,
  onChange,
  placeholder = "Pilih…",
  loadingPlaceholder = "Memuat…",
  loading = false,
  disabled = false,
  required = false,
  fieldStyle,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selected = useMemo(() => options.find((o) => o.id === value) || null, [options, value]);

  useEffect(() => {
    if (!open) setQuery(selected?.name || "");
  }, [selected, open]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed ? options.filter((o) => o.name.toLowerCase().includes(trimmed)).slice(0, 100) : null;

  function handleSelect(opt) {
    onChange(opt);
    setOpen(false);
    inputRef.current?.blur();
  }

  function handleFocus() {
    if (disabled || loading) return;
    setOpen(true);
    setQuery("");
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery(selected?.name || "");
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div className="rk-input-wrap">
        {Icon && <Icon size={16} className="rk-input-icon" />}
        <input
          ref={inputRef}
          id={id}
          className="rk-field"
          style={fieldStyle}
          type="text"
          autoComplete="off"
          required={required}
          disabled={disabled || loading}
          value={open ? query : selected?.name || ""}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={loading ? loadingPlaceholder : placeholder}
        />
      </div>

      {open && !loading && !disabled && (
        <div className="rk-searchable-panel">
          {filtered ? (
            filtered.length ? (
              filtered.map((o) => (
                <button type="button" key={o.id} className="rk-searchable-option" onClick={() => handleSelect(o)}>
                  {o.name}
                </button>
              ))
            ) : (
              <div className="rk-searchable-empty">Tidak ditemukan.</div>
            )
          ) : (
            <>
              {topOptions.length > 0 && (
                <>
                  <div className="rk-searchable-section-label">{topLabel}</div>
                  {topOptions.map((o) => (
                    <button type="button" key={o.id} className="rk-searchable-option" onClick={() => handleSelect(o)}>
                      {o.name}
                    </button>
                  ))}
                  <div className="rk-searchable-section-label">Semua</div>
                </>
              )}
              {options.map((o) => (
                <button type="button" key={o.id} className="rk-searchable-option" onClick={() => handleSelect(o)}>
                  {o.name}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
