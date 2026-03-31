"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

const positionLabels: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  MIDFIELDER: "Meio-campista",
  FORWARD: "Atacante",
};

interface Payment {
  id: string;
  amount: number;
  paidAt: string;
  transactionId: string | null;
}

interface PlayerRow {
  id: string;
  name: string;
  position: string;
  shirtNumber: number;
  photoUrl: string | null;
  payment: Payment | null;
}

interface Summary {
  totalPlayers: number;
  paidCount: number;
  pendingCount: number;
  totalCollected: number;
}

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];

export default function MensalidadePage() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [registering, setRegistering] = useState<string | null>(null); // playerId being registered
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    setActionError(null);
    try {
      const res = await fetch(`/api/players/membership?month=${month}&year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setPlayers(data.players);
        setSummary(data.summary);
      }
    } catch {
      setActionError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleRegister(playerId: string) {
    const rawAmount = amounts[playerId];
    const amount = parseFloat(rawAmount?.replace(",", ".") || "");
    if (!rawAmount || isNaN(amount) || amount <= 0) {
      setActionError("Informe um valor válido para registrar o pagamento.");
      return;
    }

    setSubmitting(playerId);
    setActionError(null);
    try {
      const res = await fetch(`/api/players/${playerId}/membership`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year, amount }),
      });
      if (res.ok) {
        setRegistering(null);
        setAmounts((prev) => ({ ...prev, [playerId]: "" }));
        setFeedback("Pagamento registrado com sucesso.");
        await fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        setActionError(data.error || "Erro ao registrar pagamento.");
      }
    } finally {
      setSubmitting(null);
    }
  }

  async function handleRevert(playerId: string, paymentId: string) {
    setSubmitting(playerId);
    setActionError(null);
    try {
      const res = await fetch(`/api/players/${playerId}/membership/${paymentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFeedback("Pagamento estornado.");
        await fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        setActionError(data.error || "Erro ao estornar pagamento.");
      }
    } finally {
      setSubmitting(null);
    }
  }

  const paidPlayers = players.filter((p) => p.payment);
  const pendingPlayers = players.filter((p) => !p.payment);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/squad" className="mb-1 block text-sm text-blue-600 hover:underline">
            ← Voltar para Elenco
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Controle de Mensalidade</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Registre e acompanhe os pagamentos mensais do elenco.
          </p>
        </div>
      </div>

      {/* Month/Year selector */}
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 py-1">
            <span className="text-sm font-medium text-gray-700">Período:</span>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Selecionar mês"
            >
              {monthNames.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Selecionar ano"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {feedback && (
        <div role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {feedback}
        </div>
      )}
      {actionError && (
        <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card>
            <CardContent>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Jogadores
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{summary.totalPlayers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                Pagaram
              </p>
              <p className="mt-1 text-3xl font-bold text-green-700">{summary.paidCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                Pendentes
              </p>
              <p className="mt-1 text-3xl font-bold text-amber-700">{summary.pendingCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Arrecadado
              </p>
              <p className="mt-1 text-xl font-bold text-blue-700">
                {formatCurrency(summary.totalCollected)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress bar */}
      {summary && summary.totalPlayers > 0 && (
        <div>
          <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
            <span>
              {summary.paidCount} de {summary.totalPlayers} pagaram
            </span>
            <span>{Math.round((summary.paidCount / summary.totalPlayers) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{
                width: `${(summary.paidCount / summary.totalPlayers) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
          Nenhum jogador ativo no elenco.
        </div>
      ) : (
        <>
          {/* Pending section */}
          {pendingPlayers.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Pendentes</h2>
                  <Badge variant="warning">{pendingPlayers.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100">
                  {pendingPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {player.photoUrl ? (
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            className="h-9 w-9 rounded-full border border-gray-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                            {player.shirtNumber}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{player.name}</p>
                          <p className="text-xs text-gray-500">
                            #{player.shirtNumber} · {positionLabels[player.position] || player.position}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {registering === player.id ? (
                          <>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="R$ 0,00"
                              value={amounts[player.id] || ""}
                              onChange={(e) =>
                                setAmounts((prev) => ({ ...prev, [player.id]: e.target.value }))
                              }
                              className="w-32"
                              aria-label={`Valor da mensalidade de ${player.name}`}
                            />
                            <Button
                              onClick={() => handleRegister(player.id)}
                              disabled={submitting === player.id}
                            >
                              {submitting === player.id ? "Salvando..." : "Confirmar"}
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => setRegistering(null)}
                              disabled={submitting === player.id}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setRegistering(player.id);
                              setActionError(null);
                            }}
                          >
                            + Registrar pagamento
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paid section */}
          {paidPlayers.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Pagaram</h2>
                  <Badge variant="success">{paidPlayers.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100">
                  {paidPlayers.map((player) => {
                    const paidDate = new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                    }).format(new Date(player.payment!.paidAt));
                    return (
                      <div
                        key={player.id}
                        className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {player.photoUrl ? (
                            <img
                              src={player.photoUrl}
                              alt={player.name}
                              className="h-9 w-9 rounded-full border border-gray-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                              {player.shirtNumber}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{player.name}</p>
                            <p className="text-xs text-gray-500">
                              #{player.shirtNumber} · {positionLabels[player.position] || player.position}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold text-green-700">
                              {formatCurrency(player.payment!.amount)}
                            </p>
                            <p className="text-xs text-gray-400">{paidDate}</p>
                          </div>
                          <Badge variant="success">Pago</Badge>
                          <button
                            onClick={() => handleRevert(player.id, player.payment!.id)}
                            disabled={submitting === player.id}
                            className="rounded-md px-2 py-1 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                            aria-label={`Estornar pagamento de ${player.name}`}
                          >
                            {submitting === player.id ? "..." : "Estornar"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
