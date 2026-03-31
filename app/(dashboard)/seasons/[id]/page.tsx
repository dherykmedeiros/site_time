"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type SeasonType = "LEAGUE" | "CUP" | "TOURNAMENT";
type SeasonStatus = "ACTIVE" | "FINISHED";
type MatchStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

interface StandingRow {
  playerId: string;
  playerName: string;
  shirtNumber: number | null;
  position: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDiff: number;
  points: number;
  goals: number;
  assists: number;
}

interface MatchRow {
  id: string;
  date: string;
  opponent: string;
  type: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
}

interface SeasonDetail {
  id: string;
  name: string;
  type: SeasonType;
  status: SeasonStatus;
  startDate: string;
  endDate: string | null;
  matches: MatchRow[];
  _count: { matches: number };
}

const typeLabels: Record<SeasonType, string> = {
  LEAGUE: "Liga",
  CUP: "Copa",
  TOURNAMENT: "Torneio",
};

const positionLabels: Record<string, string> = {
  GOALKEEPER: "GOL",
  DEFENDER: "ZAG",
  MIDFIELDER: "MEI",
  FORWARD: "ATA",
};

export default function SeasonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [season, setSeason] = useState<SeasonDetail | null>(null);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"standings" | "matches">("standings");

  async function load() {
    setLoading(true);
    try {
      const [seasonRes, standingsRes] = await Promise.all([
        fetch(`/api/seasons/${id}`),
        fetch(`/api/seasons/${id}/standings`),
      ]);

      if (seasonRes.ok) {
        const d = await seasonRes.json();
        setSeason(d.season);
      }

      if (standingsRes.ok) {
        const d = await standingsRes.json();
        setStandings(d.standings ?? []);
        setMatchCount(d.matchCount ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  if (loading || !season) {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-2xl bg-[var(--surface-soft)]" />
        <div className="h-64 animate-pulse rounded-2xl bg-[var(--surface-soft)]" />
      </div>
    );
  }

  const startFmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
    new Date(season.startDate)
  );
  const endFmt = season.endDate
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(season.endDate))
    : "Em andamento";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-subtle)] uppercase tracking-wide">
            <Link href="/seasons" className="hover:text-[var(--text)] transition">← Temporadas</Link>
            <span>·</span>
            <span>{typeLabels[season.type]}</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--text)]">{season.name}</h1>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            {startFmt} → {endFmt}
          </p>
        </div>
        <div className="flex gap-2 self-start">
          <Link
            href="/seasons"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
          >
            Voltar
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Partidas", value: season._count.matches },
          { label: "Concluídas", value: matchCount },
          { label: "Jogadores", value: standings.length },
          { label: "Status", value: season.status === "ACTIVE" ? "Ativa 🟢" : "Encerrada" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="app-surface rounded-2xl border border-[var(--border)] p-4 text-center shadow-[var(--shadow-sm)]"
          >
            <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-1 w-fit">
        {(["standings", "matches"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              activeTab === tab
                ? "bg-[var(--brand)] text-white shadow-sm"
                : "text-[var(--text-subtle)] hover:text-[var(--text)]"
            }`}
          >
            {tab === "standings" ? "Classificação" : "Partidas"}
          </button>
        ))}
      </div>

      {/* Standings tab */}
      {activeTab === "standings" && (
        <section>
          {standings.length === 0 ? (
            <div className="app-surface rounded-2xl border border-dashed border-[var(--border-strong)] p-12 text-center text-[var(--text-muted)]">
              <p className="text-3xl">📊</p>
              <p className="mt-2 text-sm font-semibold">Nenhuma partida encerrada ainda</p>
              <p className="mt-1 text-xs">A classificação aparece após registrar partidas concluídas com stats.</p>
            </div>
          ) : (
            <div className="app-surface overflow-hidden rounded-2xl border border-[var(--border)] shadow-[var(--shadow-sm)]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface-soft)]">
                      <th className="px-4 py-3 text-left font-semibold text-[var(--text-subtle)]">#</th>
                      <th className="px-4 py-3 text-left font-semibold text-[var(--text-subtle)]">Jogador</th>
                      <th className="px-3 py-3 text-center font-semibold text-[var(--text-subtle)]">J</th>
                      <th className="px-3 py-3 text-center font-semibold text-[var(--text-subtle)]">V</th>
                      <th className="px-3 py-3 text-center font-semibold text-[var(--text-subtle)]">E</th>
                      <th className="px-3 py-3 text-center font-semibold text-[var(--text-subtle)]">D</th>
                      <th className="px-3 py-3 text-center font-semibold text-[var(--text-subtle)]">SG</th>
                      <th className="px-3 py-3 text-center font-semibold text-[var(--text-subtle)]">⚽</th>
                      <th className="px-3 py-3 text-center font-semibold text-[var(--text-subtle)]">🎯</th>
                      <th className="px-3 py-3 text-center font-bold text-[var(--text)]">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((row, idx) => (
                      <tr
                        key={row.playerId}
                        className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-soft)]"
                      >
                        <td className="px-4 py-3 font-bold text-[var(--text-subtle)]">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[var(--text)]">{row.playerName}</p>
                          <p className="text-xs text-[var(--text-muted)]">
                            #{row.shirtNumber ?? "—"} · {positionLabels[row.position] || row.position}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-center text-[var(--text)]">{row.played}</td>
                        <td className="px-3 py-3 text-center text-emerald-400 font-semibold">{row.won}</td>
                        <td className="px-3 py-3 text-center text-[var(--text-subtle)]">{row.drawn}</td>
                        <td className="px-3 py-3 text-center text-red-400">{row.lost}</td>
                        <td className={`px-3 py-3 text-center font-medium ${row.goalDiff >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                        </td>
                        <td className="px-3 py-3 text-center text-[var(--text)]">{row.goals}</td>
                        <td className="px-3 py-3 text-center text-[var(--text)]">{row.assists}</td>
                        <td className="px-3 py-3 text-center text-lg font-bold text-[var(--text)]">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Matches tab */}
      {activeTab === "matches" && (
        <section>
          {season.matches.length === 0 ? (
            <div className="app-surface rounded-2xl border border-dashed border-[var(--border-strong)] p-12 text-center text-[var(--text-muted)]">
              <p className="text-3xl">🏟️</p>
              <p className="mt-2 text-sm font-semibold">Nenhuma partida vinculada</p>
              <p className="mt-1 text-xs">Ao criar partidas, selecione esta temporada para associar.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {season.matches.map((m) => {
                const dateFmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
                  new Date(m.date)
                );
                const resultText =
                  m.homeScore !== null && m.awayScore !== null
                    ? `${m.homeScore} × ${m.awayScore}`
                    : "—";

                return (
                  <Link
                    key={m.id}
                    href={`/matches/${m.id}`}
                    className="app-surface flex items-center justify-between rounded-xl border border-[var(--border)] px-5 py-3 shadow-[var(--shadow-sm)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
                  >
                    <div>
                      <p className="font-semibold text-[var(--text)]">vs {m.opponent}</p>
                      <p className="text-xs text-[var(--text-muted)]">{dateFmt}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-[var(--text)]">{resultText}</p>
                      <p className="text-xs text-[var(--text-subtle)] capitalize">{m.status.toLowerCase()}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
