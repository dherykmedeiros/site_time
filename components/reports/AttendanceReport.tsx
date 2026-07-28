"use client";
import React from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
          {entry.name}: {entry.value}{entry.dataKey === 'attendanceRate' ? '%' : ''}
        </p>
      ))}
    </div>
  );
};

export default function AttendanceReport({ data, loading, error }: { data: any; loading: boolean; error: string }) {
  if (loading) return <div className="flex items-center justify-center py-20"><p className="text-sm text-[#8fa39b] animate-pulse">Carregando relatório...</p></div>;
  if (error) return <div className="rounded-xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.06)] p-4 text-sm text-[#f87171]">{error}</div>;
  if (!data || !data.overview) return <div className="flex items-center justify-center py-20"><p className="text-sm text-[#8fa39b]">Nenhum dado encontrado</p></div>;

  const { overview, players, monthly } = data;
  
  const sortedPlayers = [...players].sort((a: any, b: any) => b.attendanceRate - a.attendanceRate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Total de Jogos</p>
          <p className="mt-1 text-2xl font-black text-white">{overview.totalMatches}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Taxa de Presença Média</p>
          <p className="mt-1 text-2xl font-black text-[#34d399]">{overview.avgAttendanceRate.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Taxa de Confirmação RSVP</p>
          <p className="mt-1 text-2xl font-black text-[#22d3ee]">{overview.avgRsvpRate.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Total de Presenças</p>
          <p className="mt-1 text-2xl font-black text-white">{overview.totalPresent}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] mb-4">Evolução Mensal de Presença</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="avgPresent" name="Média Presentes" fill="#34d399" radius={[4, 4, 0, 0]} barSize={40} />
              <Line yAxisId="right" type="monotone" dataKey="attendanceRate" name="Taxa de Presença (%)" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] overflow-hidden">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] p-6 pb-2">Ranking de Frequência</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#8fa39b]">
            <thead className="bg-[#1c1815] text-[10px] uppercase tracking-wider text-[#8fa39b]">
              <tr>
                <th className="px-4 py-3 font-medium">Jogador</th>
                <th className="px-4 py-3 font-medium text-center">Posição</th>
                <th className="px-4 py-3 font-medium text-center">Convocado</th>
                <th className="px-4 py-3 font-medium text-center">RSVP Sim</th>
                <th className="px-4 py-3 font-medium text-center">Presente</th>
                <th className="px-4 py-3 font-medium w-48">% Presença</th>
                <th className="px-4 py-3 font-medium text-center">% RSVP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {sortedPlayers.map((p: any, idx: number) => {
                let medal = '';
                if (idx === 0) medal = '🥇';
                else if (idx === 1) medal = '🥈';
                else if (idx === 2) medal = '🥉';

                return (
                  <tr key={p.playerId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                      <span className="w-5 text-center">{medal}</span>
                      {p.playerName} {p.shirtNumber && <span className="text-[10px] text-white/40">#{p.shirtNumber}</span>}
                    </td>
                    <td className="px-4 py-3 text-center">{positionLabels[p.position] || p.position}</td>
                    <td className="px-4 py-3 text-center">{p.summoned}</td>
                    <td className="px-4 py-3 text-center text-[#22d3ee]">{p.rsvpConfirmed}</td>
                    <td className="px-4 py-3 text-center text-[#34d399]">{p.present}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-10 text-right font-bold text-white">{p.attendanceRate.toFixed(1)}%</span>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#34d399] rounded-full" 
                            style={{ width: `${Math.min(p.attendanceRate, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{p.rsvpRate.toFixed(1)}%</td>
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
