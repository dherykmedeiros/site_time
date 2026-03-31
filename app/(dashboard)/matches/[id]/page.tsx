"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

const PostGameForm = dynamic(
  () => import("@/components/forms/PostGameForm").then((m) => ({ default: m.PostGameForm })),
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
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [showPostGame, setShowPostGame] = useState(false);
  const [showConvocacao, setShowConvocacao] = useState(false);
  const [copyMsg, setCopyMsg] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMatch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/matches/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMatch(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

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

    lines.push(``, `👉 Confirme aqui: ${match.shareUrl}`);
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
      `👉 Ver partida: ${match.shareUrl}`,
    ];
    return lines.join("\n");
  }

  if (loading) {
    return <p className="text-gray-500">Carregando...</p>;
  }

  if (!match) {
    return <p className="text-red-500">Partida não encontrada.</p>;
  }

  const confirmed = match.rsvps.filter((r) => r.status === "CONFIRMED").length;
  const declined = match.rsvps.filter((r) => r.status === "DECLINED").length;
  const pending = match.rsvps.filter((r) => r.status === "PENDING").length;

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
          {match.status === "SCHEDULED" && (
            <Button
              variant="secondary"
              onClick={() => setShowConvocacao((v) => !v)}
            >
              📋 Gerar Convocação
            </Button>
          )}
          {match.status === "SCHEDULED" && (
            <Button variant="danger" onClick={() => setConfirmCancelOpen(true)}>
              Cancelar Partida
            </Button>
          )}
          <Button variant="danger" onClick={() => setConfirmDeleteOpen(true)}>
            Excluir
          </Button>
        </div>
      </div>

      {copyMsg && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {copyMsg}
        </div>
      )}

      {/* F-007: WhatsApp convocation generator */}
      {showConvocacao && match.status === "SCHEDULED" && (
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
            <pre className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 font-sans text-sm text-gray-800">
              {buildConvocacaoText()}
            </pre>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(buildConvocacaoText());
                  setCopyMsg("Convocação copiada!");
                  setTimeout(() => setCopyMsg(""), 2500);
                }}
              >
                📋 Copiar texto
              </Button>
              <Button
                onClick={() => {
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(buildConvocacaoText())}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                📱 Abrir no WhatsApp
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

      {/* Score (if completed) */}
      {match.status === "COMPLETED" &&
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
      {match.status === "SCHEDULED" && (
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
      {match.status !== "SCHEDULED" && match.rsvps.length > 0 && (
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

      {/* Post-game form (T042) — show when canSubmitPostGame is true */}
      {match.canSubmitPostGame && !showPostGame && (
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

      {match.canSubmitPostGame && showPostGame && (
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
      {match.status === "COMPLETED" && match.stats.length > 0 && (
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
      {match.status === "COMPLETED" &&
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
        open={confirmCancelOpen}
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
        open={confirmDeleteOpen}
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
    </div>
  );
}
