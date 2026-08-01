"use client";

import React, { useEffect, useState } from "react";
import { Users, Trophy, Star, ShieldAlert, Award, ArrowRightLeft } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";

interface PlayerOption {
  id: string;
  name: string;
  shirtNumber: number;
  position: string;
  photoUrl: string | null;
}

interface ComparisonData {
  player1: {
    id: string;
    name: string;
    photoUrl: string | null;
    shirtNumber: number;
    position: string;
    stats: {
      goals: number;
      assists: number;
      yellowCards: number;
      redCards: number;
      matches: number;
      starters: number;
      technical: number;
      tactical: number;
      physical: number;
      discipline: number;
      averageStars: number;
    };
  };
  player2: {
    id: string;
    name: string;
    photoUrl: string | null;
    shirtNumber: number;
    position: string;
    stats: {
      goals: number;
      assists: number;
      yellowCards: number;
      redCards: number;
      matches: number;
      starters: number;
      technical: number;
      tactical: number;
      physical: number;
      discipline: number;
      averageStars: number;
    };
  };
}

const positionLabels: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  LEFT_BACK: "Lateral Esq.",
  RIGHT_BACK: "Lateral Dir.",
  LEFT_WINGBACK: "Ala Esq.",
  RIGHT_WINGBACK: "Ala Dir.",
  MIDFIELDER: "Meio-camp.",
  DEFENSIVE_MIDFIELDER: "Volante",
  FORWARD: "Atacante",
  LEFT_WINGER: "Ponta Esq.",
  RIGHT_WINGER: "Ponta Dir.",
};

