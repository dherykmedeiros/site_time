"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Star, User, ClipboardList, CheckCircle2, AlertCircle, Save, Shield } from "lucide-react";
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
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationState>>({});

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check if current logged in user is authorized to edit the report
  const isDesignatedCoach = currentUserPlayerId && match.coachPlayerId === currentUserPlayerId;
  const canEdit = isCoachOrAdmin || isDesignatedCoach;

  // Load active players list for coach selector
  const loadActivePlayers = useCallback(async () => {
    try {
      const res = await fetch("/api/players/active");
      if (res.ok) {
        const data = await res.json();
        setActivePlayers(data);
      }
    } catch (err) {
      console.error("Erro ao carregar lista de atletas ativos", err);
    }
  }, []);

  // Load coach report data
  const loadReport = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/matches/${match.id}/coach-report`);
      if (res.ok) {
        const data = await res.json();
        if (data.coachPlayerId) {
          setSelectedCoachId(data.coachPlayerId);
        }
        setSummary(data.summary || "");

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
          coachPlayerId: selectedCoachId || null,
          summary,
          evaluations: evalList,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setFeedbackMsg("Relatório do treinador e avaliações salvas com sucesso!");
        fetchMatch();
        setTimeout(() => setFeedbackMsg(null), 3000);
      } else {
        setErrorMsg(data.error || "Erro ao salvar relatório do treinador");
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

  const assignedCoach = activePlayers.find((p) => p.id === selectedCoachId) || match.coachPlayer;

  return (
    <div className="space-y-6">
      {/* Informações do Treinador Responsável */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">Relatório do Treinador</h2>
                <p className="text-xs text-[var(--text-subtle)]">
                  Avaliação tática e parecer individual do desempenho dos atletas na partida.
                </p>
              </div>
            </div>

            {/* Designar Treinador Responsável */}
            {canEdit && (
              <div className="flex flex-col gap-1 sm:items-end">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#8fa39b]">
                  Treinador Responsável do Jogo:
                </label>
                <select
                  value={selectedCoachId}
                  onChange={(e) => setSelectedCoachId(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#16130f] px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-[#36c2a8]"
                >
                  <option value="">-- Selecione o Treinador --</option>
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
          {assignedCoach && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm overflow-hidden">
                {assignedCoach.photoUrl ? (
                  <img src={assignedCoach.photoUrl} alt={assignedCoach.name} className="h-full w-full object-cover" />
                ) : (
                  assignedCoach.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Treinador da Partida</p>
                <p className="text-sm font-bold text-white">
                  {assignedCoach.name} {assignedCoach.fullName ? `(${assignedCoach.fullName})` : ""}
                </p>
              </div>
            </div>
          )}

          {/* Banner de feedback/erro */}
          {feedbackMsg && (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-400">
              ✅ {feedbackMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-400">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Resumo Geral da Partida */}
          <div>
            <label className="block text-xs font-bold text-[var(--text)] mb-2">
              📝 Análise Geral da Partida (Treinador):
            </label>
            {canEdit ? (
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Escreva a análise tática do jogo, substituições, pontos fortes e fracos do time nesta partida..."
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#36c2a8]"
              />
            ) : (
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">
                {summary || "Nenhuma análise geral foi registrada pelo treinador ainda."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Avaliações Individuais dos Atletas */}
      <Card>
        <CardHeader>
          <h3 className="text-base font-bold text-white">Notas e Avaliações Individuais de Desempenho</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {match.stats.length === 0 ? (
            <p className="text-xs text-[var(--text-subtle)] text-center py-4">
              Nenhum jogador participou ou foi registrado nas estatísticas desta partida.
            </p>
          ) : (
            match.stats.map((p) => {
              const key = p.playerId || p.guestPlayerId || p.playerName;
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
                          <span className="text-[10px] font-bold text-[#8fa39b]">({posLabel})</span>
                        </div>
                        <div className="text-[11px] text-[#8fa39b] mt-0.5">
                          ⚽ Gols: {p.goals} · 🅰️ Assist: {p.assists} · 🟨 Cartões: {p.yellowCards}
                        </div>
                      </div>
                    </div>

                    {/* Nota do Treinador */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#8fa39b]">Nota:</span>
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
                        placeholder={`Comentário do treinador sobre o desempenho de ${p.playerName}...`}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#36c2a8]"
                      />
                    ) : (
                      <p className="text-xs text-[var(--text-subtle)] bg-black/20 p-2.5 rounded-lg border border-white/5 italic">
                        "{ev.feedback || "Sem observações adicionais pelo treinador."}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Botão de Salvar (Apenas Treinador/Admin) */}
          {canEdit && (
            <div className="pt-4 flex justify-end">
              <Button
                onClick={handleSaveReport}
                disabled={saving}
                className="bg-[#10b981] hover:bg-[#34d399] text-black font-bold text-xs uppercase tracking-wider px-6 py-2.5 shadow-lg"
              >
                {saving ? "Salvando..." : "💾 Salvar Relatório & Avaliações"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
