import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ─── Proxy / Middleware (Next.js 16) ─────────────────────────────
// Defesa em profundidade para rotas protegidas.
// Em Next.js 16, proxy.ts substituiu middleware.ts.

const PROTECTED_PREFIXES = ["/dashboard"];
const PUBLIC_EXACT = ["/login", "/register", "/register-from-invite", "/offline", "/"];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_EXACT.includes(pathname)) return true;

  if (pathname.startsWith("/jogadores/")) return true;
  if (pathname.startsWith("/matches/")) return true;
  if (pathname.startsWith("/vagas")) return true;
  if (pathname.startsWith("/test-location")) return true;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && !PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return true;
  }

  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname.startsWith("/icons/")) return true;
  if (pathname.startsWith("/uploads/")) return true;
  if (pathname.startsWith("/sw.js")) return true;

  return false;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect logged-in users away from login/register pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const needsAuth = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (needsAuth) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!token.teamId && !pathname.startsWith("/dashboard/settings")) {
      return NextResponse.redirect(new URL("/dashboard/settings", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|uploads|sw.js|manifest.webmanifest|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
