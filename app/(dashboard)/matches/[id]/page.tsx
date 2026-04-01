"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { BordereauCard } from "@/components/dashboard/BordereauCard";
import { SuggestedLineupCard } from "@/components/dashboard/SuggestedLineupCard";
import type { BordereauResponse, SuggestedLineupResponse } from "@/lib/validations/match";

const PostGameForm = dynamic(
  () => import("@/components/forms/PostGameForm").then((m) => ({ default: m.PostGameForm })),
  { loading: () => <div className="p-4 text-center text-gray-500">Carregando formulário...</div> }
);

const TransactionForm = dynamic(
  () => import("@/components/forms/TransactionForm").then((m) => ({ default: m.TransactionForm })),
  { loading: () => <div className="p-4 text-center text-gray-500">Carregando formulário...</div> }
);

interface RSVP {
  playerId: string;
  playerName: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED";
  respondedAt: string | null;
}

interface PlayerStat {
  playerId: string;
  playerName: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

interface MatchDetail {
  id: string;
  date: string;
  venue: string;
  opponent: string;
  type: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  shareToken: string;
  shareUrl: string;
  rsvps: RSVP[];
  stats: PlayerStat[];
  canSubmitPostGame: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MatchLineupResponse {
  matchId: string;
  generatedAt: string;
  imageUrl: string;
  lineup: SuggestedLineupResponse;
}

type ScheduledWorkspaceSection = "overview" | "presence" | "lineup" | "operations" | "postgame";

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

const rsvpStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  DECLINED: "Recusado",
};

const rsvpStatusVariants: Record<string, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  DECLINED: "danger",
};

function formatMatchDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [showPostGame, setShowPostGame] = useState(false);
  const [showConvocacao, setShowConvocacao] = useState(false);
  const [convocacaoText, setConvocacaoText] = useState("");
  const [showLineupShare, setShowLineupShare] = useState(false);
  const [lineupShareText, setLineupShareText] = useState("");
  const [copyMsg, setCopyMsg] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [lineupData, setLineupData] = useState<MatchLineupResponse | null>(null);
  const [lineupLoading, setLineupLoading] = useState(false);
  const [lineupRefreshing, setLineupRefreshing] = useState(false);
  const [lineupSaving, setLineupSaving] = useState(false);
  const [lineupError, setLineupError] = useState<string | null>(null);
  const [bordereauData, setBordereauData] = useState<BordereauResponse | null>(null);
  const [bordereauLoading, setBordereauLoading] = useState(false);
  const [bordereauSaving, setBordereauSaving] = useState(false);
  const [bordereauError, setBordereauError] = useState<string | null>(null);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ScheduledWorkspaceSection>("overview");

  const fetchMatch = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/matches/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMatch(data);
      } else if (res.status === 404) {
        setMatch(null);
        setLoadError("Partida nao encontrada.");
      } else {
        setMatch(null);
        setLoadError("Nao foi possivel carregar os dados da partida.");
      }
    } catch {
      setMatch(null);
      setLoadError("Erro de conexao ao carregar a partida.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  const fetchLineup = useCallback(async (options?: { refresh?: boolean }) => {
    if (!isAdmin || !match || match.status !== "SCHEDULED") {
      setLineupData(null);
      setLineupError(null);
      return;
    }

    if (options?.refresh) {
      setLineupRefreshing(true);
    } else {
      setLineupLoading(true);
    }

    try {
      const res = await fetch(`/api/matches/${id}/lineup`);
      const data = await res.json();

      if (!res.ok) {
        setLineupError(data.error || "Erro ao carregar sugestao de escalacao");
        return;
      }

      setLineupData(data);
      setLineupError(null);
    } catch {
      setLineupError("Erro de conexão ao carregar sugestao de escalacao");
    } finally {
      setLineupLoading(false);
      setLineupRefreshing(false);
    }
  }, [id, isAdmin, match]);

  useEffect(() => {
    if (!match) {
      return;
    }

    fetchLineup();
  }, [match, fetchLineup]);

  const fetchBordereau = useCallback(async () => {
    if (!isAdmin || !match || match.status !== "SCHEDULED") {
      setBordereauData(null);
      setBordereauError(null);
      return;
    }

    setBordereauLoading(true);
    try {
      const res = await fetch(`/api/matches/${id}/bordereau`);
      const data = await res.json();

      if (!res.ok) {
        setBordereauError(data.error || "Erro ao carregar bordero");
        return;
      }

      setBordereauData(data);
      setBordereauError(null);
    } catch {
      setBordereauError("Erro de conexão ao carregar bordero");
    } finally {
      setBordereauLoading(false);
    }
  }, [id, isAdmin, match]);

  useEffect(() => {
    if (!match) {
      return;
    }

    fetchBordereau();
  }, [match, fetchBordereau]);

  useEffect(() => {
    const allowedSections: ScheduledWorkspaceSection[] = ["overview", "presence"];

    if (isAdmin && match?.status === "SCHEDULED") {
      allowedSections.push("lineup", "operations");
    }

    if ((isAdmin && match?.canSubmitPostGame) || match?.status === "COMPLETED") {
      allowedSections.push("postgame");
    }

    if (!allowedSections.includes(activeSection)) {
      setActiveSection("overview");
    }
  }, [activeSection, isAdmin, match?.status]);

  function toggleChecklistItem(index: number) {
    setBordereauData((current) => {
      if (!current) return current;
      return {
        ...current,
        checklist: current.checklist.map((item, itemIndex) =>
          itemIndex === index ? { ...item, isChecked: !item.isChecked } : item
        ),
      };
    });
  }

  function toggleAttendance(playerId: string) {
    setBordereauData((current) => {
      if (!current) return current;

      const nextAttendance = current.attendance.map((item) => {
        if (item.playerId !== playerId) {
          return item;
        }

        const nextPresent = !item.present;
        return {
          ...item,
          present: nextPresent,
          checkedInAt: nextPresent ? new Date().toISOString() : null,
        };
      });
      const presentCount = nextAttendance.filter((item) => item.present).length;
      const suggestedSharePerPresent = presentCount > 0
        ? Number((current.costSummary.totalExpense / presentCount).toFixed(2))
        : null;

      return {
        ...current,
        attendance: nextAttendance,
        costSummary: {
          ...current.costSummary,
          presentCount,
          suggestedSharePerPresent,
        },
      };
    });
  }

  async function handleSaveBordereau() {
    if (!bordereauData) return;

    setBordereauSaving(true);
    setBordereauError(null);

    try {
      const res = await fetch(`/api/matches/${id}/bordereau`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklist: bordereauData.checklist.map((item) => ({
            label: item.label,
            isChecked: item.isChecked,
            sortOrder: item.sortOrder,
          })),
          attendance: bordereauData.attendance.map((item) => ({
            playerId: item.playerId,
            present: item.present,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBordereauError(data.error || "Erro ao salvar bordero");
        return;
      }

      setBordereauData(data);
      setFeedback("Bordero atualizado com sucesso.");
    } catch {
      setBordereauError("Erro de conexão ao salvar bordero");
    } finally {
      setBordereauSaving(false);
    }
  }

  async function handleSaveLineup(payload: {
    formation?: string | null;
    blockPreset?: string | null;
    starters: Array<{ playerId: string; fieldX: number | null; fieldY: number | null }>;
    bench: string[];
  }) {
    setLineupSaving(true);
    setLineupError(null);

    try {
      const res = await fetch(`/api/matches/${id}/lineup`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setLineupError(data.error || "Erro ao salvar escalacao");
        return;
      }

      setLineupData(data);
      setLineupError(null);
      setFeedback("Escalacao salva com sucesso para esta partida.");
    } catch {
      setLineupError("Erro de conexão ao salvar escalacao");
    } finally {
      setLineupSaving(false);
    }
  }

  async function handleResetSavedLineup() {
    setLineupSaving(true);
    setLineupError(null);

    try {
      const res = await fetch(`/api/matches/${id}/lineup`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setLineupError(data.error || "Erro ao resetar escalacao");
        return;
      }

      setLineupData(data);
      setLineupError(null);
      setFeedback("Escalacao manual removida. A sugestao automatica voltou a valer.");
    } catch {
      setLineupError("Erro de conexão ao resetar escalacao");
    } finally {
      setLineupSaving(false);
    }
  }

  async function handleRsvp(status: "CONFIRMED" | "DECLINED") {
    setRsvpLoading(true);
    try {
      const res = await fetch(`/api/matches/${id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchMatch();
        setFeedback("Presença registrada com sucesso.");
      } else {
        const data = await res.json();
        setActionError(data.error || "Erro ao registrar presença");
      }
    } catch {
      setActionError("Erro de conexão");
    } finally {
      setRsvpLoading(false);
    }
  }

  async function handleCancelConfirm() {
    setActionLoading(true);
    setActionError(null);

    const res = await fetch(`/api/matches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    if (res.ok) {
      setConfirmCancelOpen(false);
      setFeedback("Partida cancelada com sucesso.");
      await fetchMatch();
    } else {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error || "Erro ao cancelar partida");
    }

    setActionLoading(false);
  }

  async function handleDeleteConfirm() {
    if (!match) return;

    setActionLoading(true);
    setActionError(null);

    const confirm_param = match.stats.length > 0 ? "?confirm=true" : "";
    const res = await fetch(`/api/matches/${id}${confirm_param}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/matches");
      return;
    }

    const data = await res.json().catch(() => ({}));
    setActionError(data.error || "Erro ao excluir partida");
    setActionLoading(false);
  }

  function handleCopyLink() {
    if (!match?.shareUrl) return;
    navigator.clipboard.writeText(match.shareUrl).then(() => {
      setCopyMsg("Link copiado!");
      setTimeout(() => setCopyMsg(""), 2000);
    });
  }

  function buildConvocacaoText() {
    if (!match) return "";

    const dateStr = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(match.date));

    const confirmedNames = match.rsvps
      .filter((r) => r.status === "CONFIRMED")
      .map((r) => r.playerName);
    const pendingNames = match.rsvps
      .filter((r) => r.status === "PENDING")
      .map((r) => r.playerName);

    const lines: string[] = [
      `⚽ JOGO MARCADO!`,
      ``,
      `📅 ${dateStr}`,
      `📍 ${match.venue}`,
      `🏆 vs ${match.opponent}`,
      ``,
    ];

    if (confirmedNames.length > 0) {
      lines.push(`✅ Confirmados (${confirmedNames.length}): ${confirmedNames.join(", ")}`);
    }
    if (pendingNames.length > 0) {
      lines.push(`⏳ Aguardando (${pendingNames.length}): ${pendingNames.join(", ")}`);
    }

    lines.push(``, `👉 Confirme aqui: ${window.location.origin}/matches/${match.id}`);
    return lines.join("\n");
  }

  function buildLineupShareText() {
    if (!match || !lineupData) return "";

    const dateStr = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(match.date));

    const formation = lineupData.lineup.meta.formation;
    const lines: string[] = [
      `⚽ ESCALAÇÃO — vs ${match.opponent}`,
      `📅 ${dateStr} | 📍 ${match.venue}`,
      ...(formation ? [`🗺️ ${formation}`] : []),
      ``,
      `👕 Titulares:`,
      ...lineupData.lineup.starters.map(
        (starter, index) => `${index + 1}. ${starter.playerName}`
      ),
    ];

    if (lineupData.lineup.bench.length > 0) {
      lines.push(
        ``,
        `🪑 Banco: ${lineupData.lineup.bench.map((b) => b.playerName).join(", ")}`
      );
    }

    lines.push(``, `🔗 Veja a partida: ${match.shareUrl}`);
    return lines.join("\n");
  }

  function buildResultText() {
    if (!match || match.homeScore === null || match.awayScore === null) return "";

    const home = match.homeScore;
    const away = match.awayScore;
    const result = home > away ? "✅ Vitória" : home < away ? "❌ Derrota" : "🟡 Empate";
    const scorers = match.stats
      .filter((s) => s.goals > 0)
      .map((s) => `${s.playerName} (${s.goals})`)
      .join(", ");

    const lines = [
      `⚽ RESULTADO`,
      ``,
      `${result}: ${home} × ${away}`,
      `🏆 vs ${match.opponent}`,
      ...(scorers ? [`⚽ Gols: ${scorers}`] : []),
      ``,
      `🖼️ Card recap: ${window.location.origin}/api/og/team-recap/${match.id}`,
      `👉 Ver partida: ${match.shareUrl}`,
    ];
    return lines.join("\n");
  }

  if (loading) {
    return <p className="text-gray-500">Carregando...</p>;
  }

  if (!match) {
    return (
      <div className="space-y-4 rounded-[16px] border border-[#efc1b7] bg-[#fff1ee] p-5">
        <p className="text-sm text-[var(--danger)]">
          {loadError ?? "Partida nao encontrada."}
        </p>
        <Button type="button" variant="secondary" onClick={fetchMatch}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const confirmed = match.rsvps.filter((r) => r.status === "CONFIRMED").length;
  const declined = match.rsvps.filter((r) => r.status === "DECLINED").length;
  const pending = match.rsvps.filter((r) => r.status === "PENDING").length;
  const isScheduled = match.status === "SCHEDULED";
  const canSeeLineup = isAdmin && isScheduled;
  const canSeeOperations = isAdmin && isScheduled;
  const canSeePostGame = (isAdmin && match.canSubmitPostGame) || match.status === "COMPLETED";
  const sections: Array<{
    id: ScheduledWorkspaceSection;
    label: string;
    helper: string;
  }> = [
    { id: "overview", label: "Resumo", helper: "Visao rapida da partida" },
    { id: "presence", label: "Presenca", helper: "RSVP e lista de respostas" },
    ...(canSeeLineup
      ? [{ id: "lineup" as const, label: "Escalacao", helper: "Sugestao inicial do jogo" }]
      : []),
    ...(canSeeOperations
      ? [{ id: "operations" as const, label: "Operacao", helper: "Bordero e despesas" }]
      : []),
    ...(canSeePostGame
      ? [{ id: "postgame" as const, label: "Pos-jogo", helper: "Placar, estatisticas e compartilhamento" }]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push("/matches")}
            className="mb-2 text-sm text-blue-600 hover:underline"
          >
            ← Voltar para Jogos
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            vs {match.opponent}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant={statusVariants[match.status]}>
              {statusLabels[match.status]}
            </Badge>
            <Badge variant="default">
              {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleCopyLink}>
            🖗 Compartilhar
          </Button>
          {isAdmin && match.status === "SCHEDULED" && (
            <Button
              variant="secondary"
              onClick={() => {
                const next = !showConvocacao;
                setShowConvocacao(next);
                if (next && match) {
                  setConvocacaoText(buildConvocacaoText());
                }
              }}
            >
              📋 Gerar Convocação
            </Button>
          )}
          {isAdmin && match.status === "SCHEDULED" && (
            <Button variant="danger" onClick={() => setConfirmCancelOpen(true)}>
              Cancelar Partida
            </Button>
          )}
          {isAdmin && (
            <Button variant="danger" onClick={() => setConfirmDeleteOpen(true)}>
              Excluir
            </Button>
          )}
        </div>
      </div>

      {copyMsg && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {copyMsg}
        </div>
      )}

      {/* F-007: WhatsApp convocation generator */}
      {isAdmin && showConvocacao && match.status === "SCHEDULED" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Convocação para WhatsApp</h2>
              <button
                onClick={() => setShowConvocacao(false)}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Fechar convocação"
              >
                Fechar
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              className="min-h-[180px] w-full rounded-lg border border-gray-200 bg-gray-50 p-4 font-sans text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={convocacaoText}
              onChange={(e) => setConvocacaoText(e.target.value)}
              aria-label="Texto da convocação"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(convocacaoText);
                  setCopyMsg("Convocação copiada!");
                  setTimeout(() => setCopyMsg(""), 2500);
                }}
              >
                📋 Copiar texto
              </Button>
              <Button
                onClick={() => {
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(convocacaoText)}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                📱 Abrir no WhatsApp
              </Button>
              <Button
                variant="ghost"
                onClick={() => setConvocacaoText(buildConvocacaoText())}
              >
                🔄 Regenerar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {feedback && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {feedback}
        </div>
      )}

      {actionError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Match Info */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Informações</h2>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-sm text-gray-500">Data</span>
              <p className="font-medium">{formatMatchDate(match.date)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Local</span>
              <p className="font-medium">{match.venue}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Adversário</span>
              <p className="font-medium">{match.opponent}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Tipo</span>
              <p className="font-medium">
                {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {(isScheduled || canSeePostGame) && (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">Central da partida</h2>
                <p className="text-sm text-[var(--text-subtle)]">
                  Separamos presenca, escalacao e operacao para a pagina ficar mais objetiva.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    type="button"
                    variant={activeSection === section.id ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <button
                type="button"
                onClick={() => setActiveSection("overview")}
                className={`rounded-[14px] border p-4 text-left transition-colors ${
                  activeSection === "overview"
                    ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-white"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Resumo</p>
                <p className="mt-2 text-lg font-semibold text-[var(--text)]">Tudo em contexto</p>
                <p className="mt-1 text-sm text-[var(--text-subtle)]">Visao rapida da rodada e proximos passos.</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("presence")}
                className={`rounded-[14px] border p-4 text-left transition-colors ${
                  activeSection === "presence"
                    ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-white"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Presenca</p>
                <p className="mt-2 text-lg font-semibold text-[var(--text)]">{confirmed} confirmados</p>
                <p className="mt-1 text-sm text-[var(--text-subtle)]">{pending} pendentes e {declined} recusas.</p>
              </button>

              {canSeeLineup && (
                <button
                  type="button"
                  onClick={() => setActiveSection("lineup")}
                  className={`rounded-[14px] border p-4 text-left transition-colors ${
                    activeSection === "lineup"
                      ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                      : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-white"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Escalacao</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    {lineupLoading ? "Calculando..." : `${lineupData?.lineup.starters.length ?? 0} titulares`}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-subtle)]">
                    {lineupError ? "Revise o erro da leitura" : "Veja a sugestao sem inflar a pagina principal."}
                  </p>
                </button>
              )}

              {canSeeOperations && (
                <button
                  type="button"
                  onClick={() => setActiveSection("operations")}
                  className={`rounded-[14px] border p-4 text-left transition-colors ${
                    activeSection === "operations"
                      ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                      : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-white"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Operacao</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    {bordereauLoading ? "Carregando..." : `${bordereauData?.costSummary.presentCount ?? 0} presentes`}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-subtle)]">
                    Bordero e despesas ficam isolados do RSVP.
                  </p>
                </button>
              )}

              {canSeePostGame && (
                <button
                  type="button"
                  onClick={() => setActiveSection("postgame")}
                  className={`rounded-[14px] border p-4 text-left transition-colors ${
                    activeSection === "postgame"
                      ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                      : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-white"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Pos-jogo</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    {match.status === "COMPLETED" ? "Partida finalizada" : "Registro pendente"}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-subtle)]">
                    Placar, estatisticas e compartilhamento em uma area dedicada.
                  </p>
                </button>
              )}
            </div>

            <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="text-sm font-semibold text-[var(--text)]">
                {sections.find((section) => section.id === activeSection)?.label}
              </p>
              <p className="mt-1 text-sm text-[var(--text-subtle)]">
                {sections.find((section) => section.id === activeSection)?.helper}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isScheduled && activeSection === "overview" && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-[var(--text)]">Visao geral do jogo</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Confirmacoes</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{confirmed}</p>
                <p className="mt-1 text-sm text-[var(--text-subtle)]">Jogadores que ja confirmaram presenca.</p>
              </div>
              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Pendencias</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{pending}</p>
                <p className="mt-1 text-sm text-[var(--text-subtle)]">Ainda sem resposta no RSVP.</p>
              </div>
              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Recusas</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{declined}</p>
                <p className="mt-1 text-sm text-[var(--text-subtle)]">Atletas indisponiveis para esta partida.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Score (if completed) */}
      {activeSection === "postgame" && match.status === "COMPLETED" &&
        match.homeScore !== null &&
        match.awayScore !== null && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Placar</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-6 text-3xl font-bold">
                <span className="text-blue-600">{match.homeScore}</span>
                <span className="text-gray-400">x</span>
                <span className="text-red-600">{match.awayScore}</span>
              </div>
            </CardContent>
          </Card>
        )}

      {/* RSVP Summary and Actions */}
      {match.status === "SCHEDULED" && activeSection === "presence" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Confirmação de Presença</h2>
              <div className="flex gap-3 text-sm">
                <span className="text-green-600">✅ {confirmed}</span>
                <span className="text-red-600">❌ {declined}</span>
                <span className="text-yellow-600">⏳ {pending}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* RSVP action buttons for players */}
            <div className="mb-4 flex gap-3">
              <Button
                onClick={() => handleRsvp("CONFIRMED")}
                disabled={rsvpLoading}
              >
                ✅ Confirmar Presença
              </Button>
              <Button
                variant="danger"
                onClick={() => handleRsvp("DECLINED")}
                disabled={rsvpLoading}
              >
                ❌ Recusar
              </Button>
            </div>

            {/* RSVP list */}
            <div className="space-y-2">
              {match.rsvps.map((rsvp) => (
                <div
                  key={rsvp.playerId}
                  className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-4 py-2"
                >
                  <span className="font-medium text-gray-900">
                    {rsvp.playerName}
                  </span>
                  <Badge variant={rsvpStatusVariants[rsvp.status]}>
                    {rsvpStatusLabels[rsvp.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RSVP list for non-scheduled matches */}
      {match.status !== "SCHEDULED" && match.rsvps.length > 0 && activeSection === "presence" && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Presenças</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {match.rsvps.map((rsvp) => (
                <div
                  key={rsvp.playerId}
                  className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-4 py-2"
                >
                  <span className="font-medium text-gray-900">
                    {rsvp.playerName}
                  </span>
                  <Badge variant={rsvpStatusVariants[rsvp.status]}>
                    {rsvpStatusLabels[rsvp.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {canSeeLineup && activeSection === "lineup" && lineupData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Compartilhar Escalação</h2>
              <button
                onClick={() => {
                  const next = !showLineupShare;
                  setShowLineupShare(next);
                  if (next) setLineupShareText(buildLineupShareText());
                }}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                {showLineupShare ? "Fechar" : "📋 Gerar texto"}
              </button>
            </div>
          </CardHeader>
          {showLineupShare && (
            <CardContent>
              <textarea
                className="min-h-[160px] w-full rounded-lg border border-gray-200 bg-gray-50 p-4 font-sans text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={lineupShareText}
                onChange={(e) => setLineupShareText(e.target.value)}
                aria-label="Texto da escalação para compartilhar"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(lineupShareText);
                    setCopyMsg("Escalação copiada!");
                    setTimeout(() => setCopyMsg(""), 2500);
                  }}
                >
                  📋 Copiar texto
                </Button>
                <Button
                  onClick={() => {
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(lineupShareText)}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                >
                  📱 Enviar no WhatsApp
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLineupShareText(buildLineupShareText())}
                >
                  🔄 Regenerar
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {canSeeLineup && activeSection === "lineup" && (
        <SuggestedLineupCard
          loading={lineupLoading}
          error={lineupError}
          lineup={lineupData?.lineup ?? null}
          generatedAt={lineupData?.generatedAt ?? null}
          onRefresh={() => fetchLineup({ refresh: true })}
          canRefresh={!lineupRefreshing}
          onSaveLineup={handleSaveLineup}
          onResetSavedLineup={handleResetSavedLineup}
          saveLoading={lineupSaving}
          imageUrl={lineupData?.imageUrl ?? null}
        />
      )}

      {canSeeOperations && activeSection === "operations" && (
        <BordereauCard
          loading={bordereauLoading}
          saving={bordereauSaving}
          error={bordereauError}
          data={bordereauData}
          onChecklistToggle={toggleChecklistItem}
          onAttendanceToggle={toggleAttendance}
          onSave={handleSaveBordereau}
          onOpenExpense={() => setExpenseModalOpen(true)}
        />
      )}

      {/* Post-game form (T042) — show when canSubmitPostGame is true */}
      {activeSection === "postgame" && isAdmin && match.canSubmitPostGame && !showPostGame && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-orange-800">
                  Pós-jogo disponível
                </p>
                <p className="text-sm text-orange-600">
                  A data da partida já passou. Registre o placar e as
                  estatísticas.
                </p>
              </div>
              <Button onClick={() => setShowPostGame(true)}>
                Registrar Pós-Jogo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === "postgame" && isAdmin && match.canSubmitPostGame && showPostGame && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Registrar Pós-Jogo</h2>
          </CardHeader>
          <CardContent>
            <PostGameForm
              matchId={match.id}
              rsvps={match.rsvps}
              onSuccess={() => {
                setShowPostGame(false);
                fetchMatch();
              }}
              onCancel={() => setShowPostGame(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Stats display (when match is COMPLETED and has stats) */}
      {activeSection === "postgame" && match.status === "COMPLETED" && match.stats.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Estatísticas Individuais</h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 font-medium text-gray-500">Jogador</th>
                    <th className="pb-2 text-center font-medium text-gray-500">
                      Gols
                    </th>
                    <th className="pb-2 text-center font-medium text-gray-500">
                      Assist.
                    </th>
                    <th className="pb-2 text-center font-medium text-gray-500">
                      🟨
                    </th>
                    <th className="pb-2 text-center font-medium text-gray-500">
                      🟥
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {match.stats.map((stat) => (
                    <tr
                      key={stat.playerId}
                      className="border-b border-gray-100"
                    >
                      <td className="py-2 font-medium">{stat.playerName}</td>
                      <td className="py-2 text-center">{stat.goals}</td>
                      <td className="py-2 text-center">{stat.assists}</td>
                      <td className="py-2 text-center">{stat.yellowCards}</td>
                      <td className="py-2 text-center">{stat.redCards}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* F-002: Share result card */}
      {activeSection === "postgame" && match.status === "COMPLETED" &&
        match.stats.length > 0 &&
        match.homeScore !== null &&
        match.awayScore !== null && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent>
              <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-blue-800">Compartilhar resultado</p>
                  <p className="text-sm text-blue-600">
                    {match.homeScore} × {match.awayScore} vs {match.opponent} — divulgue o card de resultado!
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      window.open(
                        `/api/og/team-recap/${match.id}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    🖼️ Abrir card recap
                  </Button>
                  <Button variant="secondary" onClick={handleCopyLink}>
                    🔗 Copiar link
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(buildResultText())}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    📱 Compartilhar no WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      <Modal
        open={isAdmin && confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        title="Cancelar partida"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Tem certeza que deseja cancelar esta partida?
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleCancelConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? "Cancelando..." : "Confirmar cancelamento"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setConfirmCancelOpen(false)}
              disabled={actionLoading}
            >
              Voltar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isAdmin && confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Excluir partida"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {match.stats.length > 0
              ? "Esta partida possui estatísticas e será excluída permanentemente. Deseja continuar?"
              : "Deseja excluir esta partida permanentemente?"}
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? "Excluindo..." : "Confirmar exclusão"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={actionLoading}
            >
              Voltar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isAdmin && expenseModalOpen && !!match}
        onClose={() => setExpenseModalOpen(false)}
        title="Lancar despesa da partida"
      >
        {match && (
          <TransactionForm
            defaultType="EXPENSE"
            defaultCategory="REFEREE"
            defaultDescriptionPrefix={`Partida vs ${match.opponent}`}
            hideTypeSelector
            matchId={match.id}
            onSuccess={async () => {
              setExpenseModalOpen(false);
              await fetchBordereau();
              setFeedback("Despesa vinculada a partida registrada com sucesso.");
            }}
            onCancel={() => setExpenseModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
