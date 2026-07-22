"use client";

import React, { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase";
import {
  createMatchLiveEventAction,
  updateRSVPAction,
} from "@/app/actions/match-actions";
import {
  Trophy,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlusCircle,
  Shield,
  UserCheck,
  UserX,
  Zap,
} from "lucide-react";

export interface PlayerInfo {
  id: string;
  name: string;
  shirtNumber: number;
}

export interface LiveEventItem {
  id: string;
  type: "GOAL" | "ASSIST" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION";
  minute: number;
  half: number;
  description?: string | null;
  player?: PlayerInfo | null;
}

export interface RSVPItem {
  id: string;
  playerId: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED";
  player: PlayerInfo;
}

export interface LiveScoreboardProps {
  matchId: string;
  teamName: string;
  opponentName: string;
  venue: string;
  matchDate: string;
  isHome: boolean;
  initialHomeScore: number;
  initialAwayScore: number;
  initialLiveStatus: string;
  matchLiveId: string;
  initialEvents: LiveEventItem[];
  initialRsvps: RSVPItem[];
  playersList: PlayerInfo[];
  currentPlayerId?: string; // ID do jogador logado se houver
}

export function LiveScoreboard({
  matchId,
  teamName,
  opponentName,
  venue,
  matchDate,
  isHome,
  initialHomeScore,
  initialAwayScore,
  initialLiveStatus,
  matchLiveId,
  initialEvents,
  initialRsvps,
  playersList,
  currentPlayerId,
}: LiveScoreboardProps) {
  const [homeScore, setHomeScore] = useState(initialHomeScore);
  const [awayScore, setAwayScore] = useState(initialAwayScore);
  const [liveStatus, setLiveStatus] = useState(initialLiveStatus);
  const [events, setEvents] = useState<LiveEventItem[]>(initialEvents);
  const [rsvps, setRsvps] = useState<RSVPItem[]>(initialRsvps);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form de Evento ao Vivo
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventType, setEventType] = useState<
    "GOAL" | "ASSIST" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION"
  >("GOAL");
  const [eventMinute, setEventMinute] = useState<number>(1);
  const [eventHalf, setEventHalf] = useState<number>(1);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [teamIsScorer, setTeamIsScorer] = useState<boolean>(true);
  const [eventDesc, setEventDesc] = useState<string>("");

  // Subscrição Supabase Realtime para escutar inserts/updates em tempo real
  useEffect(() => {
    if (!matchLiveId) return;

    // Escuta alterações na tabela match_lives (Placar)
    const liveChannel = supabaseClient
      .channel(`match-live-${matchLiveId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "match_lives",
          filter: `id=eq.${matchLiveId}`,
        },
        (payload) => {
          if (payload.new) {
            setHomeScore(payload.new.homeScore);
            setAwayScore(payload.new.awayScore);
            setLiveStatus(payload.new.liveStatus);
          }
        }
      )
      // Escuta inserções na tabela match_live_events (Eventos da Partida)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_live_events",
          filter: `matchLiveId=eq.${matchLiveId}`,
        },
        (payload) => {
          if (payload.new) {
            const newEvt = payload.new as any;
            const playerObj = playersList.find((p) => p.id === newEvt.playerId);
            const formattedEvt: LiveEventItem = {
              id: newEvt.id,
              type: newEvt.type,
              minute: newEvt.minute,
              half: newEvt.half,
              description: newEvt.description,
              player: playerObj || null,
            };
            setEvents((prev) => [formattedEvt, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(liveChannel);
    };
  }, [matchLiveId, playersList]);

  // Handler de alteração de RSVP
  const handleRsvpUpdate = async (status: "CONFIRMED" | "DECLINED") => {
    if (!currentPlayerId) return;
    setIsSubmitting(true);
    const res = await updateRSVPAction({
      matchId,
      playerId: currentPlayerId,
      status,
    });
    setIsSubmitting(false);

    if (res.success) {
      setRsvps((prev) =>
        prev.map((r) =>
          r.playerId === currentPlayerId ? { ...r, status } : r
        )
      );
    }
  };

  // Handler para adicionar evento de jogo
  const handleAddLiveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await createMatchLiveEventAction({
      matchId,
      matchLiveId,
      type: eventType,
      minute: Number(eventMinute),
      half: Number(eventHalf),
      playerId: selectedPlayerId || null,
      description: eventDesc || null,
      teamIsScorer,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      setHomeScore(res.data.homeScore);
      setAwayScore(res.data.awayScore);
      setShowEventModal(false);
      // Reset form
      setEventDesc("");
      setSelectedPlayerId("");
    }
  };

  const currentRsvp = rsvps.find((r) => r.playerId === currentPlayerId)?.status;

  const homeTeamName = isHome ? teamName : opponentName;
  const awayTeamName = isHome ? opponentName : teamName;

  return (
    <div className="max-w-md mx-auto bg-slate-900 text-white min-h-screen pb-12 flex flex-col font-sans">
      {/* Header & Status */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
          <Zap className="w-4 h-4 animate-pulse" />
          <span>PLACAR AO VIVO</span>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 font-medium">
          {liveStatus === "NOT_STARTED"
            ? "Não Iniciado"
            : liveStatus === "FIRST_HALF"
            ? "1º Tempo"
            : liveStatus === "HALF_TIME"
            ? "Intervalo"
            : liveStatus === "SECOND_HALF"
            ? "2º Tempo"
            : "Encerrado"}
        </span>
      </div>

      {/* Main Scoreboard Display */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 text-center border-b border-slate-800 shadow-xl">
        <div className="flex justify-around items-center my-4">
          {/* Time Mandante */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center mb-2 shadow-inner border border-slate-600">
              <Shield className="w-7 h-7 text-slate-300" />
            </div>
            <h2 className="font-bold text-sm text-slate-200 line-clamp-1">
              {homeTeamName}
            </h2>
            <span className="text-xs text-slate-400 mt-0.5">
              {isHome ? "(Mandante)" : ""}
            </span>
          </div>

          {/* Placar Numérico */}
          <div className="flex items-center gap-3 px-4">
            <span className="text-5xl font-black tracking-tight text-white font-mono bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-700/50 shadow-inner">
              {homeScore}
            </span>
            <span className="text-2xl font-bold text-slate-500">:</span>
            <span className="text-5xl font-black tracking-tight text-white font-mono bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-700/50 shadow-inner">
              {awayScore}
            </span>
          </div>

          {/* Time Visitante */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center mb-2 shadow-inner border border-slate-600">
              <Shield className="w-7 h-7 text-slate-300" />
            </div>
            <h2 className="font-bold text-sm text-slate-200 line-clamp-1">
              {awayTeamName}
            </h2>
            <span className="text-xs text-slate-400 mt-0.5">
              {!isHome ? "(Mandante)" : ""}
            </span>
          </div>
        </div>

        {/* Informações da Partida */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{venue}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{new Date(matchDate).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      </div>

      {/* Botões de Ação de RSVP (para Atletas) */}
      {currentPlayerId && (
        <div className="p-4 bg-slate-850 border-b border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Sua Presença na Partida</span>
            {currentRsvp === "CONFIRMED" && (
              <span className="text-emerald-400 text-xs flex items-center gap-1 font-normal">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmado
              </span>
            )}
            {currentRsvp === "DECLINED" && (
              <span className="text-rose-400 text-xs flex items-center gap-1 font-normal">
                <XCircle className="w-3.5 h-3.5" /> Recusado
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleRsvpUpdate("CONFIRMED")}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                currentRsvp === "CONFIRMED"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Vou Jogar</span>
            </button>
            <button
              onClick={() => handleRsvpUpdate("DECLINED")}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                currentRsvp === "DECLINED"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-900/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              <UserX className="w-4 h-4" />
              <span>Não Posso</span>
            </button>
          </div>
        </div>
      )}

      {/* Botão de Adicionar Evento (Admin / Técnico) */}
      <div className="p-4 flex justify-between items-center">
        <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wide">
          Linha do Tempo (Ao Vivo)
        </h3>
        <button
          onClick={() => setShowEventModal(true)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Lançar Evento</span>
        </button>
      </div>

      {/* Timeline de Eventos ao Vivo */}
      <div className="px-4 flex-1">
        {events.length === 0 ? (
          <div className="text-center py-10 bg-slate-800/40 rounded-xl border border-slate-800">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-xs">Nenhum evento registrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-slate-800 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-400 bg-slate-900 px-2 py-1 rounded border border-slate-700 font-mono">
                    {evt.minute}&apos; ({evt.half}ºT)
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      {evt.type === "GOAL" && "⚽ Gol!"}
                      {evt.type === "ASSIST" && "🅰️ Assistência"}
                      {evt.type === "YELLOW_CARD" && "🟨 Cartão Amarelo"}
                      {evt.type === "RED_CARD" && "🟥 Cartão Vermelho"}
                      {evt.type === "SUBSTITUTION" && "🔄 Substituição"}
                      {evt.player && (
                        <span className="text-slate-300 font-normal">
                          - #{evt.player.shirtNumber} {evt.player.name}
                        </span>
                      )}
                    </div>
                    {evt.description && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {evt.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal / Form de Lançamento de Evento */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 text-white rounded-2xl p-6 w-full max-w-sm border border-slate-700 shadow-2xl">
            <h3 className="text-base font-bold mb-4 text-emerald-400 flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Lançar Evento da Partida
            </h3>

            <form onSubmit={handleAddLiveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Tipo de Evento
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="GOAL">⚽ Gol</option>
                  <option value="ASSIST">🅰️ Assistência</option>
                  <option value="YELLOW_CARD">🟨 Cartão Amarelo</option>
                  <option value="RED_CARD">🟥 Cartão Vermelho</option>
                  <option value="SUBSTITUTION">🔄 Substituição</option>
                </select>
              </div>

              {eventType === "GOAL" && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Quem marcou o gol?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTeamIsScorer(true)}
                      className={`p-2.5 rounded-lg font-medium border text-center ${
                        teamIsScorer
                          ? "bg-emerald-600 text-white border-emerald-500"
                          : "bg-slate-900 text-slate-400 border-slate-700"
                      }`}
                    >
                      {teamName} (Nosso Time)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeamIsScorer(false)}
                      className={`p-2.5 rounded-lg font-medium border text-center ${
                        !teamIsScorer
                          ? "bg-rose-600 text-white border-rose-500"
                          : "bg-slate-900 text-slate-400 border-slate-700"
                      }`}
                    >
                      {opponentName} (Adversário)
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Minuto do Jogo
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="130"
                    value={eventMinute}
                    onChange={(e) => setEventMinute(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Tempo
                  </label>
                  <select
                    value={eventHalf}
                    onChange={(e) => setEventHalf(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value={1}>1º Tempo</option>
                    <option value={2}>2º Tempo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Atleta Envolvido (Opcional)
                </label>
                <select
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="">Nenhum / Não especificado</option>
                  {playersList.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.shirtNumber} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Descrição / Observação
                </label>
                <input
                  type="text"
                  placeholder="Ex: Gol de falta, substituição de lesão..."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition-colors shadow"
                >
                  {isSubmitting ? "Gravando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
