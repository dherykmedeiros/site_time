"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Painel", icon: "⌂" },
  { href: "/squad", label: "Elenco", icon: "◉" },
  { href: "/matches", label: "Jogos", icon: "◍", badgeKey: "upcomingMatches" as const },
  { href: "/finances", label: "Finanças", icon: "◈" },
  { href: "/friendly-requests", label: "Amistosos", icon: "◎", badgeKey: "pendingRequests" as const },
  { href: "/team/settings", label: "Configurações", icon: "⋯" },
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
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-white/95 text-[#13453a] shadow-sm"
                  : "text-[#d7efe6] hover:bg-white/15 hover:text-white"
              } ${mobile ? "text-base" : ""}`}
              onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/10 text-xs">
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 && (
                <span className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#f8cf85] px-1.5 text-xs font-semibold text-[#4f2f00]">
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
    <div className="flex min-h-screen bg-transparent">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-shrink-0 border-r border-[#196a5a] bg-gradient-to-b from-[#0b6454] via-[#0d6f5e] to-[#09473c] md:block">
        <div className="flex h-20 items-center border-b border-white/15 px-6">
          <Link href="/" className="text-lg font-bold tracking-tight text-white">
            Site Time Studio
          </Link>
        </div>
        <p className="px-6 pt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#b9ded3]">
          Navegação
        </p>
        <nav className="mt-3 space-y-1 px-3">
          <NavLinks />
        </nav>
        <div className="absolute bottom-4 left-3 right-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/15 text-xs">↩</span>
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
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-[#196a5a] bg-gradient-to-b from-[#0b6454] via-[#0d6f5e] to-[#09473c] transition-transform duration-200 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/15 px-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Site Time Studio
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#d3eee5] hover:text-white"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>
        <p className="px-6 pt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#b9ded3]">
          Navegação
        </p>
        <nav className="mt-3 space-y-1 px-3">
          <NavLinks mobile />
        </nav>
        <div className="absolute bottom-4 left-3 right-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/15 text-xs">↩</span>
            Sair
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)]/95 px-4 backdrop-blur md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-[var(--text)] hover:text-[var(--brand)]"
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
          <Link href="/" className="text-lg font-bold text-[var(--brand)]">
            Site Time
          </Link>
          <div className="w-6" /> {/* Spacer for center alignment */}
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
