"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const positionLabels: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  LEFT_BACK: "Lateral Esq.",
  RIGHT_BACK: "Lateral Dir.",
  MIDFIELDER: "Meio-camp.",
  DEFENSIVE_MIDFIELDER: "Volante",
  FORWARD: "Atacante",
  LEFT_WINGER: "Ponta Esq.",
  RIGHT_WINGER: "Ponta Dir.",
};

interface RankingEntry {
  rank: number;
  playerId: string;
  playerName: string;
  photoUrl: string | null;
  shirtNumber: number;
  position: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  matches: number;
  seasonId: string | null;
}

interface Season {
  id: string;
  name: string;
  status: string;
}

const medalColors = [
  { border: "border-yellow-400/60", bg: "bg-yellow-400/10", text: "text-yellow-400", shadow: "shadow-[0_0_20px_rgba(250,204,21,0.15)]", label: "🥇 1º" },
  { border: "border-gray-300/50", bg: "bg-gray-300/10", text: "text-gray-300", shadow: "shadow-[0_0_15px_rgba(209,213,219,0.10)]", label: "🥈 2º" },
  { border: "border-amber-600/50", bg: "bg-amber-700/10", text: "text-amber-500", shadow: "shadow-[0_0_15px_rgba(180,83,9,0.10)]", label: "🥉 3º" },
];

