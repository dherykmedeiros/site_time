"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Users, 
  Sparkles, 
  ArrowLeftRight, 
  Save, 
  Share2, 
  Star, 
  UserCheck, 
  Trash2,
  CheckCircle2
} from "lucide-react";
import { playerPositionLabels } from "@/lib/player-positions";
import { autoBalanceTrainingTeams, TrainingPlayerCandidate } from "@/lib/match-lineup";
import type { MatchDetail, MatchLineupResponse } from "@/app/dashboard/matches/[id]/page";

export interface TrainingPlayerItem {
  id: string; // playerId or guestPlayerId
  playerId: string | null;
  guestPlayerId: string | null;
  name: string;
  position: string;
  shirtNumber: number | null;
  role: "STARTER" | "BENCH";
  teamSide: "A" | "B";
  isGuest?: boolean;
  fieldX?: number | null;
  fieldY?: number | null;
}

interface TrainingLineupManagerProps {
  match: MatchDetail;
  lineupData: MatchLineupResponse | null;
  onSaveLineup: (lineupPayload: any) => Promise<void>;
  saveLoading: boolean;
}

export function TrainingLineupManager({
  match,
  lineupData,
  onSaveLineup,
  saveLoading,
}: TrainingLineupManagerProps) {
  // Pool of all confirmed players and guest players
  const allEligibleCandidates: TrainingPlayerItem[] = useMemo(() => {
    const list: TrainingPlayerItem[] = [];

    // Map stats by playerId to get position if available
    const statPosMap = new Map<string, { position?: string }>();
    (match.stats || []).forEach((st) => {
      if (st.playerId) statPosMap.set(st.playerId, { position: st.position });
    });

    // If lineup data has starters/bench, map their positions and shirt numbers
    const lineupPlayerMap = new Map<string, { position?: string; shirtNumber?: number | null }>();
    if (lineupData?.lineup) {
      [...lineupData.lineup.starters, ...lineupData.lineup.bench].forEach((p: any) => {
        if (p.playerId) {
          lineupPlayerMap.set(p.playerId, { position: p.position, shirtNumber: p.shirtNumber });
        }
      });
    }

    // Regular confirmed players
    match.rsvps
      .filter((r) => r.status === "CONFIRMED")
      .forEach((r) => {
        const fromLineup = lineupPlayerMap.get(r.playerId);
        const fromStats = statPosMap.get(r.playerId);
        list.push({
          id: r.playerId,
          playerId: r.playerId,
          guestPlayerId: null,
          name: r.playerName,
          position: fromLineup?.position || fromStats?.position || "MIDFIELDER",
          shirtNumber: fromLineup?.shirtNumber ?? null,
          role: "STARTER",
          teamSide: "A",
          isGuest: false,
        });
      });

    // Guest players (if attached on match or in lineup)
    (match.guestPlayers || []).forEach((g) => {
      list.push({
        id: g.id,
        playerId: null,
        guestPlayerId: g.id,
        name: g.name,
        position: g.position || "FORWARD",
        shirtNumber: g.shirtNumber ?? null,
        role: "STARTER",
        teamSide: "B",
        isGuest: true,
      });
    });

    // If lineup data has any guest not already in list
    if (lineupData?.lineup) {
      [...lineupData.lineup.starters, ...lineupData.lineup.bench]
        .filter((p: any) => p.isGuest || p.playerId?.startsWith?.("guest_"))
        .forEach((g: any) => {
          if (!list.some((item) => item.id === g.playerId)) {
            list.push({
              id: g.playerId,
              playerId: null,
              guestPlayerId: g.playerId,
              name: g.playerName,
              position: g.position || "FORWARD",
              shirtNumber: g.shirtNumber ?? null,
              role: "STARTER",
              teamSide: g.teamSide === "B" ? "B" : "A",
              isGuest: true,
            });
          }
        });
    }

    return list;
  }, [match.rsvps, match.stats, match.guestPlayers, lineupData]);

  // Squad State
  const [teamAStarters, setTeamAStarters] = useState<TrainingPlayerItem[]>([]);
  const [teamABench, setTeamABench] = useState<TrainingPlayerItem[]>([]);
  const [teamBStarters, setTeamBStarters] = useState<TrainingPlayerItem[]>([]);
  const [teamBBench, setTeamBBench] = useState<TrainingPlayerItem[]>([]);

  // UI state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareText, setShareText] = useState("");
  const [copyMsg, setCopyMsg] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Initialize or synchronize state when lineupData or allEligibleCandidates change
  useEffect(() => {
    if (lineupData?.trainingDivision) {
      const div = lineupData.trainingDivision;
      setTeamAStarters(div.teamA.starters);
      setTeamABench(div.teamA.bench);
      setTeamBStarters(div.teamB.starters);
      setTeamBBench(div.teamB.bench);
    } else if (lineupData?.lineup) {
      // If we have standard saved lineup entries, split by teamSide
      const startersA: TrainingPlayerItem[] = [];
      const benchA: TrainingPlayerItem[] = [];
      const startersB: TrainingPlayerItem[] = [];
      const benchB: TrainingPlayerItem[] = [];

      lineupData.lineup.starters.forEach((s: any) => {
        const item: TrainingPlayerItem = {
          id: s.playerId,
          playerId: s.playerId?.startsWith?.("guest_") ? null : s.playerId,
          guestPlayerId: s.playerId?.startsWith?.("guest_") ? s.playerId : null,
          name: s.playerName,
          position: s.position,
          shirtNumber: s.shirtNumber ?? null,
          role: "STARTER",
          teamSide: s.teamSide === "B" ? "B" : "A",
          fieldX: s.fieldX,
          fieldY: s.fieldY,
          isGuest: Boolean(s.isGuest),
        };
        if (item.teamSide === "B") startersB.push(item);
        else startersA.push(item);
      });

      lineupData.lineup.bench.forEach((b: any) => {
        const item: TrainingPlayerItem = {
          id: b.playerId,
          playerId: b.playerId?.startsWith?.("guest_") ? null : b.playerId,
          guestPlayerId: b.playerId?.startsWith?.("guest_") ? b.playerId : null,
          name: b.playerName,
          position: b.position,
          shirtNumber: b.shirtNumber ?? null,
          role: "BENCH",
          teamSide: b.teamSide === "B" ? "B" : "A",
          isGuest: Boolean(b.isGuest),
        };
        if (item.teamSide === "B") benchB.push(item);
        else benchA.push(item);
      });

      // If everything was empty, auto-divide initially
      if (startersA.length === 0 && startersB.length === 0 && allEligibleCandidates.length > 0) {
        handleAutoBalance();
      } else {
        setTeamAStarters(startersA);
        setTeamABench(benchA);
        setTeamBStarters(startersB);
        setTeamBBench(benchB);
      }
    } else if (allEligibleCandidates.length > 0) {
      handleAutoBalance();
    }
  }, [lineupData, allEligibleCandidates]);

  // Set of already assigned player IDs
  const assignedIds = useMemo(() => {
    const set = new Set<string>();
    [...teamAStarters, ...teamABench, ...teamBStarters, ...teamBBench].forEach((p) => {
      set.add(p.id);
    });
    return set;
  }, [teamAStarters, teamABench, teamBStarters, teamBBench]);

  // Unassigned available pool
  const unassignedPlayers = useMemo(() => {
    return allEligibleCandidates.filter((p) => !assignedIds.has(p.id));
  }, [allEligibleCandidates, assignedIds]);

  // Auto Balance Division Function
  const handleAutoBalance = () => {
    const candidates: TrainingPlayerCandidate[] = allEligibleCandidates.map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      shirtNumber: p.shirtNumber,
      isGuest: p.isGuest,
    }));

    const result = autoBalanceTrainingTeams(candidates);

    setTeamAStarters(
      result.teamA.starters.map((p) => ({
        id: p.id,
        playerId: p.isGuest ? null : p.id,
        guestPlayerId: p.isGuest ? p.id : null,
        name: p.name,
        position: p.position,
        shirtNumber: p.shirtNumber ?? null,
        role: "STARTER",
        teamSide: "A",
        isGuest: p.isGuest,
      }))
    );

    setTeamABench(
      result.teamA.bench.map((p) => ({
        id: p.id,
        playerId: p.isGuest ? null : p.id,
        guestPlayerId: p.isGuest ? p.id : null,
        name: p.name,
        position: p.position,
        shirtNumber: p.shirtNumber ?? null,
        role: "BENCH",
        teamSide: "A",
        isGuest: p.isGuest,
      }))
    );

    setTeamBStarters(
      result.teamB.starters.map((p) => ({
        id: p.id,
        playerId: p.isGuest ? null : p.id,
        guestPlayerId: p.isGuest ? p.id : null,
        name: p.name,
        position: p.position,
        shirtNumber: p.shirtNumber ?? null,
        role: "STARTER",
        teamSide: "B",
        isGuest: p.isGuest,
      }))
    );

    setTeamBBench(
      result.teamB.bench.map((p) => ({
        id: p.id,
        playerId: p.isGuest ? null : p.id,
        guestPlayerId: p.isGuest ? p.id : null,
        name: p.name,
        position: p.position,
        shirtNumber: p.shirtNumber ?? null,
        role: "BENCH",
        teamSide: "B",
        isGuest: p.isGuest,
      }))
    );

    setFeedbackMsg("Times A e B equilibrados automaticamente com base nas posições!");
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Swap all players between Team A and Team B
  const handleSwapSides = () => {
    const prevAStarters = [...teamAStarters];
    const prevABench = [...teamABench];
    const prevBStarters = [...teamBStarters];
    const prevBBench = [...teamBBench];

    setTeamAStarters(prevBStarters.map((p) => ({ ...p, teamSide: "A" })));
    setTeamABench(prevBBench.map((p) => ({ ...p, teamSide: "A" })));
    setTeamBStarters(prevAStarters.map((p) => ({ ...p, teamSide: "B" })));
    setTeamBBench(prevABench.map((p) => ({ ...p, teamSide: "B" })));

    setFeedbackMsg("Lados dos times invertidos com sucesso!");
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  // Move single player between squads or roles
  const movePlayer = (
    player: TrainingPlayerItem,
    targetSide: "A" | "B",
    targetRole: "STARTER" | "BENCH"
  ) => {
    setTeamAStarters((prev) => prev.filter((p) => p.id !== player.id));
    setTeamABench((prev) => prev.filter((p) => p.id !== player.id));
    setTeamBStarters((prev) => prev.filter((p) => p.id !== player.id));
    setTeamBBench((prev) => prev.filter((p) => p.id !== player.id));

    const updatedItem: TrainingPlayerItem = {
      ...player,
      teamSide: targetSide,
      role: targetRole,
    };

    if (targetSide === "A") {
      if (targetRole === "STARTER") {
        setTeamAStarters((prev) => [...prev, updatedItem]);
      } else {
        setTeamABench((prev) => [...prev, updatedItem]);
      }
    } else {
      if (targetRole === "STARTER") {
        setTeamBStarters((prev) => [...prev, updatedItem]);
      } else {
        setTeamBBench((prev) => [...prev, updatedItem]);
      }
    }
  };

  // Remove player from lineup (move back to unassigned)
  const removePlayerFromLineup = (playerId: string) => {
    setTeamAStarters((prev) => prev.filter((p) => p.id !== playerId));
    setTeamABench((prev) => prev.filter((p) => p.id !== playerId));
    setTeamBStarters((prev) => prev.filter((p) => p.id !== playerId));
    setTeamBBench((prev) => prev.filter((p) => p.id !== playerId));
  };

  // Save the full training lineup
  const handleSave = async () => {
    const starters = [
      ...teamAStarters.map((p) => ({
        playerId: p.id,
        teamSide: "A" as const,
        fieldX: p.fieldX ?? null,
        fieldY: p.fieldY ?? null,
      })),
      ...teamBStarters.map((p) => ({
        playerId: p.id,
        teamSide: "B" as const,
        fieldX: p.fieldX ?? null,
        fieldY: p.fieldY ?? null,
      })),
    ];

    const bench = [
      ...teamABench.map((p) => ({
        playerId: p.id,
        teamSide: "A" as const,
      })),
      ...teamBBench.map((p) => ({
        playerId: p.id,
        teamSide: "B" as const,
      })),
    ];

    await onSaveLineup({ starters, bench });
    setFeedbackMsg("Divisão dos times salva com sucesso!");
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Generate WhatsApp text for Training match
  const generateTrainingShareText = () => {
    const dateStr = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Sao_Paulo",
    }).format(new Date(match.date));

    const lines: string[] = [
      `⚽ *AMISTOSO TREINO: TIME A x TIME B*`,
      `📅 ${dateStr} | 📍 ${match.venue}`,
      ``,
      `🟢 *TIME A (${teamAStarters.length + teamABench.length} atletas):*`,
      `*Titulares:*`,
      ...teamAStarters.map(
        (p, idx) =>
          `${idx + 1}. ${p.shirtNumber ? `#${p.shirtNumber} ` : ""}${p.name}${
            p.position ? ` (${playerPositionLabels[p.position as keyof typeof playerPositionLabels] || p.position})` : ""
          }${p.isGuest ? " (Convidado)" : ""}`
      ),
    ];

    if (teamABench.length > 0) {
      lines.push(
        `*Reservas:*`,
        ...teamABench.map(
          (p) =>
            `▫️ ${p.shirtNumber ? `#${p.shirtNumber} ` : ""}${p.name}${
              p.isGuest ? " (Convidado)" : ""
            }`
        )
      );
    }

    lines.push(
      ``,
      `🟠 *TIME B (${teamBStarters.length + teamBBench.length} atletas):*`,
      `*Titulares:*`,
      ...teamBStarters.map(
        (p, idx) =>
          `${idx + 1}. ${p.shirtNumber ? `#${p.shirtNumber} ` : ""}${p.name}${
            p.position ? ` (${playerPositionLabels[p.position as keyof typeof playerPositionLabels] || p.position})` : ""
          }${p.isGuest ? " (Convidado)" : ""}`
      )
    );

    if (teamBBench.length > 0) {
      lines.push(
        `*Reservas:*`,
        ...teamBBench.map(
          (p) =>
            `▫️ ${p.shirtNumber ? `#${p.shirtNumber} ` : ""}${p.name}${
              p.isGuest ? " (Convidado)" : ""
            }`
        )
      );
    }

    if (unassignedPlayers.length > 0) {
      lines.push(
        ``,
        `⏳ *Aguardando Divisão (${unassignedPlayers.length}):*`,
        ...unassignedPlayers.map((p) => `▪️ ${p.name}`)
      );
    }

    const dashboardMatchUrl = typeof window !== "undefined" ? `${window.location.origin}/dashboard/matches/${match.id}` : `/dashboard/matches/${match.id}`;
    lines.push(``, `🔗 Detalhes no aplicativo: ${dashboardMatchUrl}`);

    return lines.join("\n");
  };

  const handleOpenShare = () => {
    setShareText(generateTrainingShareText());
    setShowShareModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Action Banner */}
      <Card className="border border-emerald-500/30 bg-gradient-to-r from-[#0d1f18] via-[#091410] to-[#0d1f18]">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  Divisão de Elenco — Amistoso Treino
                  <Badge variant="success" className="text-xs">
                    Time A vs Time B
                  </Badge>
                </h2>
                <p className="text-xs text-[#8fa39b] mt-0.5">
                  Organize os atletas e convidados confirmados entre as duas equipes. O admin ou o técnico podem distribuir manualmente ou equilibrar com um clique.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="secondary"
                onClick={handleAutoBalance}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold cursor-pointer"
                title="Equilibrar posições automaticamente"
              >
                <Sparkles className="h-4 w-4 mr-1.5 text-emerald-400" />
                Auto-Dividir Equilibrado
              </Button>

              <Button
                variant="secondary"
                onClick={handleSwapSides}
                className="bg-white/5 hover:bg-white/10 text-white text-xs font-bold cursor-pointer"
                title="Inverter os lados Time A e Time B"
              >
                <ArrowLeftRight className="h-4 w-4 mr-1.5 text-[#8fa39b]" />
                Inverter Lados
              </Button>

              <Button
                variant="secondary"
                onClick={handleOpenShare}
                className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold cursor-pointer"
              >
                <Share2 className="h-4 w-4 mr-1.5" />
                WhatsApp
              </Button>

              <Button
                variant="primary"
                onClick={handleSave}
                loading={saveLoading}
                className="bg-[#10b981] hover:bg-[#059669] text-black font-black text-xs px-5 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Save className="h-4 w-4 mr-1.5" />
                Salvar Escalação
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {feedbackMsg}
        </div>
      )}

      {/* Main Dual-Squad Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 🟢 TIME A (Mandante / Colete A) */}
        <Card className="border-emerald-500/30 bg-[#09130f]">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-black font-black text-xs">
                  A
                </span>
                <div>
                  <h3 className="text-base font-black text-white">Time A</h3>
                  <span className="text-[11px] font-bold text-emerald-400">
                    {teamAStarters.length} Titulares • {teamABench.length} Reservas
                  </span>
                </div>
              </div>
              <Badge variant="success" className="text-[11px] font-bold">
                Colete Verde / Principal
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {/* Titulares do Time A */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-emerald-400" /> Titulares ({teamAStarters.length}/11)
                </span>
              </div>

              {teamAStarters.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-[#8fa39b]">
                  Nenhum titular alocado no Time A.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {teamAStarters.map((player, idx) => {
                    const posLabel =
                      playerPositionLabels[player.position as keyof typeof playerPositionLabels] ||
                      player.position;

                    return (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-xs font-black">
                            {idx + 1}
                          </span>
                          <div className="truncate">
                            <span className="text-xs font-bold text-white block truncate">
                              {player.shirtNumber ? `#${player.shirtNumber} ` : ""}
                              {player.name}
                              {player.isGuest && (
                                <span className="ml-1 text-[10px] text-amber-400 font-normal">
                                  (Convidado)
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-[#8fa39b]">{posLabel}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => movePlayer(player, "A", "BENCH")}
                            className="rounded-lg p-1 text-[#8fa39b] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                            title="Mover para Reserva"
                          >
                            🪑
                          </button>
                          <button
                            onClick={() => movePlayer(player, "B", "STARTER")}
                            className="rounded-lg p-1 text-[#8fa39b] hover:bg-orange-500/20 hover:text-orange-400 transition-colors cursor-pointer"
                            title="Mover para Time B"
                          >
                            ➔ B
                          </button>
                          <button
                            onClick={() => removePlayerFromLineup(player.id)}
                            className="rounded-lg p-1 text-[#8fa39b] hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remover da escalação"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reservas do Time A */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-xs font-black uppercase tracking-wider text-[#8fa39b] block">
                🪑 Reservas ({teamABench.length})
              </span>

              {teamABench.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/5 p-3 text-center text-xs text-[#8fa39b]/60">
                  Nenhum reserva no Time A.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {teamABench.map((player) => {
                    const posLabel =
                      playerPositionLabels[player.position as keyof typeof playerPositionLabels] ||
                      player.position;

                    return (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-xs text-[#8fa39b]">▫️</span>
                          <span className="text-xs font-semibold text-white truncate">
                            {player.shirtNumber ? `#${player.shirtNumber} ` : ""}
                            {player.name}
                            {player.isGuest && (
                              <span className="ml-1 text-[10px] text-amber-400 font-normal">
                                (Convidado)
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-[#8fa39b]/70">({posLabel})</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => movePlayer(player, "A", "STARTER")}
                            className="rounded-lg p-1 text-[#8fa39b] hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors cursor-pointer"
                            title="Promover a Titular"
                          >
                            ⭐
                          </button>
                          <button
                            onClick={() => movePlayer(player, "B", "BENCH")}
                            className="rounded-lg p-1 text-[#8fa39b] hover:bg-orange-500/20 hover:text-orange-400 transition-colors cursor-pointer"
                            title="Mover para Time B"
                          >
                            ➔ B
                          </button>
                          <button
                            onClick={() => removePlayerFromLineup(player.id)}
                            className="rounded-lg p-1 text-[#8fa39b] hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remover da escalação"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 🟠 TIME B (Visitante / Colete B) */}
        <Card className="border-orange-500/30 bg-[#140e09]">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-black font-black text-xs">
                  B
                </span>
                <div>
                  <h3 className="text-base font-black text-white">Time B</h3>
                  <span className="text-[11px] font-bold text-orange-400">
                    {teamBStarters.length} Titulares • {teamBBench.length} Reservas
                  </span>
                </div>
              </div>
              <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[11px] font-bold">
                Colete Laranja / Desafiante
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {/* Titulares do Time B */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-orange-400" /> Titulares ({teamBStarters.length}/11)
                </span>
              </div>

              {teamBStarters.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-[#8fa39b]">
                  Nenhum titular alocado no Time B.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {teamBStarters.map((player, idx) => {
                    const posLabel =
                      playerPositionLabels[player.position as keyof typeof playerPositionLabels] ||
                      player.position;

                    return (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orange-500/20 text-orange-300 font-mono text-xs font-black">
                            {idx + 1}
                          </span>
                          <div className="truncate">
                            <span className="text-xs font-bold text-white block truncate">
                              {player.shirtNumber ? `#${player.shirtNumber} ` : ""}
                              {player.name}
                              {player.isGuest && (
                                <span className="ml-1 text-[10px] text-amber-400 font-normal">
                                  (Convidado)
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-[#8fa39b]">{posLabel}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => movePlayer(player, "B", "BENCH")}
                            className="rounded-lg p-1 text-[#8fa39b] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                            title="Mover para Reserva"
                          >
                            🪑
                          </button>
                          <button
                            onClick={() => movePlayer(player, "A", "STARTER")}
                            className="rounded-lg p-1 text-[#8fa39b] hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Mover para Time A"
                          >
                            ➔ A
                          </button>
                          <button
                            onClick={() => removePlayerFromLineup(player.id)}
                            className="rounded-lg p-1 text-[#8fa39b] hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remover da escalação"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reservas do Time B */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-xs font-black uppercase tracking-wider text-[#8fa39b] block">
                🪑 Reservas ({teamBBench.length})
              </span>

              {teamBBench.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/5 p-3 text-center text-xs text-[#8fa39b]/60">
                  Nenhum reserva no Time B.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {teamBBench.map((player) => {
                    const posLabel =
                      playerPositionLabels[player.position as keyof typeof playerPositionLabels] ||
                      player.position;

                    return (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-xs text-[#8fa39b]">▫️</span>
                          <span className="text-xs font-semibold text-white truncate">
                            {player.shirtNumber ? `#${player.shirtNumber} ` : ""}
                            {player.name}
                            {player.isGuest && (
                              <span className="ml-1 text-[10px] text-amber-400 font-normal">
                                (Convidado)
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-[#8fa39b]/70">({posLabel})</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => movePlayer(player, "B", "STARTER")}
                            className="rounded-lg p-1 text-[#8fa39b] hover:bg-orange-500/20 hover:text-orange-300 transition-colors cursor-pointer"
                            title="Promover a Titular"
                          >
                            ⭐
                          </button>
                          <button
                            onClick={() => movePlayer(player, "A", "BENCH")}
                            className="rounded-lg p-1 text-[#8fa39b] hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Mover para Time A"
                          >
                            ➔ A
                          </button>
                          <button
                            onClick={() => removePlayerFromLineup(player.id)}
                            className="rounded-lg p-1 text-[#8fa39b] hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remover da escalação"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 👥 Unassigned / Available Pool */}
      {unassignedPlayers.length > 0 && (
        <Card className="border border-white/10 bg-white/[0.02]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-400" />
                Atletas e Convidados Disponíveis Não Alocados ({unassignedPlayers.length})
              </h3>
              <span className="text-xs text-[#8fa39b]">
                Clique para alocar diretamente no Time A ou Time B
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {unassignedPlayers.map((player) => {
                const posLabel =
                  playerPositionLabels[player.position as keyof typeof playerPositionLabels] ||
                  player.position;

                return (
                  <div
                    key={player.id}
                    className="p-3 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between gap-2"
                  >
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">
                        {player.shirtNumber ? `#${player.shirtNumber} ` : ""}
                        {player.name}
                      </p>
                      <p className="text-[10px] text-[#8fa39b]">
                        {posLabel} {player.isGuest && "• Convidado"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => movePlayer(player, "A", "STARTER")}
                        className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-black transition-colors cursor-pointer"
                        title="Adicionar ao Time A como Titular"
                      >
                        + A
                      </button>
                      <button
                        onClick={() => movePlayer(player, "B", "STARTER")}
                        className="px-2 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-[11px] font-black transition-colors cursor-pointer"
                        title="Adicionar ao Time B como Titular"
                      >
                        + B
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Share Text Modal */}
      {showShareModal && (
        <Card className="border border-emerald-500/30 bg-[#0a1814]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Share2 className="h-4 w-4 text-emerald-400" />
                Texto Formatado para WhatsApp (Time A x Time B)
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-xs text-[#8fa39b] hover:text-white cursor-pointer"
              >
                Fechar ✕
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              rows={12}
              className="w-full rounded-xl border border-white/10 bg-black/50 p-3.5 text-xs text-white font-mono leading-relaxed outline-none focus:border-emerald-500"
            />

            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="primary"
                onClick={() => {
                  navigator.clipboard.writeText(shareText);
                  setCopyMsg("Texto copiado para a área de transferência!");
                  setTimeout(() => setCopyMsg(""), 3000);
                }}
                className="bg-emerald-500 text-black font-bold text-xs cursor-pointer"
              >
                📋 Copiar Texto
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(shareText)}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
              >
                📱 Enviar Diretamente no WhatsApp
              </Button>
            </div>

            {copyMsg && (
              <p className="text-xs font-bold text-emerald-400 mt-2">
                ✅ {copyMsg}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
