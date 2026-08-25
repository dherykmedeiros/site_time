"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Shield, ClipboardList, CheckCircle2, AlertCircle, Save, User, Users, Activity, Sparkles, Target, Lock, ArrowRightLeft, Plus, Trash2, Award } from "lucide-react";
import type { MatchDetail, PlayerStat } from "@/app/dashboard/matches/[id]/page";
import { playerPositionLabels } from "@/lib/player-positions";

interface ActivePlayerOption {
  id: string;
  name: string;
  fullName: string | null;
  shirtNumber: number;
  position: string;
  photoUrl: string | null;
}

interface ConfirmedPlayerOption {
  id: string;
  playerId: string | null;
  guestPlayerId: string | null;
  name: string;
  fullName: string | null;
  shirtNumber: number;
  position: string;
  photoUrl: string | null;
}

interface SubstitutionItem {
  playerOutId: string;
  playerInId: string;
  minute: string;
  reason: string;
}

interface EvaluationState {
  playerId?: string | null;
  guestPlayerId?: string | null;
  rating: number; // 1 to 10
  feedback: string;
}

interface MatchCoachReportTabProps {
  match: MatchDetail;
  isCoachOrAdmin: boolean;
  currentUserId: string | null;
  currentUserPlayerId: string | null;
  fetchMatch: () => void;
}

const FORMATIONS_FUT11 = [
  "4-3-3 (Ofensivo / Triângulo no Meio)",
  "4-3-3 (Defensivo / 1 Volante e 2 Meias)",
  "4-3-3 (Falso 9)",
  "4-4-2 (Linhas Paralelas)",
  "4-4-2 (Losango / Diamante Central)",
  "4-2-3-1 (Padrão com Pontas)",
  "4-2-3-1 (Aberto)",
  "3-5-2 (Com Alas Agressivos)",
  "3-4-3 (Tripla de Ataque)",
  "4-1-4-1 (Pressão Alta)",
  "4-5-1 (Contenção / Tranca)",
  "5-3-2 (Bloco Baixo / Contra-Ataque)",
  "5-4-1 (Linha Quinquenal)",
  "3-4-1-2 (Meia Clássico)",
  "4-3-2-1 (Árvore de Natal)",
  "Fut7 (2-3-1 Padrão)",
  "Fut7 (3-2-1 Pirâmide)",
  "Fut7 (2-2-2 Quadrado)",
  "Fut7 (1-4-1 Ofensivo)",
  "Fut6 (2-2-1 Socca)",
  "Futsal (1-2-1 Pivô Clássico)",
  "Futsal (2-2 Quadra)",
  "Futsal (3-0 Com 3 Fixos)",
];

