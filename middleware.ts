import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ─── Middleware (T011) ─────────────────────────────────────
// Camada de defesa em profundidade para rotas protegidas.
// As APIs possuem seus próprios checks de auth nos handlers,
// mas o middleware garante que rotas de dashboard nunca sejam
// acessadas sem autenticação.

// Rotas que EXIGEM autenticação
const PROTECTED_PREFIXES = ["/dashboard"];

// Rotas públicas explícitas (nunca bloqueadas pelo middleware)
const PUBLIC_EXACT = ["/login", "/register", "/register-from-invite", "/offline", "/"];

function isPublicRoute(pathname: string): boolean {
  // Exact matches
  if (PUBLIC_EXACT.includes(pathname)) return true;

  // Public page patterns
  if (pathname.startsWith("/jogadores/")) return true;
  if (pathname.startsWith("/matches/")) return true;
  if (pathname.startsWith("/vagas")) return true;
  if (pathname.startsWith("/test-location")) return true;

  // Public team portal (single slug, e.g. /my-team)
  // This pattern matches /<slug> but NOT /dashboard or other known paths
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && !PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return true;
  }

  // All API routes are handled by their own auth checks
  if (pathname.startsWith("/api/")) return true;

  // Static files and Next.js internals
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname.startsWith("/icons/")) return true;
  if (pathname.startsWith("/uploads/")) return true;
  if (pathname.startsWith("/sw.js")) return true;

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const needsAuth = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (needsAuth) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // No valid token — redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // User must change password — redirect to change-password (unless already there)
    if (token.mustChangePassword && !pathname.startsWith("/dashboard/change-password")) {
      return NextResponse.redirect(new URL("/dashboard/change-password", request.url));
    }

    // User has no team — redirect to onboarding or show error
    // (allow access to settings pages so they can join a team)
    if (!token.teamId && !pathname.startsWith("/dashboard/settings") && !pathname.startsWith("/dashboard/change-password")) {
      return NextResponse.redirect(new URL("/dashboard/settings", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files
    "/((?!_next/static|_next/image|favicon.ico|icons|uploads|sw.js|manifest.webmanifest|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
