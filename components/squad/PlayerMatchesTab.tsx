"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import { PlayerCoachReportModal } from "./PlayerCoachReportModal";

interface PlayerMatchesTabProps {
  matchStats: Array<{
    id: string;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    match: {
      id: string;
      date: string | Date;
      opponent: string;
      homeScore: number | null;
      awayScore: number | null;
      isHome: boolean;
      status: string;
      coachReport?: {
        id: string;
        evaluations?: Array<{ id: string }>;
      } | null;
    };
  }>;
  absences: Array<{
    id: string;
    match: {
      id: string;
      date: string | Date;
      opponent: string;
      venue: string | null;
      homeScore: number | null;
      awayScore: number | null;
      isHome: boolean;
      type: string;
    };
  }>;
}

export function PlayerMatchesTab({ matchStats, absences }: PlayerMatchesTabProps) {
  const [selectedMatchIdForReport, setSelectedMatchIdForReport] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Histórico de Partidas */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="border-b border-white/5 px-6 py-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-[#8fa39b]">
            📋 Últimas Partidas (com estatísticas)
          </h2>
        </div>

        {matchStats.length === 0 ? (
          <div className="p-12 text-center text-[#8fa39b]">
            <p className="text-3xl mb-3">🏟️</p>
            <p className="font-semibold text-white text-sm">Nenhuma partida com stats registradas</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {/* Header */}
            <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_4rem_4rem_4rem_4rem] gap-2 bg-white/[0.015] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#8fa39b]">
              <span>Adversário</span>
              <span>Resultado</span>
              <span className="text-center">⚽</span>
              <span className="text-center">🎯</span>
              <span className="text-center">🟨</span>
              <span className="text-center">🟥</span>
            </div>

            {matchStats.map((stat) => {
              const match = stat.match;
              const teamGoals = match.isHome ? match.homeScore : match.awayScore;
              const opponentGoals = match.isHome ? match.awayScore : match.homeScore;
              const resultLabel =
                teamGoals == null || opponentGoals == null
                  ? "—"
                  : teamGoals > opponentGoals
                  ? "✓ Vitória"
                  : teamGoals < opponentGoals
                  ? "✗ Derrota"
                  : "= Empate";
              const resultColor =
                teamGoals == null
                  ? "text-[#8fa39b]"
                  : teamGoals > (opponentGoals ?? 0)
                  ? "text-[#34d399]"
                  : teamGoals < (opponentGoals ?? 0)
                  ? "text-red-400"
                  : "text-yellow-400";

              return (
                <div
                  key={stat.id}
                  className="flex flex-col gap-2 px-6 py-4 transition hover:bg-white/[0.02] sm:grid sm:grid-cols-[2fr_1fr_4rem_4rem_4rem_4rem] sm:items-center sm:gap-2"
                >
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {match.isHome ? "vs" : "@"} {match.opponent}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#8fa39b]">{formatDate(new Date(match.date))}</span>
                      {match.coachReport?.evaluations && match.coachReport.evaluations.length > 0 && (
                        <button
                          onClick={() => setSelectedMatchIdForReport(match.id)}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        >
                          📋 Parecer do Treinador
                        </button>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs font-bold ${resultColor}`}>
                    {resultLabel}
                    {teamGoals != null && opponentGoals != null && ` (${teamGoals}x${opponentGoals})`}
                  </p>
                  <p className="text-center font-black text-[#34d399] sm:text-center">{stat.goals}</p>
                  <p className="text-center font-bold text-white sm:text-center">{stat.assists}</p>
                  <p className="text-center font-bold text-yellow-400 sm:text-center">{stat.yellowCards}</p>
                  <p className="text-center font-bold text-red-400 sm:text-center">{stat.redCards}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Histórico de Ausências */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.02] overflow-hidden">
        <div className="border-b border-red-500/10 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-red-400">
                Faltas em Jogos Confirmados
              </h2>
              <p className="text-[11px] text-[#8fa39b]">
                Partidas em que o atleta confirmou presença no RSVP (SIM) mas não compareceu
              </p>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              absences.length > 0
                ? "bg-red-500/10 border border-red-500/30 text-red-400"
                : "bg-emerald-500/10 border border-emerald-500/30 text-[#34d399]"
            }`}
          >
            {absences.length} {absences.length === 1 ? "falta registrada" : "faltas registradas"}
          </span>
        </div>

        {absences.length === 0 ? (
          <div className="p-8 text-center text-[#8fa39b]">
            <p className="text-3xl mb-2">✅</p>
            <p className="font-semibold text-white text-sm">Nenhuma falta em jogos confirmados</p>
            <p className="text-xs text-[#8fa39b] mt-1">Sua assiduidade está impecável!</p>
          </div>
        ) : (
          <div className="divide-y divide-red-500/10">
            {absences.map((absence) => (
              <div key={absence.id} className="flex items-center justify-between px-6 py-3 text-xs">
                <div>
                  <span className="font-bold text-white">
                    {absence.match.isHome ? "vs" : "@"} {absence.match.opponent}
                  </span>
                  <span className="text-[#8fa39b] ml-2 font-mono">
                    ({formatDate(new Date(absence.match.date))})
                  </span>
                </div>
                <span className="font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-[10px]">
                  FALTOU
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal do Parecer Individual do Treinador */}
      {selectedMatchIdForReport && (
        <PlayerCoachReportModal
          matchId={selectedMatchIdForReport}
          onClose={() => setSelectedMatchIdForReport(null)}
        />
      )}
    </div>
  );
}
