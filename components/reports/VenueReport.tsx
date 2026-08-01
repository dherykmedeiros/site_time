"use client";

import React, { useState } from "react";
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
          {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
        </p>
      ))}
    </div>
  );
};

export default function VenueReport({
  data,
  loading,
  error,
  onSelectVenue,
  selectedVenue,
}: {
  data: any;
  loading: boolean;
  error: string;
  onSelectVenue?: (venue: string) => void;
  selectedVenue?: string;
}) {
  const [internalVenue, setInternalVenue] = useState(selectedVenue || "ALL");

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="animate-pulse text-sm text-[#8fa39b]">Carregando relatório de locais...</p>
      </div>
    );
  if (error)
    return (
      <div className="rounded-xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.06)] p-4 text-sm text-[#f87171]">
        {error}
      </div>
    );
  if (!data || !data.overview)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[#8fa39b]">Nenhum dado encontrado</p>
      </div>
    );

  const { overview, venuesList, players } = data;

  const handleVenueChange = (val: string) => {
    setInternalVenue(val);
    if (onSelectVenue) onSelectVenue(val);
  };

  const topVenues = [...(venuesList || [])].slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Venue Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
        <div>
          <h2 className="text-sm font-bold text-white">Selecione o Campo / Local:</h2>
          <p className="text-xs text-[#8fa39b]">
            Veja estatísticas individuais e de presença por localidade
          </p>
        </div>
        <select
          value={internalVenue}
          onChange={(e) => handleVenueChange(e.target.value)}
          className="h-10 rounded-lg border border-white/10 bg-[#1c1815] px-4 text-sm font-semibold text-[#34d399] outline-none focus:border-[#36c2a8] transition-colors"
        >
          <option value="ALL">🏟️ Todos os Locais ({venuesList.reduce((acc: number, v: any) => acc + v.matchCount, 0)} jogos)</option>
          {venuesList.map((v: any) => (
            <option key={v.venue} value={v.venue}>
              📍 {v.venue} ({v.matchCount} {v.matchCount === 1 ? "jogo" : "jogos"})
            </option>
          ))}
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">
            Jogos no Campo
          </p>
          <p className="mt-1 text-2xl font-black text-white">{overview.totalMatches}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">
            Aproveitamento
          </p>
          <p className="mt-1 text-2xl font-black text-[#34d399]">
            {overview.winRate.toFixed(1)}%
          </p>
          <p className="mt-1 text-[10px] text-[#8fa39b]">
            {overview.wins}V - {overview.draws}E - {overview.losses}D
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">
            Média de Presença
          </p>
          <p className="mt-1 text-2xl font-black text-[#22d3ee]">
            {overview.avgAttendance.toFixed(1)}
          </p>
          <p className="mt-1 text-[10px] text-[#8fa39b]">atletas / jogo</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">
            Saldo de Gols
          </p>
          <p
            className={`mt-1 text-2xl font-black ${
              overview.goalDifference > 0
                ? "text-[#34d399]"
                : overview.goalDifference < 0
                ? "text-[#f87171]"
                : "text-white"
            }`}
          >
            {overview.goalDifference > 0 ? "+" : ""}
            {overview.goalDifference}
          </p>
          <p className="mt-1 text-[10px] text-[#8fa39b]">
            {overview.goalsFor} pró / {overview.goalsAgainst} contra
          </p>
        </div>
      </div>

      {/* Comparison Chart across Venues */}
      {topVenues.length > 1 && (
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-6">
          <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Comparativo de Campos (Jogos & Presença Média)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVenues} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="venue" stroke="#8fa39b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="matchCount" name="Total de Jogos" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgAttendance" name="Presença Média" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table of Players at the selected Venue */}
      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] overflow-hidden">
        <div className="p-6 pb-2 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Atletas no Local: {overview.selectedVenue}
          </h3>
          <span className="text-xs text-[#8fa39b]">
            {players.length} atletas analisados
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#8fa39b]">
            <thead className="bg-[#1c1815] text-[10px] uppercase tracking-wider text-[#8fa39b]">
              <tr>
                <th className="px-4 py-3 font-medium">Jogador</th>
                <th className="px-4 py-3 font-medium text-center">Posição</th>
                <th className="px-4 py-3 font-medium text-center">Presenças</th>
                <th className="px-4 py-3 font-medium w-48">% Presença</th>
                <th className="px-4 py-3 font-medium text-center">Gols</th>
                <th className="px-4 py-3 font-medium text-center">Assistências</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {players.map((p: any, idx: number) => {
                let medal = "";
                if (idx === 0) medal = "🥇";
                else if (idx === 1) medal = "🥈";
                else if (idx === 2) medal = "🥉";

                return (
                  <tr key={p.playerId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                      <span className="w-5 text-center">{medal}</span>
                      {p.playerName}{" "}
                      {p.shirtNumber && (
                        <span className="text-[10px] text-white/40">#{p.shirtNumber}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {positionLabels[p.position] || p.position}
                    </td>
                    <td className="px-4 py-3 text-center text-[#34d399] font-bold">
                      {p.presentCount}/{p.matchesPlayed}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-10 text-right font-bold text-white">
                          {p.attendanceRate.toFixed(1)}%
                        </span>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#34d399] rounded-full"
                            style={{ width: `${Math.min(p.attendanceRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-white font-bold">
                      {p.goals > 0 ? p.goals : "-"}
                    </td>
                    <td className="px-4 py-3 text-center text-[#22d3ee] font-bold">
                      {p.assists > 0 ? p.assists : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
