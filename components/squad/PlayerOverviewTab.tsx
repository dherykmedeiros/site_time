"use client";

import React from "react";
import { formatDateOnly } from "@/lib/utils";

const achievementMeta: Record<string, { icon: string; label: string; color: string }> = {
  HAT_TRICK: { icon: "🎩", label: "Hat-trick", color: "border-yellow-400/40 bg-yellow-400/8 text-yellow-300" },
  TOP_SCORER_ROUND: { icon: "⚽", label: "Artilheiro da Rodada", color: "border-[#10b981]/40 bg-[#10b981]/8 text-[#34d399]" },
  VETERAN: { icon: "🎖️", label: "Veterano", color: "border-blue-400/40 bg-blue-400/8 text-blue-300" },
  ASSIST_MASTER: { icon: "🎯", label: "Mestre das Assistências", color: "border-purple-400/40 bg-purple-400/8 text-purple-300" },
  FULL_ATTENDANCE_MONTH: { icon: "📅", label: "Presença Perfeita", color: "border-cyan-400/40 bg-cyan-400/8 text-cyan-300" },
};

interface PlayerOverviewTabProps {
  player: {
    description?: string | null;
    achievements: Array<{
      id: string;
      type: string;
      awardedAt: string | Date;
    }>;
    fines: Array<{
      id: string;
      description: string;
      severity: string;
      matchesSuspended?: number | null;
      date: string | Date;
    }>;
  };
}

export function PlayerOverviewTab({ player }: PlayerOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Biografia / Sobre o Atleta */}
      {player.description && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="mb-3 text-xs font-black uppercase tracking-widest text-[#8fa39b]">
            📖 Biografia / Características
          </h2>
          <p className="text-sm text-[#8fa39b] leading-relaxed whitespace-pre-wrap">
            {player.description}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Achievements */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-[#8fa39b]">
            🏅 Conquistas
          </h2>
          {player.achievements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-[#8fa39b]">
              <p className="text-4xl mb-3">🎖️</p>
              <p className="font-semibold text-white text-sm">Nenhuma conquista ainda</p>
              <p className="mt-1 text-xs">Continue jogando para desbloquear conquistas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {player.achievements.map((ach) => {
                const meta = achievementMeta[ach.type] ?? {
                  icon: "🏆",
                  label: ach.type,
                  color: "border-white/10 bg-white/5 text-white",
                };
                return (
                  <div
                    key={ach.id}
                    className={`flex items-center gap-3 rounded-xl border ${meta.color} px-4 py-3 transition-all`}
                  >
                    <span className="text-2xl">{meta.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-white">{meta.label}</p>
                      <p className="text-[10px] text-[#8fa39b]">
                        {formatDateOnly(new Date(ach.awardedAt), { dateStyle: "short" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active fines */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-[#8fa39b]">
            ⚖️ Punições Ativas
          </h2>
          {player.fines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-[#8fa39b]">
              <p className="text-4xl mb-3">✅</p>
              <p className="font-semibold text-white text-sm">Nenhuma punição ativa</p>
              <p className="mt-1 text-xs">O atleta está regularizado no sistema.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {player.fines.map((fine) => (
                <div key={fine.id} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="mt-0.5 text-xl">
                    {fine.severity === "SUSPENSION" ? "🟥" : "🟨"}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">{fine.description}</p>
                    <p className="mt-0.5 text-xs text-[#8fa39b]">
                      {fine.severity === "SUSPENSION"
                        ? `Suspensão: ${fine.matchesSuspended} jogo(s)`
                        : "Advertência"}
                      {" · "}
                      {formatDateOnly(new Date(fine.date), { dateStyle: "short" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
