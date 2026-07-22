import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

  const { pathname, search } = request.nextUrl;

  const redirectToMasuk = () => {
    const url = request.nextUrl.clone();
    url.pathname = "/masuk";
    url.search = "";
    // Sertakan query string asli (mis. ?composition_id=... dari builder,
    // lihat /keranjang/tambah) supaya tidak hilang setelah login.
    url.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(url);
  };

  // Panel admin dinonaktifkan sementara di storefront — akan dipindah ke
  // workspace dashboard/ (lihat rencana migrasi). Kode /admin dibiarkan
  // utuh untuk referensi, hanya aksesnya yang ditutup di sini.
  if (pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!user) {
    return redirectToMasuk();
  }

  if (pathname.startsWith("/mitra")) {
    const { data: floris } = await supabase
      .from("florists")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!floris) {
      return redirectToMasuk();
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/akun/:path*", "/mitra/:path*", "/admin/:path*", "/keranjang/:path*", "/checkout/:path*"],
};
