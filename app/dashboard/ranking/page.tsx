"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

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

interface RatingPlayerEntry {
  playerId: string;
  playerName: string;
  photoUrl: string | null;
  shirtNumber: number;
  position: string;
  averageStars: number;
  totalRatings: number;
}

interface RatingGroup {
  category: string;
  title: string;
  order: number;
  players: RatingPlayerEntry[];
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= Math.round(rating);
        return (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              isFilled
                ? "fill-yellow-400 text-yellow-400 animate-none"
                : "text-white/20 fill-transparent"
            }`}
          />
        );
      })}
      <span className="ml-1.5 text-xs font-black text-white">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<"stats" | "ratings">("stats");
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [ratingsRanking, setRatingsRanking] = useState<RatingGroup[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [seasonFilter, setSeasonFilter] = useState("");
  const [activeSeason, setActiveSeason] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData(tab: "stats" | "ratings", sid?: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sid) params.set("seasonId", sid);
      const url = tab === "stats" ? `/api/stats/ranking?${params}` : `/api/stats/ratings-ranking?${params}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (tab === "stats") {
          setRanking(data.ranking || []);
        } else {
          setRatingsRanking(data.rankings || []);
        }
        setSeasons(data.seasons || []);
        setActiveSeason(data.season || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(activeTab, seasonFilter || undefined);
  }, [activeTab, seasonFilter]);

  const podium = ranking.slice(0, 3);
  const restOfRanking = ranking;

  // Check if there are any players rated in any position category
  const hasAnyRatings = ratingsRanking.some((group) => group.players.length > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 rounded-[22px] border border-[rgba(16,185,129,0.18)] bg-[rgba(10,24,20,0.4)] p-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md">
        <div className="space-y-1.5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Desempenho Geral
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight bg-gradient-to-r from-white to-[#34d399] bg-clip-text text-transparent">
            {activeTab === "stats" ? "🎯 Estatísticas & Artilharia" : "⭐ Melhores por Posição"}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {activeSeason && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#34d399]">
                🏆 {activeSeason.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/60">
              {activeTab === "stats" ? "Gols & Assistências" : "Média de Avaliações"}
            </span>
          </div>
        </div>

        {/* Tab switcher + Season filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-white/[0.05] p-1 border border-white/5">
            <button
              onClick={() => setActiveTab("stats")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "stats"
                  ? "bg-[#10b981] text-white shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              🎯 Estatísticas
            </button>
            <button
              onClick={() => setActiveTab("ratings")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "ratings"
                  ? "bg-[#10b981] text-white shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              ⭐ Avaliações
            </button>
          </div>

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
      ) : activeTab === "stats" ? (
        ranking.length === 0 ? (
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
        )
      ) : !hasAnyRatings ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
          <p className="text-5xl">⭐</p>
          <p className="mt-4 text-lg font-bold text-white">Nenhuma avaliação registrada</p>
          <p className="mt-2 text-sm text-[#8fa39b]">
            Dê notas aos seus companheiros nas partidas encerradas para montar o ranking.
          </p>
        </div>
      ) : (
        /* Ratings grouped by consolidated positions */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ratingsRanking.map((group) => {
            const hasPlayers = group.players.length > 0;
            return (
              <div
                key={group.category}
                className="rounded-[22px] border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md flex flex-col h-full hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="text-[#34d399]">⚽</span> {group.title}
                  </h3>
                  <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-bold text-[#8fa39b]">
                    {group.players.length} {group.players.length === 1 ? "jogador" : "jogadores"}
                  </span>
                </div>

                {!hasPlayers ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-8 text-center border border-dashed border-white/5 rounded-xl bg-black/10">
                    <span className="text-lg">⭐</span>
                    <p className="mt-2 text-xs font-semibold text-[#8fa39b]">Sem avaliações</p>
                  </div>
                ) : (
                  <div className="space-y-3 flex-1">
                    {group.players.map((player, idx) => {
                      const isFirst = idx === 0;
                      return (
                        <Link
                          key={player.playerId}
                          href={`/dashboard/squad/${player.playerId}`}
                          className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/[0.04] ${
                            isFirst
                              ? "bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.15)] shadow-[0_0_15px_rgba(16,185,129,0.03)]"
                              : "border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black bg-black/20 ${
                              isFirst ? "text-yellow-400" : "text-[#8fa39b]"
                            }`}>
                              {idx + 1}º
                            </div>
                            {player.photoUrl ? (
                              <img
                                src={player.photoUrl}
                                alt={player.playerName}
                                className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10"
                              />
                            ) : (
                              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 font-bold text-xs text-white">
                                {player.playerName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-sm text-white group-hover:text-[#34d399] transition-colors truncate max-w-[120px] sm:max-w-none">
                                {player.playerName}
                              </p>
                              <p className="text-[10px] text-[#8fa39b]">
                                #{player.shirtNumber}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <StarRating rating={player.averageStars} />
                            <span className="text-[9px] text-[#8fa39b]">
                              {player.totalRatings} {player.totalRatings === 1 ? "avaliação" : "avaliações"}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

