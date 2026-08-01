"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Coins, Check, Copy, AlertCircle, Eye, Upload, XCircle, CheckCircle2, FileText } from "lucide-react";
import { BordereauCard } from "@/components/dashboard/BordereauCard";
import { MatchEquipmentCard } from "@/components/dashboard/MatchEquipmentCard";
import { formatCurrency } from "@/lib/utils";
import type { MatchDetail } from "@/app/dashboard/matches/[id]/page";
import type { BordereauResponse } from "@/lib/validations/match";

interface MatchBordereauTabProps {
  match: MatchDetail;
  session: any;
  isAdmin: boolean;
  canSeeOperations: boolean;
  togglingPlayerId: string | null;
  checklistLoading: boolean;
  checklistPlayers: any[];
  chargesFeedback: string | null;
  chargesError: string | null;
  uploadingReceipt: boolean;
  bordereauLoading: boolean;
  bordereauSaving: boolean;
  bordereauError: string | null;
  bordereauData: BordereauResponse | null;
  toggleChecklistItem: (index: number) => void;
  toggleAttendance: (playerId: string) => void;
  handleShirtNumberChange: (playerId: string, shirtNumber: number | null) => void;
  handleSaveBordereau: () => Promise<void>;
  setExpenseModalOpen: (open: boolean) => void;
  copyPixKey: (key: string) => void;
  pixKeyCopied: boolean;
  handleUploadReceipt: (e: React.ChangeEvent<HTMLInputElement>, playerId: string) => void;
  handleApproveReceipt: (playerId: string) => void;
  handleRejectReceipt: (playerId: string) => void;
  setPreviewReceipt: (val: any) => void;
  handleTogglePayment: (playerId: string, paid: boolean) => void;
}

