import "server-only";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

interface LogAdminActionParams {
  action: string;
  entityType: "order" | "florist";
  entityId: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
}

// Dipanggil dari Route Handler admin (server, service role) setelah
// mutasi sukses — satu jejak lintas-entity untuk akuntabilitas override
// manual. before/after cuma berisi key yang benar-benar berubah, bukan
// seluruh baris (dibangun di caller).
export async function logAdminAction(admin: { id: string; email?: string }, params: LogAdminActionParams) {
  const client = createAdminClient();
  await client.from("admin_audit_log").insert({
    admin_id: admin.id,
    admin_email: admin.email || "unknown",
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId,
    before: params.before,
    after: params.after,
  });
}
