"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const positionLabels: Record<string, string> = {
  GOALKEEPER: "GOL", DEFENDER: "ZAG", LEFT_BACK: "LE", RIGHT_BACK: "LD", 
  LEFT_WINGBACK: "AE", RIGHT_WINGBACK: "AD", MIDFIELDER: "MEI", 
  DEFENSIVE_MIDFIELDER: "VOL", FORWARD: "ATA", LEFT_WINGER: "PE", RIGHT_WINGER: "PD"
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#1c1815] px-3 py-2 shadow-xl">
      <p className="text-xs font-bold text-white mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}%
        </p>
      ))}
    </div>
  );
};

export default function HomeAwayReport({ data, loading, error }: { data: any; loading: boolean; error: string }) {
  if (loading) return <div className="flex items-center justify-center py-20"><p className="text-sm text-[#8fa39b] animate-pulse">Carregando relatório...</p></div>;
  if (error) return <div className="rounded-xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.06)] p-4 text-sm text-[#f87171]">{error}</div>;
  if (!data || !data.summary || !data.players) return <div className="flex items-center justify-center py-20"><p className="text-sm text-[#8fa39b]">Nenhum dado encontrado</p></div>;

  const { summary, players } = data;
  const top15 = [...players].sort((a: any, b: any) => ((b.homeRate + b.awayRate) - (a.homeRate + a.awayRate))).slice(0, 15);
  const sortedPlayers = [...players].sort((a: any, b: any) => Math.abs(b.difference) - Math.abs(a.difference));

  const formatNumber = (num: number) => Intl.NumberFormat('pt-BR').format(num);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Jogos em Casa</p>
          <p className="mt-1 text-2xl font-black text-white">{summary.homeMatches}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Jogos Fora</p>
          <p className="mt-1 text-2xl font-black text-white">{summary.awayMatches}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Presença Casa</p>
          <p className="mt-1 text-2xl font-black text-white">{summary.homeAvgAttendance.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Presença Fora</p>
          <p className="mt-1 text-2xl font-black text-white">{summary.awayAvgAttendance.toFixed(1)}%</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] mb-4">Top 15 Jogadores: Presença Casa vs Fora</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top15} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="playerName" stroke="#8fa39b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="homeRate" name="Em Casa (%)" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="awayRate" name="Fora (%)" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#8fa39b]">
            <thead className="bg-[#1c1815] text-[10px] uppercase tracking-wider text-[#8fa39b]">
              <tr>
                <th className="px-4 py-3 font-medium">Jogador</th>
                <th className="px-4 py-3 font-medium text-center">Posição</th>
                <th className="px-4 py-3 font-medium text-center">Casa</th>
                <th className="px-4 py-3 font-medium text-center">Fora</th>
                <th className="px-4 py-3 font-medium text-center">% Casa</th>
                <th className="px-4 py-3 font-medium text-center">% Fora</th>
                <th className="px-4 py-3 font-medium text-center">Diferença</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {sortedPlayers.map((p: any) => (
                <tr key={p.playerId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{p.playerName}</td>
                  <td className="px-4 py-3 text-center">{positionLabels[p.position] || p.position}</td>
                  <td className="px-4 py-3 text-center">{p.homePresent}/{p.homeTotal}</td>
                  <td className="px-4 py-3 text-center">{p.awayPresent}/{p.awayTotal}</td>
                  <td className="px-4 py-3 text-center text-[#34d399]">{p.homeRate.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-center text-[#22d3ee]">{p.awayRate.toFixed(1)}%</td>
                  <td className={`px-4 py-3 text-center font-bold ${p.difference > 0 ? 'text-[#34d399]' : p.difference < 0 ? 'text-[#f87171]' : 'text-[#8fa39b]'}`}>
                    {p.difference > 0 ? '+' : ''}{p.difference.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
