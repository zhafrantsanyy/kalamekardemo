import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Wajib panggil getUser() (bukan getSession()) supaya token direfresh
  // dan tervalidasi ke server Supabase, bukan cuma dibaca dari cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const redirectTo = (loginPath: string) => {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  };

  if (pathname === "/mitra/masuk" || pathname === "/admin/login") {
    return supabaseResponse;
  }

  if (!user) {
    return redirectTo(pathname.startsWith("/admin") ? "/admin/login" : "/mitra/masuk");
  }

  // Model peran struktural: florist = ada baris di `florists` untuk user
  // ini. Fungsi generik requireRole() dipakai di Route Handler; di sini
  // dicek inline karena middleware jalan di Edge runtime.
  if (pathname.startsWith("/mitra")) {
    const { data: floris } = await supabase
      .from("florists")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!floris) {
      return redirectTo("/mitra/masuk");
    }
  }

  // Model peran admin: klaim di app_metadata (JWT), bukan query tabel —
  // sama asumsi dengan requireRole("admin") di lib/auth/requireRole.ts.
  if (pathname.startsWith("/admin")) {
    if (user.app_metadata?.role !== "admin") {
      return redirectTo("/admin/login");
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/mitra/:path*", "/admin/:path*"],
};
