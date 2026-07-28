"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import AvatarUploadSection from "@/components/akun/pengaturan/AvatarUploadSection";
import AccountInfoForm from "@/components/akun/pengaturan/AccountInfoForm";
import SecurityForm from "@/components/akun/pengaturan/SecurityForm";
import NotificationPrefsForm from "@/components/akun/pengaturan/NotificationPrefsForm";
import AddressBookSection from "@/components/akun/pengaturan/AddressBookSection";

function SectionSkeleton() {
  return (
    <>
      <div className="rk-skeleton" style={{ height: 14, width: "40%" }} />
      <div className="rk-skeleton" style={{ height: 40, marginTop: 12 }} />
    </>
  );
}

export default function PengaturanClient({ userId, email }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function load() {
      const [{ data: profile }, { data: addresses }] = await Promise.all([
        supabase.from("profiles").select("nama, phone, wa, avatar_url, notif_wa").eq("id", userId).maybeSingle(),
        supabase
          .from("addresses")
          .select("*")
          .eq("user_id", userId)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false }),
      ]);
      if (active) setData({ profile: profile || {}, addresses: addresses || [] });
    }

    load();
    return () => {
      active = false;
    };
  }, [userId]);

  if (!data) {
    return (
      <>
        <section className="rk-settings-section"><SectionSkeleton /></section>
        <section className="rk-settings-section"><SectionSkeleton /></section>
        <section className="rk-settings-section"><SectionSkeleton /></section>
      </>
    );
  }

  const { profile, addresses } = data;

  return (
    <>
      <section className="rk-settings-section">
        <h2 className="rk-settings-title">Foto Profil</h2>
        <AvatarUploadSection userId={userId} nama={profile.nama} avatarUrl={profile.avatar_url} />
      </section>

      <section className="rk-settings-section">
        <h2 className="rk-settings-title">Informasi Akun</h2>
        <AccountInfoForm userId={userId} email={email} nama={profile.nama} phone={profile.phone || profile.wa} />
      </section>

      <section className="rk-settings-section">
        <h2 className="rk-settings-title">Keamanan</h2>
        <SecurityForm />
      </section>

      <section className="rk-settings-section">
        <h2 className="rk-settings-title">Preferensi Notifikasi</h2>
        <NotificationPrefsForm userId={userId} notifWa={profile.notif_wa ?? true} />
      </section>

      <section className="rk-settings-section">
        <h2 className="rk-settings-title">Alamat Tersimpan</h2>
        <AddressBookSection userId={userId} initialAddresses={addresses} />
      </section>
    </>
  );
}
