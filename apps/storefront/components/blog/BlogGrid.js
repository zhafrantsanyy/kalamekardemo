"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronRight, Compass } from "lucide-react";
import { BLOG_KATEGORI } from "@/lib/data/blog";

function formatTanggal(iso) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function EmptyState({ message }) {
  return (
    <div className="rk-card" style={{ padding: "36px 28px", textAlign: "center" }}>
      <span style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--rk-rose-soft)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <Compass size={21} color="var(--rk-maroon)" />
      </span>
      <p style={{ fontSize: 15, color: "var(--rk-ink)", fontWeight: 700, marginBottom: 6 }}>{message}</p>
      <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", maxWidth: 440, margin: "0 auto 18px", lineHeight: 1.55 }}>
        Sambil menunggu, jelajahi inspirasi bunga berdasarkan momen atau cari florist di kotamu.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/momen" className="rk-btn rk-btn-primary" style={{ padding: "11px 20px", fontSize: 13.5, textDecoration: "none" }}>
          Jelajahi Moments
        </Link>
        <Link href="/toko-bunga" className="rk-btn rk-btn-ghost" style={{ padding: "11px 20px", fontSize: 13.5, textDecoration: "none" }}>
          Cari Toko Bunga
        </Link>
      </div>
    </div>
  );
}

export default function BlogGrid({ posts }) {
  const [selected, setSelected] = useState("semua");

  const filtered = selected === "semua" ? posts : posts.filter((p) => p.kategori === selected);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
        <button
          type="button"
          onClick={() => setSelected("semua")}
          className="rk-quick-pill"
          style={selected === "semua" ? { background: "var(--rk-maroon)", borderColor: "var(--rk-maroon)", color: "#fff" } : undefined}
        >
          Semua
        </button>
        {BLOG_KATEGORI.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setSelected(k.id)}
            className="rk-quick-pill"
            style={selected === k.id ? { background: "var(--rk-maroon)", borderColor: "var(--rk-maroon)", color: "#fff" } : undefined}
          >
            {k.label}
          </button>
        ))}
      </div>

      {posts.length === 0 ? (
        <EmptyState message="Artikel akan segera hadir di sini" />
      ) : filtered.length === 0 ? (
        <EmptyState message="Belum ada artikel di kategori ini" />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {filtered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="rk-card" style={{ display: "block", padding: 20, textDecoration: "none" }}>
              <span className="rk-eyebrow" style={{ fontSize: 11 }}>
                {BLOG_KATEGORI.find((k) => k.id === post.kategori)?.label}
              </span>
              <div className="rk-serif" style={{ fontSize: 18, fontWeight: 700, color: "var(--rk-ink)", margin: "10px 0 6px" }}>
                {post.judul}
              </div>
              <p style={{ fontSize: 13.5, color: "var(--rk-ink-soft)", lineHeight: 1.55, marginBottom: 12 }}>{post.excerpt}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5, color: "var(--rk-ink-soft)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <Calendar size={12} /> {formatTanggal(post.tanggalPublish)}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--rk-maroon)", fontWeight: 700 }}>
                  Baca <ChevronRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
