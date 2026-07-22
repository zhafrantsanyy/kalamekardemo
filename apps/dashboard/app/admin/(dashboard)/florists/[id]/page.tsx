import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import FloristAdminControls from "@/components/admin/FloristAdminControls";
import type { Florist } from "@/lib/types";

export default async function AdminFloristDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: floris } = await supabase.from("florists").select("*").eq("id", id).maybeSingle();
  if (!floris) notFound();

  return (
    <div style={{ display: "grid", gap: 20, maxWidth: 520 }}>
      <Link href="/admin/florists" className="dm-btn dm-btn-ghost" style={{ padding: "8px 14px", fontSize: 13, alignSelf: "start", textDecoration: "none" }}>
        <ChevronLeft size={15} /> Kembali
      </Link>

      <Card style={{ padding: 22 }}>
        <FloristAdminControls floris={floris as Florist} />
      </Card>
    </div>
  );
}
