"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "./StatsCard";
import { PushSubscriptionCard } from "./PushSubscriptionCard";
import { formatCurrency } from "@/lib/utils";
import { RankingTable } from "./RankingTable";

interface DashboardOverviewProps {
  team: {
    id: string;
    name: string;
    slug: string;
    badgeUrl: string | null;
    primaryColor: string | null;
    _count: {
      players: number;
      matches: number;
    };
  };
  balance: number;
  teamRecord: {
    totalMatches: number;
    wins: number;
    draws: number;
    losses: number;
    winRate: number;
    goalsScored: number;
    goalsConceded: number;
  };
  topScorers: Array<{ playerId: string; playerName: string; total: number }>;
  topAssisters: Array<{ playerId: string; playerName: string; total: number }>;
  mostCards: Array<{ playerId: string; playerName: string; yellowCards: number; redCards: number }>;
}

type TabType = "scorers" | "assisters" | "cards";

export default function DashboardOverview({
  team,
  balance,
  teamRecord,
  topScorers,
  topAssisters,
  mostCards,
}: DashboardOverviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("scorers");

  const playersCount = team._count?.players ?? 0;
  const matchesCount = team._count?.matches ?? 0;

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
      {/* Team Hub Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 backdrop-blur-xl p-6 shadow-sm sm:p-8">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--brand)] opacity-5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-40 animate-pulse" />

        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4.5">
              {team.badgeUrl ? (
                <img
                  src={team.badgeUrl}
                  alt={`Escudo ${team.name}`}
                  className="h-16 w-16 rounded-2xl border border-[var(--border)] object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] text-3xl text-[var(--brand)] shadow-sm bg-[var(--brand-soft)]">
                  ⚽
                </div>
              )}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--brand)]">
                  Painel de Controle
                </p>
                <h1 className="text-3xl font-bold text-[var(--text)] tracking-tight uppercase font-serif">{team.name}</h1>
              </div>
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-[var(--text-muted)] font-medium">
              Bem-vindo ao centro operacional do seu time. Acompanhe a saúde financeira, o desempenho técnico dos atletas e responda aos desafios de amistosos recebidos da comunidade.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={`/${team.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] hover:bg-[var(--brand-soft)]/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text)] transition-all duration-150"
              >
                Acessar Portal Público &rarr;
              </a>
              <Link href="/dashboard/matches">
                <Button className="rounded-xl px-5 py-2.5 text-xs uppercase tracking-wider font-bold">
                  Registrar Jogo
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-5 shadow-sm space-y-4">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-subtle)] border-b border-[var(--border)] pb-2">
              Resumo Operacional
            </p>
            <dl className="space-y-3.5 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-muted)]">Jogadores no Elenco</dt>
                <dd className="text-[var(--text)] font-bold">{playersCount}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-muted)]">Total de Partidas</dt>
                <dd className="text-[var(--text)] font-bold">{matchesCount}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-muted)]">Caixa do Time</dt>
                <dd className={`font-black ${balance >= 0 ? "text-[var(--badge-success-text)]" : "text-[var(--danger)]"}`}>
                  {formatCurrency(balance)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-muted)]">Aproveitamento Técnico</dt>
                <dd className="text-[var(--text)] font-bold">{teamRecord.winRate}%</dd>
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
          value={teamRecord.totalMatches}
          icon="⚽"
          color="green"
        />
        <StatsCard
          label="Aproveitamento"
          value={`${teamRecord.winRate}%`}
          icon="📊"
          color="yellow"
          sublabel={`${teamRecord.wins}V ${teamRecord.draws}E ${teamRecord.losses}D`}
        />
        <StatsCard
          label="Caixinha Geral"
          value={formatCurrency(balance)}
          icon="💰"
          color={balance >= 0 ? "green" : "red"}
        />
      </section>

      {/* Retrospect Panel */}
      {teamRecord.totalMatches > 0 && (
        <section className="app-surface p-6 sm:p-8 space-y-6 bg-[var(--bg-elevated)]/40 border border-[var(--border)] rounded-2xl">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div>
              <h2 className="text-lg font-bold uppercase text-[var(--text)] tracking-tight font-serif">Retrospecto Detalhado</h2>
              <p className="text-xs text-[var(--text-subtle)] mt-0.5">Indicadores e gols na temporada oficial</p>
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[var(--brand)]">Saldo Geral</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[var(--badge-success-border)] bg-[var(--badge-success-bg)] p-4 text-center">
              <p className="text-2xl font-black text-[var(--badge-success-text)]">{teamRecord.wins}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--badge-success-text)] mt-1">Vitórias</p>
            </div>
            <div className="rounded-xl border border-[var(--badge-warning-border)] bg-[var(--badge-warning-bg)] p-4 text-center">
              <p className="text-2xl font-black text-[var(--badge-warning-text)]">{teamRecord.draws}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--badge-warning-text)] mt-1">Empates</p>
            </div>
            <div className="rounded-xl border border-[var(--badge-danger-border)] bg-[var(--badge-danger-bg)] p-4 text-center">
              <p className="text-2xl font-black text-[var(--badge-danger-text)]">{teamRecord.losses}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--badge-danger-text)] mt-1">Derrotas</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/20 p-4 text-center">
              <p className="text-2xl font-black text-[var(--text)]">
                {teamRecord.goalsScored} <span className="text-xs font-semibold text-[var(--text-subtle)]">x</span> {teamRecord.goalsConceded}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1">Gols Pró : Contra</p>
            </div>
          </div>
        </section>
      )}

      {/* Rankings Section */}
      <section className="app-surface p-6 sm:p-8 space-y-6 bg-[var(--bg-elevated)]/40 border border-[var(--border)] rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="text-lg font-bold uppercase text-[var(--text)] tracking-tight font-serif">Desempenho de Atletas</h2>
            <p className="text-xs text-[var(--text-subtle)] mt-0.5">Estatísticas acumuladas individuais do elenco</p>
          </div>

          {/* Tab Controller Buttons */}
          <div className="flex rounded-lg bg-[var(--bg-elevated)]/80 p-1 border border-[var(--border)]">
            <button
              onClick={() => setActiveTab("scorers")}
              className={`rounded-md px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "scorers"
                  ? "bg-[var(--brand)] text-[var(--bg)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              ⚽ Artilharia
            </button>
            <button
              onClick={() => setActiveTab("assisters")}
              className={`rounded-md px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "assisters"
                  ? "bg-[var(--brand)] text-[var(--bg)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              🅰️ Assistências
            </button>
            <button
              onClick={() => setActiveTab("cards")}
              className={`rounded-md px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "cards"
                  ? "bg-[var(--brand)] text-[var(--bg)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              🟨 Cartões
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === "scorers" && (
            <RankingTable title="Artilharia" data={topScorers} type="goals" />
          )}

          {activeTab === "assisters" && (
            <RankingTable title="Assistências" data={topAssisters} type="assists" />
          )}

          {activeTab === "cards" && (
            <RankingTable title="Cartões" data={mostCards} type="cards" />
          )}
        </div>
      </section>

      {/* Push Notification Toggle widget */}
      <PushSubscriptionCard />

      {/* Shortcuts grid */}
      <section className="app-surface p-6 sm:p-8 space-y-6 bg-[var(--bg-elevated)]/40 border border-[var(--border)] rounded-2xl">
        <div>
          <h2 className="text-lg font-bold uppercase text-[var(--text)] tracking-tight font-serif">Atalhos Operacionais</h2>
          <p className="text-xs text-[var(--text-subtle)] mt-0.5">Gerenciamento direto dos módulos do portal</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-all duration-300 hover:border-[var(--brand)]/40 hover:bg-[var(--brand-soft)]/20 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-xl transition-transform group-hover:scale-110 duration-200">
                  {action.icon}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[var(--text)] uppercase group-hover:text-[var(--brand)] font-serif transition-colors duration-150 tracking-tight">
                    {action.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
