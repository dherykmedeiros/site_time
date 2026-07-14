"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NotificationCenter from "./NotificationCenter";

const navItems = [
  { href: "/dashboard", label: "Painel", icon: "⌂" },
  { href: "/dashboard/messages", label: "Avisos", icon: "📢" },
  { href: "/dashboard/squad", label: "Elenco", icon: "👥" },
  { href: "/dashboard/squad/mensalidade", label: "Mensalidade", icon: "💰", adminOnly: true },
  { href: "/dashboard/matches", label: "Jogos", icon: "⚽", badgeKey: "upcomingMatches" as const },
  { href: "/dashboard/gallery", label: "Galeria", icon: "📸" },
  { href: "/dashboard/polls", label: "Enquetes", icon: "📊" },
  { href: "/dashboard/seasons", label: "Temporadas", icon: "🏆", adminOnly: true },
  { href: "/dashboard/ranking", label: "Ranking", icon: "🏅" },
  { href: "/dashboard/finances", label: "Finanças", icon: "💳" },
  { href: "/dashboard/fines", label: "Punições", icon: "⚖️" },
  { href: "/dashboard/rules", label: "Regras", icon: "📋" },
  { href: "/dashboard/evaluations", label: "Avaliações", icon: "📈", adminOnly: true },
  { href: "/dashboard/equipment", label: "Equipamentos", icon: "👕" },
  {
    href: "/dashboard/friendly-requests",
    label: "Amistosos",
    icon: "🤝",
    badgeKey: "pendingRequests" as const,
    adminOnly: true,
  },
  { href: "/dashboard/team/settings", label: "Configurações", icon: "⚙", adminOnly: true },
];

