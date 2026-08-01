"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push("★");
    else if (rating >= i - 0.5) stars.push("✦");
    else stars.push("☆");
  }
  return <span className="text-xs tracking-wider text-[#fbbf24]">{stars.join("")}</span>;
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

export default function RatingsReport({
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

  const radarData = [
    { subject: "Técnico", A: data.skillRadar.technical, fullMark: 5 },
    { subject: "Tático", A: data.skillRadar.tactical, fullMark: 5 },
    { subject: "Físico", A: data.skillRadar.physical, fullMark: 5 },
    { subject: "Disciplina", A: data.skillRadar.discipline, fullMark: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Nota Média do Time
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-black text-white">{data.overview.avgTeamRating.toFixed(1)}</p>
            <div className="mb-1">
              <StarRating rating={data.overview.avgTeamRating} />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Total de Avaliações
          </p>
          <p className="text-2xl font-black text-white">{data.overview.totalEvaluations}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Total de Votos MVP
          </p>
          <p className="text-2xl font-black text-white">{data.overview.totalMvpVotes}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Total de Partidas Avaliadas
          </p>
          <p className="text-2xl font-black text-white">{data.overview.totalRatings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Line Chart */}
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Nota Média por Mês
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyAvg}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#8fa39b" }} />
                <Line type="monotone" dataKey="avgRating" name="Nota Média" stroke="#fbbf24" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Radar de Habilidades (Time)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#8fa39b", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: "#8fa39b", fontSize: 10 }} />
                <Radar name="Média" dataKey="A" stroke="#36c2a8" fill="#36c2a8" fillOpacity={0.5} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4 overflow-x-auto">
        <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
          Ranking de Jogadores
        </h3>
        <table className="w-full text-left text-sm text-white">
          <thead className="border-b border-white/[0.06] text-xs text-[#8fa39b]">
            <tr>
              <th className="py-2 pr-4 font-normal w-12 text-center">#</th>
              <th className="py-2 px-2 font-normal">Jogador</th>
              <th className="py-2 px-2 font-normal">Pos</th>
              <th className="py-2 px-2 font-normal">Nota Média</th>
              <th className="py-2 px-2 font-normal text-center">Avaliações</th>
              <th className="py-2 pl-4 font-normal text-center">MVPs</th>
            </tr>
          </thead>
          <tbody>
            {data.playerRatings
              .sort((a: any, b: any) => b.avgRating - a.avgRating)
              .map((player: any, idx: number) => (
                <tr
                  key={player.playerId}
                  className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="py-3 pr-4 text-center">
                    {idx < 3 ? ["🥇", "🥈", "🥉"][idx] : idx + 1}
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-medium">{player.playerName}</span>
                    <span className="ml-2 text-xs text-[#8fa39b]">#{player.shirtNumber}</span>
                  </td>
                  <td className="py-3 px-2 text-[#8fa39b]">
                    {positionLabels[player.position] || player.position}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{player.avgRating.toFixed(1)}</span>
                      <StarRating rating={player.avgRating} />
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center text-[#8fa39b]">{player.totalRatings}</td>
                  <td className="py-3 pl-4 text-center font-bold text-[#fbbf24]">
                    {player.mvpVotes > 0 ? player.mvpVotes : "-"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
