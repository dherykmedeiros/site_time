"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Activity, 
  Clock, 
  MapPin, 
  Calendar,
  AlertCircle,
  Share2
} from "lucide-react";

interface LiveEvent {
  id: string;
  type: "GOAL" | "ASSIST" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION";
  minute: number;
  half: number;
  playerId: string | null;
  guestPlayerId: string | null;
  description: string | null;
  player?: {
    id: string;
    name: string;
    shirtNumber: number;
  } | null;
  guestPlayer?: {
    id: string;
    name: string;
    shirtNumber: number | null;
  } | null;
}

interface MatchLive {
  id: string | null;
  matchId: string;
  liveStatus: "NOT_STARTED" | "FIRST_HALF" | "HALF_TIME" | "SECOND_HALF" | "FINISHED";
  homeScore: number;
  awayScore: number;
  firstHalfStart: string | null;
  firstHalfEnd: string | null;
  secondHalfStart: string | null;
  secondHalfEnd: string | null;
  events: LiveEvent[];
}

interface MatchData {
  id: string;
  date: string;
  venue: string;
  opponent: string;
  opponentBadgeUrl: string | null;
  isHome: boolean;
  status: string;
  team: {
    name: string;
    badgeUrl: string | null;
  };
}

interface LiveMatchViewProps {
  matchId: string;
  initialMatch: MatchData;
  initialLive: MatchLive;
}

