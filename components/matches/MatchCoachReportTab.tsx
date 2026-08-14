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
  const [activePlayers, setActivePlayers] = useState<ActivePlayerOption[]>([]);
  const [confirmedPlayers, setConfirmedPlayers] = useState<ConfirmedPlayerOption[]>([]);

  const [selectedCoachId, setSelectedCoachId] = useState<string>(match.coachPlayerId || "");
  const [formation, setFormation] = useState<string>("4-3-3 (Ofensivo / Triângulo no Meio)");
  const [starterPlayerIds, setStarterPlayerIds] = useState<string[]>([]);
  const [substitutions, setSubstitutions] = useState<SubstitutionItem[]>([]);

  const [summary, setSummary] = useState<string>("");
  const [startingStrategy, setStartingStrategy] = useState<string>("");
  const [substitutionsNotes, setSubstitutionsNotes] = useState<string>("");
  const [strengths, setStrengths] = useState<string>("");
  const [improvements, setImprovements] = useState<string>("");
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationState>>({});

  const [canView, setCanView] = useState<boolean>(true);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [assigningCoach, setAssigningCoach] = useState<boolean>(false);

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load active players list for coach selector (Only Admin/Coach role)
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

  // Load coach report data
  const loadReport = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/matches/${match.id}/coach-report`);
      if (res.ok) {
        const data = await res.json();
        setCanView(data.canView ?? true);
        setCanEdit(data.canEdit ?? false);

        if (data.coachPlayerId) {
          setSelectedCoachId(data.coachPlayerId);
        }
        setFormation(data.formation || "4-3-3 (Ofensivo / Triângulo no Meio)");
        setStarterPlayerIds(data.starterPlayerIds || []);
        setSubstitutions(data.substitutions || []);
        setConfirmedPlayers(data.confirmedPlayers || []);
        setSummary(data.summary || "");
        setStartingStrategy(data.startingStrategy || "");
        setSubstitutionsNotes(data.substitutionsNotes || "");
        setStrengths(data.strengths || "");
        setImprovements(data.improvements || "");

        // Map existing evaluations
        const evalMap: Record<string, EvaluationState> = {};
        (data.evaluations || []).forEach((ev: any) => {
          const key = ev.playerId || ev.guestPlayerId;
          if (key) {
            evalMap[key] = {
              playerId: ev.playerId,
              guestPlayerId: ev.guestPlayerId,
              rating: ev.rating || 5,
              feedback: ev.feedback || "",
            };
          }
        });

        // Initialize evaluations for participating match stats if missing
        match.stats.forEach((p) => {
          const key = p.playerId || p.guestPlayerId || p.playerName;
          if (key && !evalMap[key]) {
            evalMap[key] = {
              playerId: p.playerId || null,
              guestPlayerId: p.guestPlayerId || null,
              rating: 7,
              feedback: "",
            };
          }
        });

        setEvaluations(evalMap);
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

  const handleAssignCoach = async (coachId: string) => {
    setAssigningCoach(true);
    setFeedbackMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/matches/${match.id}/coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coachPlayerId: coachId || null }),
      });

      const data = await res.json();
      if (res.ok) {
        setSelectedCoachId(coachId);
        setFeedbackMsg("Treinador responsável da partida designado com sucesso!");
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

  const toggleStarterPlayer = (playerId: string) => {
    setStarterPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const addSubstitutionRow = () => {
    // Candidates to exit (titulares)
    const starterOptions = confirmedPlayers.filter((p) => starterPlayerIds.includes(p.id));
    // Candidates to enter (reservas/banco)
    const reserveOptions = confirmedPlayers.filter((p) => !starterPlayerIds.includes(p.id));

    if (starterOptions.length === 0 || reserveOptions.length === 0) {
      alert("Para registrar uma substituição, é necessário selecionar os Titulares primeiro!");
      return;
    }

    setSubstitutions((prev) => [
      ...prev,
      {
        playerOutId: starterOptions[0].id,
        playerInId: reserveOptions[0].id,
        minute: "15' 2ºT",
        reason: "",
      },
    ]);
  };

  const updateSubstitutionRow = (index: number, field: keyof SubstitutionItem, value: string) => {
    setSubstitutions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeSubstitutionRow = (index: number) => {
    setSubstitutions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRatingChange = (key: string, rating: number, playerId?: string | null, guestPlayerId?: string | null) => {
    setEvaluations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        playerId: prev[key]?.playerId ?? playerId ?? null,
        guestPlayerId: prev[key]?.guestPlayerId ?? guestPlayerId ?? null,
        rating,
        feedback: prev[key]?.feedback ?? "",
      },
    }));
  };

  const handleFeedbackChange = (key: string, feedback: string, playerId?: string | null, guestPlayerId?: string | null) => {
    setEvaluations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        playerId: prev[key]?.playerId ?? playerId ?? null,
        guestPlayerId: prev[key]?.guestPlayerId ?? guestPlayerId ?? null,
        rating: prev[key]?.rating ?? 5,
        feedback,
      },
    }));
  };

  const handleSaveReport = async () => {
    setSaving(true);
    setFeedbackMsg(null);
    setErrorMsg(null);

    const evalList = Object.values(evaluations);

    try {
      const res = await fetch(`/api/matches/${match.id}/coach-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          formation,
          starterPlayerIds,
          substitutions,
          startingStrategy,
          substitutionsNotes,
          strengths,
          improvements,
          status: "PUBLISHED",
          evaluations: evalList,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setFeedbackMsg("Relatório tático, escalação e substituições salvos com sucesso!");
        fetchMatch();
        loadReport();
        setTimeout(() => setFeedbackMsg(null), 3000);
      } else {
        setErrorMsg(data.error || "Erro ao salvar relatório tático");
      }
    } catch {
      setErrorMsg("Erro de conexão ao salvar relatório");
    } finally {
      setSaving(false);
    }
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 9) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (rating >= 7) return "bg-green-500/10 text-green-400 border-green-500/30";
    if (rating >= 5) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/10 text-red-400 border-red-500/30";
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
          {errorMsg || "Apenas a comissão técnica, administradores ou o atleta definido como treinador desta partida podem visualizar este relatório."}
        </p>
      </Card>
    );
  }

  const assignedCoach = activePlayers.find((p) => p.id === selectedCoachId) || match.coachPlayer;
  const starterPlayers = confirmedPlayers.filter((p) => starterPlayerIds.includes(p.id));
  const reservePlayers = confirmedPlayers.filter((p) => !starterPlayerIds.includes(p.id));

  // Automatic match stats analysis (Pulling empirical data!)
  const topScorer = [...match.stats].sort((a, b) => b.goals - a.goals)[0];
  const topAssister = [...match.stats].sort((a, b) => b.assists - a.assists)[0];

  return (
    <div className="space-y-6">
      {/* Banner de Permissões */}
      {!canEdit && (
        <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-center gap-3 text-xs font-semibold text-amber-450">
          <Lock className="h-4 w-4 shrink-0" />
          <span>
            <strong>Modo de Leitura:</strong> Apenas o atleta designado como treinador desta partida pode editar as informações.
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
                <h2 className="text-lg font-black text-[var(--text)]">Relatório Tático & Pós-Jogo do Treinador</h2>
                <p className="text-xs text-[var(--text-subtle)]">
                  Definição dos titulares, esquemas táticos, registro de substituições e notas técnicas.
                </p>
              </div>
            </div>

            {/* Designar Treinador (Exclusivo ADMIN/COACH) */}
            {isCoachOrAdmin && (
              <div className="flex flex-col gap-1 sm:items-end">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#8fa39b]">
                  Designar Treinador do Jogo (ADMIN):
                </label>
                <select
                  value={selectedCoachId}
                  disabled={assigningCoach}
                  onChange={(e) => handleAssignCoach(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#16130f] px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-[#36c2a8]"
                >
                  <option value="">-- Selecionar Treinador --</option>
                  {activePlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.shirtNumber} - {p.name} {p.fullName ? `(${p.fullName})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Card do Treinador Designado */}
          {assignedCoach ? (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
              <div className="h-11 w-11 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm overflow-hidden shrink-0">
                {assignedCoach.photoUrl ? (
                  <img src={assignedCoach.photoUrl} alt={assignedCoach.name} className="h-full w-full object-cover" />
                ) : (
                  assignedCoach.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                  Treinador Responsável Pela Partida
                </span>
                <span className="text-sm font-black text-white">
                  #{assignedCoach.shirtNumber || "0"} — {assignedCoach.name} {assignedCoach.fullName ? `(${assignedCoach.fullName})` : ""}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-dashed border-yellow-500/30 bg-yellow-500/5 text-xs font-semibold text-yellow-400">
              ⚠️ Nenhum atleta foi designado como treinador para esta partida ainda.
            </div>
          )}

          {/* Destaques da Partida Automáticos (Dados Puxados) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                ⚽
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8fa39b] uppercase block">Destaque de Gols</span>
                <span className="text-xs font-black text-white">
                  {topScorer && topScorer.goals > 0 ? `${topScorer.playerName} (${topScorer.goals} gols)` : "Nenhum gol registrado"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                🅰️
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8fa39b] uppercase block">Destaque de Assistências</span>
                <span className="text-xs font-black text-white">
                  {topAssister && topAssister.assists > 0 ? `${topAssister.playerName} (${topAssister.assists} assist)` : "Nenhuma assistência registrada"}
                </span>
              </div>
            </div>
          </div>

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

          {/* ── SEÇÃO 1: FORMAÇÃO & ATLETAS TITULARES (INTERATIVO) ─────── */}
          <div className="space-y-4 pt-2 border-t border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="text-xs font-bold text-[#6ee7b7] flex items-center gap-1.5">
                <Target className="h-4 w-4" /> 1. Formação Tática & Escolha dos Titulares:
              </label>

              {/* Formação Tática Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#8fa39b]">Esquema:</span>
                {canEdit ? (
                  <select
                    value={formation}
                    onChange={(e) => setFormation(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#16130f] px-3 py-1 text-xs font-bold text-emerald-400 outline-none focus:border-[#36c2a8]"
                  >
                    {FORMATIONS_FUT11.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-black text-emerald-400">
                    ⚡ {formation}
                  </span>
                )}
              </div>
            </div>

            {/* Seleção Interativa de Titulares (Apenas Atletas que Confirmaram) */}
            {canEdit ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8fa39b]">
                  <span>Selecione os atletas que iniciaram como <strong>TITULARES</strong> (apenas presenças confirmadas):</span>
                  <span className="font-bold text-emerald-400">
                    {starterPlayerIds.length} Titulares Selecionados
                  </span>
                </div>

                {confirmedPlayers.length === 0 ? (
                  <p className="text-xs text-yellow-400 italic py-2">
                    Nenhum atleta confirmou presença nesta partida até o momento.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {confirmedPlayers.map((p) => {
                      const isStarter = starterPlayerIds.includes(p.id);
                      const posLabel = playerPositionLabels[p.position as keyof typeof playerPositionLabels] || p.position;

                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleStarterPlayer(p.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                            isStarter
                              ? "border-emerald-500/40 bg-emerald-500/15 shadow-sm"
                              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                              {p.shirtNumber ? `#${p.shirtNumber}` : p.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">{p.name}</p>
                              <p className="text-[10px] text-[#8fa39b]">{posLabel}</p>
                            </div>
                          </div>

                          <div
                            className={`h-5 w-5 rounded-md border flex items-center justify-center text-xs font-black transition-colors ${
                              isStarter
                                ? "border-emerald-400 bg-emerald-400 text-black"
                                : "border-white/20 bg-transparent text-transparent"
                            }`}
                          >
                            ✓
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Modo de Leitura dos Titulares */
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#8fa39b]">Time Titular Escala de Jogo ({starterPlayers.length} atletas):</p>
                {starterPlayers.length === 0 ? (
                  <p className="text-xs text-[var(--text-subtle)] italic">Titulares não especificados pelo treinador.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {starterPlayers.map((p) => {
                      const posLabel = playerPositionLabels[p.position as keyof typeof playerPositionLabels] || p.position;
                      return (
                        <div key={p.id} className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-400">#{p.shirtNumber || "0"}</span>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{p.name}</p>
                            <p className="text-[9px] text-[#8fa39b]">{posLabel}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Motivação Tática Inicial */}
            <div>
              <label className="block text-[11px] font-bold text-[#8fa39b] mb-1">
                Motivação Tática & Ideia de Jogo Inicial (Opcional):
              </label>
              {canEdit ? (
                <textarea
                  value={startingStrategy}
                  onChange={(e) => setStartingStrategy(e.target.value)}
                  placeholder="Observações adicionais sobre o plano tático inicial..."
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
                />
              ) : (
                startingStrategy && (
                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-[var(--text)] whitespace-pre-line">
                    {startingStrategy}
                  </div>
                )
              )}
            </div>
          </div>

          {/* ── SEÇÃO 2: GERENCIADOR PRÁTICO DE SUBSTITUIÇÕES ─────────── */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#6ee7b7] flex items-center gap-1.5">
                <ArrowRightLeft className="h-4 w-4" /> 2. Registro Prático de Substituições Realizadas:
              </label>

              {canEdit && (
                <Button
                  onClick={addSubstitutionRow}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-1 h-auto"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Substituição
                </Button>
              )}
            </div>

            {canEdit ? (
              <div className="space-y-3">
                {substitutions.length === 0 ? (
                  <p className="text-xs text-[var(--text-subtle)] italic py-2">
                    Nenhuma substituição cadastrada. Clique no botão acima para adicionar as trocas feitas no jogo.
                  </p>
                ) : (
                  substitutions.map((sub, idx) => {
                    const starterOptions = confirmedPlayers.filter((p) => starterPlayerIds.includes(p.id));
                    const reserveOptions = confirmedPlayers.filter((p) => !starterPlayerIds.includes(p.id));

                    return (
                      <div key={idx} className="p-3 rounded-xl border border-white/10 bg-black/40 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-red-400 block mb-0.5">🔴 Saiu (Titular):</label>
                            <select
                              value={sub.playerOutId}
                              onChange={(e) => updateSubstitutionRow(idx, "playerOutId", e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-[#16130f] px-2.5 py-1 text-xs font-bold text-white outline-none"
                            >
                              {starterOptions.map((p) => (
                                <option key={p.id} value={p.id}>
                                  #{p.shirtNumber} - {p.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-emerald-400 block mb-0.5">🟢 Entrou (Reserva):</label>
                            <select
                              value={sub.playerInId}
                              onChange={(e) => updateSubstitutionRow(idx, "playerInId", e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-[#16130f] px-2.5 py-1 text-xs font-bold text-white outline-none"
                            >
                              {reserveOptions.map((p) => (
                                <option key={p.id} value={p.id}>
                                  #{p.shirtNumber} - {p.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-[#8fa39b] block mb-0.5">⏱️ Minuto / Tempo:</label>
                            <input
                              type="text"
                              value={sub.minute}
                              onChange={(e) => updateSubstitutionRow(idx, "minute", e.target.value)}
                              placeholder="ex: 15' 2ºT"
                              className="w-full rounded-lg border border-white/10 bg-[#16130f] px-2.5 py-1 text-xs text-white outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={sub.reason}
                            onChange={(e) => updateSubstitutionRow(idx, "reason", e.target.value)}
                            placeholder="Motivo tático / justificativa da troca (ex: Cansaço / Dar mais velocidade pela ponta)..."
                            className="flex-1 rounded-lg border border-white/10 bg-[#16130f] px-2.5 py-1 text-xs text-white outline-none"
                          />
                          <button
                            onClick={() => removeSubstitutionRow(idx)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Modo de Leitura das Substituições */
              <div className="space-y-2">
                {substitutions.length === 0 ? (
                  <p className="text-xs text-[var(--text-subtle)] italic">Nenhuma substituição cadastrada nesta partida.</p>
                ) : (
                  substitutions.map((sub, idx) => {
                    const playerOut = confirmedPlayers.find((p) => p.id === sub.playerOutId);
                    const playerIn = confirmedPlayers.find((p) => p.id === sub.playerInId);

                    return (
                      <div key={idx} className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-amber-400 shrink-0">⏱️ {sub.minute || "Troca"}</span>
                          <span className="text-red-400 font-bold">🔴 Saiu: #{playerOut?.shirtNumber || 0} {playerOut?.name || "Atleta"}</span>
                          <span className="text-white">➔</span>
                          <span className="text-emerald-400 font-bold">🟢 Entrou: #{playerIn?.shirtNumber || 0} {playerIn?.name || "Atleta"}</span>
                        </div>
                        {sub.reason && <span className="text-[#8fa39b] italic">"{sub.reason}"</span>}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Observações Gerais de Substituições */}
            <div>
              <label className="block text-[11px] font-bold text-[#8fa39b] mb-1">
                Observações Adicionais sobre as Substituições:
              </label>
              {canEdit ? (
                <textarea
                  value={substitutionsNotes}
                  onChange={(e) => setSubstitutionsNotes(e.target.value)}
                  placeholder="Considerações gerais do treinador sobre as alterações..."
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
                />
              ) : (
                substitutionsNotes && (
                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-[var(--text)] whitespace-pre-line">
                    {substitutionsNotes}
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
              {canEdit ? (
                <textarea
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="O que funcionou bem taticamente nesta partida..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
                />
              ) : (
                <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-[var(--text)] leading-relaxed whitespace-pre-line">
                  {strengths || "Não informado."}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" /> Aspectos a Trabalhar nos Treinos:
              </label>
              {canEdit ? (
                <textarea
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  placeholder="Erros a corrigir e aspectos para evoluir..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
                />
              ) : (
                <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-[var(--text)] leading-relaxed whitespace-pre-line">
                  {improvements || "Não informado."}
                </div>
              )}
            </div>
          </div>

          {/* Resumo Geral */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="block text-xs font-bold text-white flex items-center gap-1.5">
              📋 Resumo Geral & Conclusão do Treinador:
            </label>
            {canEdit ? (
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Parecer geral da atuação da equipe..."
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
              />
            ) : (
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-[var(--text)] leading-relaxed whitespace-pre-line">
                {summary || "Sem parecer geral adicional registrado."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Avaliações Individuais dos Atletas */}
      <Card>
        <CardHeader>
          <h3 className="text-base font-bold text-white">Notas e Parecer Técnico Individual por Atleta</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {match.stats.length === 0 ? (
            <p className="text-xs text-[var(--text-subtle)] text-center py-4">
              Nenhum jogador registrado nas estatísticas desta partida.
            </p>
          ) : (
            match.stats.map((p) => {
              const key = p.playerId || p.guestPlayerId || p.playerName;
              const ev = evaluations[key] || { rating: 5, feedback: "" };
              const rawPosition = p.position || (ev as any).position;
              const posLabel = rawPosition ? (playerPositionLabels[rawPosition as keyof typeof playerPositionLabels] || rawPosition) : "";

              return (
                <div
                  key={key}
                  className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                        {p.playerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{p.playerName}</span>
                          {posLabel && <span className="text-[10px] font-bold text-[#8fa39b]">({posLabel})</span>}
                        </div>
                        <div className="text-[11px] text-[#8fa39b] mt-0.5">
                          ⚽ Gols: {p.goals} · 🅰️ Assist: {p.assists} · 🟨 Cartões: {p.yellowCards}
                        </div>
                      </div>
                    </div>

                    {/* Nota do Treinador */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#8fa39b]">Nota do Treinador:</span>
                      {canEdit ? (
                        <select
                          value={ev.rating}
                          onChange={(e) => handleRatingChange(key, Number(e.target.value), p.playerId, p.guestPlayerId)}
                          className="rounded-xl border border-white/10 bg-[#16130f] px-3 py-1 text-sm font-black text-emerald-400 outline-none focus:border-[#36c2a8]"
                        >
                          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                              {n} ⭐
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-lg border font-black text-xs ${getRatingBadgeColor(ev.rating)}`}>
                          {ev.rating} ⭐
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feedback Individual do Treinador */}
                  <div>
                    {canEdit ? (
                      <input
                        type="text"
                        value={ev.feedback}
                        onChange={(e) => handleFeedbackChange(key, e.target.value, p.playerId, p.guestPlayerId)}
                        placeholder={`Parecer do treinador sobre a atuação de ${p.playerName}...`}
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

          {/* Botão de Salvar (Apenas Treinador Designado) */}
          {canEdit && (
            <div className="pt-4 flex justify-end">
              <Button
                onClick={handleSaveReport}
                disabled={saving}
                className="bg-[#10b981] hover:bg-[#34d399] text-black font-bold text-xs uppercase tracking-wider px-6 py-2.5 shadow-lg"
              >
                {saving ? "Salvando..." : "💾 Publicar Relatório Tático & Titulares"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
