import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authCookie = req.cookies.get("auth");

  // Login sayfasını hariç tut
  if (req.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  // Eğer auth cookie yoksa veya değeri "authenticated" değilse login'e yönlendir
  if (!authCookie || authCookie.value !== "authenticated") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Cookie doğruysa isteği olduğu gibi devam ettir
  return NextResponse.next();
}

// Middleware'in çalışacağı rotaları tanımla
export const config = {
  matcher: "/", // Tüm rotalara uygula
};
