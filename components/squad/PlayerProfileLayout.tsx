"use client";

import React from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { CoachPositionEditor } from "@/components/dashboard/CoachPositionEditor";
import { playerPositionLabels } from "@/lib/player-positions";
import { PlayerOverviewTab } from "./PlayerOverviewTab";
import { PlayerStatsTab } from "./PlayerStatsTab";
import { PlayerMatchesTab } from "./PlayerMatchesTab";
import { PlayerFinanceTab } from "./PlayerFinanceTab";

const positionLabels: Record<string, string> = playerPositionLabels;

interface PlayerProfileLayoutProps {
  playerData: {
    player: any;
    allMatchStats: any[];
    confirmedRSVPs: any[];
    membershipPayments: any[];
    matchPayments: any[];
  };
  isMe?: boolean;
  isCoachOrAdmin: boolean;
}

export function PlayerProfileLayout({
  playerData,
  isMe = false,
  isCoachOrAdmin,
}: PlayerProfileLayoutProps) {
  const { player, allMatchStats, confirmedRSVPs, membershipPayments, matchPayments } = playerData;

  // Aggregate stats across all matches
  const totalGoals = allMatchStats.reduce((sum, s) => sum + s.goals, 0);
  const totalAssists = allMatchStats.reduce((sum, s) => sum + s.assists, 0);
  const matchesWithStats = allMatchStats.length;

  const championshipStats = allMatchStats.filter((s) => s.match.type === "CHAMPIONSHIP");
  const friendlyStats = allMatchStats.filter((s) => s.match.type === "FRIENDLY");

  const champGoals = championshipStats.reduce((sum, s) => sum + s.goals, 0);
  const champAssists = championshipStats.reduce((sum, s) => sum + s.assists, 0);
  const champMatches = championshipStats.length;

  const friendlyGoals = friendlyStats.reduce((sum, s) => sum + s.goals, 0);
  const friendlyAssists = friendlyStats.reduce((sum, s) => sum + s.assists, 0);
  const friendlyMatches = friendlyStats.length;

  const totalAttendances = player.attendances.length;
  const presentCount = player.attendances.filter((a: any) => a.present).length;
  const attendanceRate = totalAttendances > 0 ? Math.round((presentCount / totalAttendances) * 100) : 0;

  // Absences calculation (RSVP is YES but did not attend)
  const absences = confirmedRSVPs.filter((r) => {
    const att = r.match.attendances[0];
    return !att || att.present === false;
  });

  const statCards = [
    { label: "Gols Totais", value: totalGoals, icon: "⚽", color: "text-[#34d399]", border: "border-[rgba(16,185,129,0.2)]", bg: "bg-[rgba(16,185,129,0.04)]" },
    { label: "Assistências", value: totalAssists, icon: "🎯", color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/4" },
    { label: "Partidas", value: matchesWithStats, icon: "🏟️", color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/4" },
    { label: "Presença", value: `${attendanceRate}%`, icon: "📅", color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/4" },
    {
      label: "Faltas (Confirmadas)",
      value: absences.length,
      icon: "⚠️",
      color: absences.length > 0 ? "text-red-400" : "text-[#34d399]",
      border: absences.length > 0 ? "border-red-500/30" : "border-emerald-500/20",
      bg: absences.length > 0 ? "bg-red-500/[0.06]" : "bg-emerald-500/4",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back button and Feedback shortcut (only when not personal 'me' profile) */}
      {!isMe && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard/squad"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-[#8fa39b] transition hover:bg-white/[0.07] hover:text-white"
          >
            ← Voltar ao Elenco
          </Link>
          <Link
            href="/dashboard/evaluations"
            className="inline-flex items-center gap-2 rounded-xl border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.08)] px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-[rgba(59,130,246,0.15)]"
          >
            📈 Ver Avaliações & Feedback
          </Link>
        </div>
      )}

      {/* Profile header */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(16,185,129,0.18)] bg-[rgba(10,24,20,0.4)] backdrop-blur-md">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#10b981] opacity-5 blur-3xl" />

        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {player.photoUrl ? (
              <img
                src={player.photoUrl}
                alt={player.name}
                className="h-28 w-28 rounded-2xl object-cover ring-2 ring-[rgba(16,185,129,0.4)] shadow-[0_0_30px_rgba(16,185,129,0.15)]"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[rgba(16,185,129,0.1)] text-5xl font-black text-[#34d399] ring-2 ring-[rgba(16,185,129,0.3)]">
                {player.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                  player.status === "ACTIVE"
                    ? "bg-[rgba(16,185,129,0.15)] text-[#34d399] border border-[rgba(16,185,129,0.3)]"
                    : "bg-white/5 text-[#8fa39b] border border-white/10"
                }`}
              >
                {player.status === "ACTIVE" ? "✓ Ativo" : "✕ Inativo"}
              </span>
              {player.user && (
                <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-400">
                  🔗 Conta vinculada
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-[#34d399] bg-clip-text text-transparent">
              {player.name}
            </h1>
            {player.fullName && player.fullName !== player.name && (
              <p className="text-sm text-[#8fa39b]">{player.fullName}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-[#8fa39b]">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#34d399] font-black">#{player.shirtNumber}</span>
                <span>Camisa</span>
              </span>
              <span>·</span>
              <span>{positionLabels[player.position] || player.position}</span>
              {player.secondaryPosition && (
                <>
                  <span>·</span>
                  <span className="text-xs text-emerald-400/90 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    Sec: {positionLabels[player.secondaryPosition] || player.secondaryPosition}
                  </span>
                </>
              )}
              {player.age && (
                <>
                  <span>·</span>
                  <span>{player.age} anos</span>
                </>
              )}

              <CoachPositionEditor
                playerId={player.id}
                playerName={player.name}
                currentPosition={player.position}
                currentSecondaryPosition={player.secondaryPosition}
                isCoachOrAdmin={isCoachOrAdmin}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border ${s.border} ${s.bg} p-5 text-center transition-all duration-300 hover:brightness-110`}
          >
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[#8fa39b]">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs navigation */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList aria-label="Abas de Perfil do Jogador">
          <TabsTrigger value="overview">Geral</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="matches">Histórico de Jogos</TabsTrigger>
          <TabsTrigger value="finances">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PlayerOverviewTab player={player} />
        </TabsContent>

        <TabsContent value="stats">
          <PlayerStatsTab
            player={player}
            champGoals={champGoals}
            champAssists={champAssists}
            champMatches={champMatches}
            friendlyGoals={friendlyGoals}
            friendlyAssists={friendlyAssists}
            friendlyMatches={friendlyMatches}
          />
        </TabsContent>

        <TabsContent value="matches">
          <PlayerMatchesTab matchStats={player.matchStats} absences={absences} />
        </TabsContent>

        <TabsContent value="finances">
          <PlayerFinanceTab
            membershipPayments={membershipPayments}
            matchPayments={matchPayments}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