export default function PlayerComparisonReport() {
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [p1Id, setP1Id] = useState<string>("");
  const [p2Id, setP2Id] = useState<string>("");
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const res = await fetch("/api/players");
        if (res.ok) {
          const list: PlayerOption[] = await res.json();
          setPlayers(list);
          if (list.length >= 2) {
            setP1Id(list[0].id);
            setP2Id(list[1].id);
          } else if (list.length === 1) {
            setP1Id(list[0].id);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar lista de jogadores", err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadPlayers();
  }, []);

  useEffect(() => {
    if (!p1Id || !p2Id || p1Id === p2Id) return;

    async function loadComparison() {
      setLoading(true);
      try {
        const res = await fetch(`/api/stats/compare?player1Id=${p1Id}&player2Id=${p2Id}`);
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error("Erro ao carregar comparação", err);
      } finally {
        setLoading(false);
      }
    }
    loadComparison();
  }, [p1Id, p2Id]);

  if (initialLoading) {
    return (
      <div className="h-64 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-sm text-[#8fa39b]">
        Carregando elenco...
      </div>
    );
  }

  if (players.length < 2) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-white/30" />
        <p className="mt-4 text-base font-bold text-white">Elenco insuficiente</p>
        <p className="mt-1 text-xs text-[#8fa39b]">
          É necessário ter pelo menos 2 atletas cadastrados no time para utilizar o comparativo.
        </p>
      </div>
    );
  }

  const chartData = data
    ? [
        { subject: "Técnica", P1: data.player1.stats.technical, P2: data.player2.stats.technical, fullMark: 5 },
        { subject: "Tática", P1: data.player1.stats.tactical, P2: data.player2.stats.tactical, fullMark: 5 },
        { subject: "Físico", P1: data.player1.stats.physical, P2: data.player2.stats.physical, fullMark: 5 },
        { subject: "Disciplina", P1: data.player1.stats.discipline, P2: data.player2.stats.discipline, fullMark: 5 },
        { subject: "Nota Elenco", P1: data.player1.stats.averageStars, P2: data.player2.stats.averageStars, fullMark: 5 },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Seletor de Atletas */}
      <div className="rounded-2xl border border-[rgba(16,185,129,0.2)] bg-[rgba(10,24,20,0.5)] p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#34d399] mb-4">
          <ArrowRightLeft className="h-4 w-4" /> Selecione os Atletas para Confronto
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5">Jogador 1 (Verde)</label>
            <select
              value={p1Id}
              onChange={(e) => setP1Id(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0a1814] px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#34d399]"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === p2Id}>
                  #{p.shirtNumber} {p.name} ({positionLabels[p.position] || p.position})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5">Jogador 2 (Roxo)</label>
            <select
              value={p2Id}
              onChange={(e) => setP2Id(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0a1814] px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#818cf8]"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === p1Id}>
                  #{p.shirtNumber} {p.name} ({positionLabels[p.position] || p.position})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-sm text-[#8fa39b]">
          Carregando comparativo...
        </div>
      ) : !data ? null : (
        <>
          {/* Header dos Dois Atletas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player 1 Card */}
            <div className="relative overflow-hidden rounded-2xl border border-[#34d399]/30 bg-gradient-to-br from-[#34d399]/10 to-transparent p-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                {data.player1.photoUrl ? (
                  <img
                    src={data.player1.photoUrl}
                    alt={data.player1.name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-[#34d399]"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-[#34d399]/20 flex items-center justify-center text-2xl font-black text-[#34d399]">
                    {data.player1.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#34d399]">
                    #{data.player1.shirtNumber} · {positionLabels[data.player1.position] || data.player1.position}
                  </span>
                  <h3 className="text-xl font-black text-white">{data.player1.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-white">
                      {data.player1.stats.averageStars.toFixed(1)} ⭐
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Player 2 Card */}
            <div className="relative overflow-hidden rounded-2xl border border-[#818cf8]/30 bg-gradient-to-br from-[#818cf8]/10 to-transparent p-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                {data.player2.photoUrl ? (
                  <img
                    src={data.player2.photoUrl}
                    alt={data.player2.name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-[#818cf8]"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-[#818cf8]/20 flex items-center justify-center text-2xl font-black text-[#818cf8]">
                    {data.player2.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#818cf8]">
                    #{data.player2.shirtNumber} · {positionLabels[data.player2.position] || data.player2.position}
                  </span>
                  <h3 className="text-xl font-black text-white">{data.player2.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-white">
                      {data.player2.stats.averageStars.toFixed(1)} ⭐
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico Radar de Atributos */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#8fa39b] mb-4 text-center">
              📊 Radar de Atributos & Avaliações
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={chartData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#fff", fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fill: "#8fa39b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0a1814", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Radar name={data.player1.name} dataKey="P1" stroke="#34d399" fill="#34d399" fillOpacity={0.4} />
                <Radar name={data.player2.name} dataKey="P2" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabela Comparativa Directa */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#8fa39b] mb-6">
              ⚔️ Tabela de Confronto Estatístico
            </h3>

            <div className="space-y-4">
              {[
                { label: "Jogos Disputados", p1: data.player1.stats.matches, p2: data.player2.stats.matches },
                { label: "Titularidades", p1: data.player1.stats.starters, p2: data.player2.stats.starters },
                { label: "Gols Marcados ⚽", p1: data.player1.stats.goals, p2: data.player2.stats.goals },
                { label: "Assistências 🎯", p1: data.player1.stats.assists, p2: data.player2.stats.assists },
                { label: "Cartões Amarelos 🟨", p1: data.player1.stats.yellowCards, p2: data.player2.stats.yellowCards, lowerIsBetter: true },
                { label: "Cartões Vermelhos 🟥", p1: data.player1.stats.redCards, p2: data.player2.stats.redCards, lowerIsBetter: true },
                { label: "Média Técnica", p1: data.player1.stats.technical, p2: data.player2.stats.technical },
                { label: "Média Tática", p1: data.player1.stats.tactical, p2: data.player2.stats.tactical },
                { label: "Média Física", p1: data.player1.stats.physical, p2: data.player2.stats.physical },
                { label: "Média Disciplina", p1: data.player1.stats.discipline, p2: data.player2.stats.discipline },
              ].map((row) => {
                const p1Wins = row.lowerIsBetter ? row.p1 < row.p2 : row.p1 > row.p2;
                const p2Wins = row.lowerIsBetter ? row.p2 < row.p1 : row.p2 > row.p1;

                return (
                  <div key={row.label} className="grid grid-cols-3 items-center py-2.5 px-4 rounded-xl border border-white/5 bg-white/[0.01]">
                    <div className={`text-center text-sm font-black ${p1Wins ? "text-[#34d399] font-black scale-105" : "text-white/70"}`}>
                      {row.p1}
                    </div>
                    <div className="text-center text-xs font-bold text-[#8fa39b] uppercase tracking-wider">
                      {row.label}
                    </div>
                    <div className={`text-center text-sm font-black ${p2Wins ? "text-[#818cf8] font-black scale-105" : "text-white/70"}`}>
                      {row.p2}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
