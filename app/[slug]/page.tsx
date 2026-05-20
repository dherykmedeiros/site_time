import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FriendlyRequestForm } from "@/app/FriendlyRequestForm";
import { RecruitmentForm } from "@/app/RecruitmentForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const positionLabels: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  LEFT_BACK: "Lateral Esquerdo",
  RIGHT_BACK: "Lateral Direito",
  MIDFIELDER: "Meio-Campo",
  DEFENSIVE_MIDFIELDER: "Volante",
  FORWARD: "Atacante",
  LEFT_WINGER: "Ponta Esquerda",
  RIGHT_WINGER: "Ponta Direita",
};

const competitiveLevelLabels: Record<string, string> = {
  CASUAL: "Amador / Recreativo",
  INTERMEDIATE: "Intermediário",
  COMPETITIVE: "Competitivo / Várzea Forte",
};

const fieldTypeLabels: Record<string, string> = {
  GRASS: "Grama Natural",
  SYNTHETIC: "Sintético",
  FUTSAL: "Futsal",
  SOCIETY: "Society",
  OTHER: "Outro",
};

// SEO Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await prisma.team.findUnique({
    where: { slug },
    select: { name: true, description: true, city: true },
  });

  if (!team) {
    return {
      title: "Time Não Encontrado",
    };
  }

  return {
    title: `${team.name} - Página Oficial | VARzea`,
    description: team.description || `Confira as conquistas, estatísticas gerais, elenco oficial e próximos jogos do ${team.name} no portal oficial da várzea.`,
    openGraph: {
      title: `${team.name} - Página Oficial`,
      description: team.description || `Página pública oficial do time ${team.name}. Confira elenco, jogos e estatísticas.`,
      type: "website",
    },
  };
}

