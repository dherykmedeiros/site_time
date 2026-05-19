"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface Player {
  id: string;
  name: string;
  shirtNumber: number | null;
}

interface Rule {
  id: string;
  title: string;
  description: string;
  fineAmount: number | null;
}

interface Fine {
  id: string;
  playerId: string;
  player: {
    id: string;
    name: string;
    shirtNumber: number | null;
  };
  ruleId: string | null;
  rule?: {
    id: string;
    title: string;
  } | null;
  description: string;
  amount: number;
  date: string;
  isPaid: boolean;
  paidAt: string | null;
  createdAt: string;
}

export default function FinesPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const { toast } = useToast();

  const [fines, setFines] = useState<Fine[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterPlayer, setFilterPlayer] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, PAID, UNPAID

  // Modal Form States
  const [showModal, setShowModal] = useState(false);
  const [editingFine, setEditingFine] = useState<Fine | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [playerId, setPlayerId] = useState("");
  const [ruleId, setRuleId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [isPaid, setIsPaid] = useState(false);

  // Delete & Pay confirmation Modals
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    fineId: string | null;
    actionType: "DELETE" | "PAY" | null;
    title: string;
    message: string;
  }>({ open: false, fineId: null, actionType: null, title: "", message: "" });
  const [confirmLoading, setConfirmLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [finesRes, playersRes, rulesRes] = await Promise.all([
        fetch("/api/fines"),
        fetch("/api/players?status=ACTIVE"),
        fetch("/api/rules"),
      ]);

      if (finesRes.ok) {
        const data = await finesRes.json();
        setFines(data.fines || []);
      }
      if (playersRes.ok) {
        const data = await playersRes.json();
        setPlayers(data.players || []);
      }
      if (rulesRes.ok) {
        const data = await rulesRes.json();
        setRules(data.rules || []);
      }
    } catch {
      toast("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Handle auto-completion of fine description and amount based on rule template selection
  function handleRuleChange(selectedRuleId: string) {
    setRuleId(selectedRuleId);
    if (!selectedRuleId) {
      return;
    }
    const selectedRule = rules.find((r) => r.id === selectedRuleId);
    if (selectedRule) {
      setDescription(selectedRule.title);
      setAmount(selectedRule.fineAmount !== null ? String(selectedRule.fineAmount) : "");
    }
  }

  function handleOpenCreate() {
    setEditingFine(null);
    setPlayerId("");
    setRuleId("");
    setDescription("");
    setAmount("");
    setDate(new Date().toISOString().substring(0, 10));
    setIsPaid(false);
    setFormError("");
    setShowModal(true);
  }

  function handleOpenEdit(fine: Fine) {
    setEditingFine(fine);
    setPlayerId(fine.playerId);
    setRuleId(fine.ruleId || "");
    setDescription(fine.description);
    setAmount(String(fine.amount));
    setDate(new Date(fine.date).toISOString().substring(0, 10));
    setIsPaid(fine.isPaid);
    setFormError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const body = {
      playerId,
      ruleId: ruleId || null,
      description,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      isPaid,
    };

    try {
      const url = editingFine ? `/api/fines/${editingFine.id}` : "/api/fines";
      const method = editingFine ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || "Erro ao salvar multa");
        return;
      }

      setShowModal(false);
      await loadData();
      toast(editingFine ? "Multa atualizada!" : "Multa aplicada com sucesso!");
    } catch {
      setFormError("Erro de conexão");
    } finally {
      setSaving(false);
    }
  }

  function handleOpenDelete(fine: Fine) {
    setConfirmModal({
      open: true,
      fineId: fine.id,
      actionType: "DELETE",
      title: "Excluir Multa",
      message: `Deseja realmente excluir a multa de ${fine.player.name}? O registro financeiro correspondente será removido caso a multa já tenha sido paga.`,
    });
  }

  function handleOpenPay(fine: Fine) {
    setConfirmModal({
      open: true,
      fineId: fine.id,
      actionType: "PAY",
      title: "Confirmar Pagamento",
      message: `Marcar a multa de ${fine.player.name} no valor de ${formatBRL(fine.amount)} como paga? Isso registrará automaticamente uma entrada no financeiro do time.`,
    });
  }

  async function executeConfirm() {
    if (!confirmModal.fineId || !confirmModal.actionType) return;
    setConfirmLoading(true);

    try {
      if (confirmModal.actionType === "DELETE") {
        const res = await fetch(`/api/fines/${confirmModal.fineId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast("Multa excluída com sucesso");
          await loadData();
        } else {
          toast("Erro ao excluir multa");
        }
      } else if (confirmModal.actionType === "PAY") {
        // Find existing fine to get all properties (PATCH endpoint validates full payload)
        const fine = fines.find((f) => f.id === confirmModal.fineId);
        if (fine) {
          const body = {
            playerId: fine.playerId,
            ruleId: fine.ruleId,
            description: fine.description,
            amount: fine.amount,
            date: fine.date,
            isPaid: true,
          };

          const res = await fetch(`/api/fines/${fine.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          if (res.ok) {
            toast("Pagamento registrado com sucesso!");
            await loadData();
          } else {
            toast("Erro ao registrar pagamento");
          }
        }
      }
    } catch {
      toast("Erro de conexão");
    } finally {
      setConfirmLoading(false);
      setConfirmModal({ open: false, fineId: null, actionType: null, title: "", message: "" });
    }
  }

  // Financial calculations
  const totalUnpaid = fines
    .filter((f) => !f.isPaid)
    .reduce((acc, f) => acc + f.amount, 0);

  const totalPaid = fines
    .filter((f) => f.isPaid)
    .reduce((acc, f) => acc + f.amount, 0);

  const filteredFines = fines.filter((fine) => {
    const matchesPlayer = !filterPlayer || fine.playerId === filterPlayer;
    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "PAID" && fine.isPaid) ||
      (filterStatus === "UNPAID" && !fine.isPaid);
    return matchesPlayer && matchesStatus;
  });

  function formatBRL(amount: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  }

  function formatDate(isoString: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
    }).format(new Date(isoString));
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Caixa de Punições</h1>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            Aplicação e acompanhamento de multas administrativas do elenco
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90 cursor-pointer"
          >
            + Aplicar Multa
          </button>
        )}
      </div>

      {/* KPI Financial Summaries */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="rounded-2xl border border-[rgba(239,68,68,0.15)] bg-[rgba(15,8,8,0.4)] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#f87171]">Total Pendente</p>
          <p className="mt-2 text-3xl font-black text-white">{formatBRL(totalUnpaid)}</p>
          <p className="mt-1 text-xs text-[var(--text-subtle)]">
            A receber de multas ativas
          </p>
        </div>
        <div className="rounded-2xl border border-[rgba(16,185,129,0.15)] bg-[rgba(8,15,10,0.4)] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#34d399]">Total Arrecadado</p>
          <p className="mt-2 text-3xl font-black text-white">{formatBRL(totalPaid)}</p>
          <p className="mt-1 text-xs text-[var(--text-subtle)]">
            Já inserido no livro caixa
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#090f0c] p-6 shadow-sm col-span-full md:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">Histórico Geral</p>
          <p className="mt-2 text-3xl font-black text-white">{fines.length} Multas</p>
          <p className="mt-1 text-xs text-[var(--text-subtle)]">
            {fines.filter((f) => !f.isPaid).length} pendentes e {fines.filter((f) => f.isPaid).length} pagas
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="app-surface rounded-2xl border border-[var(--border)] p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full">
          <div className="w-full sm:max-w-xs">
            <select
              value={filterPlayer}
              onChange={(e) => setFilterPlayer(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              <option value="">Todos os jogadores</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.shirtNumber ? `#${p.shirtNumber} - ` : ""}{p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:max-w-xs">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              <option value="ALL">Todos os status</option>
              <option value="UNPAID">Pendente</option>
              <option value="PAID">Paga</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fines List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-[var(--surface-soft)] border border-white/5" />
          ))}
        </div>
      ) : filteredFines.length === 0 ? (
        <div className="app-surface rounded-2xl border border-dashed border-[var(--border-strong)] p-14 text-center text-[var(--text-muted)]">
          <p className="text-4xl">⚖️</p>
          <p className="mt-3 text-base font-semibold text-white">Nenhuma multa localizada</p>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            Ajuste os filtros ou aplique uma nova multa se você for administrador.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFines.map((fine) => (
            <div
              key={fine.id}
              className="app-surface flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[var(--border)] p-5 shadow-sm hover:border-[rgba(16,185,129,0.25)] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-xl">
                  ⚖️
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-white text-base">
                      {fine.player.name}
                    </p>
                    {fine.player.shirtNumber && (
                      <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[0.7rem] font-bold text-[var(--text-subtle)]">
                        #{fine.player.shirtNumber}
                      </span>
                    )}
                    {fine.rule && (
                      <span className="rounded-full border border-white/5 bg-white/5 px-2.5 py-0.5 text-[0.68rem] font-medium text-[var(--text-subtle)] uppercase">
                        Template: {fine.rule.title}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-subtle)] leading-relaxed">
                    {fine.description}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Aplicada em: {formatDate(fine.date)} {fine.isPaid && fine.paidAt && ` · Paga em ${formatDate(fine.paidAt)}`}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 justify-between sm:justify-end">
                <div className="text-right">
                  <p className="text-lg font-black text-white">{formatBRL(fine.amount)}</p>
                  <div className="mt-1">
                    {fine.isPaid ? (
                      <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-full px-2 py-0.5 text-[0.68rem]">
                        Paga
                      </Badge>
                    ) : (
                      <Badge variant="danger" className="bg-red-500/10 text-red-400 border-red-500/20 rounded-full px-2 py-0.5 text-[0.68rem]">
                        Pendente
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && !fine.isPaid && (
                    <button
                      onClick={() => handleOpenPay(fine)}
                      className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/25 transition-all cursor-pointer shadow-sm"
                    >
                      Pagar
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(fine)}
                        className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/15 transition-all cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleOpenDelete(fine)}
                        className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                        aria-label="Excluir multa"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Fine Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingFine ? "Editar Punição" : "Aplicar Nova Punição"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20">
              {formError}
            </p>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
              Jogador Faltoso *
            </label>
            <select
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              <option value="">— Selecione o Jogador —</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.shirtNumber ? `#${p.shirtNumber} - ` : ""}{p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
              Vincular a uma Regra Existente (opcional)
            </label>
            <select
              value={ruleId}
              onChange={(e) => handleRuleChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              <option value="">— Nenhuma / Regra Personalizada —</option>
              {rules.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} {r.fineAmount !== null ? `(${formatBRL(r.fineAmount)})` : ""}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Descrição / Motivo da Multa *"
            placeholder="Ex: Cartão amarelo por reclamação desnecessária"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Valor da Multa (R$) *"
              placeholder="Ex: 10.00"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <Input
              label="Data da Ocorrência *"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-white">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="rounded border-[var(--border)] bg-[var(--surface-soft)] text-[var(--brand)] focus:ring-[var(--brand)] h-4 w-4"
              />
              Esta multa já foi paga pelo jogador?
            </label>
            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              Se marcado, será gerado automaticamente um lançamento de Receita no caixa do time.
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={saving}
              disabled={saving}
            >
              {saving ? "Salvando..." : editingFine ? "Salvar Alterações" : "Aplicar Multa"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={confirmModal.open}
        onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
        title={confirmModal.title}
      >
        <p className="text-sm text-[var(--text-subtle)] leading-relaxed">{confirmModal.message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
            disabled={confirmLoading}
          >
            Cancelar
          </Button>
          <Button
            variant={confirmModal.actionType === "DELETE" ? "danger" : "primary"}
            size="sm"
            onClick={executeConfirm}
            loading={confirmLoading}
          >
            {confirmModal.actionType === "DELETE" ? "Confirmar Exclusão" : "Confirmar Pagamento"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
