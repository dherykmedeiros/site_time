"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState, useRef, useMemo } from "react";
import NotificationCenter from "./NotificationCenter";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { Permission, Role, hasPermission, hasAnyPermission } from "@/lib/permissions";
import {
  LayoutDashboard, Home,
  Trophy, CalendarDays, Calendar, Award, PenTool,
  Users, UserCircle, ClipboardCheck, BarChart3,
  MessageSquare, Megaphone, Vote, Image as ImageIcon,
  Wallet, DollarSign, CreditCard, Gavel,
  Package, Shirt,
  Settings, Handshake, FileBarChart, FileText, BookOpen, Cog,
  Search, ChevronRight, Menu, X, Plus, LogOut
} from "lucide-react";

interface BadgeCounts {
  pendingRequests: number;
  upcomingMatches: number;
  overdueFees: number;
  lowStockEquipment: number;
}

interface NavItem {
  href: string;
  label: string;
  icon: any;
  permission?: Permission;
  badgeKey?: keyof BadgeCounts;
  exactMatch?: boolean;
}

interface NavGroup {
  id: string;
  label: string;
  icon: any;
  items: NavItem[];
  permission?: Permission;
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "overview",
    label: "Visão Geral",
    icon: LayoutDashboard,
    items: [
      { href: "/dashboard", label: "Painel", icon: Home, exactMatch: true }
    ]
  },
  {
    id: "football",
    label: "Futebol",
    icon: Trophy,
    items: [
      { href: "/dashboard/matches", label: "Jogos", icon: CalendarDays, badgeKey: "upcomingMatches" },
      { href: "/dashboard/coach-reports", label: "Relatórios dos Treinadores", icon: FileText },
      { href: "/dashboard/slots", label: "Vagas & Desafios", icon: Handshake },
      { href: "/dashboard/calendar", label: "Calendário", icon: Calendar },
      { href: "/dashboard/seasons", label: "Temporadas", icon: Award, permission: "season:manage" },
      { href: "/dashboard/tactical-plays", label: "Prancheta Tática", icon: PenTool, permission: "tactical:view" }
    ]
  },
  {
    id: "squad",
    label: "Elenco",
    icon: Users,
    items: [
      { href: "/dashboard/squad", label: "Jogadores", icon: UserCircle },
      { href: "/dashboard/evaluations", label: "Avaliações", icon: ClipboardCheck },
      { href: "/dashboard/ranking", label: "Rankings e Estatísticas", icon: BarChart3 },
      { href: "/dashboard/me", label: "Meu Perfil", icon: UserCircle }
    ]
  },
  {
    id: "communication",
    label: "Comunicação",
    icon: MessageSquare,
    items: [
      { href: "/dashboard/messages", label: "Avisos", icon: Megaphone },
      { href: "/dashboard/polls", label: "Enquetes", icon: Vote },
      { href: "/dashboard/gallery", label: "Galeria", icon: ImageIcon }
    ]
  },
  {
    id: "finance",
    label: "Financeiro",
    icon: Wallet,
    items: [
      { href: "/dashboard/finances", label: "Visão Financeira", icon: DollarSign, permission: "finance:view" },
      { href: "/dashboard/squad/mensalidade", label: "Mensalidades", icon: CreditCard, permission: "finance:manage" },
      { href: "/dashboard/fines", label: "Multas", icon: Gavel }
    ]
  },
  {
    id: "equipment",
    label: "Patrimônio",
    icon: Package,
    items: [
      { href: "/dashboard/equipment", label: "Equipamentos", icon: Shirt }
    ]
  },
  {
    id: "management",
    label: "Gestão",
    icon: Settings,
    permission: "team:view",
    items: [
      { href: "/dashboard/approvals", label: "Central de Pendências", icon: ClipboardCheck, permission: "team:manage", badgeKey: "pendingRequests" },
      { href: "/dashboard/friendly-requests", label: "Amistosos", icon: Handshake, permission: "friendly_request:manage" },
      { href: "/dashboard/reports", label: "Relatórios", icon: FileBarChart, permission: "report:view" },
      { href: "/dashboard/rules", label: "Regulamento", icon: BookOpen },
      { href: "/dashboard/team/settings", label: "Configurações", icon: Cog, permission: "team:manage" }
    ]
  }
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const mustChangePassword = session?.user?.mustChangePassword;
  const role = session?.user?.role as Role | undefined;

  // States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [monthlyFeesEnabled, setMonthlyFeesEnabled] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [badges, setBadges] = useState<BadgeCounts>({
    pendingRequests: 0,
    upcomingMatches: 0,
    overdueFees: 0,
    lowStockEquipment: 0
  });
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Transition bar
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
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [pathname]);

  // Load preferences
  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebar-collapsed");
    if (savedCollapsed !== null) setCollapsed(savedCollapsed === "true");

    const savedGroups = localStorage.getItem("sidebar-groups");
    if (savedGroups) {
      try { setExpandedGroups(JSON.parse(savedGroups)); } catch {}
    }
  }, []);

  // Close mobile menu on navigate
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchQuery("");
  }, [pathname]);

  // Badges & Settings logic
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

        setBadges(prev => ({ ...prev, pendingRequests, upcomingMatches }));
      } catch {}
    }
    loadBadges();
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
      } catch {}
    }
    loadTeamConfig();
  }, [session, pathname]);

  // Navigation Filter
  const filteredGroups = useMemo(() => {
    if (!role) return [];

    return NAV_GROUPS.map(group => {
      if (group.id === "finance") {
        if (!hasAnyPermission(role, ["finance:view", "finance:view_own"])) return null;
      } else if (group.permission && !hasPermission(role, group.permission)) {
        return null;
      }

      const visibleItems = group.items.filter(item => {
        if (item.href === "/dashboard/squad/mensalidade" && !monthlyFeesEnabled) return false;
        if (item.permission && !hasPermission(role, item.permission)) return false;
        return true;
      }).map(item => {
        if (item.href === "/dashboard/evaluations" && role === "PLAYER" && !hasPermission(role, "evaluation:create" as Permission)) {
          return { ...item, label: "Meu Feedback" };
        }
        return item;
      });

      if (visibleItems.length === 0) return null;
      return { ...group, items: visibleItems };
    }).filter(Boolean) as NavGroup[];
  }, [role, monthlyFeesEnabled]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return filteredGroups.flatMap(g => g.items.filter(i => i.label.toLowerCase().includes(q)));
  }, [searchQuery, filteredGroups]);

  // Auto-expand active group
  const lastActivePath = useRef<string>("");
  useEffect(() => {
    if (pathname === lastActivePath.current || !role || filteredGroups.length === 0) return;
    lastActivePath.current = pathname;

    const activeGroup = filteredGroups.find(g =>
      g.items.some(i => i.exactMatch ? pathname === i.href : (pathname.startsWith(i.href + "/") || pathname === i.href))
    );

    if (activeGroup) {
      setExpandedGroups(prev => {
        if (prev[activeGroup.id]) return prev;
        const next = { ...prev, [activeGroup.id]: true };
        localStorage.setItem("sidebar-groups", JSON.stringify(next));
        return next;
      });
    }
  }, [pathname, filteredGroups, role]);

  const toggleGroup = (id: string) => {
    const next = { ...expandedGroups, [id]: !expandedGroups[id] };
    setExpandedGroups(next);
    localStorage.setItem("sidebar-groups", JSON.stringify(next));
  };

  const handleToggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  };

  // Commands
  const quickActions = useMemo(() => {
    if (!role) return [];
    const actions = [];
    if (hasPermission(role, "match:create")) {
      actions.push({ id: "new-match", label: "Criar Jogo", icon: <CalendarDays size={18} />, onSelect: () => router.push("/dashboard/matches/new"), group: "Futebol" });
    }
    if (hasPermission(role, "message:create")) {
      actions.push({ id: "new-message", label: "Criar Aviso", icon: <Megaphone size={18} />, onSelect: () => router.push("/dashboard/messages/new"), group: "Comunicação" });
    }
    if (hasPermission(role, "finance:manage") && monthlyFeesEnabled) {
      actions.push({ id: "new-payment", label: "Registrar Pagamento", icon: <DollarSign size={18} />, onSelect: () => router.push("/dashboard/squad/mensalidade"), group: "Financeiro" });
    }
    if (hasPermission(role, "player:create")) {
      actions.push({ id: "new-player", label: "Adicionar Jogador", icon: <UserCircle size={18} />, onSelect: () => router.push("/dashboard/squad/new"), group: "Elenco" });
    }
    if (hasPermission(role, "poll:create")) {
      actions.push({ id: "new-poll", label: "Criar Enquete", icon: <Vote size={18} />, onSelect: () => router.push("/dashboard/polls/new"), group: "Comunicação" });
    }
    return actions;
  }, [role, router, monthlyFeesEnabled]);

  const activeItemLabel = useMemo(() => {
    const all = filteredGroups.flatMap(g => g.items);
    const exact = all.find(i => pathname === i.href);
    if (exact) return exact.label;
    const prefix = all.filter(i => i.href !== "/dashboard" && pathname.startsWith(i.href + "/")).sort((a, b) => b.href.length - a.href.length)[0];
    return prefix ? prefix.label : "Painel";
  }, [pathname, filteredGroups]);

  const todayLabel = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(new Date());

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (newPassword.length < 6) return setErrorMessage("A senha deve ter no mínimo 6 caracteres.");
    if (newPassword !== confirmPassword) return setErrorMessage("As senhas não coincidem.");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
    } catch {
      setErrorMessage("Erro de rede ao alterar a senha.");
      setIsSubmitting(false);
    }
  };

  if (mustChangePassword) {
    return (
      <div data-theme="dark" className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020506]/90 backdrop-blur-xl p-4">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[var(--brand)] opacity-10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[var(--brand-neon)] opacity-5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative w-full max-w-md rounded-[24px] border border-[rgba(16,185,129,0.15)] bg-[rgba(10,24,20,0.6)] p-6 sm:p-8 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-6">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] text-2xl mb-4">🔒</span>
            <h2 className="text-xl font-black uppercase tracking-tight text-white font-serif">Alteração de Senha Obrigatória</h2>
            <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
              Sua senha foi resetada pela administração. Para sua segurança, defina uma nova senha de acesso antes de continuar.
            </p>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {errorMessage && <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-semibold text-red-400">⚠️ {errorMessage}</div>}
            {successMessage && <div className="rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] p-3 text-xs font-semibold text-[var(--brand)]">✓ {successMessage}</div>}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-subtle)] mb-1.5">Nova Senha</label>
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isSubmitting} placeholder="Mínimo 6 caracteres" className="w-full rounded-xl border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[var(--brand)] focus:outline-none transition duration-200" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-subtle)] mb-1.5">Confirmar Nova Senha</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isSubmitting} placeholder="Repita a nova senha" className="w-full rounded-xl border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[var(--brand)] focus:outline-none transition duration-200" />
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#10b981] hover:bg-[#34d399] px-4 py-3 text-xs font-black uppercase tracking-widest text-[#010403] disabled:opacity-50 transition duration-200 cursor-pointer text-center">
                {isSubmitting ? "Salvando..." : "Salvar Nova Senha"}
              </button>
              <button type="button" onClick={() => signOut({ callbackUrl: "/login" })} className="w-full rounded-xl border border-[var(--border)] hover:bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--text-muted)] transition duration-200 cursor-pointer text-center">
                Sair da Conta
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Common item renderer
  const NavItemRender = ({ item, isMobile = false, isCollapsed = false }: { item: NavItem, isMobile?: boolean, isCollapsed?: boolean }) => {
    const isActive = item.exactMatch ? pathname === item.href : (pathname.startsWith(item.href + "/") || pathname === item.href);
    const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
    const Icon = item.icon;
    
    return (
      <Link
        href={item.href}
        prefetch={false}
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
        title={isCollapsed && !isMobile ? item.label : undefined}
        aria-current={isActive ? "page" : undefined}
        className={`group flex items-center gap-3 rounded-lg py-2.5 transition-all duration-200 ${
          isActive
            ? "bg-[var(--brand-soft)] text-[var(--brand)] border-l-2 border-[var(--brand)] font-medium"
            : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)] border-l-2 border-transparent"
        } ${isCollapsed && !isMobile ? "justify-center px-0 mx-2" : "px-3"}`}
      >
        <span className={`inline-flex shrink-0 transition-transform group-hover:scale-110 duration-200 ${isActive ? "text-[var(--brand)]" : "text-[var(--text-muted)] group-hover:text-[var(--text)]"}`}>
          <Icon size={18} />
        </span>
        {(!isCollapsed || isMobile) && (
          <>
            <span className="flex-1 tracking-tight text-sm truncate">{item.label}</span>
            {badgeCount > 0 && (
              <span className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#ef4444] px-1.5 text-[9px] font-black text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]" aria-label={`${badgeCount} pendente(s)`}>
                {badgeCount}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <div data-theme="dark" className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} items={quickActions} />
      
      {transitioning && (
        <div
          className="fixed top-0 left-0 z-[9999] h-[3.5px] bg-gradient-to-r from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand-neon)] transition-all duration-200 ease-out pointer-events-none shadow-[0_1px_10px_var(--brand)]"
          style={{ width: `${progress}%` }}
        />
      )}
      <a href="#dashboard-main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--brand)] focus:px-3 focus:py-2 focus:text-xs focus:font-black focus:text-[var(--bg)]">
        Ir para o conteúdo principal
      </a>

      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--brand)] opacity-5 rounded-full blur-[130px] pointer-events-none" />

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className={`hidden h-screen flex-shrink-0 border-r border-[var(--border)] bg-[var(--bg-elevated)]/90 backdrop-blur-2xl md:sticky md:top-0 md:flex md:flex-col transition-all duration-300 ease-in-out shadow-lg ${collapsed ? "w-20" : "w-72"}`}>
          <div className="border-b border-[var(--border)] px-5 py-6 flex items-center justify-between">
            <Link href="/dashboard" prefetch={false} className="inline-flex items-center gap-3 text-[var(--text)] overflow-hidden">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] text-lg shrink-0">⚽</span>
              {!collapsed && (
                <span className="transition-all duration-300 whitespace-nowrap">
                  <strong className="block text-lg font-black tracking-tight uppercase bg-gradient-to-r from-[var(--text)] to-[var(--brand)] bg-clip-text text-transparent">VARzea</strong>
                  <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[var(--text-subtle)]">DIRETORIA DE ELITE</span>
                </span>
              )}
            </Link>
            <button onClick={handleToggleCollapse} className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] hover:bg-[var(--brand-soft)]/50 hover:border-[var(--brand)]/30 text-[var(--text-muted)] hover:text-[var(--text)] transition-all cursor-pointer" title={collapsed ? "Expandir menu" : "Recolher menu"}>
              <ChevronRight size={14} className={collapsed ? "" : "rotate-180"} />
            </button>
          </div>

          {!collapsed && (
            <div className="px-4 py-4 pb-1">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-[var(--text-subtle)]" />
                <input
                  type="text"
                  placeholder="Buscar páginas..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === "Escape" && setSearchQuery("")}
                  className="w-full bg-black/20 border border-[var(--border)] rounded-lg pl-9 pr-8 py-2 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--brand)] transition-colors placeholder:text-[var(--text-muted)]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2 top-2 p-0.5 text-[var(--text-subtle)] hover:text-[var(--text)]">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
            {searchQuery.trim() && !collapsed ? (
              <div className="space-y-1">
                {searchResults.length > 0 ? (
                  searchResults.map(item => <NavItemRender key={item.href} item={item} />)
                ) : (
                  <p className="px-3 py-4 text-center text-xs text-[var(--text-subtle)]">Nenhum resultado.</p>
                )}
              </div>
            ) : (
              <nav className="space-y-4 pt-2">
                {filteredGroups.map(group => {
                  const GroupIcon = group.icon;
                  const groupBadgeCount = group.items.reduce((acc, i) => acc + (i.badgeKey ? (badges[i.badgeKey] || 0) : 0), 0);
                  const isAnyActive = group.items.some(i => i.exactMatch ? pathname === i.href : (pathname.startsWith(i.href + "/") || pathname === i.href));

                  if (collapsed) {
                    return (
                      <div key={group.id} className="relative group/group-icon flex justify-center mb-2">
                        <button className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${isAnyActive ? "bg-[var(--brand-soft)] text-[var(--brand)]" : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"}`}>
                          <GroupIcon size={20} />
                        </button>
                        {groupBadgeCount > 0 && <span className="absolute top-0 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-[var(--bg-elevated)]" />}
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] text-xs text-[var(--text)] rounded shadow-lg opacity-0 pointer-events-none group-hover/group-icon:opacity-100 transition-opacity z-50 whitespace-nowrap font-medium">
                          {group.label}
                        </div>
                      </div>
                    );
                  }

                  const isExpanded = expandedGroups[group.id];
                  return (
                    <div key={group.id} className="space-y-1">
                      <button
                        onClick={() => toggleGroup(group.id)}
                        aria-expanded={isExpanded}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-subtle)] hover:text-[var(--text)] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <GroupIcon size={12} />
                          <span>{group.label}</span>
                        </div>
                        <ChevronRight size={12} className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="space-y-0.5 mt-1">
                          {group.items.map(item => <NavItemRender key={item.href} item={item} />)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </nav>
            )}
          </div>

          <div className="border-t border-[var(--border)] p-4">
            <button onClick={() => signOut({ callbackUrl: "/login" })} className={`flex items-center gap-3 rounded-xl border border-[var(--border)] bg-black/20 hover:bg-[var(--danger-soft)]/20 hover:border-[var(--danger)]/30 hover:text-[var(--danger)] px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-all cursor-pointer ${collapsed ? "justify-center px-0 w-full" : "w-full"}`} title={collapsed ? "Sair" : undefined}>
              <LogOut size={16} className={collapsed ? "" : "shrink-0"} />
              {!collapsed && <span className="tracking-tight">Sair da Sessão</span>}
            </button>
          </div>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)} />}

        {/* Mobile sidebar drawer */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-[var(--border)] bg-[var(--bg-elevated)] backdrop-blur-3xl transition-transform duration-250 ease-out md:hidden flex flex-col ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-5">
            <span className="text-lg font-black uppercase tracking-wider text-[var(--text)]">VARzea</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 cursor-pointer">
              <X size={20} />
            </button>
          </div>
          
          <div className="px-4 py-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-[var(--text-subtle)]" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--brand)]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-4 custom-scrollbar">
            {searchQuery.trim() ? (
              <div className="space-y-1">
                {searchResults.length > 0 ? (
                  searchResults.map(item => <NavItemRender key={item.href} item={item} isMobile />)
                ) : (
                  <p className="px-3 py-4 text-center text-sm text-[var(--text-subtle)]">Nenhum resultado.</p>
                )}
              </div>
            ) : (
              filteredGroups.map(group => (
                <div key={group.id} className="space-y-1">
                  <div className="px-4 py-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                    <group.icon size={12} />
                    {group.label}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map(item => <NavItemRender key={item.href} item={item} isMobile />)}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-[var(--border)]">
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-black/20 px-4 py-3 text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger-soft)]/50 transition-all cursor-pointer">
              <LogOut size={18} />
              Sair da Sessão
            </button>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile header */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)]/90 px-4 backdrop-blur-xl md:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="rounded-lg p-1.5 text-[var(--text)] hover:bg-[var(--bg-elevated)] cursor-pointer">
              <Menu size={24} />
            </button>
            <span className="text-base font-black uppercase tracking-widest text-[var(--brand)] font-serif">VARzea</span>
            <NotificationCenter />
          </header>

          {/* Desktop page header */}
          <header className="hidden shrink-0 border-b border-[var(--border)] bg-[var(--bg-elevated)]/60 px-8 py-5 backdrop-blur-md md:block">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                  {todayLabel}
                </p>
                <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-[var(--text)] font-serif">{activeItemLabel}</h1>
              </div>
              <div className="flex items-center gap-4">
                {quickActions.length > 0 && (
                  <button 
                    onClick={() => setCommandMenuOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-[var(--brand-soft)] hover:bg-[var(--brand)]/20 px-3 py-2 text-[var(--brand)] transition-colors border border-[var(--brand)]/20 cursor-pointer"
                    title="Ações Rápidas (Ctrl+K)"
                  >
                    <Plus size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Criar</span>
                  </button>
                )}
                <NotificationCenter />
                <div className="rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--brand)]">
                  Operação de Elite
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main id="dashboard-main-content" className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-300">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
