"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

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

const typeLabels: Record<string, string> = { FRIENDLY: "Amistoso", CHAMPIONSHIP: "Campeonato" };

export default function TeamPerformance({ data, loading, error }: { data: any; loading: boolean; error: string }) {
  if (loading) return <div className="flex items-center justify-center py-20"><p className="text-sm text-[#8fa39b] animate-pulse">Carregando relatório...</p></div>;
  if (error) return <div className="rounded-xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.06)] p-4 text-sm text-[#f87171]">{error}</div>;
  if (!data || !data.overview) return <div className="flex items-center justify-center py-20"><p className="text-sm text-[#8fa39b]">Nenhum dado encontrado</p></div>;

  const { overview, byType, byVenue, monthly, streaks } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Jogos</p>
          <p className="mt-1 text-2xl font-black text-white">{overview.totalMatches}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Vitórias</p>
          <p className="mt-1 text-2xl font-black text-[#34d399]">{overview.wins}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Empates</p>
          <p className="mt-1 text-2xl font-black text-[#fbbf24]">{overview.draws}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Derrotas</p>
          <p className="mt-1 text-2xl font-black text-[#f87171]">{overview.losses}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Aproveitamento</p>
          <p className="mt-1 text-2xl font-black text-white">{overview.winRate.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Saldo Gols</p>
          <p className={`mt-1 text-2xl font-black ${overview.goalDifference > 0 ? 'text-[#34d399]' : overview.goalDifference < 0 ? 'text-[#f87171]' : 'text-white'}`}>
            {overview.goalDifference > 0 ? '+' : ''}{overview.goalDifference}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] mb-4">Resultados por Mês</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="month" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="wins" stackId="a" name="Vitórias" fill="#34d399" />
                <Bar dataKey="draws" stackId="a" name="Empates" fill="#fbbf24" />
                <Bar dataKey="losses" stackId="a" name="Derrotas" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] mb-4">Gols Pró vs Contra</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="month" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="goalsFor" name="Gols Feitos" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: '#34d399', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="goalsAgainst" name="Gols Sofridos" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: '#f87171', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-white/[0.06] bg-[#1c1815] p-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] mb-4">Sequências</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
              <span className="text-sm text-[#8fa39b]">Sequência Atual</span>
              <span className="font-bold text-white">{streaks.currentStreak?.count || 0} {streaks.currentStreak?.type === 'win' ? 'Vitória(s)' : streaks.currentStreak?.type === 'loss' ? 'Derrota(s)' : 'Empate(s)'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
              <span className="text-sm text-[#8fa39b]">Maior S. Vitórias</span>
              <span className="font-bold text-[#34d399]">{streaks.longestWinStreak || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-sm text-[#8fa39b]">Maior S. Invicta</span>
              <span className="font-bold text-[#34d399]">{streaks.longestUnbeatenStreak || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border border-white/[0.06] bg-[#1c1815] p-6 lg:col-span-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] mb-4">Mando de Campo</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#16130f] rounded-lg p-4">
              <p className="text-xs font-bold text-white mb-2">Casa</p>
              <div className="flex justify-between text-sm mb-1"><span className="text-[#8fa39b]">Jogos</span> <span className="font-bold">{byVenue?.home?.matches || 0}</span></div>
              <div className="flex justify-between text-sm mb-1"><span className="text-[#8fa39b]">Vitórias</span> <span className="font-bold text-[#34d399]">{byVenue?.home?.wins || 0}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#8fa39b]">Apr.</span> <span className="font-bold">{byVenue?.home?.winRate?.toFixed(1) || 0}%</span></div>
            </div>
            <div className="bg-[#16130f] rounded-lg p-4">
              <p className="text-xs font-bold text-white mb-2">Fora</p>
              <div className="flex justify-between text-sm mb-1"><span className="text-[#8fa39b]">Jogos</span> <span className="font-bold">{byVenue?.away?.matches || 0}</span></div>
              <div className="flex justify-between text-sm mb-1"><span className="text-[#8fa39b]">Vitórias</span> <span className="font-bold text-[#34d399]">{byVenue?.away?.wins || 0}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#8fa39b]">Apr.</span> <span className="font-bold">{byVenue?.away?.winRate?.toFixed(1) || 0}%</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
