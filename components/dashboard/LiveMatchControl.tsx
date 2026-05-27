"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { 
  Play, 
  Square, 
  Pause, 
  Plus, 
  Minus, 
  Trash2, 
  Activity, 
  Award,
  AlertTriangle,
  UserCheck
} from "lucide-react";

interface LiveEvent {
  id: string;
  type: "GOAL" | "ASSIST" | "YELLOW_CARD" | "RED_CARD";
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

interface LiveMatchControlProps {
  matchId: string;
}

export function LiveMatchControl({ matchId }: LiveMatchControlProps) {
  const [match, setMatch] = useState<MatchData | null>(null);
  const [live, setLive] = useState<MatchLive | null>(null);
  const [guests, setGuests] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stopwatches
  const [firstHalfSeconds, setFirstHalfSeconds] = useState(0);
  const [secondHalfSeconds, setSecondHalfSeconds] = useState(0);

  // Event Form State
  const [eventType, setEventType] = useState<"GOAL" | "ASSIST" | "YELLOW_CARD" | "RED_CARD">("GOAL");
  const [selectedPlayerKey, setSelectedPlayerKey] = useState(""); // format: "player_ID" or "guest_ID" or ""
  const [eventDescription, setEventDescription] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, [matchId]);

  // Timers Effect
  useEffect(() => {
    if (!live) return;

    const interval = setInterval(() => {
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

    return () => clearInterval(interval);
  }, [live]);

  async function fetchInitialData() {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch live details
      const liveRes = await fetch(`/api/matches/${matchId}/live`);
      const liveData = await liveRes.json();
      if (!liveRes.ok) throw new Error(liveData.error || "Erro ao carregar dados ao vivo");

      setMatch(liveData.match);
      setLive(liveData.live);

      // 2. Fetch active players
      const playersRes = await fetch("/api/players?status=ACTIVE");
      const playersData = await playersRes.json();
      if (playersRes.ok) setPlayers(playersData.players || []);

      // 3. Fetch guest players
      const guestsRes = await fetch(`/api/matches/${matchId}/guests`);
      const guestsData = await guestsRes.json();
      if (guestsRes.ok) setGuests(guestsData.guests || []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshLiveState() {
    try {
      const res = await fetch(`/api/matches/${matchId}/live`);
      const data = await res.json();
      if (res.ok) {
        setLive(data.live);
        setMatch(data.match);
      }
    } catch (err) {
      console.error("Erro ao atualizar estado do jogo", err);
    }
  }

  async function handleAction(action: string) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${matchId}/live`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao executar ação");

      await refreshLiveState();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    let playerId: string | null = null;
    let guestPlayerId: string | null = null;

    if (selectedPlayerKey.startsWith("player_")) {
      playerId = selectedPlayerKey.replace("player_", "");
    } else if (selectedPlayerKey.startsWith("guest_")) {
      guestPlayerId = selectedPlayerKey.replace("guest_", "");
    }

    try {
      const res = await fetch(`/api/matches/${matchId}/live/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: eventType,
          playerId,
          guestPlayerId,
          description: eventDescription.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao registrar evento");

      setSelectedPlayerKey("");
      setEventDescription("");
      await refreshLiveState();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    if (!confirm("Tem certeza que deseja apagar este evento do jogo? O placar será corrigido se for um gol.")) return;

    setError(null);
    try {
      const res = await fetch(`/api/matches/${matchId}/live/events?eventId=${eventId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao remover evento");

      await refreshLiveState();
    } catch (err: any) {
      setError(err.message);
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return <p className="text-sm text-[var(--text-subtle)] py-4">Carregando painel de controle ao vivo...</p>;
  }

  if (!match || !live) {
    return (
      <div className="rounded-[12px] bg-[rgba(239,68,68,0.1)] p-4 text-[#fca5a5] font-semibold border border-[rgba(239,68,68,0.3)] text-center">
        Falha ao inicializar o controle da partida ao vivo.
      </div>
    );
  }

  const teamName = match.team.name;
  const opponentName = match.opponent;

  // Compile players options
  const playerOptions = [
    { value: "", label: "Nenhum / Gol do Adversário / Geral" },
    ...players.map((p) => ({
      value: `player_${p.id}`,
      label: `${p.name} #${p.shirtNumber}`,
    })),
    ...guests.map((g) => ({
      value: `guest_${g.id}`,
      label: `${g.name} (Convidado) ${g.shirtNumber ? `#${g.shirtNumber}` : ""}`,
    })),
  ];

  // Helper to translate event labels
  const eventLabels = {
    GOAL: "Gol",
    ASSIST: "Assistência",
    YELLOW_CARD: "Cartão Amarelo",
    RED_CARD: "Cartão Vermelho",
  };

  const getEventEmoji = (type: string) => {
    switch (type) {
      case "GOAL": return "⚽";
      case "ASSIST": return "👟";
      case "YELLOW_CARD": return "🟨";
      case "RED_CARD": return "🟥";
      default: return "📢";
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-[12px] border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.1)] p-3 text-sm text-[#fca5a5] font-semibold">
          {error}
        </div>
      )}

      {/* Main Scoreboard Card */}
      <Card className="overflow-hidden border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
        <div className="bg-gradient-to-r from-[#0d1612] via-[#090e0b] to-[#0d1612] px-6 py-8 flex flex-col items-center justify-center relative">
          
          {/* Live pulsing badge */}
          {(live.liveStatus === "FIRST_HALF" || live.liveStatus === "SECOND_HALF") && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-500 border border-red-500/25 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              AO VIVO
            </div>
          )}

