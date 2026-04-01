"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { BordereauResponse } from "@/lib/validations/match";

interface BordereauCardProps {
  loading: boolean;
  saving: boolean;
  error: string | null;
  data: BordereauResponse | null;
  onChecklistToggle: (index: number) => void;
  onAttendanceToggle: (playerId: string) => void;
  onSave: () => void;
  onOpenExpense: () => void;
}

const rsvpVariants: Record<"PENDING" | "CONFIRMED" | "DECLINED", "warning" | "success" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  DECLINED: "danger",
};

const rsvpLabels: Record<"PENDING" | "CONFIRMED" | "DECLINED", string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  DECLINED: "Recusado",
};

export function BordereauCard({
  loading,
  saving,
  error,
  data,
  onChecklistToggle,
  onAttendanceToggle,
  onSave,
  onOpenExpense,
}: BordereauCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">
              Bordero
            </p>
            <h2 className="text-lg font-semibold text-[var(--text)]">Operacao do dia do jogo</h2>
            <p className="text-sm text-[var(--text-subtle)]">
              Presenca real e diferente do RSVP. O rateio mostrado abaixo e apenas sugestao visual.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={onOpenExpense} disabled={!data}>
              Lançar despesa
            </Button>
            <Button type="button" onClick={onSave} disabled={!data || saving}>
              {saving ? "Salvando..." : "Salvar bordero"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {loading && <p className="text-sm text-[var(--text-subtle)]">Carregando bordero...</p>}

        {!loading && error && (
          <div className="rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1.8fr]">
              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                <h3 className="mb-3 font-semibold text-[var(--text)]">Checklist pre-jogo</h3>
                <div className="space-y-3">
                  {data.checklist.map((item, index) => (
                    <label key={item.id} className="flex items-center gap-3 rounded-[12px] bg-white p-3 text-sm text-[var(--text)]">
                      <input
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={() => onChecklistToggle(index)}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-[var(--text)]">Presenca real</h3>
                  <Badge variant="info">{data.costSummary.presentCount} presentes</Badge>
                </div>
                <div className="space-y-3">
                  {data.attendance.map((item) => (
                    <div key={item.playerId} className="rounded-[12px] bg-white p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[var(--text)]">{item.playerName}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant={rsvpVariants[item.rsvpStatus]}>
                              {rsvpLabels[item.rsvpStatus]}
                            </Badge>
                            {item.checkedInAt && (
                              <span className="text-xs text-[var(--text-subtle)]">
                                Check-in {new Date(item.checkedInAt).toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-[var(--text)]">
                          <input
                            type="checkbox"
                            checked={item.present}
                            onChange={() => onAttendanceToggle(item.playerId)}
                          />
                          Presente
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[var(--text)]">Despesas da partida</h3>
                  <p className="text-sm text-[var(--text-subtle)]">
                    Rateio sugerido por presente: {data.costSummary.suggestedSharePerPresent == null ? "aguardando presencas" : formatCurrency(data.costSummary.suggestedSharePerPresent)}
                  </p>
                </div>
                <Badge variant="default">Total {formatCurrency(data.costSummary.totalExpense)}</Badge>
              </div>

              <div className="mt-4 space-y-3">
                {data.expenses.length === 0 && (
                  <p className="text-sm text-[var(--text-subtle)]">Nenhuma despesa registrada para este jogo.</p>
                )}
                {data.expenses.map((expense) => (
                  <div key={expense.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] bg-white p-3">
                    <div>
                      <p className="font-semibold text-[var(--text)]">{expense.description}</p>
                      <p className="text-sm text-[var(--text-subtle)]">
                        {expense.category} • {new Date(expense.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span className="font-semibold text-[var(--text)]">{formatCurrency(expense.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}