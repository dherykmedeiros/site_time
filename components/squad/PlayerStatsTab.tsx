"use client";

import React from "react";
import { RadarChart } from "@/components/ui/RadarChart";
import { formatDateOnly } from "@/lib/utils";

interface PlayerStatsTabProps {
  player: {
    evaluations: Array<{
      id: string;
      technical: number;
      tactical: number;
      physical: number;
      discipline: number;
      date: string | Date;
    }>;
  };
  champGoals: number;
  champAssists: number;
  champMatches: number;
  friendlyGoals: number;
  friendlyAssists: number;
  friendlyMatches: number;
}

export function PlayerStatsTab({
  player,
  champGoals,
  champAssists,
  champMatches,
  friendlyGoals,
  friendlyAssists,
  friendlyMatches,
}: PlayerStatsTabProps) {
  const latestEval = player.evaluations[0] ?? null;

  return (
    <div className="space-y-6">
      {/* Desempenho por Tipo de Competição */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-amber-500/10 pb-3 mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              🏆 Desempenho em Campeonato
            </h3>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
              {champMatches} {champMatches === 1 ? "partida" : "partidas"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-black text-white">{champGoals}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">⚽ Gols</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{champAssists}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">🎯 Assist.</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{champMatches}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">🏟️ Jogos</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-blue-500/10 pb-3 mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
              🤝 Desempenho em Amistosos
            </h3>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-300">
              {friendlyMatches} {friendlyMatches === 1 ? "partida" : "partidas"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-black text-white">{friendlyGoals}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400/80">⚽ Gols</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{friendlyAssists}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400/80">🎯 Assist.</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{friendlyMatches}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400/80">🏟️ Jogos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart e Barras de Progresso */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 max-w-2xl mx-auto">
        <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-[#8fa39b]">
          📊 Perfil Técnico e Atributos
        </h2>
        {latestEval ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center">
              <RadarChart
                data={{
                  technical: latestEval.technical,
                  tactical: latestEval.tactical,
                  physical: latestEval.physical,
                  discipline: latestEval.discipline,
                }}
                size={220}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {[
                { label: "Técnico", value: latestEval.technical },
                { label: "Tático", value: latestEval.tactical },
                { label: "Físico", value: latestEval.physical },
                { label: "Disciplina", value: latestEval.discipline },
              ].map((attr) => (
                <div
                  key={attr.label}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2"
                >
                  <span className="text-xs font-semibold text-[#8fa39b]">{attr.label}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                          i < attr.value ? "bg-[#10b981]" : "bg-white/10"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs font-black text-[#34d399]">{attr.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#8fa39b] text-center">
              Avaliação de {formatDateOnly(new Date(latestEval.date), { dateStyle: "short" })}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#8fa39b]">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold text-white text-sm">Sem avaliações registradas</p>
            <p className="mt-1 text-xs">Registre uma avaliação técnica para gerar este gráfico.</p>
          </div>
        )}
      </div>
    </div>
  );
}