export function MatchBordereauTab({
  match,
  session,
  isAdmin,
  canSeeOperations,
  togglingPlayerId,
  checklistLoading,
  checklistPlayers,
  chargesFeedback,
  chargesError,
  uploadingReceipt,
  bordereauLoading,
  bordereauSaving,
  bordereauError,
  bordereauData,
  toggleChecklistItem,
  toggleAttendance,
  handleShirtNumberChange,
  handleSaveBordereau,
  setExpenseModalOpen,
  copyPixKey,
  pixKeyCopied,
  handleUploadReceipt,
  handleApproveReceipt,
  handleRejectReceipt,
  setPreviewReceipt,
  handleTogglePayment,
}: MatchBordereauTabProps) {
  const loggedInPlayerId = session?.user?.playerId;
  const currentPlayerInfo = loggedInPlayerId ? checklistPlayers.find((p) => p.id === loggedInPlayerId) : null;
  const pendingPayments = checklistPlayers.filter((p) => p.payment && p.payment.status === "PENDING");

  return (
    <div className="space-y-6">
      {/* SEÇÃO 1: Controle de Mensalidade / Cobranças do Jogador */}
      {match.hasCharge && (
        <div className="space-y-6">
          {/* Card de Chave PIX */}
          {match.pixKey && (
            <div className="rounded-[18px] border border-white/5 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 backdrop-blur-md shadow-lg">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-[#34d399]">
                    <Coins className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)]">Pagamento via PIX</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Copie a chave abaixo para realizar a transferência da taxa do jogo.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-black/20 border border-white/5 p-2 pr-3">
                  <span className="text-xs font-mono font-bold text-white px-2 select-all">{match.pixKey}</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyPixKey(match.pixKey || "")}
                    className="h-8 rounded-lg px-2.5 text-xs flex items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    {pixKeyCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#34d399]" />
                        <span className="text-[#34d399]">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Envio de Comprovante pelo Jogador Logado */}
          {currentPlayerInfo && (() => {
            const isApproved = currentPlayerInfo.payment && currentPlayerInfo.payment.status === "PAID";
            return (
              <div className="rounded-[18px] border border-white/5 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 backdrop-blur-md shadow-lg">
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)] mb-3">Seu Pagamento</h3>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-soft)] text-sm font-black text-[var(--brand)] border border-[var(--brand)]/20">
                      {currentPlayerInfo.shirtNumber || "—"}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{currentPlayerInfo.name}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Taxa de jogo individual: <strong className="text-[#34d399]">{match.chargeAmount != null ? formatCurrency(match.chargeAmount) : "R$ 0,00"}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {currentPlayerInfo.payment ? (
                      isApproved ? (
                        <Badge variant="success" className="bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/25 text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="h-4 w-4 text-[#34d399]" />
                          <span>Pago & Aprovado ✅</span>
                        </Badge>
                      ) : (
                        <div className="flex flex-col items-end gap-1.5">
                          <Badge variant="warning" className="bg-amber-500/10 text-amber-400 border border-amber-500/25 text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-bold">
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                            <span>Aguardando Aprovação ⏳</span>
                          </Badge>
                          {currentPlayerInfo.payment.receiptUrl && (
                            <a
                              href={currentPlayerInfo.payment.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#34d399] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <Eye className="h-3.5 w-3.5" /> Ver comprovante enviado
                            </a>
                          )}
                        </div>
                      )
                    ) : (
                      <Badge variant="danger" className="bg-red-500/10 text-red-400 border border-red-500/25 text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-bold">
                        <XCircle className="h-4 w-4 text-red-400" />
                        <span>Pagamento Pendente ⏳</span>
                      </Badge>
                    )}

                    {!isApproved && (
                      <label className="relative cursor-pointer">
                        <span className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-sm ${
                          uploadingReceipt 
                            ? "border-white/5 bg-white/5 cursor-not-allowed text-[var(--text-muted)]" 
                            : "border-[#10b981]/30 bg-[#10b981]/10 hover:bg-[#10b981]/20 hover:border-[#10b981]/40 cursor-pointer"
                        }`}>
                          <Upload className="h-4 w-4" />
                          {uploadingReceipt ? "Enviando..." : "Enviar Comprovante"}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          className="hidden"
                          onChange={(e) => handleUploadReceipt(e, currentPlayerInfo.id)}
                          disabled={uploadingReceipt}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ADMIN: Revisar comprovantes pendentes */}
          {isAdmin && pendingPayments.length > 0 && (
            <div className="rounded-[18px] border border-amber-500/15 bg-amber-500/[0.02] p-5 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2.5 mb-4">
                <AlertCircle className="h-5 w-5 text-amber-400 animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-wider text-amber-400">Comprovantes Aguardando Revisão ({pendingPayments.length})</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {pendingPayments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-sm font-black text-amber-400 border border-amber-500/20">
                        {p.shirtNumber || "—"}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{p.name}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Enviado por PIX</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {p.payment?.receiptUrl && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setPreviewReceipt({ url: p.payment.receiptUrl, playerName: p.name, playerId: p.id })}
                          className="h-8 w-8 rounded-lg p-0 flex items-center justify-center text-white/80 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10"
                          title="Visualizar Comprovante"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleApproveReceipt(p.id)}
                        disabled={togglingPlayerId === p.id}
                        className="h-8 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold px-3 transition-colors"
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRejectReceipt(p.id)}
                        disabled={togglingPlayerId === p.id}
                        className="h-8 rounded-lg border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold px-3 transition-colors"
                      >
                        Recusar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADMIN & ELENCO: Controle Geral de Pagamentos */}
          <Card className="rounded-[18px]">
            <CardHeader>
              <div className="flex flex-col justify-between gap-2 border-b border-white/5 pb-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-white">Controle de Pagamentos</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Taxa definida por atleta: <strong className="text-[#34d399]">{match.chargeAmount != null ? formatCurrency(match.chargeAmount) : "R$ 0,00"}</strong>
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm mt-2 sm:mt-0">
                  <div className="rounded-xl bg-white/[0.02] border border-white/5 px-4 py-2 text-center">
                    <p className="text-xs text-[var(--text-muted)]">Arrecadado</p>
                    <p className="text-lg font-black text-[#34d399] mt-0.5">
                      {formatCurrency(
                        checklistPlayers
                          .filter((p) => p.payment && p.payment.status === "PAID")
                          .reduce((sum, p) => sum + (match.chargeAmount || 0), 0)
                      )}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/[0.02] border border-white/5 px-4 py-2 text-center">
                    <p className="text-xs text-[var(--text-muted)]">Pagos</p>
                    <p className="text-lg font-black text-white mt-0.5">
                      {checklistPlayers.filter((p) => p.payment && p.payment.status === "PAID").length} <span className="text-xs font-normal text-[var(--text-muted)]">/ {checklistPlayers.length}</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {chargesFeedback && (
                <div className="rounded-[12px] border border-[#bde0d3] bg-[#e9f8f1] p-3 text-sm text-[#1d5f4f] font-semibold">
                  {chargesFeedback}
                </div>
              )}

              {chargesError && (
                <div className="rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)] font-semibold">
                  {chargesError}
                </div>
              )}

              {checklistLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#10b981] border-t-transparent" />
                </div>
              ) : checklistPlayers.length === 0 ? (
                <p className="text-center py-8 text-[var(--text-muted)]">Nenhum jogador ativo no elenco.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {checklistPlayers.map((p) => {
                    const isPaid = !!p.payment && p.payment.status === "PAID";
                    const isPending = !!p.payment && p.payment.status === "PENDING";
                    const isToggling = togglingPlayerId === p.id;
                    
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-soft)] text-sm font-black text-[var(--brand)] border border-[var(--brand)]/20">
                            {p.shirtNumber || "—"}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm">{p.name}</p>
                            <div className="mt-1 flex flex-wrap gap-1 items-center font-bold">
                              {p.present ? (
                                <Badge variant="success" className="text-[10px] px-1.5 py-0.5">Presente</Badge>
                              ) : p.rsvp === "CONFIRMED" ? (
                                <Badge variant="info" className="text-[10px] px-1.5 py-0.5">Confirmou RSVP</Badge>
                              ) : null}
                              {isPending && (
                                <Badge variant="warning" className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-1.5 py-0.5 flex items-center gap-1 font-bold">
                                  <span>Pendente Aprovação</span>
                                  {p.payment?.receiptUrl && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setPreviewReceipt({ url: p.payment.receiptUrl, playerName: p.name, playerId: p.id });
                                      }}
                                      className="text-[#34d399] hover:text-[#059669] focus:outline-none"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </button>
                                  )}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {isAdmin ? (
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isPaid}
                              disabled={isToggling}
                              onChange={(e) => handleTogglePayment(p.id, e.target.checked)}
                              className="sr-only peer"
                              aria-label={`Toggle payment for ${p.name}`}
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand)]"></div>
                          </label>
                        ) : (
                          <div>
                            {isPaid ? (
                              <Badge variant="success" className="bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/20 text-xs px-2.5 py-1">Pago ✅</Badge>
                            ) : isPending ? (
                              <Badge variant="warning" className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1">Em Análise ⏳</Badge>
                            ) : (
                              <Badge variant="danger" className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-1">Pendente ⏳</Badge>
                            )}
                          </div>
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

      {/* SEÇÃO 2: Operações / Gestão Financeira (Bordero) */}
      {canSeeOperations && (
        <div className="space-y-6">
          <BordereauCard
            loading={bordereauLoading}
            saving={bordereauSaving}
            error={bordereauError}
            data={bordereauData}
            onChecklistToggle={toggleChecklistItem}
            onAttendanceToggle={toggleAttendance}
            onShirtNumberChange={handleShirtNumberChange}
            onSave={handleSaveBordereau}
            onOpenExpense={() => setExpenseModalOpen(true)}
          />
          <MatchEquipmentCard matchId={match.id} />
        </div>
      )}
    </div>
  );
}
