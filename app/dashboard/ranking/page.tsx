"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star, ChevronUp, ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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
  averageStars: number | null;
  totalRatings: number;
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

type SortKey = "goals" | "assists" | "yellowCards" | "redCards" | "matches" | "averageStars";
type SortDir = "asc" | "desc";

function PlayerAvatar({ photoUrl, name, size = 14 }: { photoUrl: string | null; name: string; size?: number }) {
  const sizeClasses: Record<number, string> = {
    9: "h-9 w-9 text-sm",
    14: "h-14 w-14 text-xl",
    16: "h-16 w-16 text-2xl",
    24: "h-24 w-24 text-3xl",
  };
  const cls = sizeClasses[size] || `h-${size} w-${size} text-xl`;

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${cls} rounded-full object-cover ring-2 ring-[#10b981]/30`}
      />
    );
  }
  return (
    <div className={`${cls} flex items-center justify-center rounded-full bg-[rgba(16,185,129,0.15)] text-[#34d399] font-black ring-2 ring-[#10b981]/20`}>
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

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== column) {
    return <ChevronDown className="inline h-3 w-3 opacity-0 group-hover/col:opacity-40 transition-opacity" />;
  }
  return sortDir === "desc"
    ? <ChevronDown className="inline h-3 w-3 text-[#34d399]" />
    : <ChevronUp className="inline h-3 w-3 text-[#34d399]" />;
}

// Cores para gráfico de pizza
const PIE_COLORS = ["#34d399", "#818cf8", "#fbbf24", "#f87171", "#38bdf8", "#a78bfa", "#fb923c", "#4ade80", "#f472b6"];

