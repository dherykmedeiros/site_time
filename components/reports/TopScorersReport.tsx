"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

const positionLabels: Record<string, string> = {
  GOALKEEPER: "Goleiro", DEFENDER: "Zagueiro", LEFT_BACK: "Lateral Esq.", RIGHT_BACK: "Lateral Dir.", 
  LEFT_WINGBACK: "Ala Esq.", RIGHT_WINGBACK: "Ala Dir.", MIDFIELDER: "Meia", 
  DEFENSIVE_MIDFIELDER: "Volante", FORWARD: "Atacante", LEFT_WINGER: "Ponta Esq.", RIGHT_WINGER: "Ponta Dir."
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#1c1815] px-3 py-2 shadow-xl">
      <p className="text-xs font-bold text-white mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function TopScorersReport({ data, loading, error }: { data: any; loading: boolean; error: string }) {
  if (loading) return <div className="flex items-center justify-center py-20"><p className="text-sm text-[#8fa39b] animate-pulse">Carregando relatório...</p></div>;
  if (error) return <div className="rounded-xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.06)] p-4 text-sm text-[#f87171]">{error}</div>;
  if (!data || !data.players) return <div className="flex items-center justify-center py-20"><p className="text-sm text-[#8fa39b]">Nenhum dado encontrado</p></div>;

  const { players, monthly } = data;
  
  const totalGoals = players.reduce((sum: number, p: any) => sum + p.goals, 0);
  const totalAssists = players.reduce((sum: number, p: any) => sum + p.assists, 0);
  const totalContributions = players.reduce((sum: number, p: any) => sum + p.goalContributions, 0);
  const totalMatches = Math.max(...players.map((p: any) => p.matchesPlayed), 0); // Estimate

  const top10 = [...players].sort((a: any, b: any) => b.goals - a.goals || b.assists - a.assists).slice(0, 10);
  const sortedTable = [...players].sort((a: any, b: any) => b.goalContributions - a.goalContributions || b.goals - a.goals);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Total de Gols</p>
          <p className="mt-1 text-2xl font-black text-white">{totalGoals}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Total de Assistências</p>
          <p className="mt-1 text-2xl font-black text-white">{totalAssists}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Participação em Gols</p>
          <p className="mt-1 text-2xl font-black text-white">{totalContributions}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Máx Jogos Disp.</p>
          <p className="mt-1 text-2xl font-black text-white">{totalMatches}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] mb-4">Top 10 Artilheiros</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={top10} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="playerName" type="category" stroke="#8fa39b" fontSize={10} width={80} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="goals" name="Gols" fill="#34d399" radius={[0, 4, 4, 0]} />
                <Bar dataKey="assists" name="Assistências" fill="#22d3ee" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] mb-4">Evolução Mensal (Gols e Assistências)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAssists" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="month" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="goals" name="Gols" stroke="#34d399" fillOpacity={1} fill="url(#colorGoals)" />
                <Area type="monotone" dataKey="assists" name="Assistências" stroke="#22d3ee" fillOpacity={1} fill="url(#colorAssists)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] overflow-hidden">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] p-6 pb-2">Ranking Geral</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#8fa39b]">
            <thead className="bg-[#1c1815] text-[10px] uppercase tracking-wider text-[#8fa39b]">
              <tr>
                <th className="px-4 py-3 font-medium w-12 text-center">#</th>
                <th className="px-4 py-3 font-medium">Jogador</th>
                <th className="px-4 py-3 font-medium">Posição</th>
                <th className="px-4 py-3 font-medium text-center">Gols</th>
                <th className="px-4 py-3 font-medium text-center">Assist.</th>
                <th className="px-4 py-3 font-medium text-center">G+A</th>
                <th className="px-4 py-3 font-medium text-center">Jogos</th>
                <th className="px-4 py-3 font-medium text-center">Média/Jogo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {sortedTable.map((p: any, idx: number) => {
                const avg = p.matchesPlayed > 0 ? (p.goalContributions / p.matchesPlayed).toFixed(2) : "0.00";
                return (
                  <tr key={p.playerId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-center text-white/50">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-white">
                      <div className="flex items-center gap-2">
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt={p.playerName} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">{p.playerName.charAt(0)}</div>
                        )}
                        {p.playerName} {p.shirtNumber && <span className="text-[10px] text-white/40">#{p.shirtNumber}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">{positionLabels[p.position] || p.position}</td>
                    <td className="px-4 py-3 text-center font-bold text-[#34d399]">{p.goals}</td>
                    <td className="px-4 py-3 text-center font-bold text-[#22d3ee]">{p.assists}</td>
                    <td className="px-4 py-3 text-center font-bold text-white">{p.goalContributions}</td>
                    <td className="px-4 py-3 text-center">{p.matchesPlayed}</td>
                    <td className="px-4 py-3 text-center">{avg}</td>
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