function PlayerAvatar({ photoUrl, name, size = 14 }: { photoUrl: string | null; name: string; size?: number }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`h-${size} w-${size} rounded-full object-cover ring-2 ring-[#10b981]/30`}
      />
    );
  }
  return (
    <div className={`h-${size} w-${size} flex items-center justify-center rounded-full bg-[rgba(16,185,129,0.15)] text-[#34d399] font-black text-xl ring-2 ring-[#10b981]/20`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [seasonFilter, setSeasonFilter] = useState("");
  const [activeSeason, setActiveSeason] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadRanking(sid?: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sid) params.set("seasonId", sid);
      const res = await fetch(`/api/stats/ranking?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRanking(data.ranking || []);
        setSeasons(data.seasons || []);
        setActiveSeason(data.season || null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRanking(seasonFilter || undefined);
  }, [seasonFilter]);

  const podium = ranking.slice(0, 3);
  const restOfRanking = ranking;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[22px] border border-[rgba(16,185,129,0.18)] bg-[rgba(10,24,20,0.4)] p-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Estatísticas do Elenco
          </p>
          <h1 className="mt-1 text-2xl font-black uppercase tracking-tight bg-gradient-to-r from-white to-[#34d399] bg-clip-text text-transparent">
            🎯 Artilharia
          </h1>
          {activeSeason && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#34d399]">
              🏆 {activeSeason.name}
            </span>
          )}
        </div>

        {/* Season filter */}
        <div className="flex items-center gap-3">
          <select
            id="season-filter"
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#10b981] backdrop-blur-sm"
          >
            <option value="" className="bg-[#0a1814]">Todas as temporadas</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0a1814]">
                {s.name} {s.status === "ACTIVE" ? "• Ativa" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02]" />
          ))}
        </div>
      ) : ranking.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
          <p className="text-5xl">⚽</p>
          <p className="mt-4 text-lg font-bold text-white">Nenhuma estatística encontrada</p>
          <p className="mt-2 text-sm text-[#8fa39b]">
            Registre gols e assistências nas partidas para ver o ranking.
          </p>
        </div>
      ) : (
        <>
          {/* Podium — top 3 */}
          {podium.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {podium.map((player, idx) => {
                const medal = medalColors[idx];
                const isFirst = idx === 0;
                return (
                  <Link
                    key={player.playerId}
                    href={`/dashboard/squad/${player.playerId}`}
                    className={`group relative flex flex-col items-center gap-4 rounded-2xl border ${medal.border} ${medal.bg} ${medal.shadow} p-6 transition-all duration-300 hover:scale-[1.02] hover:brightness-110 ${isFirst ? "sm:row-span-1 sm:col-start-2 sm:order-first" : ""}`}
                  >
                    <span className={`text-sm font-black uppercase tracking-widest ${medal.text}`}>
                      {medal.label}
                    </span>

                    {player.photoUrl ? (
                      <img
                        src={player.photoUrl}
                        alt={player.playerName}
                        className={`${isFirst ? "h-24 w-24" : "h-16 w-16"} rounded-full object-cover ring-2 ${medal.border}`}
                      />
                    ) : (
                      <div className={`${isFirst ? "h-24 w-24 text-3xl" : "h-16 w-16 text-xl"} flex items-center justify-center rounded-full bg-black/20 font-black ${medal.text} ring-2 ${medal.border}`}>
                        {player.playerName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="text-center">
                      <p className={`font-black ${isFirst ? "text-lg" : "text-base"} text-white`}>{player.playerName}</p>
                      <p className="text-xs text-[#8fa39b]">
                        #{player.shirtNumber} · {positionLabels[player.position] || player.position}
                      </p>
                    </div>

                    <div className={`flex gap-4 ${isFirst ? "text-base" : "text-sm"}`}>
                      <div className="text-center">
                        <p className={`font-black ${medal.text} ${isFirst ? "text-3xl" : "text-2xl"}`}>{player.goals}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Gols</p>
                      </div>
                      <div className="text-center">
                        <p className={`font-black text-white ${isFirst ? "text-xl" : "text-lg"}`}>{player.assists}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Assist.</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Full ranking table */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="border-b border-white/5 px-6 py-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#8fa39b]">
                Ranking Completo — {ranking.length} jogadores
              </h2>
            </div>

            {/* Table header */}
            <div className="hidden sm:grid sm:grid-cols-[3rem_2fr_5rem_5rem_5rem_5rem_5rem] gap-2 border-b border-white/5 bg-white/[0.015] px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-[#8fa39b]">
              <span className="text-center">#</span>
              <span>Jogador</span>
              <span className="text-center">⚽ Gols</span>
              <span className="text-center">🎯 Assist.</span>
              <span className="text-center">🟨</span>
              <span className="text-center">🟥</span>
              <span className="text-center">Jogos</span>
            </div>

            <div className="divide-y divide-white/5">
              {restOfRanking.map((entry) => {
                const isTop3 = entry.rank <= 3;
                return (
                  <Link
                    key={entry.playerId}
                    href={`/dashboard/squad/${entry.playerId}`}
                    className={`group flex items-center gap-4 px-6 py-4 transition-all duration-200 hover:bg-white/[0.04] sm:grid sm:grid-cols-[3rem_2fr_5rem_5rem_5rem_5rem_5rem] ${isTop3 ? "bg-[rgba(16,185,129,0.03)]" : ""}`}
                  >
                    {/* Rank */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black sm:h-7 sm:w-7">
                      {entry.rank === 1 ? (
                        <span className="text-yellow-400">🥇</span>
                      ) : entry.rank === 2 ? (
                        <span className="text-gray-300">🥈</span>
                      ) : entry.rank === 3 ? (
                        <span className="text-amber-500">🥉</span>
                      ) : (
                        <span className="text-[#8fa39b] font-black text-sm">{entry.rank}</span>
                      )}
                    </div>

                    {/* Player info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <PlayerAvatar photoUrl={entry.photoUrl} name={entry.playerName} size={9} />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate group-hover:text-[#34d399] transition-colors">
                          {entry.playerName}
                        </p>
                        <p className="text-xs text-[#8fa39b]">
                          #{entry.shirtNumber} · {positionLabels[entry.position] || entry.position}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex sm:justify-center">
                      <span className="font-black text-[#34d399] text-lg">{entry.goals}</span>
                    </div>
                    <div className="hidden sm:flex sm:justify-center">
                      <span className="font-bold text-white">{entry.assists}</span>
                    </div>
                    <div className="hidden sm:flex sm:justify-center">
                      <span className="font-bold text-yellow-400">{entry.yellowCards}</span>
                    </div>
                    <div className="hidden sm:flex sm:justify-center">
                      <span className="font-bold text-red-400">{entry.redCards}</span>
                    </div>
                    <div className="hidden sm:flex sm:justify-center">
                      <span className="font-bold text-[#8fa39b]">{entry.matches}</span>
                    </div>

                    {/* Mobile compact stats */}
                    <div className="ml-auto flex gap-3 sm:hidden text-sm">
                      <span className="font-black text-[#34d399]">{entry.goals}⚽</span>
                      <span className="font-bold text-white">{entry.assists}🎯</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
