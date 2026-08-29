"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { AlertCircle, MapPin, CheckCircle2 } from "lucide-react";
import { GuestPlayersManager } from "@/components/dashboard/GuestPlayersManager";
import { DocumentPromptModal } from "@/components/matches/DocumentPromptModal";
import type { MatchDetail } from "@/app/dashboard/matches/[id]/page";

interface MatchRsvpTabProps {
  match: MatchDetail;
  currentUserId: string | null;
  isCoachOrAdmin: boolean;
  rsvpLoading: boolean;
  handleRsvp: (status: "CONFIRMED" | "DECLINED", docDetails?: { fullName?: string; cpf?: string }) => void;
  setMatch: React.Dispatch<React.SetStateAction<MatchDetail | null>>;
  fetchMatch: () => void;
  isCheckInOpen: boolean;
  checkInFeedback: string | null;
  checkInError: string | null;
  checkInLoading: boolean;
  handleCheckIn: () => void;
}

const rsvpStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  DECLINED: "Recusado",
};

const rsvpStatusVariants: Record<string, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  DECLINED: "danger",
};

export function MatchRsvpTab({
  match,
  currentUserId,
  isCoachOrAdmin,
  rsvpLoading,
  handleRsvp,
  setMatch,
  fetchMatch,
  isCheckInOpen,
  checkInFeedback,
  checkInError,
  checkInLoading,
  handleCheckIn,
}: MatchRsvpTabProps) {
  const [summonLoadingId, setSummonLoadingId] = useState<string | null>(null);
  const [showDocModal, setShowDocModal] = useState(false);

  const confirmed = match.rsvps.filter((r) => r.status === "CONFIRMED").length;
  const declined = match.rsvps.filter((r) => r.status === "DECLINED").length;
  const pending = match.rsvps.filter((r) => r.status === "PENDING").length;

  const loggedInPlayerRsvp = match.rsvps.find((r) => r.playerId === currentUserId);
  const isSummoned = match.type !== "CHAMPIONSHIP" || loggedInPlayerRsvp?.summoned === true;

  const handleSummonToggle = async (playerId: string, currentSummoned: boolean) => {
    setSummonLoadingId(playerId);
    try {
      const res = await fetch(`/api/matches/${match.id}/rsvp/summon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId,
          summoned: !currentSummoned,
        }),
      });
      if (res.ok) {
        const updatedSummon = await res.json();
        setMatch((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            rsvps: prev.rsvps.map((r) =>
              r.playerId === playerId ? { ...r, summoned: updatedSummon.summoned } : r
            ),
          };
        });
      }
    } catch (err) {
      console.error("Erro ao alterar convocação", err);
    } finally {
      setSummonLoadingId(null);
    }
  };

  const handleAdminChangeRsvpStatus = async (playerId: string, newStatus: "CONFIRMED" | "PENDING" | "DECLINED") => {
    try {
      const res = await fetch(`/api/matches/${match.id}/rsvp/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, status: newStatus }),
      });
      if (res.ok) {
        setMatch((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            rsvps: prev.rsvps.map((r) =>
              r.playerId === playerId ? { ...r, status: newStatus } : r
            ),
          };
        });
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Erro ao alterar status do atleta");
      }
    } catch {
      alert("Erro de conexão ao alterar status do atleta");
    }
  };

  return (
    <div className="space-y-6">
      {/* Relatório de Presenças */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-[var(--text)]">Relatório de Presenças no Local</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-[#34d399]">Gerar Card de Presenças</p>
              <p className="text-sm text-[var(--text-subtle)]">
                Crie um relatório visual personalizado mostrando os jogadores confirmados e o horário exato do check-in de cada um!
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  const url = `/api/og/match/${match.id}/attendance`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
              >
                🖼️ Abrir card de presenças
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const url = `${window.location.origin}/api/og/match/${match.id}/attendance`;
                  navigator.clipboard.writeText(url).then(() => {
                    alert("Link do relatório copiado!");
                  });
                }}
              >
                📋 Copiar link do card
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmação de Presença */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Confirmação de Presença</h2>
            <div className="flex gap-3 text-sm font-semibold">
              <span className="text-green-500">✅ {confirmed}</span>
              <span className="text-red-400">❌ {declined}</span>
              <span className="text-amber-500">⏳ {pending}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {match.isPlayerSuspended && (
            <div className="mb-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400">Você está suspenso para esta partida</p>
                <p className="text-xs text-[var(--text-subtle)] mt-1">
                  Motivo: {match.suspensionReason || "Suspensão disciplinar ativa."}
                </p>
                <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                  Você foi automaticamente marcado como "não vai" e está bloqueado de alterar presença ou realizar check-in.
                </p>
              </div>
            </div>
          )}

          {/* RSVP action buttons for players */}
          {match.status === "SCHEDULED" && currentUserId && !match.isPlayerSuspended && (
            <div className="mb-6">
              {isSummoned ? (
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      if (match.requiresDocumentDetails) {
                        setShowDocModal(true);
                      } else {
                        handleRsvp("CONFIRMED");
                      }
                    }}
                    disabled={rsvpLoading}
                    className={loggedInPlayerRsvp?.status === "CONFIRMED" ? "bg-green-600 text-white" : ""}
                  >
                    ✅ Confirmar Presença
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRsvp("DECLINED")}
                    disabled={rsvpLoading}
                    className={loggedInPlayerRsvp?.status === "DECLINED" ? "bg-red-600 text-white" : ""}
                  >
                    ❌ Recusar
                  </Button>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-450">Você não foi convocado</p>
                    <p className="text-xs text-[var(--text-subtle)] mt-1">
                      Esta é uma partida de campeonato. Apenas jogadores convocados pela comissão técnica podem registrar presença.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Check-in section for confirmed players */}
          {match.status === "SCHEDULED" && loggedInPlayerRsvp?.status === "CONFIRMED" && (
            <div className="mb-6">
              {match.userAttendance?.present ? (
                <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-400">Chegada Confirmada no Campo!</p>
                    <p className="text-xs text-[var(--text-subtle)] mt-1">
                      Seu check-in no local foi registrado em{" "}
                      {match.userAttendance.checkedInAt
                        ? new Intl.DateTimeFormat("pt-BR", {
                            timeStyle: "short",
                            timeZone: "America/Sao_Paulo",
                          }).format(new Date(match.userAttendance.checkedInAt))
                        : ""}{" "}
                      h. Presença oficialmente confirmada.
                    </p>
                  </div>
                </div>
              ) : (
                match.latitude !== null &&
                match.longitude !== null &&
                isCheckInOpen && (
                  <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-400">Confirmar Presença no Local</p>
                        <p className="text-xs text-[var(--text-subtle)] mt-1">
                          Quando estiver no local da partida (campo de jogo, em um raio de até 500 metros), confirme sua chegada clicando no botão abaixo.
                        </p>
                      </div>
                    </div>

                    {checkInFeedback && (
                      <div className="rounded-[12px] border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] p-3 text-xs text-[#6ee7b7] font-semibold">
                        {checkInFeedback}
                      </div>
                    )}
                    {checkInError && (
                      <div className="rounded-[12px] border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.1)] p-3 text-xs text-[#fca5a5] font-semibold">
                        {checkInError}
                      </div>
                    )}

                    <Button
                      onClick={handleCheckIn}
                      disabled={checkInLoading}
                      className="w-full sm:w-auto text-xs font-black uppercase tracking-wider text-[#010403] bg-[#10b981] hover:bg-[#34d399]"
                    >
                      {checkInLoading ? "Obtendo localização..." : "📍 Confirmar Presença (Check-in)"}
                    </Button>
                  </div>
                )
              )}
            </div>
          )}

          {/* RSVP list */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#8fa39b] mb-3">Elenco</h3>
            {match.rsvps.map((rsvp) => (
              <div
                key={rsvp.playerId}
                className="flex items-center justify-between rounded-[12px] border border-white/5 bg-white/[0.04] px-4 py-2 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-medium ${
                      match.type === "CHAMPIONSHIP" && !rsvp.summoned
                        ? "text-[var(--text-muted)] line-through"
                        : "text-[var(--text)]"
                    }`}
                  >
                    {rsvp.playerName}
                  </span>
                  {rsvp.isSuspended && (
                    <Badge variant="danger" className="bg-red-500/10 text-red-400 border-red-500/20">
                      Suspenso
                    </Badge>
                  )}
                  {match.type === "CHAMPIONSHIP" && (
                    <Badge variant={rsvp.summoned ? "success" : "default"}>
                      {rsvp.summoned ? "Convocado" : "Não Convocado"}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {match.status === "SCHEDULED" && isCoachOrAdmin && match.type === "CHAMPIONSHIP" && !rsvp.isGuest && (
                    <Button
                      size="sm"
                      variant={rsvp.summoned ? "ghost" : "secondary"}
                      disabled={summonLoadingId === rsvp.playerId}
                      onClick={() => handleSummonToggle(rsvp.playerId, rsvp.summoned ?? false)}
                    >
                      {rsvp.summoned ? "📋 Desconvocar" : "📋 Convocar"}
                    </Button>
                  )}
                  {isCoachOrAdmin && !rsvp.isGuest ? (
                    <select
                      value={rsvp.status}
                      onChange={(e) => handleAdminChangeRsvpStatus(rsvp.playerId, e.target.value as "CONFIRMED" | "PENDING" | "DECLINED")}
                      className="rounded-lg border border-white/10 bg-[#16130f] px-2.5 py-1 text-xs font-bold text-white outline-none focus:border-[#36c2a8] cursor-pointer"
                    >
                      <option value="CONFIRMED">✅ Confirmado</option>
                      <option value="PENDING">⏳ Pendente</option>
                      <option value="DECLINED">❌ Recusado</option>
                    </select>
                  ) : (
                    <Badge variant={rsvpStatusVariants[rsvp.status]}>
                      {rsvpStatusLabels[rsvp.status]}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Convidados */}
      {isCoachOrAdmin && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Jogadores Convidados</h2>
          </CardHeader>
          <CardContent>
            <GuestPlayersManager matchId={match.id} requiresDocumentDetails={match.requiresDocumentDetails} onGuestsChange={fetchMatch} />
          </CardContent>
        </Card>
      )}
      {/* Modal de Documentos */}
      <DocumentPromptModal
        open={showDocModal}
        onClose={() => setShowDocModal(false)}
        onConfirm={async (fullName, cpf) => {
          await handleRsvp("CONFIRMED", { fullName, cpf });
        }}
      />
    </div>
  );
}
