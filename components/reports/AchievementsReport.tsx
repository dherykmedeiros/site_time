"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#1c1815] px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-bold text-white">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: entry.color || entry.payload.fill }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const positionLabels: Record<string, string> = {
  GOALKEEPER: "GOL",
  DEFENDER: "ZAG",
  LEFT_BACK: "LE",
  RIGHT_BACK: "LD",
  LEFT_WINGBACK: "AE",
  RIGHT_WINGBACK: "AD",
  MIDFIELDER: "MEI",
  DEFENSIVE_MIDFIELDER: "VOL",
  FORWARD: "ATA",
  LEFT_WINGER: "PE",
  RIGHT_WINGER: "PD",
};

const badgeLabels: Record<string, string> = {
  HAT_TRICK: "⚽ Hat-trick",
  TOP_SCORER_ROUND: "🎯 Artilheiro",
  VETERAN: "🏅 Veterano",
  ASSIST_MASTER: "🅰️ Assistências",
  FULL_ATTENDANCE_MONTH: "✅ Presença Total",
};

const badgeColors: Record<string, string> = {
  HAT_TRICK: "bg-[rgba(54,194,168,0.12)] text-[#36c2a8] border-[rgba(54,194,168,0.25)]",
  TOP_SCORER_ROUND: "bg-[rgba(251,191,36,0.12)] text-[#fbbf24] border-[rgba(251,191,36,0.25)]",
  VETERAN: "bg-[rgba(129,140,248,0.12)] text-[#818cf8] border-[rgba(129,140,248,0.25)]",
  ASSIST_MASTER: "bg-[rgba(34,211,238,0.12)] text-[#22d3ee] border-[rgba(34,211,238,0.25)]",
  FULL_ATTENDANCE_MONTH: "bg-[rgba(16,185,129,0.12)] text-[#10b981] border-[rgba(16,185,129,0.25)]",
};

const barColors = ["#34d399", "#36c2a8", "#fbbf24", "#818cf8", "#22d3ee", "#a78bfa", "#f87171"];

export default function AchievementsReport({
  data,
  loading,
  error,
}: {
  data: any;
  loading: boolean;
  error: string;
}) {
  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="animate-pulse text-sm text-[#8fa39b]">Carregando relatório...</p>
      </div>
    );
  if (error)
    return (
      <div className="rounded-xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.06)] p-4 text-sm text-[#f87171]">
        {error}
      </div>
    );
  if (!data)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[#8fa39b]">Nenhum dado encontrado</p>
      </div>
    );

  const top3 = data.topMvps || [];
  const mvp1 = top3[0];
  const mvp2 = top3[1];
  const mvp3 = top3[2];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Total de Conquistas
          </p>
          <p className="text-2xl font-black text-[#34d399]">{data.overview.totalAchievements}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Jogadores Premiados
          </p>
          <p className="text-2xl font-black text-white">{data.overview.uniqueAchievers}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Votos MVP Totais
          </p>
          <p className="text-2xl font-black text-[#fbbf24]">{data.overview.totalMvpVotes}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* MVP Podium */}
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4 flex flex-col">
          <h3 className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Podium MVP
          </h3>
          <div className="flex-1 flex items-end justify-center gap-4 px-4 pb-4">
            {/* 2nd Place */}
            {mvp2 && (
              <div className="flex flex-col items-center w-1/3">
                <div className="mb-2 flex flex-col items-center">
                  <div className="text-3xl mb-1">🥈</div>
                  <span className="text-sm font-bold text-white text-center line-clamp-1">{mvp2.playerName}</span>
                  <span className="text-xs text-[#8fa39b]">#{mvp2.shirtNumber}</span>
                </div>
                <div className="w-full h-24 bg-gradient-to-t from-white/5 to-[#9ca3af]/20 rounded-t-lg border-t-2 border-[#9ca3af] flex items-center justify-center">
                  <span className="text-xs font-bold text-[#9ca3af]">{mvp2.mvpVotes} votos</span>
                </div>
              </div>
            )}
            {/* 1st Place */}
            {mvp1 && (
              <div className="flex flex-col items-center w-1/3">
                <div className="mb-2 flex flex-col items-center">
                  <div className="text-4xl mb-1">👑</div>
                  <span className="text-sm font-bold text-white text-center line-clamp-1">{mvp1.playerName}</span>
                  <span className="text-xs text-[#8fa39b]">#{mvp1.shirtNumber}</span>
                </div>
                <div className="w-full h-32 bg-gradient-to-t from-white/5 to-[#fbbf24]/20 rounded-t-lg border-t-2 border-[#fbbf24] flex items-center justify-center shadow-[0_-10px_30px_rgba(251,191,36,0.15)]">
                  <span className="text-xs font-bold text-[#fbbf24]">{mvp1.mvpVotes} votos</span>
                </div>
              </div>
            )}
            {/* 3rd Place */}
            {mvp3 && (
              <div className="flex flex-col items-center w-1/3">
                <div className="mb-2 flex flex-col items-center">
                  <div className="text-2xl mb-1">🥉</div>
                  <span className="text-sm font-bold text-white text-center line-clamp-1">{mvp3.playerName}</span>
                  <span className="text-xs text-[#8fa39b]">#{mvp3.shirtNumber}</span>
                </div>
                <div className="w-full h-16 bg-gradient-to-t from-white/5 to-[#d97706]/20 rounded-t-lg border-t-2 border-[#d97706] flex items-center justify-center">
                  <span className="text-xs font-bold text-[#d97706]">{mvp3.mvpVotes} votos</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart by Type */}
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Conquistas por Tipo
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byType}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="typeLabel" stroke="#8fa39b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Quantidade" radius={[4, 4, 0, 0]}>
                  {data.byType.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4 overflow-x-auto">
        <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
          Quadro de Honra
        </h3>
        <table className="w-full text-left text-sm text-white">
          <thead className="border-b border-white/[0.06] text-xs text-[#8fa39b]">
            <tr>
              <th className="py-2 pr-4 font-normal">Jogador</th>
              <th className="py-2 px-2 font-normal">Pos</th>
              <th className="py-2 px-2 font-normal text-center">Total</th>
              <th className="py-2 pl-4 font-normal">Tipos de Conquista</th>
            </tr>
          </thead>
          <tbody>
            {data.playerAchievements
              .sort((a: any, b: any) => b.achievements - a.achievements)
              .map((player: any) => (
                <tr
                  key={player.playerId}
                  className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="py-3 pr-4">
                    <span className="font-medium">{player.playerName}</span>
                    <span className="ml-2 text-xs text-[#8fa39b]">#{player.shirtNumber}</span>
                  </td>
                  <td className="py-3 px-2 text-[#8fa39b]">
                    {positionLabels[player.position] || player.position}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-[#34d399]">{player.achievements}</td>
                  <td className="py-3 pl-4">
                    <div className="flex flex-wrap gap-2">
                      {player.types.map((type: string, i: number) => (
                        <span
                          key={i}
                          className={`px-2 py-1 text-[10px] font-bold rounded-md border ${
                            badgeColors[type] || "bg-white/5 text-white border-white/10"
                          }`}
                        >
                          {badgeLabels[type] || type}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
