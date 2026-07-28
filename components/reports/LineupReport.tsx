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
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#1c1815] px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-bold text-white">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
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

export default function LineupReport({
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

  const top15Players = [...data.players]
    .sort((a: any, b: any) => b.totalSelections - a.totalSelections)
    .slice(0, 15);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Jogos Analisados
          </p>
          <p className="text-2xl font-black text-white">{data.overview.totalMatches}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Tamanho Médio do Elenco
          </p>
          <p className="text-2xl font-black text-white">
            {data.overview.avgSquadSize.toFixed(1)}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Formação Mais Usada
          </p>
          <p className="text-2xl font-black text-[#34d399]">
            {data.overview.mostUsedFormation || "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Horizontal Stacked Bar */}
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Top 15 Jogadores Mais Escalados
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top15Players} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="playerName" type="category" stroke="#8fa39b" fontSize={10} tickLine={false} axisLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#8fa39b" }} />
                <Bar dataKey="starterCount" name="Titular" stackId="a" fill="#10b981" />
                <Bar dataKey="benchCount" name="Reserva" stackId="a" fill="#fbbf24" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grouped Bar */}
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Média por Posição
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.positionDistribution} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="positionLabel" stroke="#8fa39b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#8fa39b" }} />
                <Bar dataKey="avgStarters" name="Titulares" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgBench" name="Reservas" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4 overflow-x-auto">
        <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
          Visão Geral do Elenco
        </h3>
        <table className="w-full text-left text-sm text-white">
          <thead className="border-b border-white/[0.06] text-xs text-[#8fa39b]">
            <tr>
              <th className="py-2 pr-4 font-normal">Jogador</th>
              <th className="py-2 px-2 font-normal">Pos</th>
              <th className="py-2 px-2 font-normal text-center">Selecionado</th>
              <th className="py-2 px-2 font-normal text-center">Titular</th>
              <th className="py-2 px-2 font-normal text-center">Reserva</th>
              <th className="py-2 px-2 font-normal w-32">% Titular</th>
              <th className="py-2 pl-4 font-normal text-center">Não Escalado</th>
            </tr>
          </thead>
          <tbody>
            {data.players.map((player: any) => (
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
                <td className="py-3 px-2 text-center font-bold">{player.totalSelections}</td>
                <td className="py-3 px-2 text-center text-[#10b981]">{player.starterCount}</td>
                <td className="py-3 px-2 text-center text-[#fbbf24]">{player.benchCount}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-right">{player.starterRate.toFixed(0)}%</span>
                    <div className="h-1.5 w-full rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#34d399]"
                        style={{ width: `${player.starterRate}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 pl-4 text-center text-[#8fa39b]">{player.notSelectedCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
