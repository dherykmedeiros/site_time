"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { useSession } from "next-auth/react";

const MatchForm = dynamic(
  () => import("@/components/forms/MatchForm").then((m) => ({ default: m.MatchForm })),
  { loading: () => <div className="p-4 text-center text-gray-500">Carregando formulário...</div> }
);

interface MatchSummary {
  id: string;
  date: string;
  venue: string;
  opponent: string;
  isHome: boolean;
  opponentBadgeUrl: string | null;
  type: "FRIENDLY" | "CHAMPIONSHIP";
  homeScore: number | null;
  awayScore: number | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  shareToken: string;
  rsvpSummary: {
    confirmed: number;
    declined: number;
    pending: number;
  };
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  SCHEDULED: "Agendada",
  COMPLETED: "Finalizada",
  CANCELLED: "Cancelada",
};

const statusVariants: Record<string, "info" | "success" | "danger"> = {
  SCHEDULED: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};

const typeLabels: Record<string, string> = {
  FRIENDLY: "Amistoso",
  CHAMPIONSHIP: "Campeonato",
};

const statusFilterOptions = [
  { value: "ALL", label: "Todos os status" },
  { value: "SCHEDULED", label: "Agendadas" },
  { value: "COMPLETED", label: "Finalizadas" },
  { value: "CANCELLED", label: "Canceladas" },
];

const typeFilterOptions = [
  { value: "ALL", label: "Todos os tipos" },
  { value: "FRIENDLY", label: "Amistoso" },
  { value: "CHAMPIONSHIP", label: "Campeonato" },
];

function formatMatchDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export default function MatchesPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (typeFilter !== "ALL") params.set("type", typeFilter);
      const qs = params.toString();
      const res = await fetch(`/api/matches${qs ? `?${qs}` : ""}`);
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches);
      } else {
        setMatches([]);
        setLoadError("Nao foi possivel carregar as partidas agora.");
      }
    } catch {
      setMatches([]);
      setLoadError("Erro de conexao ao carregar as partidas.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const filteredMatches = matches.filter((m) =>
    m.opponent.toLowerCase().includes(search.toLowerCase()) ||
    m.venue.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[22px] border border-[rgba(16,185,129,0.18)] bg-[rgba(10,24,20,0.4)] p-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Agenda Esportiva
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Jogos do Time</h1>
        </div>
        {isAdmin ? (
          <Button onClick={() => setShowAddModal(true)} className="rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[#010403] bg-[#10b981] hover:bg-[#34d399]">
            + Agendar Partida
          </Button>
        ) : null}
      </div>

      {/* Filters & Search */}
      <div className="app-surface flex flex-wrap items-end gap-4 rounded-[16px] p-4">
        <div className="w-full sm:w-44">
          <Select
            label="Status"
            options={statusFilterOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            label="Tipo"
            options={typeFilterOptions}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="block text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Buscar Adversário / Local
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Digite para buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 pl-9 text-xs font-bold text-[var(--text)] outline-none focus:border-[var(--brand)] transition-colors shadow-sm"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
          </div>
        </div>
      </div>

      {/* Match list */}
      {loadError && (
        <div className="rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)]">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="app-surface rounded-[14px] p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="flex gap-2">
                  <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMatches.length === 0 ? (
        <Card className="rounded-[18px] p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-[var(--text-muted)]">Nenhuma partida encontrada.</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]/80">
            Tente buscar por outro termo ou mude os filtros!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <Link key={match.id} href={`/dashboard/matches/${match.id}`}>
              <Card className="rounded-[18px] p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text)]">
                        vs {match.opponent}
                      </span>
                      <Badge variant={statusVariants[match.status]}>
                        {statusLabels[match.status]}
                      </Badge>
                      <Badge variant="default">{typeLabels[match.type]}</Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
                      <span>📅 {formatMatchDate(match.date)}</span>
                      <span>📍 {match.venue}</span>
                    </div>
                    {match.status === "COMPLETED" &&
                      match.homeScore !== null &&
                      match.awayScore !== null && (
                        <div className="mt-1 text-sm font-semibold text-[var(--text)]">
                          Placar: {match.isHome ? match.homeScore : match.awayScore} x {match.isHome ? match.awayScore : match.homeScore}
                        </div>
                      )}
                  </div>
                  {match.status === "COMPLETED" && match.homeScore !== null && match.awayScore !== null ? (() => {
                    const ourScore = match.isHome ? match.homeScore : match.awayScore;
                    const opponentScore = match.isHome ? match.awayScore : match.homeScore;

                    let badgeColor = "bg-gray-500/10 text-gray-400 border-gray-500/20";
                    let resultLabel = "Empate";

                    if (ourScore > opponentScore) {
                      resultLabel = "Vitória";
                      badgeColor = "bg-emerald-500/15 text-[#34d399] border-emerald-500/30";
                    } else if (ourScore < opponentScore) {
                      resultLabel = "Derrota";
                      badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                    }

                    return (
                      <span className={`text-xs font-mono font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border shrink-0 text-center ${badgeColor}`}>
                        {resultLabel}
                      </span>
                    );
                  })() : (
                    <div className="rounded-xl border border-[#e5ece5] bg-[#f8fbf8] px-3 py-2 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-green-600">
                          ✅ {match.rsvpSummary.confirmed}
                        </span>
                        <span className="text-red-600">
                          ❌ {match.rsvpSummary.declined}
                        </span>
                        <span className="text-yellow-600">
                          ⏳ {match.rsvpSummary.pending}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Add match modal */}
      <Modal
        open={isAdmin && showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Agendar Partida"
      >
        <MatchForm
          onSuccess={() => {
            setShowAddModal(false);
            fetchMatches();
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
}
