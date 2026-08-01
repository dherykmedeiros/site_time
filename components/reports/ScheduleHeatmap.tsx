"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function ScheduleHeatmap({ data, loading, error }: { data: any; loading: boolean; error: string }) {
  if (loading) return <div className="flex items-center justify-center py-20"><p className="text-sm text-[#8fa39b] animate-pulse">Carregando relatório...</p></div>;
  if (error) return <div className="rounded-xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.06)] p-4 text-sm text-[#f87171]">{error}</div>;
  if (!data || !data.heatmap || !data.dayOfWeekSummary) return <div className="flex items-center justify-center py-20"><p className="text-sm text-[#8fa39b]">Nenhum dado encontrado</p></div>;

  let bestDay = { dayLabel: "-", avgPresent: 0 };
  data.dayOfWeekSummary.forEach((d: any) => {
    if (d.avgPresent > bestDay.avgPresent) bestDay = d;
  });

  let bestHour = { hour: 0, avgPresent: 0 };
  if (data.hourSummary) {
    data.hourSummary.forEach((h: any) => {
      if (h.avgPresent > bestHour.avgPresent) bestHour = h;
    });
  }

  const totalMatches = data.dayOfWeekSummary.reduce((acc: number, curr: any) => acc + curr.totalMatches, 0);

  // For heatmap grid
  const days = Array.from({ length: 7 }, (_, i) => i);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const activeHours = hours.filter(h => data.heatmap.some((hm: any) => hm.hour === h));

  const minHour = activeHours.length ? Math.min(...activeHours) : 18;
  const maxHour = activeHours.length ? Math.max(...activeHours) : 23;
  const displayHours = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i);

  const getCellData = (day: number, hour: number) => {
    return data.heatmap.find((hm: any) => hm.dayOfWeek === day && hm.hour === hour) || { avgAttendance: 0, matchCount: 0 };
  };

  const maxAtt = Math.max(...data.heatmap.map((d: any) => d.avgAttendance), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Melhor Dia</p>
          <p className="mt-1 text-2xl font-black text-white">{bestDay.dayLabel}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Melhor Horário</p>
          <p className="mt-1 text-2xl font-black text-white">{bestHour.hour}h</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Total de Jogos</p>
          <p className="mt-1 text-2xl font-black text-white">{totalMatches}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] mb-4">Mapa de Calor (Presença Média)</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex">
              <div className="w-12 shrink-0"></div>
              {displayHours.map(h => (
                <div key={h} className="flex-1 text-center text-xs text-[#8fa39b] pb-2">{h}h</div>
              ))}
            </div>
            {days.map(d => (
              <div key={d} className="flex items-center mb-1">
                <div className="w-12 shrink-0 text-xs font-medium text-[#8fa39b]">{dayLabels[d]}</div>
                {displayHours.map(h => {
                  const cell = getCellData(d, h);
                  const intensity = cell.avgAttendance / maxAtt;
                  return (
                    <div key={`${d}-${h}`} className="flex-1 px-0.5">
                      <div 
                        className="h-8 w-full rounded-sm flex items-center justify-center text-[10px] font-bold"
                        style={{
                          backgroundColor: intensity > 0 ? `rgba(52, 211, 153, ${intensity * 0.8 + 0.2})` : '#1c1815',
                          color: intensity > 0.5 ? '#16130f' : (intensity > 0 ? 'white' : 'transparent')
                        }}
                        title={`${dayLabels[d]} ${h}h: ${cell.avgAttendance.toFixed(1)} média (${cell.matchCount} jogos)`}
                      >
                        {cell.avgAttendance > 0 ? cell.avgAttendance.toFixed(1) : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] mb-4">Média de Presença por Dia</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.dayOfWeekSummary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="dayLabel" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="avgPresent" name="Presença Média" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