export function LiveMatchView({ matchId, initialMatch, initialLive }: LiveMatchViewProps) {
  const [match, setMatch] = useState<MatchData>(initialMatch);
  const [live, setLive] = useState<MatchLive>(initialLive);

  const handleOpenEventRecap = (event: any) => {
    const shareUrl = `${window.location.origin}/api/og/event/${event.id}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };
  
  // Stopwatch seconds states
  const [firstHalfSeconds, setFirstHalfSeconds] = useState(0);
  const [secondHalfSeconds, setSecondHalfSeconds] = useState(0);

  // Poll for real-time updates every 15 seconds
  useEffect(() => {
    // Skip polling if finished
    if (live.liveStatus === "FINISHED") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/matches/${matchId}/live`);
        const data = await res.json();
        if (res.ok) {
          setLive(data.live);
          setMatch(data.match);
        }
      } catch (err) {
        console.error("Erro ao atualizar jogo ao vivo", err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [matchId, live.liveStatus]);

  // Clock ticks (local prediction for smooth seconds counter)
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date().getTime();

      // First Half Timer
      if (live.liveStatus === "FIRST_HALF" && live.firstHalfStart) {
        const start = new Date(live.firstHalfStart).getTime();
        setFirstHalfSeconds(Math.max(0, Math.floor((now - start) / 1000)));
      } else if (live.firstHalfStart && live.firstHalfEnd) {
        const start = new Date(live.firstHalfStart).getTime();
        const end = new Date(live.firstHalfEnd).getTime();
        setFirstHalfSeconds(Math.max(0, Math.floor((end - start) / 1000)));
      } else {
        setFirstHalfSeconds(0);
      }

      // Second Half Timer
      if (live.liveStatus === "SECOND_HALF" && live.secondHalfStart) {
        const start = new Date(live.secondHalfStart).getTime();
        setSecondHalfSeconds(Math.max(0, Math.floor((now - start) / 1000)));
      } else if (live.secondHalfStart && live.secondHalfEnd) {
        const start = new Date(live.secondHalfStart).getTime();
        const end = new Date(live.secondHalfEnd).getTime();
        setSecondHalfSeconds(Math.max(0, Math.floor((end - start) / 1000)));
      } else {
        setSecondHalfSeconds(0);
      }
    }, 1000);

    return () => clearInterval(clockInterval);
  }, [live]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const getEventEmoji = (type: string) => {
    switch (type) {
      case "GOAL": return "⚽";
      case "ASSIST": return "👟";
      case "YELLOW_CARD": return "🟨";
      case "RED_CARD": return "🟥";
      case "SUBSTITUTION": return "🔁";
      default: return "📢";
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case "GOAL": return "GOL!";
      case "ASSIST": return "Assistência";
      case "YELLOW_CARD": return "Cartão Amarelo";
      case "RED_CARD": return "Cartão Vermelho";
      case "SUBSTITUTION": return "Substituição";
      default: return "Evento";
    }
  };

  const teamName = match.team.name;
  const opponentName = match.opponent;
  const isMatchLive = live.liveStatus === "FIRST_HALF" || live.liveStatus === "SECOND_HALF";

  return (
    <section className="space-y-6">
      {/* Visual scoreboard wrapper */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-[#0c1310] via-[#040807] to-[#0c1310] shadow-[0_24px_48px_rgba(0,0,0,0.5)]">
        
        {/* Decorative dynamic neon blur lines */}
        {isMatchLive && (
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent blur-[1px] animate-pulse" />
        )}

        <div className="px-6 py-10 flex flex-col items-center justify-center relative">
          
          {/* Pulsing Live Tag */}
          {isMatchLive && (
            <div className="flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/25 px-3 py-1 text-xs font-black tracking-wider text-red-500 animate-pulse mb-3">
              <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              AO VIVO EM TEMPO REAL
            </div>
          )}

          {/* Half Status & Clock Display */}
          <div className="flex flex-col items-center justify-center mb-6">
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-white/50 mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3 text-emerald-400" />
              {live.liveStatus === "NOT_STARTED" && "Aguardando Início"}
              {live.liveStatus === "FIRST_HALF" && "1º Tempo"}
              {live.liveStatus === "HALF_TIME" && "Intervalo"}
              {live.liveStatus === "SECOND_HALF" && "2º Tempo"}
              {live.liveStatus === "FINISHED" && "Fim de Jogo"}
            </span>

            <h1 className="text-5xl font-black font-mono tracking-widest text-white drop-shadow-[0_0_16px_rgba(52,211,153,0.25)] select-none">
              {live.liveStatus === "NOT_STARTED" && "00:00"}
              {live.liveStatus === "FIRST_HALF" && formatTime(firstHalfSeconds)}
              {live.liveStatus === "HALF_TIME" && "INTERVALO"}
              {live.liveStatus === "SECOND_HALF" && formatTime(secondHalfSeconds)}
              {live.liveStatus === "FINISHED" && "FINALIZADO"}
            </h1>

            {/* Total time tracker */}
            {live.liveStatus !== "NOT_STARTED" && (
              <span className="text-xs text-white/40 mt-1.5 font-medium">
                Tempo de jogo somado: {formatTime(firstHalfSeconds + secondHalfSeconds)}
              </span>
            )}
          </div>

          {/* Teams and Scores row */}
          <div className="w-full max-w-xl grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 px-2 sm:px-6">
            
            {/* Home Team */}
            <div className="text-right flex flex-col items-end gap-1">
              <span className="font-black text-sm sm:text-base text-white tracking-wide text-balance leading-tight">
                {match.isHome ? teamName : opponentName}
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] text-white/50">
                Mandante
              </span>
            </div>

            {/* Glowing scoreboard */}
            <div className="bg-black/60 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 text-3xl sm:text-4xl font-black text-white font-mono shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)]">
              <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">{live.homeScore}</span>
              <span className="text-white/30 font-light text-xl select-none">:</span>
              <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">{live.awayScore}</span>
            </div>

            {/* Away Team */}
            <div className="text-left flex flex-col items-start gap-1">
              <span className="font-black text-sm sm:text-base text-white tracking-wide text-balance leading-tight">
                {match.isHome ? opponentName : teamName}
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] text-white/50">
                Visitante
              </span>
            </div>

          </div>

          {/* Small auto-update notifier */}
          {isMatchLive && (
            <p className="text-[10px] text-white/55 font-medium mt-8 flex items-center gap-1 bg-white/[0.02] border border-white/5 rounded-full px-3 py-1 animate-pulse">
              <Activity className="h-3 w-3 text-emerald-400" />
              Esta tela atualiza automaticamente a cada 15s
            </p>
          )}

        </div>

      </div>

      {/* Public Timeline of Events */}
      {live.liveStatus !== "NOT_STARTED" && (
        <Card className="rounded-[22px] border border-white/10 bg-gradient-to-br from-[#0c1310] via-[#040807] to-[#0c1310] shadow-[0_20px_40px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Lances e Acontecimentos
            </h2>
          </div>
          <CardContent className="p-6">
            {live.events.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-[12px] p-6 bg-white/[0.01]">
                <p className="text-sm text-white/80">Nenhum lance registrado até agora.</p>
                <p className="text-xs text-white/50 mt-1">Os gols, cartões e lances do jogo serão exibidos aqui à medida que acontecem.</p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                {[...live.events].reverse().map((event) => {
                  const isGoal = event.type === "GOAL";
                  const isOpponentGoal = isGoal && !event.playerId && !event.guestPlayerId;
                  
                  return (
                    <div key={event.id} className="relative flex items-start gap-4 animate-fade-in group">
                      
                      {/* Timeline dot */}
                      <span className={`absolute -left-[24px] top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#080d0b] border-[3px] border-white/20 transition-all ${
                        isGoal ? "border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : ""
                      }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-transparent" />
                      </span>

                      {/* Event icon & visual details */}
                      <div className={`flex-1 rounded-[16px] border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.05] hover:scale-[1.01] ${
                        isOpponentGoal ? "border-red-500/20 bg-red-500/[0.01]" : ""
                      } ${isGoal && !isOpponentGoal ? "border-emerald-500/20 bg-emerald-500/[0.01]" : ""}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg" role="img" aria-label={event.type}>
                              {getEventEmoji(event.type)}
                            </span>
                            <span className="text-xs font-black font-mono text-emerald-450 bg-emerald-550/15 text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              {event.minute}' ({event.half}T)
                            </span>
                            <span className="font-bold text-sm text-white">
                              {getEventLabel(event.type)}
                            </span>
                          </div>
                          {(event.playerId || event.guestPlayerId) && (
                            <button
                              onClick={() => handleOpenEventRecap(event)}
                              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm active:scale-95"
                              title="Ver Stories Recap"
                            >
                              <Share2 className="h-3 w-3" />
                              Stories Recap
                            </button>
                          )}
                        </div>

                        {/* Player name */}
                        <p className="mt-2 font-extrabold text-sm text-white">
                          {event.player?.name || event.guestPlayer?.name || "Adversário / Geral"}
                          {(event.player?.shirtNumber || event.guestPlayer?.shirtNumber) && (
                            <span className="text-xs text-white/50 ml-1 font-semibold">
                              #{event.player?.shirtNumber || event.guestPlayer?.shirtNumber}
                            </span>
                          )}
                        </p>

                        {event.description && (
                          <p className="mt-1 text-xs text-white/50 italic leading-relaxed">
                            "{event.description}"
                          </p>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
}