interface AnalyticsData {
  evolution: { name: string; Técnico: number; Tático: number; Físico: number; Disciplina: number }[];
  positionDistribution: { name: string; value: number }[];
  leaderboard: { name: string; Nota: number }[];
}

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<"stats" | "ratings" | "analytics">("stats");
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [ratingsRanking, setRatingsRanking] = useState<RatingGroup[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [seasonFilter, setSeasonFilter] = useState("");
  const [matchTypeFilter, setMatchTypeFilter] = useState("ALL");
  const [activeSeason, setActiveSeason] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Sorting state
  const [sortKey, setSortKey] = useState<SortKey>("goals");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  async function loadData(tab: "stats" | "ratings" | "analytics", sid?: string, mtype?: string) {
    if (tab === "analytics") return; // analytics tem seu proprio loader
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sid) params.set("seasonId", sid);
      if (mtype && mtype !== "ALL") params.set("matchType", mtype);
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

  async function loadAnalytics() {
    setAnalyticsLoading(true);
    try {
      const res = await fetch("/api/stats/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "analytics") {
      if (!analyticsData) loadAnalytics();
    } else {
      loadData(activeTab, seasonFilter || undefined, matchTypeFilter);
    }
  }, [activeTab, seasonFilter, matchTypeFilter]);

  // Sorted ranking
  const sortedRanking = useMemo(() => {
    const sorted = [...ranking].sort((a, b) => {
      let aVal: number;
      let bVal: number;

      if (sortKey === "averageStars") {
        aVal = a.averageStars ?? -1;
        bVal = b.averageStars ?? -1;
      } else {
        aVal = a[sortKey];
        bVal = b[sortKey];
      }

      if (bVal !== aVal) {
        return sortDir === "desc" ? bVal - aVal : aVal - bVal;
      }
      // Secondary sort: goals desc, then assists desc
      if (a.goals !== b.goals) return b.goals - a.goals;
      return b.assists - a.assists;
    });
    return sorted;
  }, [ranking, sortKey, sortDir]);

  // ── Compute highlights from ranking data ──
  function computeHighlights() {
    if (ranking.length === 0) return [];

    const items: { label: string; emoji: string; value: string; sub: string; player: RankingEntry; accentColor: string }[] = [];

    const topScorer = [...ranking].sort((a, b) => b.goals - a.goals)[0];
    if (topScorer && topScorer.goals > 0) {
      items.push({ label: "Artilheiro", emoji: "⚽", value: String(topScorer.goals), sub: topScorer.goals === 1 ? "gol" : "gols", player: topScorer, accentColor: "#34d399" });
    }

    const assistLeader = [...ranking].sort((a, b) => b.assists - a.assists)[0];
    if (assistLeader && assistLeader.assists > 0) {
      items.push({ label: "Garçom", emoji: "🎯", value: String(assistLeader.assists), sub: assistLeader.assists === 1 ? "assistência" : "assistências", player: assistLeader, accentColor: "#818cf8" });
    }

    const mostPresent = [...ranking].sort((a, b) => b.matches - a.matches)[0];
    if (mostPresent && mostPresent.matches > 0) {
      items.push({ label: "Mais Presente", emoji: "📅", value: String(mostPresent.matches), sub: mostPresent.matches === 1 ? "jogo" : "jogos", player: mostPresent, accentColor: "#fbbf24" });
    }

    const rated = ranking.filter((p) => p.averageStars !== null && p.totalRatings > 0);
    if (rated.length > 0) {
      const bestRated = [...rated].sort((a, b) => {
        if ((b.averageStars ?? 0) !== (a.averageStars ?? 0)) return (b.averageStars ?? 0) - (a.averageStars ?? 0);
        return b.totalRatings - a.totalRatings;
      })[0];
      items.push({ label: "Melhor Avaliado", emoji: "⭐", value: bestRated.averageStars!.toFixed(1), sub: `${bestRated.totalRatings} ${bestRated.totalRatings === 1 ? "avaliação" : "avaliações"}`, player: bestRated, accentColor: "#f59e0b" });
    }

    return items;
  }

  const highlights = computeHighlights();

  // ── Prêmios da Temporada ──
  const awards = useMemo(() => {
    if (ranking.length === 0) return [];
    const items: { title: string; emoji: string; badge: string; player: RankingEntry | null; stat: string; gradient: string }[] = [];

    // Chuteira de Ouro
    const topScorer = [...ranking].sort((a, b) => b.goals - a.goals)[0];
    if (topScorer && topScorer.goals > 0) {
      items.push({ title: "Chuteira de Ouro", emoji: "👟", badge: "Artilheiro", player: topScorer, stat: `${topScorer.goals} gol${topScorer.goals > 1 ? "s" : ""}`, gradient: "from-yellow-500/20 to-amber-600/5" });
    }

    // Bola de Ouro
    const rated = ranking.filter((p) => p.averageStars !== null && p.totalRatings > 0);
    if (rated.length > 0) {
      const best = [...rated].sort((a, b) => (b.averageStars ?? 0) - (a.averageStars ?? 0) || b.totalRatings - a.totalRatings)[0];
      items.push({ title: "Bola de Ouro", emoji: "⚽", badge: "Craque", player: best, stat: `${best.averageStars!.toFixed(1)} ⭐`, gradient: "from-yellow-400/20 to-orange-500/5" });
    }

    // Garçom do Ano
    const topAssist = [...ranking].sort((a, b) => b.assists - a.assists)[0];
    if (topAssist && topAssist.assists > 0) {
      items.push({ title: "Garçom do Ano", emoji: "🎯", badge: "Assistências", player: topAssist, stat: `${topAssist.assists} assist${topAssist.assists > 1 ? "s" : ""}`, gradient: "from-indigo-500/20 to-purple-600/5" });
    }

    // Fair Play
    const fairPlay = [...ranking].filter((p) => p.matches > 0 && p.yellowCards === 0 && p.redCards === 0).sort((a, b) => b.matches - a.matches);
    if (fairPlay.length > 0) {
      items.push({ title: "Prêmio Fair Play", emoji: "🤝", badge: "Disciplina", player: fairPlay[0], stat: `${fairPlay[0].matches} jogo${fairPlay[0].matches > 1 ? "s" : ""} sem cartão`, gradient: "from-emerald-500/20 to-teal-600/5" });
    }

    // Luva de Ouro
    const keepers = ranking.filter((p) => p.position === "GOALKEEPER" && p.averageStars !== null && p.totalRatings > 0);
    if (keepers.length > 0) {
      const bestKeeper = [...keepers].sort((a, b) => (b.averageStars ?? 0) - (a.averageStars ?? 0))[0];
      items.push({ title: "Luva de Ouro", emoji: "🧤", badge: "Goleiro", player: bestKeeper, stat: `${bestKeeper.averageStars!.toFixed(1)} ⭐`, gradient: "from-sky-500/20 to-cyan-600/5" });
    }

    return items;
  }, [ranking]);

  // Check if there are any players rated in any position category
  const hasAnyRatings = ratingsRanking.some((group) => group.players.length > 0);

  const colHeaderClass = "group/col cursor-pointer select-none text-center transition-colors hover:text-white";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 rounded-[22px] border border-[rgba(16,185,129,0.18)] bg-[rgba(10,24,20,0.4)] p-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md">
        <div className="space-y-1.5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Desempenho Geral
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight bg-gradient-to-r from-white to-[#34d399] bg-clip-text text-transparent">
            {activeTab === "stats" ? "🎯 Estatísticas & Artilharia" : activeTab === "ratings" ? "⭐ Melhores por Posição" : "📊 Análise do Elenco"}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {activeSeason && activeTab !== "analytics" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#34d399]">
                🏆 {activeSeason.name}
              </span>
            )}
            {matchTypeFilter === "CHAMPIONSHIP" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-amber-400">
                🏆 Apenas Campeonato
              </span>
            )}
            {matchTypeFilter === "FRIENDLY" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-blue-400">
                🤝 Apenas Amistosos
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/60">
              {activeTab === "stats" ? "Gols & Assistências" : "Média de Avaliações"}
            </span>
          </div>
        </div>

        {/* Tab switcher + Season filter + Match Type filter */}
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
            <button
              onClick={() => setActiveTab("analytics")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "analytics"
                  ? "bg-[#10b981] text-white shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              📊 Gráficos
            </button>
          </div>

          {activeTab !== "analytics" && <select
            id="match-type-filter"
            value={matchTypeFilter}
            onChange={(e) => setMatchTypeFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#10b981] backdrop-blur-sm cursor-pointer"
          >
            <option value="ALL" className="bg-[#0a1814]">Todos os Tipos de Jogo</option>
            <option value="CHAMPIONSHIP" className="bg-[#0a1814]">🏆 Apenas Campeonato</option>
            <option value="FRIENDLY" className="bg-[#0a1814]">🤝 Apenas Amistosos</option>
          </select>

          <select
            id="season-filter"
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#10b981] backdrop-blur-sm cursor-pointer"
          >
            <option value="" className="bg-[#0a1814]">Todas as temporadas</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0a1814]">
                {s.name} {s.status === "ACTIVE" ? "• Ativa" : ""}
              </option>
            ))}
          </select>}
        </div>
      </div>

      {/* ═══════════ ABA ANALYTICS ═══════════ */}
      {activeTab === "analytics" ? (
        analyticsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02]" />
            ))}
          </div>
        ) : !analyticsData ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
            <p className="text-5xl">📊</p>
            <p className="mt-4 text-lg font-bold text-white">Dados insuficientes</p>
            <p className="mt-2 text-sm text-[#8fa39b]">Registre avaliações e partidas para gerar gráficos analíticos.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Evolução Técnica & Física */}
            {analyticsData.evolution.length > 0 && (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#8fa39b] mb-6">📈 Evolução Técnica & Física — Média do Elenco</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={analyticsData.evolution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: "#8fa39b", fontSize: 11 }} />
                    <YAxis domain={[0, 5]} tick={{ fill: "#8fa39b", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "#0a1814", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="Técnico" stroke="#34d399" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Tático" stroke="#818cf8" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Físico" stroke="#fbbf24" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Disciplina" stroke="#f87171" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top 5 Melhores Avaliados */}
              {analyticsData.leaderboard.length > 0 && (
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                  <h2 className="text-sm font-black uppercase tracking-widest text-[#8fa39b] mb-6">🏅 Top 5 — Melhores Notas do Elenco</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={analyticsData.leaderboard} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" domain={[0, 5]} tick={{ fill: "#8fa39b", fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "#fff", fontSize: 12 }} width={110} />
                      <Tooltip contentStyle={{ background: "#0a1814", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: 12 }} />
                      <Bar dataKey="Nota" fill="#34d399" radius={[0, 8, 8, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Distribuição por Posição */}
              {analyticsData.positionDistribution.length > 0 && (
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                  <h2 className="text-sm font-black uppercase tracking-widest text-[#8fa39b] mb-6">🥧 Distribuição de Posições — Elenco Ativo</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={analyticsData.positionDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: "rgba(255,255,255,0.2)" }}
                      >
                        {analyticsData.positionDistribution.map((_, idx) => (
                          <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#0a1814", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )
      ) : loading ? (
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
            {/* ═══════════════════════════════════════════════ */}
            {/* ██ PRÊMIOS DA TEMPORADA ██ */}
            {/* ═══════════════════════════════════════════════ */}
            {awards.length > 0 && (
              <div className="space-y-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
                  <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-yellow-400">
                    🏆 Prêmios da Temporada
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
                </div>

                <div className={`grid gap-4 ${
                  awards.length <= 2 ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto" :
                  awards.length === 3 ? "grid-cols-1 sm:grid-cols-3" :
                  awards.length === 4 ? "grid-cols-2 lg:grid-cols-4" :
                  "grid-cols-2 lg:grid-cols-5"
                }`}>
                  {awards.map((a) => (
                    <Link
                      key={a.title}
                      href={a.player ? `/dashboard/squad/${a.player.playerId}` : "#"}
                      className={`group relative flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-gradient-to-br ${a.gradient} p-5 transition-all duration-300 hover:scale-[1.03] hover:border-white/15 overflow-hidden text-center`}
                    >
                      <span className="text-3xl">{a.emoji}</span>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{a.title}</p>
                      {a.player && (
                        <>
                          <PlayerAvatar photoUrl={a.player.photoUrl} name={a.player.playerName} size={16} />
                          <p className="font-bold text-white text-sm group-hover:text-[#6ee7b7] transition-colors truncate w-full">{a.player.playerName}</p>
                          <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white/60">
                            {a.badge} · {a.stat}
                          </span>
                        </>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* ██ DESTAQUES DA TEMPORADA ██ */}
            {/* ═══════════════════════════════════════════════ */}
            {highlights.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#34d399]/20 to-transparent" />
                  <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#34d399]">
                    🏆 Destaques da Temporada
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#34d399]/20 to-transparent" />
                </div>

                <div className={`grid gap-4 ${
                  highlights.length === 1
                    ? "grid-cols-1 max-w-xs mx-auto"
                    : highlights.length === 2
                    ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
                    : highlights.length === 3
                    ? "grid-cols-1 sm:grid-cols-3"
                    : "grid-cols-2 lg:grid-cols-4"
                }`}>
                  {highlights.map((h) => (
                    <Link
                      key={h.label}
                      href={`/dashboard/squad/${h.player.playerId}`}
                      className="group relative flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10 overflow-hidden"
                    >
                      {/* Subtle glow */}
                      <div
                        className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full opacity-20 blur-2xl"
                        style={{ background: h.accentColor }}
                      />
                      <div className="relative z-10 shrink-0">
                        <PlayerAvatar photoUrl={h.player.photoUrl} name={h.player.playerName} size={14} />
                      </div>
                      <div className="relative z-10 min-w-0 flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                          {h.emoji} {h.label}
                        </p>
                        <p className="font-bold text-white text-sm truncate group-hover:text-[#6ee7b7] transition-colors">
                          {h.player.playerName}
                        </p>
                        <p className="text-[10px] text-white/40">
                          #{h.player.shirtNumber} · {positionLabels[h.player.position] || h.player.position}
                        </p>
                      </div>
                      <div className="relative z-10 text-right shrink-0">
                        <p className="text-2xl font-black leading-none" style={{ color: h.accentColor }}>
                          {h.value}
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-0.5">
                          {h.sub}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Full ranking table */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
              <div className="border-b border-white/5 px-6 py-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#8fa39b]">
                  Ranking Completo — {ranking.length} jogadores
                </h2>
              </div>

              {/* Table header — sortable columns */}
              <div className="hidden sm:grid sm:grid-cols-[3rem_2fr_5rem_5rem_5rem_5rem_5rem_5rem] gap-2 border-b border-white/5 bg-white/[0.015] px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-[#8fa39b]">
                <span className="text-center">#</span>
                <span>Jogador</span>
                <span className={colHeaderClass} onClick={() => handleSort("goals")}>
                  ⚽ Gols <SortIcon column="goals" sortKey={sortKey} sortDir={sortDir} />
                </span>
                <span className={colHeaderClass} onClick={() => handleSort("assists")}>
                  🎯 Assist. <SortIcon column="assists" sortKey={sortKey} sortDir={sortDir} />
                </span>
                <span className={colHeaderClass} onClick={() => handleSort("yellowCards")}>
                  🟨 <SortIcon column="yellowCards" sortKey={sortKey} sortDir={sortDir} />
                </span>
                <span className={colHeaderClass} onClick={() => handleSort("redCards")}>
                  🟥 <SortIcon column="redCards" sortKey={sortKey} sortDir={sortDir} />
                </span>
                <span className={colHeaderClass} onClick={() => handleSort("matches")}>
                  Jogos <SortIcon column="matches" sortKey={sortKey} sortDir={sortDir} />
                </span>
                <span className={colHeaderClass} onClick={() => handleSort("averageStars")}>
                  ⭐ Nota <SortIcon column="averageStars" sortKey={sortKey} sortDir={sortDir} />
                </span>
              </div>

              <div className="divide-y divide-white/5">
                {sortedRanking.map((entry, idx) => {
                  return (
                    <Link
                      key={entry.playerId}
                      href={`/dashboard/squad/${entry.playerId}`}
                      className="group flex items-center gap-4 px-6 py-4 transition-all duration-200 hover:bg-white/[0.04] sm:grid sm:grid-cols-[3rem_2fr_5rem_5rem_5rem_5rem_5rem_5rem]"
                    >
                      {/* Rank */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black sm:h-7 sm:w-7">
                        <span className="text-[#8fa39b] font-black text-sm">{idx + 1}</span>
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
                        <span className={`font-black text-lg ${sortKey === "goals" ? "text-[#34d399]" : "text-[#34d399]/70"}`}>{entry.goals}</span>
                      </div>
                      <div className="hidden sm:flex sm:justify-center">
                        <span className={`font-bold ${sortKey === "assists" ? "text-white" : "text-white/70"}`}>{entry.assists}</span>
                      </div>
                      <div className="hidden sm:flex sm:justify-center">
                        <span className={`font-bold ${sortKey === "yellowCards" ? "text-yellow-400" : "text-yellow-400/70"}`}>{entry.yellowCards}</span>
                      </div>
                      <div className="hidden sm:flex sm:justify-center">
                        <span className={`font-bold ${sortKey === "redCards" ? "text-red-400" : "text-red-400/70"}`}>{entry.redCards}</span>
                      </div>
                      <div className="hidden sm:flex sm:justify-center">
                        <span className={`font-bold ${sortKey === "matches" ? "text-white" : "text-[#8fa39b]"}`}>{entry.matches}</span>
                      </div>
                      <div className="hidden sm:flex sm:justify-center">
                        {entry.averageStars !== null ? (
                          <span className={`font-bold ${sortKey === "averageStars" ? "text-yellow-400" : "text-yellow-400/70"}`}>{entry.averageStars.toFixed(1)}</span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
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
