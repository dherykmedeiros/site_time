"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PushSubscriptionCard } from "@/components/dashboard/PushSubscriptionCard";
import { formatCurrency } from "@/lib/utils";
import { CardSkeleton, TableSkeleton } from "@/components/ui/Skeleton";

interface TeamOverview {
  id: string;
  name: string;
  slug: string;
  badgeUrl: string | null;
  primaryColor: string | null;
  _count: {
    players: number;
    matches: number;
  };
}

interface RankingsData {
  rankings: {
    topScorers?: Array<{ playerId: string; playerName: string; total: number }>;
    topAssisters?: Array<{ playerId: string; playerName: string; total: number }>;
    mostCards?: Array<{ playerId: string; playerName: string; yellowCards: number; redCards: number }>;
  };
  teamRecord: {
    totalMatches: number;
    wins: number;
    draws: number;
    losses: number;
    winRate: number;
    goalsScored: number;
    goalsConceded: number;
  };
}

type TabType = "scorers" | "assisters" | "cards";

export default function DashboardHomePage() {
  const [team, setTeam] = useState<TeamOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTeam, setHasTeam] = useState(true);
  const [rankings, setRankings] = useState<RankingsData | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("scorers");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/teams");
        if (res.status === 404 || res.status === 403) {
          setHasTeam(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setTeam(data);

          // Load rankings and balance in parallel
          const [rankingsRes, financeRes] = await Promise.all([
            fetch("/api/stats/rankings?limit=5").catch(() => null),
            fetch("/api/finances?limit=1").catch(() => null),
          ]);

          if (rankingsRes?.ok) {
            setRankings(await rankingsRes.json());
          }
          if (financeRes?.ok) {
            const finData = await financeRes.json();
            setBalance(finData.balance);
          }
        }
      } catch {
        setHasTeam(false);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 animate-pulse rounded-lg bg-white/5 border border-white/10" />
          <div>
            <div className="mb-2 h-6 w-48 animate-pulse rounded bg-white/5" />
            <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <TableSkeleton rows={5} />
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  if (!hasTeam || !team) {
    return (
      <div className="mx-auto max-w-2xl rounded-[26px] border border-[rgba(16,185,129,0.2)] bg-[rgba(10,20,18,0.75)] px-8 py-14 text-center shadow-2xl backdrop-blur-xl space-y-6">
        <span className="text-4xl animate-bounce inline-block">⚽</span>
        <h1 className="text-3xl font-black uppercase text-white tracking-tight">Bem-vindo à VARzea</h1>
        <p className="max-w-md mx-auto text-sm text-[#8fa39b] leading-relaxed">
          Você ainda não possui um time vinculado. Crie a identidade e as cores oficiais do seu primeiro time para acessar todos os recursos do painel administrativo.
        </p>
        <Link href="/dashboard/team/settings" className="inline-block pt-2">
          <Button className="min-h-11 rounded-full px-8 uppercase tracking-widest font-black text-xs text-[#010403] bg-[#10b981] hover:bg-[#34d399] shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            Configurar Primeiro Time
          </Button>
        </Link>
      </div>
    );
  }

  const record = rankings?.teamRecord;
  const playersCount = team?._count?.players ?? 0;
  const matchesCount = team?._count?.matches ?? 0;
  const topScorers = rankings?.rankings?.topScorers || [];
  const topAssisters = rankings?.rankings?.topAssisters || [];
  const mostCards = rankings?.rankings?.mostCards || [];

  const quickActions = [
    {
      href: "/dashboard/squad",
      title: "Gerenciar Elenco",
      description: "Cadastro de atletas, posições e números de camisa.",
      icon: "👥",
    },
    {
      href: "/dashboard/matches",
      title: "Agenda & Partidas",
      description: "Planejar jogos amistosos, oficiais e registrar placares.",
      icon: "⚽",
    },
    {
      href: "/dashboard/finances",
      title: "Caixinha do Time",
      description: "Lançamento de mensalidades, despesas e saldo geral.",
      icon: "💰",
    },
    {
      href: "/dashboard/friendly-requests",
      title: "Desafios Recebidos",
      description: "Negociar datas e responder solicitações de amistosos.",
      icon: "🤝",
    },
    {
      href: "/dashboard/team/settings",
      title: "Identidade & Cores",
      description: "Ajustar escudo, uniformes e detalhes de contato do time.",
      icon: "⚙",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Team Hub Banner (Holográfico) */}
      <section className="relative overflow-hidden rounded-[26px] border border-[rgba(16,185,129,0.2)] bg-[rgba(10,24,20,0.45)] backdrop-blur-xl p-6 shadow-xl sm:p-8">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#10b981] opacity-5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#34d399] to-transparent opacity-40 animate-pulse" />

        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4.5">
              {team.badgeUrl ? (
                <img
                  src={team.badgeUrl}
                  alt={`Escudo ${team.name}`}
                  className="h-16 w-16 rounded-2xl border border-[rgba(16,185,129,0.3)] object-cover shadow-md"
                />
              ) : (
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(16,185,129,0.3)] text-3xl text-white shadow-md bg-[rgba(16,185,129,0.06)]"
                >
                  ⚽
                </div>
              )}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#34d399]">
                  Painel de Controle
                </p>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">{team.name}</h1>
              </div>
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-[#8fa39b] font-medium">
              Bem-vindo ao centro operacional do seu time. Acompanhe a saúde financeira, o desempenho técnico dos atletas e responda aos desafios de amistosos recebidos da comunidade.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-150"
              >
                Acessar Portal Público &rarr;
              </a>
              <Link href="/dashboard/matches">
                <Button className="rounded-xl px-5 py-2.5 text-xs uppercase tracking-wider font-bold text-[#010403] bg-[#10b981] hover:bg-[#34d399] transition-all">
                  Registrar Jogo
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-inner space-y-4">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8fa39b] border-b border-white/5 pb-2">
              Resumo Operacional
            </p>
            <dl className="space-y-3.5 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <dt className="text-[#8fa39b]">Jogadores no Elenco</dt>
                <dd className="text-white font-extrabold">{playersCount}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#8fa39b]">Total de Partidas</dt>
                <dd className="text-white font-extrabold">{matchesCount}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#8fa39b]">Caixa do Time</dt>
                <dd className={`font-black ${balance != null && balance >= 0 ? "text-[#34d399]" : "text-[#f87171]"}`}>
                  {balance != null ? formatCurrency(balance) : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#8fa39b]">Aproveitamento Técnico</dt>
                <dd className="text-white font-black">{record ? `${record.winRate}%` : "—"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Stats Cards Row */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Atletas Oficiais"
          value={playersCount}
          icon="👥"
          color="blue"
        />
        <StatsCard
          label="Partidas Disputadas"
          value={record?.totalMatches ?? 0}
          icon="⚽"
          color="green"
        />
        <StatsCard
          label="Aproveitamento"
          value={record ? `${record.winRate}%` : "—"}
          icon="📊"
          color="yellow"
          sublabel={
            record
              ? `${record.wins}V ${record.draws}E ${record.losses}D`
              : undefined
          }
        />
        <StatsCard
          label="Caixinha Geral"
          value={balance != null ? formatCurrency(balance) : "—"}
          icon="💰"
          color={balance != null && balance >= 0 ? "green" : "red"}
        />
      </section>

      {/* Retrospect Panel */}
      {record && record.totalMatches > 0 && (
        <section className="app-surface p-6 sm:p-8 space-y-6 border-white/5 bg-[rgba(10,24,20,0.25)]">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h2 className="text-lg font-black uppercase text-white tracking-tight">Retrospecto Detalhado</h2>
              <p className="text-xs text-[#8fa39b] mt-0.5">Indicadores e gols na temporada oficial</p>
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#10b981]">Saldo Geral</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[rgba(16,185,129,0.15)] bg-[rgba(16,185,129,0.06)] p-4 text-center">
              <p className="text-2xl font-black text-[#34d399]">{record.wins}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#34d399] mt-1">Vitórias</p>
            </div>
            <div className="rounded-xl border border-[rgba(245,158,11,0.15)] bg-[rgba(245,158,11,0.06)] p-4 text-center">
              <p className="text-2xl font-black text-[#fbbf24]">{record.draws}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24] mt-1">Empates</p>
            </div>
            <div className="rounded-xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.06)] p-4 text-center">
              <p className="text-2xl font-black text-[#f87171]">{record.losses}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#f87171] mt-1">Derrotas</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <p className="text-2xl font-black text-white">
                {record.goalsScored} <span className="text-xs font-semibold text-[#8fa39b]">x</span> {record.goalsConceded}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8fa39b] mt-1">Gols Pró : Contra</p>
            </div>
          </div>
        </section>
      )}

      {/* Rankings Section (Abas Animadas Interativas!) */}
      {rankings && (
        <section className="app-surface p-6 sm:p-8 space-y-6 border-white/5 bg-[rgba(10,24,20,0.25)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-lg font-black uppercase text-white tracking-tight">Desempenho de Atletas</h2>
              <p className="text-xs text-[#8fa39b] mt-0.5">Estatísticas acumuladas individuais do elenco</p>
            </div>

            {/* Tab Controller Buttons */}
            <div className="flex rounded-lg bg-white/[0.03] p-1 border border-white/5">
              <button
                onClick={() => setActiveTab("scorers")}
                className={`rounded-md px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "scorers"
                    ? "bg-[#10b981] text-[#010403] shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                    : "text-[#8fa39b] hover:text-white"
                }`}
              >
                ⚽ Artilharia
              </button>
              <button
                onClick={() => setActiveTab("assisters")}
                className={`rounded-md px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "assisters"
                    ? "bg-[#10b981] text-[#010403] shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                    : "text-[#8fa39b] hover:text-white"
                }`}
              >
                🅰️ Assistências
              </button>
              <button
                onClick={() => setActiveTab("cards")}
                className={`rounded-md px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "cards"
                    ? "bg-[#10b981] text-[#010403] shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                    : "text-[#8fa39b] hover:text-white"
                }`}
              >
                🟨 Cartões
              </button>
            </div>
          </div>

          {/* Render Tab Contents based on Active Selection */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === "scorers" && (
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-transparent shadow-inner">
                <table className="w-full text-left text-sm divide-y divide-white/5">
                  <thead className="bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-[#8fa39b]">
                    <tr>
                      <th className="px-5 py-3.5">Posição</th>
                      <th className="px-5 py-3.5">Jogador</th>
                      <th className="px-5 py-3.5 text-right">Gols Assinalados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {topScorers.length > 0 ? (
                      topScorers.map((entry, idx) => (
                        <tr key={entry.playerId} className="hover:bg-white/[0.01]">
                          <td className="px-5 py-3.5 font-black text-[#8fa39b]">{idx + 1}</td>
                          <td className="px-5 py-3.5 font-extrabold text-white">{entry.playerName}</td>
                          <td className="px-5 py-3.5 text-right font-black text-[#10b981] text-base">{entry.total}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-5 py-8 text-center text-xs text-[#8fa39b] font-medium">Sem dados de artilharia disponíveis.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "assisters" && (
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-transparent shadow-inner">
                <table className="w-full text-left text-sm divide-y divide-white/5">
                  <thead className="bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-[#8fa39b]">
                    <tr>
                      <th className="px-5 py-3.5">Posição</th>
                      <th className="px-5 py-3.5">Jogador</th>
                      <th className="px-5 py-3.5 text-right">Assistências Efetuadas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {topAssisters.length > 0 ? (
                      topAssisters.map((entry, idx) => (
                        <tr key={entry.playerId} className="hover:bg-white/[0.01]">
                          <td className="px-5 py-3.5 font-black text-[#8fa39b]">{idx + 1}</td>
                          <td className="px-5 py-3.5 font-extrabold text-white">{entry.playerName}</td>
                          <td className="px-5 py-3.5 text-right font-black text-[#10b981] text-base">{entry.total}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-5 py-8 text-center text-xs text-[#8fa39b] font-medium">Sem dados de assistências disponíveis.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "cards" && (
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-transparent shadow-inner">
                <table className="w-full text-left text-sm divide-y divide-white/5">
                  <thead className="bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-[#8fa39b]">
                    <tr>
                      <th className="px-5 py-3.5">Posição</th>
                      <th className="px-5 py-3.5">Jogador</th>
                      <th className="px-5 py-3.5 text-center">Cartões Amarelos 🟨</th>
                      <th className="px-5 py-3.5 text-center">Cartões Vermelhos 🟥</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-center">
                    {mostCards.length > 0 ? (
                      mostCards.map((entry, idx) => (
                        <tr key={entry.playerId} className="hover:bg-white/[0.01] text-left">
                          <td className="px-5 py-3.5 font-black text-[#8fa39b]">{idx + 1}</td>
                          <td className="px-5 py-3.5 font-extrabold text-white">{entry.playerName}</td>
                          <td className="px-5 py-3.5 text-center font-bold text-white">{entry.yellowCards || 0}</td>
                          <td className="px-5 py-3.5 text-center font-bold text-white">{entry.redCards || 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-xs text-[#8fa39b] font-medium">Sem dados de cartões e disciplina.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Push Notification Toggle widget */}
      <PushSubscriptionCard />

      {/* Shortcuts grid */}
      <section className="app-surface p-6 sm:p-8 space-y-6 border-white/5 bg-[rgba(10,24,20,0.25)]">
        <div>
          <h2 className="text-lg font-black uppercase text-white tracking-tight">Atalhos Operacionais</h2>
          <p className="text-xs text-[#8fa39b] mt-0.5">Gerenciamento direto dos módulos do portal</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] p-5 transition-all duration-300 hover:border-[#10b981]/40 hover:bg-[#10b981]/5 card-hover shadow-lg"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xl shadow-inner transition-transform group-hover:scale-110 duration-200">
                  {action.icon}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-black text-white uppercase group-hover:text-[#10b981] transition-colors duration-150 tracking-tight">
                    {action.title}
                  </p>
                  <p className="text-xs text-[#8fa39b] leading-relaxed font-semibold">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
