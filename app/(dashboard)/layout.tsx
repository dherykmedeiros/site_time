"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Início", icon: "🏠" },
  { href: "/squad", label: "Elenco", icon: "👥" },
  { href: "/matches", label: "Jogos", icon: "⚽", badgeKey: "upcomingMatches" as const },
  { href: "/finances", label: "Finanças", icon: "💰" },
  { href: "/friendly-requests", label: "Amistosos", icon: "🤝", badgeKey: "pendingRequests" as const },
  { href: "/team/settings", label: "Configurações", icon: "⚙️" },
];

interface BadgeCounts {
  pendingRequests: number;
  upcomingMatches: number;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [badges, setBadges] = useState<BadgeCounts>({
    pendingRequests: 0,
    upcomingMatches: 0,
  });

  useEffect(() => {
    async function loadBadges() {
      try {
        const [frRes, matchRes] = await Promise.all([
          fetch("/api/friendly-requests?status=PENDING").catch(() => null),
          fetch("/api/matches?status=SCHEDULED").catch(() => null),
        ]);

        let pendingRequests = 0;
        let upcomingMatches = 0;

        if (frRes?.ok) {
          const data = await frRes.json();
          pendingRequests = Array.isArray(data.requests) ? data.requests.length : 0;
        }

        if (matchRes?.ok) {
          const data = await matchRes.json();
          const now = new Date();
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          const matches = Array.isArray(data.matches) ? data.matches : [];
          upcomingMatches = matches.filter((m: { date: string }) => {
            const d = new Date(m.date);
            return d >= now && d <= weekFromNow;
          }).length;
        }

        setBadges({ pendingRequests, upcomingMatches });
      } catch {
        // silently ignore badge loading errors
      }
    }
    loadBadges();
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  function NavLinks({ mobile = false }: { mobile?: boolean }) {
    return (
      <>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              } ${mobile ? "text-base" : ""}`}
              onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 && (
                <span className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white md:block">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href="/" className="text-lg font-bold text-blue-600">
            Site Time
          </Link>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          <NavLinks />
        </nav>
        <div className="absolute bottom-4 left-3 right-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span>🚪</span>
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <Link
            href="/"
            className="text-lg font-bold text-blue-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            Site Time
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          <NavLinks mobile />
        </nav>
        <div className="absolute bottom-4 left-3 right-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span>🚪</span>
            Sair
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Abrir menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link href="/" className="text-lg font-bold text-blue-600">
            Site Time
          </Link>
          <div className="w-6" /> {/* Spacer for center alignment */}
        </header>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
