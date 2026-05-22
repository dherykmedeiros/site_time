import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  Award, 
  Zap, 
  Shield, 
  TrendingUp, 
  AlertTriangle 
} from "lucide-react";
import { RecapShareButtonsClient } from "@/components/RecapShareButtonsClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getMatchByIdOrToken(idOrToken: string) {
  const match = await prisma.match.findFirst({
    where: {
      OR: [
        { id: idOrToken },
        { shareToken: idOrToken }
      ]
    },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          shortName: true,
          badgeUrl: true,
          primaryColor: true,
          secondaryColor: true,
        },
      },
      matchStats: {
        include: {
          player: {
            select: {
              id: true,
              name: true,
              photoUrl: true,
              position: true,
              shirtNumber: true,
            },
          },
        },
        orderBy: {
          goals: "desc",
        },
      },
      lineupSelections: {
        include: {
          player: {
            select: {
              id: true,
              name: true,
              photoUrl: true,
              position: true,
              shirtNumber: true,
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  return match;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatchByIdOrToken(id);

  if (!match) {
    return { title: "Recap Pós-Jogo — Partida não encontrada" };
  }

  const teamName = match.team.name;
  const opponent = match.opponent;
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(match.date);

  const title = `Recap: ${teamName} x ${opponent} | Portal do Time`;
  const description = `Confira os melhores momentos, artilheiros e a escalação do jogo de ${formattedDate}!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: match.team.badgeUrl ? [{ url: match.team.badgeUrl }] : [],
    },
  };
}

const positionLabels: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  LEFT_BACK: "Lateral Esquerdo",
  RIGHT_BACK: "Lateral Direito",
  MIDFIELDER: "Meio-campista",
  DEFENSIVE_MIDFIELDER: "Volante",
  FORWARD: "Atacante",
  LEFT_WINGER: "Ponta Esquerda",
  RIGHT_WINGER: "Ponta Direita",
};

export default async function PublicRecapPage({ params }: PageProps) {
  const { id } = await params;
  const match = await getMatchByIdOrToken(id);

  if (!match) {
    notFound();
  }

  // Double check if match completed
  if (match.status !== "COMPLETED" || match.homeScore === null || match.awayScore === null) {
    return (
      <div className="min-h-screen bg-[#030708] flex items-center justify-center p-4">
        <div className="app-surface p-8 max-w-md text-center space-y-4 border-amber-500/20">
          <AlertTriangle size={48} className="mx-auto text-amber-500 animate-pulse" />
          <h1 className="text-2xl font-bold text-white">Recap Indisponível</h1>
          <p className="text-[var(--text-muted)] text-sm">
            Esta partida ainda não foi finalizada pela comissão técnica ou não possui placar registrado.
          </p>
          <div className="pt-4">
            <Link 
              href="/"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 px-6 text-xs font-bold uppercase tracking-wider text-white border border-white/10 transition-all cursor-pointer"
            >
              Voltar ao Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { team, matchStats, lineupSelections } = match;

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
  }).format(match.date);

  const formattedTime = new Intl.DateTimeFormat("pt-BR", {
    timeStyle: "short",
  }).format(match.date);

  // Extract scorers and assistants
  const scorers = matchStats.filter((stat) => stat.goals > 0);
  const assistants = matchStats.filter((stat) => stat.assists > 0);

  // Math totals
  const totalGoals = matchStats.reduce((sum, s) => sum + s.goals, 0);
  const totalAssists = matchStats.reduce((sum, s) => sum + s.assists, 0);
  const totalYellows = matchStats.reduce((sum, s) => sum + s.yellowCards, 0);
  const totalReds = matchStats.reduce((sum, s) => sum + s.redCards, 0);

  // Group lineup by STARTER and BENCH
  const starters = lineupSelections.filter((l) => l.role === "STARTER");
  const bench = lineupSelections.filter((l) => l.role === "BENCH");

  // Generate dynamic premium narrative text
  const mainScore = match.isHome ? match.homeScore : match.awayScore;
  const oppScore = match.isHome ? match.awayScore : match.homeScore;
  const isWin = mainScore > oppScore;
  const isDraw = mainScore === oppScore;

  let outcomeVerb = "enfrentou";
  let outcomeAdjective = "um jogo equilibrado";
  if (isWin) {
    outcomeVerb = "conquistou uma grande vitória contra";
    outcomeAdjective = "uma atuação brilhante e dominante";
  } else if (isDraw) {
    outcomeVerb = "empatou em um confronto disputado com";
    outcomeAdjective = "um duelo tenso de muita garra";
  } else {
    outcomeVerb = "teve um placar adverso diante de";
    outcomeAdjective = "um jogo de aprendizados e superação";
  }

  const narrativeText = `No último compromisso oficial, o ${team.name} ${outcomeVerb} o ${match.opponent} em ${outcomeAdjective}. A partida foi realizada no palco ${match.venue}, reunindo atletas dedicados em busca do melhor resultado. Com o placar final de ${mainScore} a ${oppScore}, o elenco demonstrou entrosamento, disciplina tática e garra coletiva durante os 90 minutos de disputa, fortalecendo a união e o ritmo do time.`;

  return (
    <div className="min-h-screen bg-[#030708] text-[var(--text)] font-sans antialiased relative pb-20 selection:bg-[#10b981] selection:text-black">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#10b981]/5 rounded-full filter blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#34d399]/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-10 sm:pt-16 space-y-10">
        
        {/* TOP TEAM NAV / BRAND */}
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            {team.badgeUrl ? (
              <img 
                src={team.badgeUrl} 
                alt={team.name} 
                className="w-10 h-10 object-cover rounded-xl border border-white/10" 
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#10b981] font-bold">
                {team.name.charAt(0)}
              </div>
            )}
            <div>
              <span className="text-xs uppercase tracking-widest text-[#10b981] font-extrabold">Portal do Time</span>
              <h2 className="text-sm font-bold text-white -mt-0.5">{team.name}</h2>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-[#34d399] px-3 py-1 rounded-full">
            RECAP OFICIAL
          </span>
        </div>

        {/* PREMIUM PLACAR HEADER */}
        <div className="app-surface p-6 sm:p-10 relative overflow-hidden glassmorphism flex flex-col items-center justify-center text-center space-y-6">
          <div className="absolute inset-0 bg-gradient-to-b from-[#10b981]/5 to-transparent pointer-events-none" />
          
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#8fa39b] z-10">
            Placar Final
          </span>

          {/* Shields and Score Grid */}
          <div className="grid grid-cols-3 items-center justify-items-center w-full max-w-xl z-10 gap-2">
            {/* Team home */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-[#10b981]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {team.badgeUrl ? (
                  <img 
                    src={team.badgeUrl} 
                    alt={team.name} 
                    className="w-11 h-11 sm:w-16 sm:h-16 object-cover rounded-2xl" 
                  />
                ) : (
                  <Shield size={32} className="text-[#10b981]" />
                )}
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider text-center max-w-[100px] truncate">
                {team.shortName || team.name}
              </span>
            </div>

            {/* Placar Numeros */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="flex items-center gap-3 sm:gap-6">
                <span className="text-5xl sm:text-7xl font-black text-white text-neon-gradient tracking-tight">
                  {match.isHome ? match.homeScore : match.awayScore}
                </span>
                <span className="text-xl sm:text-3xl font-black text-[#8fa39b] opacity-40">x</span>
                <span className="text-5xl sm:text-7xl font-black text-[#8fa39b] tracking-tight">
                  {match.isHome ? match.awayScore : match.homeScore}
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#34d399] bg-[#10b981]/10 px-2.5 py-0.5 rounded-md">
                CONCLUÍDO
              </span>
            </div>

            {/* Adversário */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {match.opponentBadgeUrl ? (
                  <img 
                    src={match.opponentBadgeUrl} 
                    alt={match.opponent} 
                    className="w-11 h-11 sm:w-16 sm:h-16 object-cover rounded-2xl" 
                  />
                ) : (
                  <Shield size={32} className="text-[#8fa39b]" />
                )}
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider text-center max-w-[100px] truncate">
                {match.opponent}
              </span>
            </div>
          </div>

          {/* Quick info subheader */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#8fa39b] border-t border-white/5 pt-4 w-full max-w-md">
            <span className="flex items-center gap-1.5 font-semibold">
              <Calendar size={13} className="text-[#10b981]" />
              {formattedDate} às {formattedTime}
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <MapPin size={13} className="text-[#10b981]" />
              {match.venue}
            </span>
          </div>
        </div>

        {/* NATIVE SHARE CALL TO ACTION */}
        <div className="app-surface p-6 glassmorphism text-center space-y-4">
          <h3 className="text-sm uppercase font-extrabold tracking-widest text-white">Compartilhe este Resultado!</h3>
          <p className="text-xs text-[#8fa39b] max-w-md mx-auto">
            Mostre o placar da rodada e as estatísticas para os amigos e torcedores nas redes sociais!
          </p>
          <div className="pt-2">
            <RecapShareButtonsClient 
              teamName={team.name}
              opponent={match.opponent}
              homeScore={match.homeScore}
              awayScore={match.awayScore}
              isHome={match.isHome}
              shareToken={match.shareToken}
            />
          </div>
        </div>

        {/* HIGHLIGHTS & DYNAMIC TEXT NARRATIVE */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Narrative description */}
          <div className="app-surface p-6 md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-[#10b981]" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Melhores Momentos</h3>
              </div>
              <p className="text-xs text-[#8fa39b] leading-relaxed text-justify font-medium">
                {narrativeText}
              </p>
            </div>
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/5 text-center">
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="block text-xs font-extrabold text-[#10b981]">{totalGoals}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#8fa39b] font-bold">Gols</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="block text-xs font-extrabold text-[#34d399]">{totalAssists}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#8fa39b] font-bold">Assists</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="block text-xs font-extrabold text-yellow-500">{totalYellows}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#8fa39b] font-bold">Amarelos</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="block text-xs font-extrabold text-red-500">{totalReds}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#8fa39b] font-bold">Vermelhos</span>
              </div>
            </div>
          </div>

          {/* Destaque Individual / Artilharia */}
          <div className="app-surface p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-[#10b981]" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Destaques do Jogo</h3>
            </div>

            {/* Scorers */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#8fa39b]">Artilharia</h4>
              {scorers.length > 0 ? (
                <div className="space-y-2">
                  {scorers.map((stat) => (
                    <div key={stat.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-xs font-bold text-white">
                          {stat.player.photoUrl ? (
                            <img src={stat.player.photoUrl} alt={stat.player.name} className="w-full h-full object-cover" />
                          ) : (
                            stat.player.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-white leading-none">{stat.player.name}</p>
                          <span className="text-[9px] text-[#8fa39b] font-medium">{positionLabels[stat.player.position] || stat.player.position}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded">
                        {stat.goals} {stat.goals === 1 ? "Gol" : "Gols"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8fa39b] italic">Nenhum gol registrado.</p>
              )}
            </div>

            {/* Assistants */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#8fa39b]">Garçons</h4>
              {assistants.length > 0 ? (
                <div className="space-y-2">
                  {assistants.map((stat) => (
                    <div key={stat.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-xs font-bold text-white">
                          {stat.player.photoUrl ? (
                            <img src={stat.player.photoUrl} alt={stat.player.name} className="w-full h-full object-cover" />
                          ) : (
                            stat.player.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-white leading-none">{stat.player.name}</p>
                          <span className="text-[9px] text-[#8fa39b] font-medium">{positionLabels[stat.player.position] || stat.player.position}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#34d399] bg-[#34d399]/10 px-2 py-0.5 rounded">
                        {stat.assists} {stat.assists === 1 ? "Assis." : "Assis."}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8fa39b] italic">Nenhuma assistência registrada.</p>
              )}
            </div>
          </div>
        </div>

        {/* TACTICAL LINEUP / ESCALAÇÃO */}
        {lineupSelections.length > 0 && (
          <div className="app-surface p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#10b981]" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Escalação Tática</h3>
              </div>
              {match.lineupFormation && (
                <span className="text-xs font-extrabold text-[#34d399] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Formação: {match.lineupFormation.replace(/_/g, " ")}
                </span>
              )}
            </div>

            {/* VIRTUAL SOCCER FIELD */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full max-w-2xl mx-auto bg-gradient-to-b from-[#0b1714] to-[#040809] border border-emerald-500/20 shadow-inner flex flex-col justify-between p-4">
              {/* Soccer Pitch Markings */}
              <div className="absolute inset-0 border-2 border-emerald-500/5 m-3 rounded-xl pointer-events-none" />
              <div className="absolute top-1/2 left-3 right-3 border-t border-emerald-500/5 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-emerald-500/5 pointer-events-none" />
              {/* Penalty boxes */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-40 h-16 border-b border-x border-emerald-500/5 pointer-events-none" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-40 h-16 border-t border-x border-emerald-500/5 pointer-events-none" />

              {/* Starters overlay */}
              <div className="relative w-full h-full z-10">
                {starters.map((sel) => {
                  // If coordinates are set in the database, use them. Otherwise, default to standard grid placements based on index or position type.
                  let posX = sel.fieldX ?? 50;
                  let posY = sel.fieldY ?? 50;

                  // Fallback positioning if coords are undefined
                  if (sel.fieldX == null || sel.fieldY == null) {
                    if (sel.player.position === "GOALKEEPER") { posX = 50; posY = 88; }
                    else if (sel.player.position === "LEFT_BACK") { posX = 15; posY = 65; }
                    else if (sel.player.position === "RIGHT_BACK") { posX = 85; posY = 65; }
                    else if (sel.player.position === "DEFENDER") { posX = 50; posY = 72; }
                    else if (sel.player.position === "DEFENSIVE_MIDFIELDER") { posX = 50; posY = 48; }
                    else if (sel.player.position === "MIDFIELDER") { posX = 50; posY = 35; }
                    else if (sel.player.position === "LEFT_WINGER") { posX = 20; posY = 18; }
                    else if (sel.player.position === "RIGHT_WINGER") { posX = 80; posY = 18; }
                    else if (sel.player.position === "FORWARD") { posX = 50; posY = 15; }
                  }

                  return (
                    <div 
                      key={sel.id} 
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-1 group"
                      style={{ 
                        left: `${posX}%`, 
                        top: `${posY}%` 
                      }}
                    >
                      {/* Shirt circle */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#10b981] border border-black text-black font-black text-[10px] sm:text-xs flex items-center justify-center shadow-lg relative group-hover:scale-110 group-hover:bg-[#34d399] transition-transform">
                        {sel.player.shirtNumber}
                      </div>
                      
                      {/* Name tag */}
                      <div className="bg-black/80 px-2 py-0.5 rounded border border-white/10 text-[8px] sm:text-[9px] font-bold text-white max-w-[80px] truncate text-center shadow-sm">
                        {sel.player.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ROSTER DETAIL LIST */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {/* Starters list */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#10b981] border-b border-white/5 pb-1">
                  Titulares ({starters.length})
                </h4>
                <div className="divide-y divide-white/5">
                  {starters.map((sel) => (
                    <div key={sel.id} className="flex items-center justify-between py-2 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-5 font-black text-[#8fa39b]">{sel.player.shirtNumber}</span>
                        <span className="font-bold text-white">{sel.player.name}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#8fa39b]">
                        {positionLabels[sel.player.position] || sel.player.position}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bench list */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#34d399] border-b border-white/5 pb-1">
                  Suplentes ({bench.length})
                </h4>
                {bench.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {bench.map((sel) => (
                      <div key={sel.id} className="flex items-center justify-between py-2 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-5 font-black text-[#8fa39b]">{sel.player.shirtNumber}</span>
                          <span className="font-bold text-white">{sel.player.name}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-[#8fa39b]">
                          {positionLabels[sel.player.position] || sel.player.position}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8fa39b] italic">Nenhum jogador no banco de reservas.</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* BOTTOM PORTAL NAV LINK */}
        <div className="text-center pt-8">
          <Link 
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 px-8 text-xs font-bold uppercase tracking-wider text-white border border-white/10 hover:border-[#10b981]/50 hover:text-[#34d399] transition-all duration-200 cursor-pointer shadow-lg"
          >
            Acessar o Portal Oficial do {team.name} &rarr;
          </Link>
        </div>

      </main>
    </div>
  );
}
