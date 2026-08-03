"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Shield, ClipboardList, CheckCircle2, AlertCircle, Save, User, Users, Activity, Sparkles, Target, Lock } from "lucide-react";
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

export function MatchCoachReportTab({
  match,
  isCoachOrAdmin,
  currentUserId,
  currentUserPlayerId,
  fetchMatch,
}: MatchCoachReportTabProps) {
  const [activePlayers, setActivePlayers] = useState<ActivePlayerOption[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<string>(match.coachPlayerId || "");
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
          const key = p.playerId || p.guestPlayerId;
          if (key && !evalMap[key]) {
            evalMap[key] = {
              playerId: p.playerId,
              guestPlayerId: p.guestPlayerId,
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

  const handleRatingChange = (key: string, rating: number) => {
    setEvaluations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        rating,
      },
    }));
  };

  const handleFeedbackChange = (key: string, feedback: string) => {
    setEvaluations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
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
        setFeedbackMsg("Relatório tático e parecer dos atletas salvos com sucesso!");
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

  return (
    <div className="space-y-6">
      {/* Banner de Permissões */}
      {!canEdit && (
        <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-center gap-3 text-xs font-semibold text-amber-450">
          <Lock className="h-4 w-4 shrink-0" />
          <span>
            <strong>Modo de Leitura:</strong> Apenas o atleta designado como treinador desta partida (ou admin se nenhum estiver definido) pode editar o relatório tático.
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
                  Análise de campo, leitura de substituições e notas individuais da comissão técnica.
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

          {/* Seção 1: Time Titular & Estratégia Inicial */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#6ee7b7] flex items-center gap-1.5">
              <Target className="h-4 w-4" /> 1. Time Titular & Ideia de Jogo Inicial:
            </label>
            {canEdit ? (
              <textarea
                value={startingStrategy}
                onChange={(e) => setStartingStrategy(e.target.value)}
                placeholder="Explique a formação escolhida para os 11 titulares, a proposta tática inicial (marcação alta, contra-ataque, posse de bola) e a estratégia pensada antes do apito inicial..."
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
              />
            ) : (
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">
                {startingStrategy || "Nenhuma observação registrada sobre o time titular."}
              </div>
            )}
          </div>

          {/* Seção 2: Substituições Realizadas & Leitura de Jogo */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#6ee7b7] flex items-center gap-1.5">
              <Activity className="h-4 w-4" /> 2. Substituições Realizadas & Pensamento Tático:
            </label>
            {canEdit ? (
              <textarea
                value={substitutionsNotes}
                onChange={(e) => setSubstitutionsNotes(e.target.value)}
                placeholder="Registre as substituições feitas na partida (ex: 'Aos 15 min do 2ºT: Saiu Fulano / Entrou Ciclano para dar mais velocidade pela ponta'). Explique o que pensava no momento da alteração..."
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
              />
            ) : (
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">
                {substitutionsNotes || "Nenhuma leitura de substituição registrada pelo treinador."}
              </div>
            )}
          </div>

          {/* Seção 3: Pontos Fortes & Aspectos a Evoluir */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="space-y-2">
            <label className="block text-xs font-bold text-white flex items-center gap-1.5">
              📋 Resumo Geral & Conclusão do Treinador:
            </label>
            {canEdit ? (
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Parecer geral da atuação da equipe..."
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
              />
            ) : (
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">
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
                          onChange={(e) => handleRatingChange(key, Number(e.target.value))}
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
                        onChange={(e) => handleFeedbackChange(key, e.target.value)}
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
                {saving ? "Salvando..." : "💾 Publicar Relatório Tático"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
