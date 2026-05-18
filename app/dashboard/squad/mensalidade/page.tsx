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
  LEFT_BACK: "Lateral esquerdo",
  RIGHT_BACK: "Lateral direito",
  MIDFIELDER: "Meio-campista",
  DEFENSIVE_MIDFIELDER: "Volante",
  FORWARD: "Atacante",
  LEFT_WINGER: "Ponta esquerda",
  RIGHT_WINGER: "Ponta direita",
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
  const [registering, setRegistering] = useState<string | null>(null);
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
    } catch {
      setActionError("Erro na conexão com o servidor.");
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
    } catch {
      setActionError("Erro na conexão com o servidor.");
    } finally {
      setSubmitting(null);
    }
  }

  const paidPlayers = players.filter((p) => p.payment);
  const pendingPlayers = players.filter((p) => !p.payment);

  return (
    <div className="space-y-6">
      {/* Voltar e Header */}
      <div className="space-y-2">
        <Link href="/dashboard/squad" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#34d399] hover:underline transition-all">
          &larr; Voltar para Elenco
        </Link>
        
        <div className="flex flex-col gap-4 rounded-[22px] border border-[rgba(16,185,129,0.18)] bg-[rgba(10,24,20,0.4)] p-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
              Relatórios Financeiros
            </p>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">Controle de Mensalidades</h1>
          </div>
        </div>
      </div>

      {/* Month/Year selector (Glassmorphism) */}
      <section className="app-surface p-4 sm:p-5 border-white/5 bg-[rgba(10,24,20,0.25)]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8fa39b]">Período:</span>
          
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-xl border border-white/10 bg-[#090f0c] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#10b981]"
            aria-label="Selecionar mês"
          >
            {monthNames.map((name, i) => (
              <option key={i + 1} value={i + 1} className="bg-[#090f0c] text-[#f0f7f4]">
                {name}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-xl border border-white/10 bg-[#090f0c] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#10b981]"
            aria-label="Selecionar ano"
          >
            {years.map((y) => (
              <option key={y} value={y} className="bg-[#090f0c] text-[#f0f7f4]">
                {y}
              </option>
            ))}
          </select>
        </div>
      </section>

      {feedback && (
        <div role="status" className="rounded-xl border border-[rgba(16,185,129,0.15)] bg-[rgba(16,185,129,0.06)] p-3 text-xs font-semibold text-[#34d399]">
          {feedback}
        </div>
      )}
      {actionError && (
        <div role="alert" className="rounded-xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.06)] p-3 text-xs font-semibold text-[#f87171]">
          {actionError}
        </div>
      )}

      {/* Summary cards */}
      {summary && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="app-surface p-5 border-white/5 bg-[rgba(10,24,20,0.25)] flex flex-col justify-between min-h-[96px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#8fa39b]">
              Elenco Total
            </p>
            <p className="mt-2 text-3xl font-black text-white">{summary.totalPlayers}</p>
          </div>
          
          <div className="app-surface p-5 border-white/5 bg-[rgba(16,185,129,0.05)] flex flex-col justify-between min-h-[96px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#34d399]">
              Confirmados
            </p>
            <p className="mt-2 text-3xl font-black text-[#34d399]">{summary.paidCount}</p>
          </div>

          <div className="app-surface p-5 border-white/5 bg-[rgba(245,158,11,0.05)] flex flex-col justify-between min-h-[96px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24]">
              Pendentes
            </p>
            <p className="mt-2 text-3xl font-black text-[#fbbf24]">{summary.pendingCount}</p>
          </div>

          <div className="app-surface p-5 border-white/5 bg-[rgba(6,182,212,0.05)] flex flex-col justify-between min-h-[96px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#22d3ee]">
              Arrecadado
            </p>
            <p className="mt-2 text-xl font-black text-[#22d3ee] truncate">
              {formatCurrency(summary.totalCollected)}
            </p>
          </div>
        </section>
      )}

      {/* Progress bar */}
      {summary && summary.totalPlayers > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8fa39b] uppercase tracking-wider">
            <span>
              {summary.paidCount} de {summary.totalPlayers} atletas confirmaram
            </span>
            <span className="text-white font-black">{Math.round((summary.paidCount / summary.totalPlayers) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#10b981] to-[#06b6d4] shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-300"
              style={{
                width: `${(summary.paidCount / summary.totalPlayers) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5 border border-white/10" />
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="app-surface p-12 text-center text-sm font-semibold text-[#8fa39b] border-dashed border-white/10 bg-transparent">
          Nenhum jogador ativo cadastrado no elenco.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending section */}
          {pendingPlayers.length > 0 && (
            <section className="app-surface p-6 sm:p-8 space-y-6 border-white/5 bg-[rgba(10,24,20,0.25)]">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                  Atletas Pendentes <Badge variant="warning">{pendingPlayers.length}</Badge>
                </h2>
                <span className="text-[10px] font-black uppercase text-[#fbbf24] tracking-widest">Aguardando</span>
              </div>

              <div className="divide-y divide-white/5">
                {pendingPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3.5">
                      {player.photoUrl ? (
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className="h-10 w-10 rounded-full border border-white/10 object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-black text-[#8fa39b]">
                          {player.shirtNumber}
                        </div>
                      )}
                      <div>
                        <p className="font-extrabold text-white">{player.name}</p>
                        <p className="text-xs font-semibold text-[#8fa39b] mt-0.5">
                          #{player.shirtNumber} &middot; {positionLabels[player.position] || player.position}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {registering === player.id ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="R$ 0,00"
                            value={amounts[player.id] || ""}
                            onChange={(e) =>
                              setAmounts((prev) => ({ ...prev, [player.id]: e.target.value }))
                            }
                            className="w-28 h-9 text-xs font-black"
                            aria-label={`Valor da mensalidade de ${player.name}`}
                          />
                          <Button
                            onClick={() => handleRegister(player.id)}
                            disabled={submitting === player.id}
                            className="h-9 px-4 text-xs font-bold uppercase tracking-wider text-[#010403] bg-[#10b981] hover:bg-[#34d399]"
                          >
                            {submitting === player.id ? "Salvando..." : "Confirmar"}
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setRegistering(null)}
                            disabled={submitting === player.id}
                            className="h-9 px-4 text-xs font-bold uppercase tracking-wider text-white bg-white/5 border-white/10 hover:bg-white/10"
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setRegistering(player.id);
                            setActionError(null);
                          }}
                          className="h-9 px-4 text-xs font-bold uppercase tracking-wider text-[#34d399] hover:bg-white/[0.05] border-white/5"
                        >
                          + Registrar pagamento
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Paid section */}
          {paidPlayers.length > 0 && (
            <section className="app-surface p-6 sm:p-8 space-y-6 border-white/5 bg-[rgba(10,24,20,0.25)]">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h2 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                  Atletas Confirmados <Badge variant="success">{paidPlayers.length}</Badge>
                </h2>
                <span className="text-[10px] font-black uppercase text-[#34d399] tracking-widest">Recebido</span>
              </div>

              <div className="divide-y divide-white/5">
                {paidPlayers.map((player) => {
                  const paidDate = new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                  }).format(new Date(player.payment!.paidAt));
                  return (
                    <div
                      key={player.id}
                      className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3.5">
                        {player.photoUrl ? (
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            className="h-10 w-10 rounded-full border border-white/10 object-cover shadow-sm"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.06)] text-xs font-black text-[#34d399]">
                            {player.shirtNumber}
                          </div>
                        )}
                        <div>
                          <p className="font-extrabold text-white">{player.name}</p>
                          <p className="text-xs font-semibold text-[#8fa39b] mt-0.5">
                            #{player.shirtNumber} &middot; {positionLabels[player.position] || player.position}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4.5">
                        <div className="text-right">
                          <p className="font-black text-[#34d399] text-base">
                            {formatCurrency(player.payment!.amount)}
                          </p>
                          <p className="text-[10px] font-semibold text-[#8fa39b] mt-0.5">{paidDate}</p>
                        </div>
                        <Badge variant="success">Pago</Badge>
                        <button
                          onClick={() => handleRevert(player.id, player.payment!.id)}
                          disabled={submitting === player.id}
                          className="rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#f87171] hover:bg-[#f87171]/10 disabled:opacity-50 transition-all cursor-pointer"
                          aria-label={`Estornar pagamento de ${player.name}`}
                        >
                          {submitting === player.id ? "..." : "Estornar"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