interface BadgeCounts {
  pendingRequests: number;
  upcomingMatches: number;
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, update } = useSession();
  const mustChangePassword = session?.user?.mustChangePassword;

  // State for password change form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(data.error || "Erro ao alterar a senha.");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Senha alterada com sucesso! Atualizando...");
      await update();
    } catch (err) {
      setErrorMessage("Erro de rede ao alterar a senha.");
      setIsSubmitting(false);
    }
  };
  const role = session?.user?.role;
  const isAdmin = role === "ADMIN";

  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [badges, setBadges] = useState<BadgeCounts>({
    pendingRequests: 0,
    upcomingMatches: 0,
  });
  const [monthlyFeesEnabled, setMonthlyFeesEnabled] = useState(true);

  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Smooth micro-animated page transition bar
  useEffect(() => {
    setTransitioning(true);
    setProgress(15);

    const t1 = setTimeout(() => setProgress(45), 60);
    const t2 = setTimeout(() => setProgress(80), 150);
    const t3 = setTimeout(() => {
      setProgress(100);
      const t4 = setTimeout(() => {
        setTransitioning(false);
        setProgress(0);
      }, 150);
    }, 280);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  useEffect(() => {
    if (!session) return;

    async function loadBadges() {
      try {
        const isAdmin = session?.user?.role === "ADMIN";
        const [frRes, matchRes] = await Promise.all([
          isAdmin ? fetch("/api/friendly-requests?status=PENDING").catch(() => null) : null,
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

    // Poll every 60 seconds
    const interval = setInterval(loadBadges, 60000);
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    if (!session) return;
    async function loadTeamConfig() {
      try {
        const res = await fetch("/api/teams");
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.monthlyFeesEnabled === "boolean") {
            setMonthlyFeesEnabled(data.monthlyFeesEnabled);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar configuracao do time na sidebar", err);
      }
    }
    loadTeamConfig();
  }, [session, pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const visibleNavItems = navItems.filter((item) => {
    if (item.href === "/dashboard/squad/mensalidade" && !monthlyFeesEnabled) {
      return false;
    }
    if (item.href === "/dashboard/finances") {
      return role === "ADMIN" || role === "MATERIAL_DIRECTOR";
    }
    if (!item.adminOnly) return true;
    if (item.href === "/dashboard/team/settings") {
      return role === "ADMIN";
    }
    return role === "ADMIN" || role === "COACH";
  });

  const activeItem = (() => {
    const exact = visibleNavItems.find((item) => pathname === item.href);
    if (exact) return exact;

    let bestMatch = null;
    let longestPrefixLength = 0;

    for (const item of visibleNavItems) {
      if (item.href === "/dashboard") continue;
      if (pathname.startsWith(item.href + "/") || pathname === item.href) {
        if (item.href.length > longestPrefixLength) {
          bestMatch = item;
          longestPrefixLength = item.href.length;
        }
      }
    }

    return bestMatch || visibleNavItems.find((item) => item.href === "/dashboard") || visibleNavItems[0] || navItems[0];
  })();

  const todayLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

  function NavLinks({ mobile = false }: { mobile?: boolean }) {
    return (
      <>
        {visibleNavItems.map((item) => {
          const isActive = activeItem.href === item.href;
          const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
          const isCollapsed = !mobile && collapsed;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={isActive ? "page" : undefined}
              title={isCollapsed ? item.label : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[var(--brand-soft)] text-[var(--brand)] border-l-4 border-[var(--brand)] font-serif"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"
              } ${isCollapsed ? "justify-center px-2" : ""} ${mobile ? "text-base" : ""}`}
              onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
            >
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-sm shrink-0 transition-transform group-hover:scale-110 duration-200 ${isActive ? "text-[var(--brand)]" : "text-[var(--text-muted)] group-hover:text-[var(--text)]"}`}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="flex-1 transition-opacity duration-300 tracking-tight">{item.label}</span>}
              {!isCollapsed && badgeCount > 0 && (
                <span
                  className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#ef4444] px-1.5 text-[9px] font-black text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                  aria-label={`${badgeCount} pendente${badgeCount !== 1 ? "s" : ""}`}
                >
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </>
    );
  }

  if (mustChangePassword) {
    return (
      <div data-theme="dark" className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020506]/90 backdrop-blur-xl p-4">
        {/* Decorative Glow Elements */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[var(--brand)] opacity-10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[var(--brand-neon)] opacity-5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md rounded-[24px] border border-[rgba(16,185,129,0.15)] bg-[rgba(10,24,20,0.6)] p-6 sm:p-8 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-6">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] text-2xl mb-4">
              🔒
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-white font-serif">
              Alteração de Senha Obrigatória
            </h2>
            <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
              Sua senha foi resetada pela administração. Para sua segurança, defina uma nova senha de acesso antes de continuar.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {errorMessage && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-semibold text-red-400">
                ⚠️ {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] p-3 text-xs font-semibold text-[var(--brand)]">
                ✓ {successMessage}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-subtle)] mb-1.5">
                Nova Senha
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[var(--brand)] focus:outline-none transition duration-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-subtle)] mb-1.5">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="Repita a nova senha"
                className="w-full rounded-xl border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[var(--brand)] focus:outline-none transition duration-200"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#10b981] hover:bg-[#34d399] px-4 py-3 text-xs font-black uppercase tracking-widest text-[#010403] disabled:opacity-50 transition duration-200 cursor-pointer text-center"
              >
                {isSubmitting ? "Salvando..." : "Salvar Nova Senha"}
              </button>
              
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full rounded-xl border border-[var(--border)] hover:bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--text-muted)] transition duration-200 cursor-pointer text-center"
              >
                Sair da Conta
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div data-theme="dark" className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      {/* Premium Top-Loading Progress Bar */}
      {transitioning && (
        <div
          className="fixed top-0 left-0 z-[9999] h-[3.5px] bg-gradient-to-r from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand-neon)] transition-all duration-200 ease-out pointer-events-none shadow-[0_1px_10px_var(--brand)]"
          style={{ width: `${progress}%` }}
        />
      )}
      <a
        href="#dashboard-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--brand)] focus:px-3 focus:py-2 focus:text-xs focus:font-black focus:text-[var(--bg)]"
      >
        Ir para o conteúdo principal
      </a>

      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--brand)] opacity-5 rounded-full blur-[130px] pointer-events-none" />

      <div className="flex min-h-screen">
        {/* Desktop Sidebar (Translúcida com borda neon fina) */}
        <aside
          className={`hidden h-screen flex-shrink-0 border-r border-[var(--border)] bg-[var(--bg-elevated)]/90 backdrop-blur-2xl md:sticky md:top-0 md:flex md:flex-col transition-all duration-300 ease-in-out shadow-lg ${
            collapsed ? "w-20" : "w-80"
          }`}
        >
          <div className="border-b border-[var(--border)] px-5 py-6 flex items-center justify-between">
            <Link href="/dashboard" prefetch={false} className="inline-flex items-center gap-3 text-[var(--text)] overflow-hidden">
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] text-xl shrink-0">
                ⚽
              </span>
              {!collapsed && (
                <span className="transition-all duration-300 whitespace-nowrap">
                  <strong className="block text-lg font-black tracking-tight uppercase bg-gradient-to-r from-[var(--text)] to-[var(--brand)] bg-clip-text text-transparent">VARzea</strong>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--text-subtle)]">
                    DIRETORIA DE ELITE
                  </span>
                </span>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] hover:bg-[var(--brand-soft)]/50 hover:border-[var(--brand)]/30 text-[var(--text-muted)] hover:text-[var(--text)] transition-all cursor-pointer"
              title={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              {collapsed ? "»" : "«"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3.5 py-6">
            {!collapsed && (
              <p className="px-3.5 text-[9px] font-black uppercase tracking-[0.25em] text-[var(--text-subtle)] transition-opacity duration-300">
                Menu de Operações
              </p>
            )}
            <nav className={`space-y-1 ${!collapsed ? "mt-4" : ""}`}>
              <NavLinks />
            </nav>
          </div>

          <div className="border-t border-[var(--border)] px-4 py-4">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={`flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-3 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-all cursor-pointer ${
                collapsed ? "w-full justify-center px-2" : "w-full"
              }`}
              title={collapsed ? "Sair" : undefined}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/5 text-xs shrink-0">🚪</span>
              {!collapsed && <span className="tracking-tight">Sair da Sessão</span>}
            </button>
          </div>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile sidebar drawer */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-[var(--border)] bg-[var(--bg-elevated)] backdrop-blur-3xl transition-transform duration-250 ease-out md:hidden ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-[var(--border)] px-6">
            <span className="text-xl font-black uppercase tracking-wider text-[var(--text)]">VARzea</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text)] text-lg cursor-pointer"
              aria-label="Fechar menu"
            >
              ✕
            </button>
          </div>
          <p className="px-6 pt-6 text-[9px] font-black uppercase tracking-[0.25em] text-[var(--text-subtle)]">
            Navegação Geral
          </p>
          <nav className="mt-4 space-y-1 px-3">
            <NavLinks mobile />
          </nav>
          <div className="absolute bottom-4 left-3 right-3">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-3 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-all cursor-pointer"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/5 text-xs">🚪</span>
              Sair da Sessão
            </button>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile header */}
          <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)]/90 px-4 backdrop-blur-xl md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-1.5 text-[var(--text)] hover:bg-[var(--bg-elevated)]"
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
            <span className="text-base font-black uppercase tracking-widest text-[var(--brand)] font-serif">VARzea</span>
            <NotificationCenter />
          </header>

          {/* Desktop page header */}
          <header className="hidden border-b border-[var(--border)] bg-[var(--bg-elevated)]/60 px-8 py-5.5 backdrop-blur-md md:block">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                  {todayLabel}
                </p>
                <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-[var(--text)] font-serif">{activeItem.label}</h1>
              </div>
              <div className="flex items-center gap-4">
                <NotificationCenter />
                <div className="rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--brand)]">
                  Operação de Elite VARzea
                </div>
              </div>
            </div>
          </header>

          {/* Main content with modern scrolling */}
          <main id="dashboard-main-content" className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-300">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