          {/* Time Display */}
          <div className="flex flex-col items-center justify-center mb-6">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--text-muted)] mb-1">
              {live.liveStatus === "NOT_STARTED" && "Não Iniciado"}
              {live.liveStatus === "FIRST_HALF" && "Primeiro Tempo"}
              {live.liveStatus === "HALF_TIME" && "Intervalo"}
              {live.liveStatus === "SECOND_HALF" && "Segundo Tempo"}
              {live.liveStatus === "FINISHED" && "Finalizado"}
            </span>
            <h1 className="text-5xl font-black font-mono tracking-wider text-[var(--brand)] drop-shadow-[0_0_12px_rgba(42,111,96,0.35)]">
              {live.liveStatus === "NOT_STARTED" && "00:00"}
              {live.liveStatus === "FIRST_HALF" && formatTime(firstHalfSeconds)}
              {live.liveStatus === "HALF_TIME" && "INTERVALO"}
              {live.liveStatus === "SECOND_HALF" && formatTime(secondHalfSeconds)}
              {live.liveStatus === "FINISHED" && "FIM DE JOGO"}
            </h1>
            
            {/* Total time tracker */}
            {live.liveStatus !== "NOT_STARTED" && (
              <span className="text-xs text-[var(--text-muted)] mt-1.5">
                Tempo total jogado: {formatTime(firstHalfSeconds + secondHalfSeconds)}
              </span>
            )}
          </div>

          {/* Scores & Names Grid */}
          <div className="w-full max-w-lg grid grid-cols-[1fr_auto_1fr] items-center gap-6">
            
            {/* Home Team */}
            <div className="text-right flex flex-col items-end gap-1">
              <span className="font-black text-base text-[var(--text)] tracking-wide">
                {match.isHome ? teamName : opponentName}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {match.isHome ? "Nosso time" : "Adversário"}
              </span>
              {/* Score Control */}
              <div className="flex items-center gap-1.5 mt-2 bg-white/[0.03] border border-white/5 rounded-lg p-1">
                <button
                  onClick={() => handleAction("decrement_home")}
                  className="rounded-[6px] p-1 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text)]"
                  disabled={submitting}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleAction("increment_home")}
                  className="rounded-[6px] p-1 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text)]"
                  disabled={submitting}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Scoreboard block */}
            <div className="bg-black/50 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 text-4xl font-extrabold text-[var(--text)] font-mono shadow-inner">
              <span>{live.homeScore}</span>
              <span className="text-[var(--text-muted)] text-xl font-normal">:</span>
              <span>{live.awayScore}</span>
            </div>

            {/* Away Team */}
            <div className="text-left flex flex-col items-start gap-1">
              <span className="font-black text-base text-[var(--text)] tracking-wide">
                {match.isHome ? opponentName : teamName}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {match.isHome ? "Adversário" : "Nosso time"}
              </span>
              {/* Score Control */}
              <div className="flex items-center gap-1.5 mt-2 bg-white/[0.03] border border-white/5 rounded-lg p-1">
                <button
                  onClick={() => handleAction("decrement_away")}
                  className="rounded-[6px] p-1 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text)]"
                  disabled={submitting}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleAction("increment_away")}
                  className="rounded-[6px] p-1 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text)]"
                  disabled={submitting}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

          </div>

          {/* Action Button Controls */}
          <div className="mt-8 flex justify-center gap-4 w-full border-t border-white/5 pt-6">
            
            {live.liveStatus === "NOT_STARTED" && (
              <Button
                onClick={() => handleAction("start_first_half")}
                variant="primary"
                loading={submitting}
                className="bg-[#15803d] hover:bg-[#166534] px-6 text-white rounded-[14px]"
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Primeiro Tempo
              </Button>
            )}

            {live.liveStatus === "FIRST_HALF" && (
              <Button
                onClick={() => handleAction("end_first_half")}
                className="bg-[#b45309] hover:bg-[#92400e] text-white px-6 rounded-[14px]"
                loading={submitting}
              >
                <Pause className="h-4 w-4 mr-2" />
                Finalizar Tempo / Intervalo
              </Button>
            )}

            {live.liveStatus === "HALF_TIME" && (
              <Button
                onClick={() => handleAction("start_second_half")}
                variant="primary"
                className="bg-[#15803d] hover:bg-[#166534] px-6 text-white rounded-[14px]"
                loading={submitting}
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Segundo Tempo
              </Button>
            )}

            {live.liveStatus === "SECOND_HALF" && (
              <Button
                onClick={() => handleAction("end_second_half")}
                variant="danger"
                className="bg-[#b91c1c] hover:bg-[#991b1b] text-white px-6 rounded-[14px]"
                loading={submitting}
              >
                <Square className="h-4 w-4 mr-2" />
                Encerrar Partida
              </Button>
            )}

            {live.liveStatus === "FINISHED" && (
              <div className="flex flex-col items-center justify-center gap-1 text-center text-sm font-semibold text-[var(--text-muted)]">
                <span className="flex items-center gap-1 bg-white/[0.04] px-4 py-2 border border-white/5 rounded-xl text-[var(--text)]">
                  <UserCheck className="h-4 w-4 text-[var(--brand)]" />
                  Estatísticas de pós-jogo compiladas no sistema!
                </span>
                <span className="text-xs text-[var(--text-muted)] mt-1 max-w-sm">
                  Os eventos registrados abaixo foram convertidos em gols, assistências e cartões na aba "Pós Jogo".
                </span>
              </div>
            )}

          </div>

        </div>
      </Card>

      {/* Grid of Add Event & Live Timeline */}
      {live.liveStatus !== "NOT_STARTED" && (
        <div className="grid gap-6 md:grid-cols-[1.2fr_1.8fr]">
          
          {/* Add Live Event Panel */}
          {live.liveStatus !== "FINISHED" ? (
            <Card className="h-fit">
              <CardHeader>
                <h3 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[var(--brand)]" />
                  Lançar Evento em Tempo Real
                </h3>
              </CardHeader>
              <CardContent>
                {(live.liveStatus === "FIRST_HALF" || live.liveStatus === "SECOND_HALF" || live.liveStatus === "HALF_TIME") ? (
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    
                    {/* Event Type Select */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setEventType("GOAL")}
                        className={`py-2 px-3 text-sm font-bold rounded-xl border flex items-center justify-center gap-2 transition-all ${
                          eventType === "GOAL"
                            ? "bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand)]"
                            : "border-white/10 bg-white/[0.02] text-[var(--text-muted)] hover:bg-white/[0.05]"
                        }`}
                      >
                        ⚽ Gol
                      </button>
                      <button
                        type="button"
                        onClick={() => setEventType("ASSIST")}
                        className={`py-2 px-3 text-sm font-bold rounded-xl border flex items-center justify-center gap-2 transition-all ${
                          eventType === "ASSIST"
                            ? "bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand)]"
                            : "border-white/10 bg-white/[0.02] text-[var(--text-muted)] hover:bg-white/[0.05]"
                        }`}
                      >
                        👟 Assistência
                      </button>
                      <button
                        type="button"
                        onClick={() => setEventType("YELLOW_CARD")}
                        className={`py-2 px-3 text-sm font-bold rounded-xl border flex items-center justify-center gap-2 transition-all ${
                          eventType === "YELLOW_CARD"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                            : "border-white/10 bg-white/[0.02] text-[var(--text-muted)] hover:bg-white/[0.05]"
                        }`}
                      >
                        🟨 Amarelo
                      </button>
                      <button
                        type="button"
                        onClick={() => setEventType("RED_CARD")}
                        className={`py-2 px-3 text-sm font-bold rounded-xl border flex items-center justify-center gap-2 transition-all ${
                          eventType === "RED_CARD"
                            ? "bg-red-500/10 text-red-500 border-red-500/30"
                            : "border-white/10 bg-white/[0.02] text-[var(--text-muted)] hover:bg-white/[0.05]"
                        }`}
                      >
                        🟥 Vermelho
                      </button>
                    </div>

                    {/* Player Dropdown */}
                    <div>
                      <Select
                        label="Quem participou?"
                        options={playerOptions}
                        value={selectedPlayerKey}
                        onChange={(e) => setSelectedPlayerKey(e.target.value)}
                        placeholder="Nenhum / Gol do adversário..."
                      />
                    </div>

                    {/* Optional description */}
                    <div>
                      <Input
                        label="Detalhes (Opcional)"
                        placeholder="Ex: de fora da área, de cabeça..."
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        maxLength={150}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-2 bg-[var(--brand)] hover:bg-[var(--brand-strong)] text-[var(--bg)] font-bold rounded-[12px]"
                      loading={submitting}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Lançar Evento aos {live.liveStatus === "HALF_TIME" ? "Intervalo" : formatTime(live.liveStatus === "FIRST_HALF" ? firstHalfSeconds : secondHalfSeconds)}
                    </Button>

                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-center py-6 text-sm text-[var(--text-muted)]">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    O cronômetro está pausado.
                    <span className="text-xs max-w-[220px]">
                      Inicie o próximo tempo de jogo para registrar eventos em tempo real.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-fit">
              <CardHeader>
                <h3 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
                  <Award className="h-4 w-4 text-[var(--brand)]" />
                  Estatísticas Finais
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Esta partida foi finalizada. As estatísticas e gols mostrados no painel principal já estão registrados nos recordes gerais do elenco na aba de Pós Jogo.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Timeline of events */}
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
                <Activity className="h-4 w-4 text-[var(--brand)]" />
                Linha do Tempo de Eventos ({live.events.length})
              </h3>
            </CardHeader>
            <CardContent>
              {live.events.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-[12px] p-6 bg-white/[0.01]">
                  <p className="text-sm text-[var(--text-subtle)]">Nenhum evento registrado ainda.</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Gols, assistências e cartões aparecerão aqui chronologicamente.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {[...live.events].reverse().map((event) => {
                    const isOurGoal = event.type === "GOAL" && (event.playerId || event.guestPlayerId);
                    const isOpponentGoal = event.type === "GOAL" && !event.playerId && !event.guestPlayerId;
                    
                    return (
                      <div
                        key={event.id}
                        className={`flex items-start justify-between gap-3 border border-white/5 rounded-xl p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-all ${
                          isOpponentGoal ? "border-red-500/20 bg-red-500/[0.01]" : ""
                        } ${isOurGoal ? "border-emerald-500/20 bg-emerald-500/[0.01]" : ""}`}
                      >
                        <div className="flex gap-3">
                          <span className="text-lg mt-0.5" role="img" aria-label={event.type}>
                            {getEventEmoji(event.type)}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black font-mono text-[var(--brand)] bg-[var(--brand-soft)] px-1.5 py-0.5 rounded">
                                {event.minute}' ({event.half}T)
                              </span>
                              <span className="font-bold text-sm text-[var(--text)]">
                                {eventLabels[event.type]}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-[var(--text)] mt-1">
                              {event.player?.name || event.guestPlayer?.name || "Adversário / Geral"}
                              {(event.player?.shirtNumber || event.guestPlayer?.shirtNumber) && (
                                <span className="text-xs text-[var(--text-muted)] ml-1">
                                  #{event.player?.shirtNumber || event.guestPlayer?.shirtNumber}
                                </span>
                              )}
                            </p>
                            {event.description && (
                              <p className="text-xs text-[var(--text-muted)] mt-0.5 italic">
                                "{event.description}"
                              </p>
                            )}
                          </div>
                        </div>

                        {live.liveStatus !== "FINISHED" && (
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="rounded-[8px] p-1.5 text-[var(--text-muted)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[#fca5a5] transition-all"
                            title="Remover Evento"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}
