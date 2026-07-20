import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { RadarChart } from "@/components/ui/RadarChart";

import { CoachPositionEditor } from "@/components/dashboard/CoachPositionEditor";

import { playerPositionLabels } from "@/lib/player-positions";

const positionLabels: Record<string, string> = playerPositionLabels;

const achievementMeta: Record<string, { icon: string; label: string; color: string }> = {
  HAT_TRICK: { icon: "🎩", label: "Hat-trick", color: "border-yellow-400/40 bg-yellow-400/8 text-yellow-300" },
  TOP_SCORER_ROUND: { icon: "⚽", label: "Artilheiro da Rodada", color: "border-[#10b981]/40 bg-[#10b981]/8 text-[#34d399]" },
  VETERAN: { icon: "🎖️", label: "Veterano", color: "border-blue-400/40 bg-blue-400/8 text-blue-300" },
  ASSIST_MASTER: { icon: "🎯", label: "Mestre das Assistências", color: "border-purple-400/40 bg-purple-400/8 text-purple-300" },
  FULL_ATTENDANCE_MONTH: { icon: "📅", label: "Presença Perfeita", color: "border-cyan-400/40 bg-cyan-400/8 text-cyan-300" },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerProfilePage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.user?.teamId) {
    return notFound();
  }

  const player = await prisma.player.findFirst({
    where: { id, teamId: session.user.teamId },
    include: {
      user: { select: { id: true, email: true, role: true } },
      matchStats: {
        include: {
          match: {
            select: { id: true, date: true, opponent: true, homeScore: true, awayScore: true, isHome: true, status: true },
          },
        },
        orderBy: { match: { date: "desc" } },
        take: 10,
      },
      achievements: {
        orderBy: { awardedAt: "desc" },
      },
      fines: {
        where: { status: "ACTIVE" },
        orderBy: { date: "desc" },
      },
      evaluations: {
        orderBy: { date: "desc" },
        take: 1,
      },
      attendances: {
        select: { present: true },
      },
    },
  });

  if (!player) return notFound();

  // Aggregate stats across all matches
  const allMatchStats = await prisma.matchStats.findMany({
    where: { playerId: id, match: { teamId: session.user.teamId } },
    include: {
      match: { select: { id: true, type: true } },
    },
  });

  const championshipStats = allMatchStats.filter((s) => s.match.type === "CHAMPIONSHIP");
  const friendlyStats = allMatchStats.filter((s) => s.match.type === "FRIENDLY");

  const totalGoals = allMatchStats.reduce((sum, s) => sum + s.goals, 0);
  const totalAssists = allMatchStats.reduce((sum, s) => sum + s.assists, 0);
  const matchesWithStats = allMatchStats.length;

  const champGoals = championshipStats.reduce((sum, s) => sum + s.goals, 0);
  const champAssists = championshipStats.reduce((sum, s) => sum + s.assists, 0);
  const champMatches = championshipStats.length;

  const friendlyGoals = friendlyStats.reduce((sum, s) => sum + s.goals, 0);
  const friendlyAssists = friendlyStats.reduce((sum, s) => sum + s.assists, 0);
  const friendlyMatches = friendlyStats.length;

  const totalAttendances = player.attendances.length;
  const presentCount = player.attendances.filter((a) => a.present).length;
  const attendanceRate = totalAttendances > 0 ? Math.round((presentCount / totalAttendances) * 100) : 0;

  const latestEval = player.evaluations[0] ?? null;

  const statCards = [
    { label: "Gols Totais", value: totalGoals, icon: "⚽", color: "text-[#34d399]", border: "border-[rgba(16,185,129,0.2)]", bg: "bg-[rgba(16,185,129,0.04)]" },
    { label: "Assistências", value: totalAssists, icon: "🎯", color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/4" },
    { label: "Partidas", value: matchesWithStats, icon: "🏟️", color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/4" },
    { label: "Presença", value: `${attendanceRate}%`, icon: "📅", color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/4" },
  ];

  return (
    <div className="space-y-6">
      {/* Back button and Feedback shortcut */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/squad"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-[#8fa39b] transition hover:bg-white/[0.07] hover:text-white"
        >
          ← Voltar ao Elenco
        </Link>
        <Link
          href="/dashboard/evaluations"
          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.08)] px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-[rgba(59,130,246,0.15)]"
        >
          📈 Ver Avaliações & Feedback
        </Link>
      </div>

      {/* Profile header */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(16,185,129,0.18)] bg-[rgba(10,24,20,0.4)] backdrop-blur-md">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#10b981] opacity-5 blur-3xl" />

        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {player.photoUrl ? (
              <img
                src={player.photoUrl}
                alt={player.name}
                className="h-28 w-28 rounded-2xl object-cover ring-2 ring-[rgba(16,185,129,0.4)] shadow-[0_0_30px_rgba(16,185,129,0.15)]"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[rgba(16,185,129,0.1)] text-5xl font-black text-[#34d399] ring-2 ring-[rgba(16,185,129,0.3)]">
                {player.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                player.status === "ACTIVE"
                  ? "bg-[rgba(16,185,129,0.15)] text-[#34d399] border border-[rgba(16,185,129,0.3)]"
                  : "bg-white/5 text-[#8fa39b] border border-white/10"
              }`}>
                {player.status === "ACTIVE" ? "✓ Ativo" : "✕ Inativo"}
              </span>
              {player.user && (
                <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-400">
                  🔗 Conta vinculada
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-[#34d399] bg-clip-text text-transparent">
              {player.name}
            </h1>
            {player.fullName && player.fullName !== player.name && (
              <p className="text-sm text-[#8fa39b]">{player.fullName}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-[#8fa39b]">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#34d399] font-black">#{player.shirtNumber}</span>
                <span>Camisa</span>
              </span>
              <span>·</span>
              <span>{positionLabels[player.position] || player.position}</span>
              {player.secondaryPosition && (
                <>
                  <span>·</span>
                  <span className="text-xs text-emerald-400/90 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    Sec: {positionLabels[player.secondaryPosition] || player.secondaryPosition}
                  </span>
                </>
              )}
              {player.age && (
                <>
                  <span>·</span>
                  <span>{player.age} anos</span>
                </>
              )}

              <CoachPositionEditor
                playerId={player.id}
                playerName={player.name}
                currentPosition={player.position}
                currentSecondaryPosition={player.secondaryPosition}
                isCoachOrAdmin={session.user.role === "ADMIN" || session.user.role === "COACH"}
              />
            </div>

            {player.description && (
              <p className="mt-2 text-sm text-[#8fa39b] max-w-lg leading-relaxed">{player.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border ${s.border} ${s.bg} p-5 text-center transition-all duration-300 hover:brightness-110`}
          >
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[#8fa39b]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Breakdown by Match Type */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-amber-500/10 pb-3 mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              🏆 Desempenho em Campeonato
            </h3>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
              {champMatches} {champMatches === 1 ? "partida" : "partidas"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-black text-white">{champGoals}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">⚽ Gols</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{champAssists}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">🎯 Assist.</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{champMatches}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">🏟️ Jogos</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-blue-500/10 pb-3 mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
              🤝 Desempenho em Amistosos
            </h3>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-300">
              {friendlyMatches} {friendlyMatches === 1 ? "partida" : "partidas"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-black text-white">{friendlyGoals}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400/80">⚽ Gols</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{friendlyAssists}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400/80">🎯 Assist.</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{friendlyMatches}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400/80">🏟️ Jogos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Radar chart */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-[#8fa39b]">
            📊 Perfil Técnico
          </h2>
          {latestEval ? (
            <div className="flex flex-col items-center gap-4">
              <RadarChart
                data={{
                  technical: latestEval.technical,
                  tactical: latestEval.tactical,
                  physical: latestEval.physical,
                  discipline: latestEval.discipline,
                }}
                size={220}
              />
              <div className="grid grid-cols-2 gap-3 w-full">
                {[
                  { label: "Técnico", value: latestEval.technical },
                  { label: "Tático", value: latestEval.tactical },
                  { label: "Físico", value: latestEval.physical },
                  { label: "Disciplina", value: latestEval.discipline },
                ].map((attr) => (
                  <div key={attr.label} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
                    <span className="text-xs font-semibold text-[#8fa39b]">{attr.label}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-2 rounded-full ${i < attr.value ? "bg-[#10b981]" : "bg-white/10"}`}
                        />
                      ))}
                      <span className="ml-1 text-xs font-black text-[#34d399]">{attr.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#8fa39b] text-center">
                Avaliação de {new Date(latestEval.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-[#8fa39b]">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-semibold text-white text-sm">Sem avaliações registradas</p>
              <p className="mt-1 text-xs">Registre uma avaliação para ver o perfil tático</p>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-[#8fa39b]">
            🏅 Conquistas
          </h2>
          {player.achievements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-[#8fa39b]">
              <p className="text-4xl mb-3">🎖️</p>
              <p className="font-semibold text-white text-sm">Nenhuma conquista ainda</p>
              <p className="mt-1 text-xs">Continue jogando para desbloquear conquistas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {player.achievements.map((ach) => {
                const meta = achievementMeta[ach.type] ?? { icon: "🏆", label: ach.type, color: "border-white/10 bg-white/5 text-white" };
                return (
                  <div
                    key={ach.id}
                    className={`flex items-center gap-3 rounded-xl border ${meta.color} px-4 py-3 transition-all`}
                  >
                    <span className="text-2xl">{meta.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-white">{meta.label}</p>
                      <p className="text-[10px] text-[#8fa39b]">
                        {new Date(ach.awardedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Match history */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="border-b border-white/5 px-6 py-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#8fa39b]">
            📋 Últimas Partidas (com estatísticas)
          </h2>
        </div>

        {player.matchStats.length === 0 ? (
          <div className="p-12 text-center text-[#8fa39b]">
            <p className="text-3xl mb-3">🏟️</p>
            <p className="font-semibold text-white text-sm">Nenhuma partida com stats registradas</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {/* Header */}
            <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_4rem_4rem_4rem_4rem] gap-2 bg-white/[0.015] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#8fa39b]">
              <span>Adversário</span>
              <span>Resultado</span>
              <span className="text-center">⚽</span>
              <span className="text-center">🎯</span>
              <span className="text-center">🟨</span>
              <span className="text-center">🟥</span>
            </div>

            {player.matchStats.map((stat) => {
              const match = stat.match;
              const teamGoals = match.isHome ? match.homeScore : match.awayScore;
              const opponentGoals = match.isHome ? match.awayScore : match.homeScore;
              const resultLabel = teamGoals == null || opponentGoals == null
                ? "—"
                : teamGoals > opponentGoals ? "✓ Vitória" : teamGoals < opponentGoals ? "✗ Derrota" : "= Empate";
              const resultColor = teamGoals == null ? "text-[#8fa39b]"
                : teamGoals > (opponentGoals ?? 0) ? "text-[#34d399]"
                : teamGoals < (opponentGoals ?? 0) ? "text-red-400"
                : "text-yellow-400";

              return (
                <div
                  key={stat.id}
                  className="flex flex-col gap-2 px-6 py-4 transition hover:bg-white/[0.02] sm:grid sm:grid-cols-[2fr_1fr_4rem_4rem_4rem_4rem] sm:items-center sm:gap-2"
                >
                  <div>
                    <p className="font-semibold text-white text-sm">{match.isHome ? "vs" : "@"} {match.opponent}</p>
                    <p className="text-[10px] text-[#8fa39b]">{new Date(match.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <p className={`text-xs font-bold ${resultColor}`}>
                    {resultLabel}
                    {teamGoals != null && opponentGoals != null && ` (${teamGoals}x${opponentGoals})`}
                  </p>
                  <p className="text-center font-black text-[#34d399]">{stat.goals}</p>
                  <p className="text-center font-bold text-white">{stat.assists}</p>
                  <p className="text-center font-bold text-yellow-400">{stat.yellowCards}</p>
                  <p className="text-center font-bold text-red-400">{stat.redCards}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active fines */}
      {player.fines.length > 0 && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] overflow-hidden">
          <div className="border-b border-red-500/10 px-6 py-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-red-400">
              ⚖️ Punições Ativas
            </h2>
          </div>
          <div className="divide-y divide-white/5">
            {player.fines.map((fine) => (
              <div key={fine.id} className="flex items-start gap-4 px-6 py-4">
                <span className="mt-0.5 text-xl">{fine.severity === "SUSPENSION" ? "🟥" : "🟨"}</span>
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">{fine.description}</p>
                  <p className="mt-0.5 text-xs text-[#8fa39b]">
                    {fine.severity === "SUSPENSION"
                      ? `Suspensão: ${fine.matchesSuspended} jogo(s)`
                      : "Advertência"}
                    {" "} · {new Date(fine.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