export function MatchCoachReportTab({
  match,
  isCoachOrAdmin,
  currentUserId,
  currentUserPlayerId,
  fetchMatch,
}: MatchCoachReportTabProps) {
  const isTraining = match.type === "TRAINING";

  const [activePlayers, setActivePlayers] = useState<ActivePlayerOption[]>([]);
  const [confirmedPlayers, setConfirmedPlayers] = useState<ConfirmedPlayerOption[]>([]);

  // Active sub-tab for training matches ("A" or "B")
  const [activeTab, setActiveTab] = useState<"A" | "B">("A");

  // Coach IDs
  const [selectedCoachId, setSelectedCoachId] = useState<string>(match.coachPlayerId || "");
  const [selectedCoachBId, setSelectedCoachBId] = useState<string>((match as any).coachPlayerBId || "");

  // Team A state
  const [formation, setFormation] = useState<string>("4-3-3 (Ofensivo / Triângulo no Meio)");
  const [starterPlayerIds, setStarterPlayerIds] = useState<string[]>([]);
  const [substitutions, setSubstitutions] = useState<SubstitutionItem[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [startingStrategy, setStartingStrategy] = useState<string>("");
  const [substitutionsNotes, setSubstitutionsNotes] = useState<string>("");
  const [strengths, setStrengths] = useState<string>("");
  const [improvements, setImprovements] = useState<string>("");
  const [evaluationsA, setEvaluationsA] = useState<Record<string, EvaluationState>>({});

  // Team B state
  const [formationB, setFormationB] = useState<string>("4-3-3 (Ofensivo / Triângulo no Meio)");
  const [starterPlayerIdsB, setStarterPlayerIdsB] = useState<string[]>([]);
  const [substitutionsB, setSubstitutionsB] = useState<SubstitutionItem[]>([]);
  const [summaryB, setSummaryB] = useState<string>("");
  const [startingStrategyB, setStartingStrategyB] = useState<string>("");
  const [substitutionsNotesB, setSubstitutionsNotesB] = useState<string>("");
  const [strengthsB, setStrengthsB] = useState<string>("");
  const [improvementsB, setImprovementsB] = useState<string>("");
  const [evaluationsB, setEvaluationsB] = useState<Record<string, EvaluationState>>({});

  const [canView, setCanView] = useState<boolean>(true);
  const [canEditA, setCanEditA] = useState<boolean>(false);
  const [canEditB, setCanEditB] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [assigningCoach, setAssigningCoach] = useState<boolean>(false);

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadActivePlayers = useCallback(async () => {
    if (!isCoachOrAdmin) return;
    try {
      const res = await fetch("/api/players/active");
      if (res.ok) {
        const data = await res.json();
        setActivePlayers(data);
      }
    } catch (err) {
      console.error("Erro ao carregar lista de atletas ativos", err);
    }
  }, [isCoachOrAdmin]);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/matches/${match.id}/coach-report`);
      if (res.ok) {
        const data = await res.json();
        setCanView(data.canView ?? true);
        setCanEditA(data.canEditA ?? false);
        setCanEditB(data.canEditB ?? false);

        if (data.coachPlayerId) setSelectedCoachId(data.coachPlayerId);
        if (data.coachPlayerBId) setSelectedCoachBId(data.coachPlayerBId);

        // Team A
        setFormation(data.formation || "4-3-3 (Ofensivo / Triângulo no Meio)");
        setStarterPlayerIds(data.starterPlayerIds || []);
        setSubstitutions(data.substitutions || []);
        setSummary(data.summary || "");
        setStartingStrategy(data.startingStrategy || "");
        setSubstitutionsNotes(data.substitutionsNotes || "");
        setStrengths(data.strengths || "");
        setImprovements(data.improvements || "");

        // Team B
        setFormationB(data.formationB || "4-3-3 (Ofensivo / Triângulo no Meio)");
        setStarterPlayerIdsB(data.starterPlayerIdsB || []);
        setSubstitutionsB(data.substitutionsB || []);
        setSummaryB(data.summaryB || "");
        setStartingStrategyB(data.startingStrategyB || "");
        setSubstitutionsNotesB(data.substitutionsNotesB || "");
        setStrengthsB(data.strengthsB || "");
        setImprovementsB(data.improvementsB || "");

        setConfirmedPlayers(data.confirmedPlayers || []);

        // Map existing evaluations separated by team side
        const evalMapA: Record<string, EvaluationState> = {};
        const evalMapB: Record<string, EvaluationState> = {};

        (data.evaluations || []).forEach((ev: any) => {
          const key = ev.playerId || ev.guestPlayerId;
          if (key) {
            const item: EvaluationState = {
              playerId: ev.playerId,
              guestPlayerId: ev.guestPlayerId,
              rating: ev.rating || 5,
              feedback: ev.feedback || "",
            };
            if (ev.teamSide === "B") {
              evalMapB[key] = item;
            } else {
              evalMapA[key] = item;
            }
          }
        });

        // Initialize evaluations for participating match stats if missing
        match.stats.forEach((p) => {
          const key = p.guestPlayerId ? p.guestPlayerId : (p.playerId || p.playerName);
          if (key) {
            if (!evalMapA[key]) {
              evalMapA[key] = {
                playerId: p.guestPlayerId ? null : (p.playerId || null),
                guestPlayerId: p.guestPlayerId || null,
                rating: 7,
                feedback: "",
              };
            }
            if (!evalMapB[key]) {
              evalMapB[key] = {
                playerId: p.guestPlayerId ? null : (p.playerId || null),
                guestPlayerId: p.guestPlayerId || null,
                rating: 7,
                feedback: "",
              };
            }
          }
        });

        setEvaluationsA(evalMapA);
        setEvaluationsB(evalMapB);
      } else {
        const data = await res.json().catch(() => ({}));
        setCanView(false);
        setErrorMsg(data.error || "Acesso restrito ao relatório do treinador.");
      }
    } catch {
      setErrorMsg("Erro de conexão ao carregar o relatório do treinador");
    } finally {
      setLoading(false);
    }
  }, [match.id, match.stats]);

  useEffect(() => {
    loadActivePlayers();
    loadReport();
  }, [loadActivePlayers, loadReport]);

  const handleAssignCoach = async (coachId: string, side: "A" | "B" = "A") => {
    setAssigningCoach(true);
    setFeedbackMsg(null);
    setErrorMsg(null);

    const payload = side === "B"
      ? { coachPlayerBId: coachId || null, teamSide: "B" }
      : { coachPlayerId: coachId || null, teamSide: "A" };

    try {
      const res = await fetch(`/api/matches/${match.id}/coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        if (side === "B") {
          setSelectedCoachBId(coachId);
        } else {
          setSelectedCoachId(coachId);
        }
        setFeedbackMsg(`Treinador do Time ${side} designado com sucesso!`);
        fetchMatch();
        loadReport();
        setTimeout(() => setFeedbackMsg(null), 3000);
      } else {
        setErrorMsg(data.error || "Erro ao designar treinador");
      }
    } catch {
      setErrorMsg("Erro de conexão ao designar treinador");
    } finally {
      setAssigningCoach(false);
    }
  };

  const toggleStarterPlayer = (playerId: string, side: "A" | "B" = "A") => {
    if (side === "B") {
      setStarterPlayerIdsB((prev) =>
        prev.includes(playerId)
          ? prev.filter((id) => id !== playerId)
          : [...prev, playerId]
      );
    } else {
      setStarterPlayerIds((prev) =>
        prev.includes(playerId)
          ? prev.filter((id) => id !== playerId)
          : [...prev, playerId]
      );
    }
  };

  const addSubstitutionRow = (side: "A" | "B" = "A") => {
    const list = isTraining
      ? confirmedPlayers.filter((p) => (p as any).teamSide === side)
      : confirmedPlayers;

    const currentStarters = side === "B" ? starterPlayerIdsB : starterPlayerIds;
    const starterOptions = list.filter((p) => currentStarters.includes(p.id));
    const reserveOptions = list.filter((p) => !currentStarters.includes(p.id));

    if (starterOptions.length === 0 || reserveOptions.length === 0) {
      alert("Para registrar uma substituição, é necessário selecionar os Titulares primeiro!");
      return;
    }

    const newSub: SubstitutionItem = {
      playerOutId: starterOptions[0].id,
      playerInId: reserveOptions[0].id,
      minute: "15' 2ºT",
      reason: "",
    };

    if (side === "B") {
      setSubstitutionsB((prev) => [...prev, newSub]);
    } else {
      setSubstitutions((prev) => [...prev, newSub]);
    }
  };

  const updateSubstitutionRow = (index: number, field: keyof SubstitutionItem, value: string, side: "A" | "B" = "A") => {
    if (side === "B") {
      setSubstitutionsB((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], [field]: value };
        return copy;
      });
    } else {
      setSubstitutions((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], [field]: value };
        return copy;
      });
    }
  };

  const removeSubstitutionRow = (index: number, side: "A" | "B" = "A") => {
    if (side === "B") {
      setSubstitutionsB((prev) => prev.filter((_, i) => i !== index));
    } else {
      setSubstitutions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleRatingChange = (key: string, rating: number, playerId?: string | null, guestPlayerId?: string | null, side: "A" | "B" = "A") => {
    if (side === "B") {
      setEvaluationsB((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          playerId: prev[key]?.playerId ?? playerId ?? null,
          guestPlayerId: prev[key]?.guestPlayerId ?? guestPlayerId ?? null,
          rating,
          feedback: prev[key]?.feedback ?? "",
        },
      }));
    } else {
      setEvaluationsA((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          playerId: prev[key]?.playerId ?? playerId ?? null,
          guestPlayerId: prev[key]?.guestPlayerId ?? guestPlayerId ?? null,
          rating,
          feedback: prev[key]?.feedback ?? "",
        },
      }));
    }
  };

  const handleFeedbackChange = (key: string, feedback: string, playerId?: string | null, guestPlayerId?: string | null, side: "A" | "B" = "A") => {
    if (side === "B") {
      setEvaluationsB((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          playerId: prev[key]?.playerId ?? playerId ?? null,
          guestPlayerId: prev[key]?.guestPlayerId ?? guestPlayerId ?? null,
          rating: prev[key]?.rating ?? 5,
          feedback,
        },
      }));
    } else {
      setEvaluationsA((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          playerId: prev[key]?.playerId ?? playerId ?? null,
          guestPlayerId: prev[key]?.guestPlayerId ?? guestPlayerId ?? null,
          rating: prev[key]?.rating ?? 5,
          feedback,
        },
      }));
    }
  };

  const handleSaveReport = async () => {
    setSaving(true);
    setFeedbackMsg(null);
    setErrorMsg(null);

    const cleanSubstitutionsA = substitutions
      .filter((s) => Boolean(s.playerOutId && s.playerInId))
      .map((s) => ({
        playerOutId: String(s.playerOutId),
        playerInId: String(s.playerInId),
        minute: s.minute || "",
        reason: s.reason || "",
      }));

    const cleanSubstitutionsB = substitutionsB
      .filter((s) => Boolean(s.playerOutId && s.playerInId))
      .map((s) => ({
        playerOutId: String(s.playerOutId),
        playerInId: String(s.playerInId),
        minute: s.minute || "",
        reason: s.reason || "",
      }));

    const cleanEvaluationsA = Object.values(evaluationsA)
      .filter((e) => Boolean(e.playerId || e.guestPlayerId))
      .map((e) => ({
        playerId: e.playerId || null,
        guestPlayerId: e.guestPlayerId || null,
        teamSide: "A" as const,
        rating: Number(e.rating) || 5,
        feedback: e.feedback || "",
      }));

    const cleanEvaluationsB = Object.values(evaluationsB)
      .filter((e) => Boolean(e.playerId || e.guestPlayerId))
      .map((e) => ({
        playerId: e.playerId || null,
        guestPlayerId: e.guestPlayerId || null,
        teamSide: "B" as const,
        rating: Number(e.rating) || 5,
        feedback: e.feedback || "",
      }));

    try {
      const res = await fetch(`/api/matches/${match.id}/coach-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Team A
          summary: summary || "",
          formation: formation || "4-3-3 (Ofensivo / Triângulo no Meio)",
          starterPlayerIds: starterPlayerIds || [],
          substitutions: cleanSubstitutionsA,
          startingStrategy: startingStrategy || "",
          substitutionsNotes: substitutionsNotes || "",
          strengths: strengths || "",
          improvements: improvements || "",
          // Team B
          summaryB: summaryB || "",
          formationB: formationB || "4-3-3 (Ofensivo / Triângulo no Meio)",
          starterPlayerIdsB: starterPlayerIdsB || [],
          substitutionsB: cleanSubstitutionsB,
          startingStrategyB: startingStrategyB || "",
          substitutionsNotesB: substitutionsNotesB || "",
          strengthsB: strengthsB || "",
          improvementsB: improvementsB || "",

          status: "PUBLISHED",
          evaluations: isTraining ? [...cleanEvaluationsA, ...cleanEvaluationsB] : cleanEvaluationsA,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setFeedbackMsg("Relatório tático e avaliações salvos com sucesso!");
        fetchMatch();
        loadReport();
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        setErrorMsg(data.error || "Erro ao salvar relatório tático");
      }
    } catch {
      setErrorMsg("Erro de conexão ao salvar relatório");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[var(--text-muted)] font-medium">Carregando relatório do treinador...</div>;
  }

  // Access Restricted View
  if (!canView) {
    return (
      <Card className="border-red-500/20 bg-red-500/5 p-8 text-center">
        <Lock className="h-10 w-10 text-red-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-red-400">Acesso Restrito ao Relatório Tático</h2>
        <p className="text-sm text-[var(--text-subtle)] mt-1 max-w-md mx-auto">
          {errorMsg || "Apenas a comissão técnica, administradores ou os atletas definidos como treinadores desta partida podem visualizar este relatório."}
        </p>
      </Card>
    );
  }

  const assignedCoachA = activePlayers.find((p) => p.id === selectedCoachId) || match.coachPlayer;
  const assignedCoachB = activePlayers.find((p) => p.id === selectedCoachBId) || (match as any).coachPlayerB;

  // Active side configuration
  const currentSide = isTraining ? activeTab : "A";
  const currentCanEdit = currentSide === "B" ? canEditB : canEditA;
  const currentFormation = currentSide === "B" ? formationB : formation;
  const currentSetFormation = currentSide === "B" ? setFormationB : setFormation;
  const currentStarters = currentSide === "B" ? starterPlayerIdsB : starterPlayerIds;
  const currentSubs = currentSide === "B" ? substitutionsB : substitutions;
  const currentSummary = currentSide === "B" ? summaryB : summary;
  const currentSetSummary = currentSide === "B" ? setSummaryB : setSummary;
  const currentStrategy = currentSide === "B" ? startingStrategyB : startingStrategy;
  const currentSetStrategy = currentSide === "B" ? setStartingStrategyB : setStartingStrategy;
  const currentSubNotes = currentSide === "B" ? substitutionsNotesB : substitutionsNotes;
  const currentSetSubNotes = currentSide === "B" ? setSubstitutionsNotesB : setSubstitutionsNotes;
  const currentStrengths = currentSide === "B" ? strengthsB : strengths;
  const currentSetStrengths = currentSide === "B" ? setStrengthsB : setStrengths;
  const currentImprovements = currentSide === "B" ? improvementsB : improvements;
  const currentSetImprovements = currentSide === "B" ? setImprovementsB : setImprovements;
  const currentEvaluations = currentSide === "B" ? evaluationsB : evaluationsA;

  const sidePlayers = isTraining
    ? confirmedPlayers.filter((p) => ((p as any).teamSide || "A") === currentSide)
    : confirmedPlayers;

  const currentCoach = currentSide === "B" ? assignedCoachB : assignedCoachA;

  return (
    <div className="space-y-6">
      {/* Banner de Permissões */}
      {!currentCanEdit && (
        <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-center gap-3 text-xs font-semibold text-amber-300">
          <Lock className="h-4 w-4 shrink-0" />
          <span>
            <strong>Modo de Leitura ({isTraining ? `Time ${currentSide}` : "Geral"}):</strong> Apenas o atleta designado como treinador do Time {currentSide} (ou a comissão técnica) pode editar as informações deste time.
          </span>
        </div>
      )}

      {/* Header do Treinador Responsável */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[var(--text)]">
                  {isTraining ? "Comissão Técnica & Relatório Tático do Treino" : "Relatório Tático & Pós-Jogo do Treinador"}
                </h2>
                <p className="text-xs text-[var(--text-subtle)]">
                  {isTraining
                    ? "Definição de esquemas táticos, substituições e notas individuais por treinador do Time A e Time B."
                    : "Definição dos titulares, esquemas táticos, registro de substituições e notas técnicas."}
                </p>
              </div>
            </div>

            {/* Designar Treinador (Exclusivo ADMIN/COACH) */}
            {isCoachOrAdmin && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    {isTraining ? "Treinador Time A (Colete):" : "Designar Treinador (ADMIN):"}
                  </label>
                  <select
                    value={selectedCoachId}
                    disabled={assigningCoach}
                    onChange={(e) => handleAssignCoach(e.target.value, "A")}
                    className="rounded-xl border border-emerald-500/30 bg-[#16130f] px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-[#36c2a8]"
                  >
                    <option value="">-- Treinador Time A --</option>
                    {activePlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.shirtNumber} - {p.name} {p.fullName ? `(${p.fullName})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {isTraining && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                      Treinador Time B (Sem Colete):
                    </label>
                    <select
                      value={selectedCoachBId}
                      disabled={assigningCoach}
                      onChange={(e) => handleAssignCoach(e.target.value, "B")}
                      className="rounded-xl border border-blue-500/30 bg-[#16130f] px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-[#3b82f6]"
                    >
                      <option value="">-- Treinador Time B --</option>
                      {activePlayers.map((p) => (
                        <option key={p.id} value={p.id}>
                          #{p.shirtNumber} - {p.name} {p.fullName ? `(${p.fullName})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Card dos Treinadores Designados */}
          {isTraining ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Treinador Time A */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm overflow-hidden shrink-0">
                  {assignedCoachA?.photoUrl ? (
                    <img src={assignedCoachA.photoUrl} alt={assignedCoachA.name} className="h-full w-full object-cover" />
                  ) : (
                    assignedCoachA?.name?.charAt(0).toUpperCase() || "A"
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                    Treinador Time A (Colete)
                  </span>
                  <span className="text-xs font-black text-white">
                    {assignedCoachA ? `#${assignedCoachA.shirtNumber || "0"} — ${assignedCoachA.name}` : "Não designado"}
                  </span>
                </div>
              </div>

              {/* Treinador Time B */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-blue-500/30 bg-blue-950/20">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-sm overflow-hidden shrink-0">
                  {assignedCoachB?.photoUrl ? (
                    <img src={assignedCoachB.photoUrl} alt={assignedCoachB.name} className="h-full w-full object-cover" />
                  ) : (
                    assignedCoachB?.name?.charAt(0).toUpperCase() || "B"
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">
                    Treinador Time B (Sem Colete)
                  </span>
                  <span className="text-xs font-black text-white">
                    {assignedCoachB ? `#${assignedCoachB.shirtNumber || "0"} — ${assignedCoachB.name}` : "Não designado"}
                  </span>
                </div>
              </div>
            </div>
          ) : assignedCoachA ? (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
              <div className="h-11 w-11 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm overflow-hidden shrink-0">
                {assignedCoachA.photoUrl ? (
                  <img src={assignedCoachA.photoUrl} alt={assignedCoachA.name} className="h-full w-full object-cover" />
                ) : (
                  assignedCoachA.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                  Treinador Responsável Pela Partida
                </span>
                <span className="text-sm font-black text-white">
                  #{assignedCoachA.shirtNumber || "0"} — {assignedCoachA.name} {assignedCoachA.fullName ? `(${assignedCoachA.fullName})` : ""}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-dashed border-yellow-500/30 bg-yellow-500/5 text-xs font-semibold text-yellow-400">
              ⚠️ Nenhum atleta foi designado como treinador para esta partida ainda.
            </div>
          )}

          {/* Feedback & Error messages */}
          {feedbackMsg && (
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-400">
              ✅ {feedbackMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-400">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Sub-Aba Seletora para Treino (Time A vs Time B) */}
          {isTraining && (
            <div className="flex items-center gap-2 border-b border-white/10 pt-2 pb-1">
              <button
                type="button"
                onClick={() => setActiveTab("A")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                  activeTab === "A"
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-900/30"
                    : "bg-white/5 text-[#8fa39b] hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>🔵 Relatório Time A</span>
                {assignedCoachA && <span className="text-[10px] opacity-80">({assignedCoachA.name})</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("B")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                  activeTab === "B"
                    ? "bg-blue-500 text-black shadow-lg shadow-blue-900/30"
                    : "bg-white/5 text-[#8fa39b] hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>🔴 Relatório Time B</span>
                {assignedCoachB && <span className="text-[10px] opacity-80">({assignedCoachB.name})</span>}
              </button>
            </div>
          )}

          {/* ── SEÇÃO 1: FORMAÇÃO & ATLETAS TITULARES (INTERATIVO) ─────── */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <Target className={`h-5 w-5 ${currentSide === "B" ? "text-blue-400" : "text-emerald-400"}`} />
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  1. Formação & Titulares {isTraining ? `(Time ${currentSide})` : ""}
                </h3>
              </div>

              {/* Seletor de Formação */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#8fa39b]">Esquema Tático:</span>
                {currentCanEdit ? (
                  <select
                    value={currentFormation}
                    onChange={(e) => currentSetFormation(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#16130f] px-3 py-1.5 text-xs font-black text-white outline-none focus:border-[#36c2a8]"
                  >
                    {FORMATIONS_FUT11.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Badge variant="default" className="text-xs font-bold">
                    {currentFormation}
                  </Badge>
                )}
              </div>
            </div>

            {/* Seleção Interativa de Titulares */}
            <div>
              <label className="block text-[11px] font-bold text-[#8fa39b] mb-2">
                Selecione os atletas que iniciaram jogando como <strong>Titulares</strong> {isTraining ? `no Time ${currentSide}` : ""}:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {sidePlayers.map((p) => {
                  const isStarter = currentStarters.includes(p.id);
                  const rawPos = p.position;
                  const posLabel = rawPos ? (playerPositionLabels[rawPos as keyof typeof playerPositionLabels] || rawPos) : "";

                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={!currentCanEdit}
                      onClick={() => toggleStarterPlayer(p.id, currentSide)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition ${
                        isStarter
                          ? currentSide === "B"
                            ? "bg-blue-500/20 border-blue-500 text-white font-bold"
                            : "bg-emerald-500/20 border-emerald-500 text-white font-bold"
                          : "bg-white/[0.02] border-white/10 text-[#8fa39b] hover:bg-white/[0.05]"
                      } ${!currentCanEdit ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <span className="w-5 text-center font-mono font-bold">
                        {p.shirtNumber ? `#${p.shirtNumber}` : "-"}
                      </span>
                      <div className="flex-1 truncate">
                        <p className="truncate font-semibold">{p.name}</p>
                        {posLabel && <p className="text-[10px] text-[#8fa39b] truncate">{posLabel}</p>}
                      </div>
                      {isStarter && (
                        <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${currentSide === "B" ? "bg-blue-500 text-black" : "bg-emerald-500 text-black"}`}>
                          11
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estratégia Inicial */}
            <div>
              <label className="block text-[11px] font-bold text-[#8fa39b] mb-1">
                Estratégia & Proposta de Jogo Inicial {isTraining ? `do Time ${currentSide}` : ""}:
              </label>
              {currentCanEdit ? (
                <textarea
                  value={currentStrategy}
                  onChange={(e) => currentSetStrategy(e.target.value)}
                  placeholder="Instruções táticas iniciais (ex: Marcação pressão alta, saída curta, transição rápida)..."
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
                />
              ) : (
                currentStrategy && (
                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-[var(--text)] whitespace-pre-line">
                    {currentStrategy}
                  </div>
                )
              )}
            </div>
          </div>

          {/* ── SEÇÃO 2: SUBSTITUIÇÕES (INTERATIVO) ────────────────────── */}
          <div className="space-y-4 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  2. Substituições Táticas {isTraining ? `(Time ${currentSide})` : ""}
                </h3>
              </div>

              {currentCanEdit && (
                <button
                  type="button"
                  onClick={() => addSubstitutionRow(currentSide)}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
                >
                  <Plus className="h-3.5 w-3.5" /> Adicionar Troca
                </button>
              )}
            </div>

            {currentSubs.length === 0 ? (
              <p className="text-xs text-[var(--text-subtle)] italic">
                Nenhuma alteração cadastrada para este time.
              </p>
            ) : (
              <div className="space-y-3">
                {currentSubs.map((sub, idx) => {
                  const starterOptions = sidePlayers.filter((p) => currentStarters.includes(p.id));
                  const reserveOptions = sidePlayers.filter((p) => !currentStarters.includes(p.id));

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-white/10 bg-[#121212] space-y-2 text-xs"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* Saiu */}
                        <div>
                          <label className="block text-[10px] font-bold text-red-400 mb-0.5">🔴 Saiu (Titular):</label>
                          {currentCanEdit ? (
                            <select
                              value={sub.playerOutId}
                              onChange={(e) => updateSubstitutionRow(idx, "playerOutId", e.target.value, currentSide)}
                              className="w-full rounded-lg border border-white/10 bg-[#16130f] px-2 py-1 text-xs text-white outline-none"
                            >
                              {starterOptions.map((p) => (
                                <option key={p.id} value={p.id}>
                                  #{p.shirtNumber} {p.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-red-400 font-bold">
                              #{sidePlayers.find((p) => p.id === sub.playerOutId)?.shirtNumber} {sidePlayers.find((p) => p.id === sub.playerOutId)?.name}
                            </span>
                          )}
                        </div>

                        {/* Entrou */}
                        <div>
                          <label className="block text-[10px] font-bold text-emerald-400 mb-0.5">🟢 Entrou (Reserva):</label>
                          {currentCanEdit ? (
                            <select
                              value={sub.playerInId}
                              onChange={(e) => updateSubstitutionRow(idx, "playerInId", e.target.value, currentSide)}
                              className="w-full rounded-lg border border-white/10 bg-[#16130f] px-2 py-1 text-xs text-white outline-none"
                            >
                              {reserveOptions.map((p) => (
                                <option key={p.id} value={p.id}>
                                  #{p.shirtNumber} {p.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-emerald-400 font-bold">
                              #{sidePlayers.find((p) => p.id === sub.playerInId)?.shirtNumber} {sidePlayers.find((p) => p.id === sub.playerInId)?.name}
                            </span>
                          )}
                        </div>

                        {/* Minuto */}
                        <div>
                          <label className="block text-[10px] font-bold text-amber-400 mb-0.5">⏱️ Minuto/Tempo:</label>
                          {currentCanEdit ? (
                            <input
                              type="text"
                              value={sub.minute}
                              onChange={(e) => updateSubstitutionRow(idx, "minute", e.target.value, currentSide)}
                              placeholder="Ex: 15' 2ºT"
                              className="w-full rounded-lg border border-white/10 bg-[#16130f] px-2 py-1 text-xs text-white outline-none"
                            />
                          ) : (
                            <span className="text-amber-400">{sub.minute || "Intervalo"}</span>
                          )}
                        </div>
                      </div>

                      {/* Motivo */}
                      <div className="flex items-center gap-2">
                        {currentCanEdit ? (
                          <>
                            <input
                              type="text"
                              value={sub.reason}
                              onChange={(e) => updateSubstitutionRow(idx, "reason", e.target.value, currentSide)}
                              placeholder="Motivo tático / justificativa da troca (ex: Cansaço / Mais velocidade)..."
                              className="flex-1 rounded-lg border border-white/10 bg-[#16130f] px-2.5 py-1 text-xs text-white outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeSubstitutionRow(idx, currentSide)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          sub.reason && <span className="text-[#8fa39b] italic">"{sub.reason}"</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Observações Gerais de Substituições */}
            <div>
              <label className="block text-[11px] font-bold text-[#8fa39b] mb-1">
                Observações Adicionais sobre as Substituições:
              </label>
              {currentCanEdit ? (
                <textarea
                  value={currentSubNotes}
                  onChange={(e) => currentSetSubNotes(e.target.value)}
                  placeholder="Considerações gerais do treinador sobre as alterações..."
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
                />
              ) : (
                currentSubNotes && (
                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-[var(--text)] whitespace-pre-line">
                    {currentSubNotes}
                  </div>
                )
              )}
            </div>
          </div>

          {/* ── SEÇÃO 3: PONTOS FORTES & ASPECTOS A EVOLUIR ──────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Pontos Fortes Observados:
              </label>
              {currentCanEdit ? (
                <textarea
                  value={currentStrengths}
                  onChange={(e) => currentSetStrengths(e.target.value)}
                  placeholder="O que funcionou bem taticamente nesta partida..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
                />
              ) : (
                <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-[var(--text)] leading-relaxed whitespace-pre-line">
                  {currentStrengths || "Não informado."}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" /> Aspectos a Trabalhar nos Treinos:
              </label>
              {currentCanEdit ? (
                <textarea
                  value={currentImprovements}
                  onChange={(e) => currentSetImprovements(e.target.value)}
                  placeholder="Erros a corrigir e aspectos para evoluir..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
                />
              ) : (
                <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-[var(--text)] leading-relaxed whitespace-pre-line">
                  {currentImprovements || "Não informado."}
                </div>
              )}
            </div>
          </div>

          {/* Resumo Geral */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="block text-xs font-bold text-white flex items-center gap-1.5">
              📋 Resumo Geral & Conclusão do Treinador {isTraining ? `(Time ${currentSide})` : ""}:
            </label>
            {currentCanEdit ? (
              <textarea
                value={currentSummary}
                onChange={(e) => currentSetSummary(e.target.value)}
                placeholder="Parecer geral da atuação da equipe..."
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
              />
            ) : (
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-[var(--text)] leading-relaxed whitespace-pre-line">
                {currentSummary || "Sem parecer geral adicional registrado."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Avaliações Individuais dos Atletas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Notas e Parecer Técnico Individual {isTraining ? `(Atletas do Time ${currentSide})` : "por Atleta"}
            </h3>
            {isTraining && (
              <Badge variant="default" className="text-xs font-bold">
                {sidePlayers.length} atletas
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sidePlayers.length === 0 ? (
            <p className="text-xs text-[var(--text-subtle)] text-center py-4">
              Nenhum jogador registrado neste time.
            </p>
          ) : (
            sidePlayers.map((p) => {
              const key = p.playerId || p.guestPlayerId || p.name;
              const ev = currentEvaluations[key] || { rating: 5, feedback: "" };
              const rawPosition = p.position;
              const posLabel = rawPosition ? (playerPositionLabels[rawPosition as keyof typeof playerPositionLabels] || rawPosition) : "";

              // Stat if available
              const playerStat = match.stats.find((st) => (st.playerId || st.guestPlayerId) === (p.playerId || p.guestPlayerId));

              return (
                <div
                  key={key}
                  className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{p.name}</span>
                          {posLabel && <span className="text-[10px] font-bold text-[#8fa39b]">({posLabel})</span>}
                        </div>
                        {playerStat && (
                          <div className="text-[11px] text-[#8fa39b] mt-0.5">
                            ⚽ Gols: {playerStat.goals} · 🅰️ Assist: {playerStat.assists} · 🟨 Cartões: {playerStat.yellowCards}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Nota do Treinador */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#8fa39b]">Nota do Treinador:</span>
                      {currentCanEdit ? (
                        <select
                          value={ev.rating}
                          onChange={(e) => handleRatingChange(key, Number(e.target.value), p.playerId, p.guestPlayerId, currentSide)}
                          className="rounded-xl border border-white/10 bg-[#16130f] px-3 py-1 text-sm font-black text-emerald-400 outline-none focus:border-[#36c2a8]"
                        >
                          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                              {n} ⭐
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg border border-white/10 font-black text-xs text-emerald-400">
                          {ev.rating} ⭐
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feedback Individual do Treinador */}
                  <div>
                    {currentCanEdit ? (
                      <input
                        type="text"
                        value={ev.feedback}
                        onChange={(e) => handleFeedbackChange(key, e.target.value, p.playerId, p.guestPlayerId, currentSide)}
                        placeholder={`Parecer do treinador sobre a atuação de ${p.name}...`}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#36c2a8]"
                      />
                    ) : (
                      <p className="text-xs text-[var(--text-subtle)] bg-black/20 p-2.5 rounded-lg border border-white/5 italic">
                        "{ev.feedback || "Sem parecer individual adicional pelo treinador."}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Botão de Salvar */}
          {currentCanEdit && (
            <div className="pt-4 space-y-3">
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleSaveReport}
                  disabled={saving}
                  loading={saving}
                  className="w-full sm:w-auto bg-[#10b981] hover:bg-[#34d399] active:scale-95 touch-manipulation text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 shadow-lg"
                >
                  {saving ? "Salvando..." : isTraining ? `💾 Salvar Relatório & Notas (Time ${currentSide})` : "💾 Publicar Relatório Tático & Titulares"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
