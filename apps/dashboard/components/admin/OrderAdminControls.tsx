"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, MessageCircle, Wallet } from "lucide-react";
import { rupiah } from "@kalamekar/shared/catalog";
import { ALL_STATUSES, STATUS_LABEL } from "@/lib/orderFlow";
import type { OrderStatus } from "@/lib/orderFlow";
import type { Florist, Order } from "@/lib/types";
import { orderValue, computeCommission } from "@/lib/payout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

async function patchOrder(orderId: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/admin/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Gagal menyimpan perubahan.");
  return json;
}

interface OrderAdminControlsProps {
  orderId: string;
  currentStatus: OrderStatus;
  currentFloristId: string | null;
  currentNotes: string;
  florists: Pick<Florist, "id" | "nama" | "area" | "wa">[];
  buyerWaLink: string | null;
  floristWaLink: string | null;
  payoutOrder: Pick<Order, "product_type" | "subtotal" | "total" | "harga_final">;
  currentCommissionRate: number;
  currentPayoutStatus: "belum_dibayar" | "dibayar";
  currentCommissionAmount: number | null;
  currentPayoutAmount: number | null;
  currentPayoutPaidAt: string | null;
}

export default function OrderAdminControls({
  orderId,
  currentStatus,
  currentFloristId,
  currentNotes,
  florists,
  buyerWaLink,
  floristWaLink,
  payoutOrder,
  currentCommissionRate,
  currentPayoutStatus,
  currentCommissionAmount,
  currentPayoutAmount,
  currentPayoutPaidAt,
}: OrderAdminControlsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [floristId, setFloristId] = useState(currentFloristId || "");
  const [notes, setNotes] = useState(currentNotes);
  const [commissionRate, setCommissionRate] = useState(String(currentCommissionRate));
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");

  const value = orderValue(payoutOrder);
  const rate = Number(commissionRate) || 0;
  const preview = value != null ? computeCommission(value, rate) : null;
  const isPaid = currentPayoutStatus === "dibayar";

  async function run(key: string, body: Record<string, unknown>) {
    setErr("");
    setBusy(key);
    try {
      await patchOrder(orderId, body);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {waButtons(buyerWaLink, floristWaLink)}

      <Card style={{ padding: 22, display: "grid", gap: 12 }}>
        <div style={{ fontWeight: 800, color: "var(--dm-magenta)" }}>Status order</div>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="dm-input" style={{ flex: 1 }} value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <Button disabled={busy !== null} onClick={() => run("status", { status })} style={{ whiteSpace: "nowrap" }}>
            {busy === "status" ? "Menyimpan…" : "Update"}
          </Button>
        </div>
      </Card>

      <Card style={{ padding: 22, display: "grid", gap: 12 }}>
        <div style={{ fontWeight: 800, color: "var(--dm-magenta)" }}>Assign floris</div>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="dm-input" style={{ flex: 1 }} value={floristId} onChange={(e) => setFloristId(e.target.value)}>
            <option value="">Belum di-assign</option>
            {florists.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nama} {f.area ? `— ${f.area}` : ""}
              </option>
            ))}
          </select>
          <Button
            disabled={busy !== null}
            onClick={() => run("floris", { floris_id: floristId || null })}
            style={{ whiteSpace: "nowrap" }}
          >
            {busy === "floris" ? "Menyimpan…" : "Assign"}
          </Button>
        </div>
      </Card>

      <Card style={{ padding: 22, display: "grid", gap: 12 }}>
        <div style={{ fontWeight: 800, color: "var(--dm-magenta)" }}>Catatan internal</div>
        <textarea
          className="dm-input"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Catatan buat tim internal, tidak terlihat pembeli/floris…"
        />
        <Button disabled={busy !== null} onClick={() => run("notes", { internal_notes: notes })} style={{ justifySelf: "start" }}>
          <Save size={15} /> {busy === "notes" ? "Menyimpan…" : "Simpan catatan"}
        </Button>
      </Card>

      <Card style={{ padding: 22, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, color: "var(--dm-magenta)" }}>Komisi & payout</div>
          <span
            className="dm-badge"
            style={{
              background: isPaid ? "var(--dm-status-selesai-bg)" : "var(--dm-status-matching-bg)",
              color: isPaid ? "var(--dm-status-selesai-fg)" : "var(--dm-status-matching-fg)",
            }}
          >
            {isPaid ? "Sudah dibayar" : "Belum dibayar"}
          </span>
        </div>

        <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--dm-ink-soft)" }}>Nilai order</span>
            <span style={{ fontWeight: 700 }}>{value != null ? rupiah(value) : "Menunggu harga final"}</span>
          </div>
          {isPaid ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--dm-ink-soft)" }}>Komisi platform ({currentCommissionRate}%)</span>
                <span style={{ fontWeight: 700 }}>{rupiah(currentCommissionAmount ?? 0)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--dm-ink-soft)" }}>Payout ke floris</span>
                <span style={{ fontWeight: 700, color: "var(--dm-magenta)" }}>{rupiah(currentPayoutAmount ?? 0)}</span>
              </div>
              {currentPayoutPaidAt && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--dm-ink-soft)" }}>Dibayar</span>
                  <span>{new Date(currentPayoutPaidAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
              )}
            </>
          ) : (
            preview && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--dm-ink-soft)" }}>Komisi platform (preview)</span>
                  <span style={{ fontWeight: 700 }}>{rupiah(preview.commission)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--dm-ink-soft)" }}>Payout ke floris (preview)</span>
                  <span style={{ fontWeight: 700, color: "var(--dm-magenta)" }}>{rupiah(preview.payout)}</span>
                </div>
              </>
            )
          )}
        </div>

        {!isPaid && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label className="dm-label">Rate komisi (%)</label>
              <input
                className="dm-input"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
              />
            </div>
            <Button disabled={busy !== null} onClick={() => run("commission_rate", { commission_rate: rate })} variant="ghost" style={{ whiteSpace: "nowrap" }}>
              {busy === "commission_rate" ? "Menyimpan…" : "Simpan rate"}
            </Button>
          </div>
        )}

        <Button
          disabled={busy !== null || (!isPaid && (!currentFloristId || value == null))}
          onClick={() =>
            run("payout", isPaid ? { payout_status: "belum_dibayar" } : { payout_status: "dibayar", commission_rate: rate })
          }
          variant={isPaid ? "danger-ghost" : "primary"}
          style={{ justifySelf: "start" }}
        >
          <Wallet size={15} /> {busy === "payout" ? "Menyimpan…" : isPaid ? "Batalkan pembayaran" : "Tandai sudah dibayar"}
        </Button>
        {!isPaid && !currentFloristId && (
          <p style={{ fontSize: 11.5, color: "var(--dm-ink-soft)" }}>Assign floris dulu sebelum menandai dibayar.</p>
        )}
      </Card>

      {err && <p style={{ fontSize: 13, color: "#a13d3d", fontWeight: 600 }}>{err}</p>}
    </div>
  );
}

function waButtons(buyerWaLink: string | null, floristWaLink: string | null) {
  if (!buyerWaLink && !floristWaLink) return null;
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {buyerWaLink && (
        <a href={buyerWaLink} target="_blank" rel="noreferrer" className="dm-btn dm-btn-dark" style={{ padding: "10px 16px", fontSize: 13 }}>
          <MessageCircle size={15} /> WhatsApp Pembeli
        </a>
      )}
      {floristWaLink && (
        <a href={floristWaLink} target="_blank" rel="noreferrer" className="dm-btn dm-btn-ghost" style={{ padding: "10px 16px", fontSize: 13 }}>
          <MessageCircle size={15} /> WhatsApp Floris
        </a>
      )}
    </div>
  );
}
