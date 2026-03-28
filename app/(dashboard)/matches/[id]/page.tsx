"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

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
  const [copyMsg, setCopyMsg] = useState("");

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
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao registrar presença");
      }
    } catch {
      alert("Erro de conexão");
    } finally {
      setRsvpLoading(false);
    }
  }

  async function handleCancel() {
    if (!confirm("Cancelar esta partida?")) return;
    const res = await fetch(`/api/matches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    if (res.ok) {
      fetchMatch();
    }
  }

  async function handleDelete() {
    if (!match) return;
    const msg =
      match.stats.length > 0
        ? "Esta partida tem estatísticas. Excluir permanentemente?"
        : "Excluir esta partida?";
    if (!confirm(msg)) return;

    const confirm_param = match.stats.length > 0 ? "?confirm=true" : "";
    const res = await fetch(`/api/matches/${id}${confirm_param}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/matches");
    }
  }

  function handleCopyLink() {
    if (!match?.shareUrl) return;
    navigator.clipboard.writeText(match.shareUrl).then(() => {
      setCopyMsg("Link copiado!");
      setTimeout(() => setCopyMsg(""), 2000);
    });
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
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCopyLink}>
            🔗 Compartilhar
          </Button>
          {match.status === "SCHEDULED" && (
            <Button variant="danger" onClick={handleCancel}>
              Cancelar Partida
            </Button>
          )}
          <Button variant="danger" onClick={handleDelete}>
            Excluir
          </Button>
        </div>
      </div>

      {copyMsg && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {copyMsg}
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
    </div>
  );
}