export default async function TeamPublicPage({ params }: PageProps) {
  const { slug } = await params;

  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      players: {
        where: { status: "ACTIVE" },
        orderBy: { shirtNumber: "asc" },
      },
      matches: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!team) {
    notFound();
  }

  // Calculate General Statistics
  const completedMatches = team.matches.filter((m) => m.status === "COMPLETED");
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsScored = 0;
  let goalsConceded = 0;

  completedMatches.forEach((m) => {
    if (m.homeScore !== null && m.awayScore !== null) {
      if (m.isHome) {
        goalsScored += m.homeScore;
        goalsConceded += m.awayScore;
        if (m.homeScore > m.awayScore) wins++;
        else if (m.homeScore === m.awayScore) draws++;
        else losses++;
      } else {
        goalsScored += m.awayScore;
        goalsConceded += m.homeScore;
        if (m.awayScore > m.homeScore) wins++;
        else if (m.awayScore === m.homeScore) draws++;
        else losses++;
      }
    }
  });

  const totalGames = completedMatches.length;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  // Split Matches into Scheduled and Recent
  const upcomingMatches = team.matches
    .filter((m) => m.status === "SCHEDULED")
    .reverse(); // So it is sorted chronologically ascending for upcoming
  const recentMatches = team.matches
    .filter((m) => m.status === "COMPLETED" || m.status === "CANCELLED")
    .slice(0, 5); // Show latest 5

  // Custom Colors Theme Fallbacks
  const themePrimary = team.primaryColor || "#10b981";
  const themeSecondary = team.secondaryColor || "#34d399";

  return (
    <main className="min-h-screen text-[#f0f7f4] relative overflow-hidden bg-[#030708] pb-16">
      {/* Background Gradients */}
      <div 
        className="absolute top-0 left-0 w-full h-[600px] pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${themePrimary} 0%, transparent 60%)`,
        }}
      />
      <div className="absolute top-[400px] right-[-10%] w-[500px] h-[500px] pointer-events-none opacity-5 rounded-full filter blur-[120px] bg-cyan-500" />
      <div className="absolute bottom-[200px] left-[-10%] w-[500px] h-[500px] pointer-events-none opacity-5 rounded-full filter blur-[120px] bg-[#10b981]" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* Header / Brand Nav */}
        <header className="flex justify-between items-center mb-12 py-4 border-b border-[#10b981]/10">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white font-mono flex items-center gap-1.5">
              ⚽ <span className="text-neon-gradient">VARzea</span>
            </span>
          </div>
          <div className="text-xs text-[#8fa39b] font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            Página Oficial do Clube
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="app-surface glassmorphism p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          {/* Badge */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500" />
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-black/80 flex items-center justify-center border-2 border-white/10 overflow-hidden">
              {team.badgeUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={team.badgeUrl} 
                  alt={`Escudo do ${team.name}`} 
                  className="w-full h-full object-cover p-2"
                />
              ) : (
                <span className="text-4xl md:text-5xl font-bold text-neon-gradient font-mono">
                  {team.shortName || team.name.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Info Details */}
          <div className="text-center md:text-left space-y-4 max-w-2xl">
            <div className="space-y-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30">
                ⭐ {team.competitiveLevel ? competitiveLevelLabels[team.competitiveLevel] : "Competitivo"}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white font-mono tracking-tight leading-none mt-2">
                {team.name}
              </h1>
            </div>

            {team.description && (
              <p className="text-[#8fa39b] text-base leading-relaxed font-sans max-w-xl">
                {team.description}
              </p>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-sm font-mono text-[#8fa39b]">
              {team.city && (
                <div className="flex items-center gap-1.5">
                  <span>📍</span>
                  <span>{team.city}{team.region ? ` - ${team.region}` : ""}</span>
                </div>
              )}
              {team.defaultVenue && (
                <div className="flex items-center gap-1.5">
                  <span>🏟️</span>
                  <span>{team.defaultVenue}</span>
                </div>
              )}
              {team.fieldType && (
                <div className="flex items-center gap-1.5">
                  <span>🌱</span>
                  <span>{fieldTypeLabels[team.fieldType]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Decorative Team Color Flags */}
          <div className="absolute top-0 right-0 flex gap-2 p-4">
            <div className="w-4 h-12 rounded-b" style={{ backgroundColor: themePrimary }} />
            <div className="w-4 h-8 rounded-b" style={{ backgroundColor: themeSecondary }} />
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white font-mono mb-6 flex items-center gap-2">
            📊 <span>Estatísticas Gerais</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="app-surface p-6 text-center bg-black/40">
              <p className="text-xs font-mono text-[#8fa39b] uppercase tracking-wider">Jogos</p>
              <p className="text-3xl md:text-4xl font-bold text-white font-mono mt-2">{totalGames}</p>
            </div>
            <div className="app-surface p-6 text-center border-l-2 border-l-[#10b981] bg-black/40">
              <p className="text-xs font-mono text-[#8fa39b] uppercase tracking-wider">Vitórias</p>
              <p className="text-3xl md:text-4xl font-bold text-[#34d399] font-mono mt-2">{wins}</p>
            </div>
            <div className="app-surface p-6 text-center border-l-2 border-l-gray-600 bg-black/40">
              <p className="text-xs font-mono text-[#8fa39b] uppercase tracking-wider">Empates</p>
              <p className="text-3xl md:text-4xl font-bold text-[#8fa39b] font-mono mt-2">{draws}</p>
            </div>
            <div className="app-surface p-6 text-center border-l-2 border-l-red-500 bg-black/40">
              <p className="text-xs font-mono text-[#8fa39b] uppercase tracking-wider">Derrotas</p>
              <p className="text-3xl md:text-4xl font-bold text-red-400 font-mono mt-2">{losses}</p>
            </div>
            <div className="app-surface p-6 text-center col-span-2 md:col-span-1 bg-black/40 flex flex-col justify-center items-center">
              <p className="text-xs font-mono text-[#8fa39b] uppercase tracking-wider">Aproveitamento</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-bold text-[#34d399] font-mono">{winRate}</span>
                <span className="text-sm font-mono text-[#8fa39b]">%</span>
              </div>
            </div>
          </div>

          {/* Goals Detail row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="app-surface p-5 flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚽</span>
                <div>
                  <p className="text-sm font-mono text-[#8fa39b]">Gols Marcados</p>
                  <p className="text-2xl font-bold text-white font-mono">{goalsScored}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-[#8fa39b]">Méd. {(goalsScored / (totalGames || 1)).toFixed(1)} por jogo</span>
            </div>
            <div className="app-surface p-5 flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="text-sm font-mono text-[#8fa39b]">Gols Sofridos</p>
                  <p className="text-2xl font-bold text-white font-mono">{goalsConceded}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-[#8fa39b]">Méd. {(goalsConceded / (totalGames || 1)).toFixed(1)} por jogo</span>
            </div>
          </div>
        </section>

        {/* MATCHES SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Upcoming Matches */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
              🗓️ <span>Próximos Compromissos</span>
            </h2>
            {upcomingMatches.length === 0 ? (
              <div className="app-surface p-8 text-center text-[#8fa39b] bg-black/30 border border-dashed border-[#10b981]/10">
                Nenhum jogo agendado no momento.
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="app-surface p-5 bg-black/40 border border-[#10b981]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#10b981]/30 transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 border border-blue-500/20 rounded">
                          {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
                        </span>
                        <span className="text-xs font-mono text-[#8fa39b]">
                          {new Date(match.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-white font-mono mt-2 flex items-center gap-2">
                        <span>{team.shortName || team.name}</span>
                        <span className="text-[#8fa39b] font-normal text-sm">vs</span>
                        <span className="text-[#34d399]">{match.opponent}</span>
                      </p>
                      <p className="text-xs text-[#8fa39b] font-mono mt-1">📍 {match.venue}</p>
                    </div>
                    <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shrink-0 text-center w-full sm:w-auto">
                      Agendado
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Match Results */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
              🏆 <span>Últimos Resultados</span>
            </h2>
            {recentMatches.length === 0 ? (
              <div className="app-surface p-8 text-center text-[#8fa39b] bg-black/30 border border-dashed border-[#10b981]/10">
                Nenhum jogo disputado registrado.
              </div>
            ) : (
              <div className="space-y-4">
                {recentMatches.map((match) => {
                  const isCancelled = match.status === "CANCELLED";
                  const win = match.homeScore !== null && match.awayScore !== null && (
                    match.isHome ? match.homeScore > match.awayScore : match.awayScore > match.homeScore
                  );
                  const draw = match.homeScore !== null && match.awayScore !== null && match.homeScore === match.awayScore;
                  
                  let badgeColor = "bg-gray-500/10 text-gray-400 border-gray-500/20";
                  let resultLabel = "Empate";
                  
                  if (isCancelled) {
                    resultLabel = "Cancelado";
                    badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                  } else if (win) {
                    resultLabel = "Vitória";
                    badgeColor = "bg-emerald-500/15 text-[#34d399] border-emerald-500/30";
                  } else if (!draw) {
                    resultLabel = "Derrota";
                    badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                  }

                  return (
                    <div key={match.id} className="app-surface p-5 bg-black/40 border border-[#10b981]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#10b981]/30 transition">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-white/5 text-[#8fa39b] px-2 py-0.5 border border-white/10 rounded">
                            {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
                          </span>
                          <span className="text-xs font-mono text-[#8fa39b]">
                            {new Date(match.date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-white font-mono mt-2 flex items-center gap-2">
                          <span>{team.shortName || team.name}</span>
                          {!isCancelled && match.homeScore !== null && match.awayScore !== null ? (
                            <span className="font-mono text-white bg-black/60 px-2.5 py-0.5 rounded border border-white/5">
                              {match.homeScore} - {match.awayScore}
                            </span>
                          ) : (
                            <span className="text-gray-500">vs</span>
                          )}
                          <span className="text-[#34d399]">{match.opponent}</span>
                        </p>
                        <p className="text-xs text-[#8fa39b] font-mono mt-1">📍 {match.venue}</p>
                      </div>
                      <span className={`text-xs font-mono px-3 py-1.5 rounded-full border shrink-0 text-center w-full sm:w-auto ${badgeColor}`}>
                        {resultLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* PUBLIC SQUAD (ELENCO) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white font-mono mb-6 flex items-center gap-2">
            🛡️ <span>Elenco Oficial</span>
          </h2>
          {team.players.length === 0 ? (
            <div className="app-surface p-8 text-center text-[#8fa39b] bg-black/30 border border-dashed border-[#10b981]/10">
              Nenhum jogador cadastrado ou ativo no elenco.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {team.players.map((player) => (
                <div key={player.id} className="trading-card p-4 flex flex-col items-center text-center space-y-4">
                  {/* Photo or silhouette */}
                  <div className="w-24 h-24 rounded-full bg-black/50 border border-[#10b981]/20 flex items-center justify-center overflow-hidden shrink-0">
                    {player.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={player.photoUrl} 
                        alt={player.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-[#10b981] font-mono font-bold">
                        {player.shirtNumber}
                      </span>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-[#34d399] uppercase tracking-wider">
                      Nº {player.shirtNumber}
                    </p>
                    <h3 className="text-base font-bold text-white font-mono line-clamp-1">
                      {player.name}
                    </h3>
                    <p className="text-xs text-[#8fa39b] font-mono">
                      {positionLabels[player.position] || player.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FORMS SECTION (AMISTOSO / RECRUTAMENTO) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Friendly Request Form Card */}
          <div className="app-surface glassmorphism p-6 md:p-8 bg-black/50 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white font-mono">⚔️ Desafiar para Amistoso</h2>
              <p className="text-sm text-[#8fa39b]">
                Representa outra equipe e quer agendar um confronto contra o {team.name}? Envie os detalhes e nossa diretoria responderá!
              </p>
            </div>
            
            <FriendlyRequestForm teamSlug={team.slug} />
          </div>

          {/* Recruitment Form Card */}
          <div className="app-surface glassmorphism p-6 md:p-8 bg-black/50 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white font-mono">⚡ Faça Parte do Time</h2>
              <p className="text-sm text-[#8fa39b]">
                {team.publicDirectoryOptIn 
                  ? `Quer vestir a camisa do ${team.name} e mostrar seu futebol? Deixe seus dados abaixo para a comissão técnica!`
                  : `O recrutamento público está atualmente fechado para esta equipe. Volte mais tarde.`
                }
              </p>
            </div>

            {team.publicDirectoryOptIn ? (
              <RecruitmentForm teamSlug={team.slug} />
            ) : (
              <div className="rounded-[18px] border border-white/5 bg-white/5 p-8 text-center text-[#8fa39b] flex flex-col justify-center items-center min-h-[300px]">
                <span className="text-4xl mb-4">🔒</span>
                <p className="text-base font-semibold text-white">Recrutamento Fechado</p>
                <p className="text-xs text-[#8fa39b] mt-1 max-w-xs mx-auto">
                  Esta equipe optou por não aceitar novas candidaturas de recrutamento público no momento.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
