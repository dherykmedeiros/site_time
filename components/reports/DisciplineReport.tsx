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

export default function DisciplineReport({
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

  const formatCurrency = (value: number) =>
    Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Amarelos
          </p>
          <p className="text-2xl font-black text-[#fbbf24]">{data.overview.totalYellowCards}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Vermelhos
          </p>
          <p className="text-2xl font-black text-[#f87171]">{data.overview.totalRedCards}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Multas
          </p>
          <p className="text-2xl font-black text-white">{data.overview.totalFines}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Valor em Multas
          </p>
          <p className="text-2xl font-black text-white">
            {formatCurrency(data.overview.totalFineAmount)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
        <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
          Cartões por Mês
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#8fa39b" }} />
              <Bar dataKey="yellowCards" name="Amarelos" stackId="a" fill="#fbbf24" radius={[0, 0, 4, 4]} />
              <Bar dataKey="redCards" name="Vermelhos" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4 overflow-x-auto">
        <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
          Ranking de Disciplina
        </h3>
        <table className="w-full text-left text-sm text-white">
          <thead className="border-b border-white/[0.06] text-xs text-[#8fa39b]">
            <tr>
              <th className="py-2 pr-4 font-normal">Jogador</th>
              <th className="py-2 px-2 font-normal">Pos</th>
              <th className="py-2 px-2 font-normal text-center">🟡</th>
              <th className="py-2 px-2 font-normal text-center">🔴</th>
              <th className="py-2 px-2 font-normal text-center">Total</th>
              <th className="py-2 px-2 font-normal text-center">Multas</th>
              <th className="py-2 pl-4 font-normal text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {data.players
              .sort((a: any, b: any) => b.totalCards - a.totalCards)
              .map((player: any, idx: number) => (
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
                  <td className="py-3 px-2 text-center text-[#fbbf24]">{player.yellowCards}</td>
                  <td className="py-3 px-2 text-center text-[#f87171]">{player.redCards}</td>
                  <td className="py-3 px-2 text-center font-bold">{player.totalCards}</td>
                  <td className="py-3 px-2 text-center">{player.fineCount}</td>
                  <td className="py-3 pl-4 text-right text-[#8fa39b]">
                    {formatCurrency(player.fineAmount)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
