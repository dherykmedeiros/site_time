"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Painel", icon: "⌂" },
  { href: "/squad", label: "Elenco", icon: "◉" },
    { href: "/squad/mensalidade", label: "Mensalidade", icon: "💰" },
  { href: "/matches", label: "Jogos", icon: "◍", badgeKey: "upcomingMatches" as const },
  { href: "/seasons", label: "Temporadas", icon: "🏆" },
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

  const activeItem =
    navItems.find(
      (item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
    ) || navItems[0];

  const todayLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

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
    <div className="min-h-screen bg-transparent">
      <a
        href="#dashboard-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0b4b3f]"
      >
        Ir para o conteudo principal
      </a>

      <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-80 flex-shrink-0 border-r border-[#196a5a] bg-gradient-to-b from-[#0a584b] via-[#0b6555] to-[#083d34] md:sticky md:top-0 md:flex md:flex-col">
        <div className="border-b border-white/15 px-6 py-6">
          <Link href="/" className="inline-flex items-center gap-3 text-white">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-xl">
              ⚽
            </span>
            <span>
              <strong className="block text-lg font-bold tracking-tight">Site Time Studio</strong>
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-[#cde7df]">
                Area administrativa
              </span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#b9ded3]">
            Navegacao
          </p>
          <nav className="mt-3 space-y-1">
            <NavLinks />
          </nav>
        </div>

        <div className="border-t border-white/15 px-3 py-4">
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
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-[#196a5a] bg-gradient-to-b from-[#0a584b] via-[#0b6555] to-[#083d34] transition-transform duration-200 md:hidden ${
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
            className="rounded-lg p-1 text-[var(--text)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
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
          <div className="w-6" />
        </header>

        {/* Desktop page header */}
        <header className="hidden border-b border-[var(--border)] bg-white/70 px-8 py-5 backdrop-blur md:block">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                {todayLabel}
              </p>
              <h1 className="mt-1 text-2xl font-bold text-[var(--text)]">{activeItem.label}</h1>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--text-muted)] shadow-[var(--shadow-sm)]">
              Gestao centralizada do seu time
            </div>
          </div>
        </header>

        {/* Main content */}
        <main id="dashboard-main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
      </div>
    </div>
  );
}
