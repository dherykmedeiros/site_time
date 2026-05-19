"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

interface Player {
  id: string;
  name: string;
  shirtNumber: number | null;
}

interface Rule {
  id: string;
  title: string;
  description: string;
  severity: "WARNING" | "SUSPENSION";
  defaultMatches: number | null;
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
  severity: "WARNING" | "SUSPENSION";
  matchesSuspended: number | null;
  status: "ACTIVE" | "SERVED" | "CANCELLED";
  date: string;
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
  const [filterSeverity, setFilterSeverity] = useState("ALL"); // ALL, WARNING, SUSPENSION
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, ACTIVE, SERVED, CANCELLED

  // Modal Form States
  const [showModal, setShowModal] = useState(false);
  const [editingFine, setEditingFine] = useState<Fine | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [playerId, setPlayerId] = useState("");
  const [ruleId, setRuleId] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"WARNING" | "SUSPENSION">("WARNING");
  const [matchesSuspended, setMatchesSuspended] = useState("1");
  const [status, setStatus] = useState<"ACTIVE" | "SERVED" | "CANCELLED">("ACTIVE");
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));

  // Delete & Serve confirmation Modals
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    fineId: string | null;
    actionType: "DELETE" | "SERVE" | null;
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

  // Handle auto-completion of fine description based on rule template selection
  function handleRuleChange(selectedRuleId: string) {
    setRuleId(selectedRuleId);
    if (!selectedRuleId) {
      return;
    }
    const selectedRule = rules.find((r) => r.id === selectedRuleId);
    if (selectedRule) {
      setDescription(selectedRule.title);
      setSeverity(selectedRule.severity);
      setMatchesSuspended(selectedRule.defaultMatches !== null ? String(selectedRule.defaultMatches) : "1");
    }
  }

  function handleOpenCreate() {
    setEditingFine(null);
    setPlayerId("");
    setRuleId("");
    setDescription("");
    setSeverity("WARNING");
    setMatchesSuspended("1");
    setStatus("ACTIVE");
    setDate(new Date().toISOString().substring(0, 10));
    setFormError("");
    setShowModal(true);
  }

  function handleOpenEdit(fine: Fine) {
    setEditingFine(fine);
    setPlayerId(fine.playerId);
    setRuleId(fine.ruleId || "");
    setDescription(fine.description);
    setSeverity(fine.severity);
    setMatchesSuspended(fine.matchesSuspended !== null ? String(fine.matchesSuspended) : "1");
    setStatus(fine.status);
    setDate(new Date(fine.date).toISOString().substring(0, 10));
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
      severity,
      matchesSuspended: severity === "SUSPENSION" ? parseInt(matchesSuspended) : null,
      status,
      date: new Date(date).toISOString(),
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
        setFormError(err.error || "Erro ao salvar punição");
        return;
      }

      setShowModal(false);
      await loadData();
      toast(editingFine ? "Punição atualizada!" : "Punição aplicada com sucesso!");
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
      title: "Excluir Punição",
      message: `Deseja realmente excluir o registro de punição de ${fine.player.name}? Esta ação é irreversível.`,
    });
  }

  function handleOpenServe(fine: Fine) {
    setConfirmModal({
      open: true,
      fineId: fine.id,
      actionType: "SERVE",
      title: "Marcar como Cumprido",
      message: `Confirmar que o jogador ${fine.player.name} já cumpriu a punição/suspensão de ${fine.matchesSuspended} ${fine.matchesSuspended === 1 ? "jogo" : "jogos"}?`,
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
          toast("Punição excluída com sucesso");
          await loadData();
        } else {
          toast("Erro ao excluir punição");
        }
      } else if (confirmModal.actionType === "SERVE") {
        const fine = fines.find((f) => f.id === confirmModal.fineId);
        if (fine) {
          const body = {
            playerId: fine.playerId,
            ruleId: fine.ruleId,
            description: fine.description,
            severity: fine.severity,
            matchesSuspended: fine.matchesSuspended,
            status: "SERVED",
            date: fine.date,
          };

          const res = await fetch(`/api/fines/${fine.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          if (res.ok) {
            toast("Punição marcada como cumprida!");
            await loadData();
          } else {
            toast("Erro ao atualizar punição");
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

  // Statistics
  const activeSuspensions = fines.filter((f) => f.severity === "SUSPENSION" && f.status === "ACTIVE").length;
  const totalWarnings = fines.filter((f) => f.severity === "WARNING").length;
  const totalServed = fines.filter((f) => f.status === "SERVED").length;

  const filteredFines = fines.filter((fine) => {
    const matchesPlayer = !filterPlayer || fine.playerId === filterPlayer;
    const matchesSeverity =
      filterSeverity === "ALL" || fine.severity === filterSeverity;
    const matchesStatus =
      filterStatus === "ALL" || fine.status === filterStatus;
    return matchesPlayer && matchesSeverity && matchesStatus;
  });

  function formatDate(isoString: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
    }).format(new Date(isoString));
  }

  function getSeverityLabel(sev: "WARNING" | "SUSPENSION", matches: number | null) {
    if (sev === "WARNING") return "Advertência";
    return `Suspensão: ${matches} ${matches === 1 ? "jogo" : "jogos"}`;
  }

  function getStatusBadge(status: "ACTIVE" | "SERVED" | "CANCELLED") {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="danger" className="bg-red-500/10 text-red-400 border-red-500/20 rounded-full px-2 py-0.5 text-[0.68rem] uppercase font-bold">
            Ativa / Pendente
          </Badge>
        );
      case "SERVED":
        return (
          <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-full px-2 py-0.5 text-[0.68rem] uppercase font-bold">
            Cumprido
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="default" className="bg-white/5 text-[var(--text-muted)] border-white/10 rounded-full px-2 py-0.5 text-[0.68rem] uppercase font-bold">
            Cancelado
          </Badge>
        );
    }
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Controle Disciplinar</h1>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            Aplicação e acompanhamento de advertências e suspensões do elenco
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90 cursor-pointer"
          >
            + Aplicar Punição
          </button>
        )}
      </div>

      {/* KPI summaries */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="rounded-2xl border border-[rgba(239,68,68,0.15)] bg-[rgba(15,8,8,0.4)] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#f87171]">Suspensões Ativas</p>
          <p className="mt-2 text-3xl font-black text-white">{activeSuspensions} Jogadores</p>
          <p className="mt-1 text-xs text-[var(--text-subtle)]">
            Atletas suspensos no momento
          </p>
        </div>
        <div className="rounded-2xl border border-[rgba(245,158,11,0.15)] bg-[rgba(25,18,8,0.4)] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#fbbf24]">Advertências Históricas</p>
          <p className="mt-2 text-3xl font-black text-white">{totalWarnings} Registros</p>
          <p className="mt-1 text-xs text-[var(--text-subtle)]">
            Total de advertências formais
          </p>
        </div>
        <div className="rounded-2xl border border-[rgba(16,185,129,0.15)] bg-[rgba(8,15,10,0.4)] p-6 shadow-sm col-span-full md:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wider text-[#34d399]">Cumpridas / Finalizadas</p>
          <p className="mt-2 text-3xl font-black text-white">{totalServed} Punições</p>
          <p className="mt-1 text-xs text-[var(--text-subtle)]">
            Histórico de punições cumpridas
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="app-surface rounded-2xl border border-[var(--border)] p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between shadow-sm">
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
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              <option value="ALL">Todas as punições</option>
              <option value="WARNING">Apenas Advertências</option>
              <option value="SUSPENSION">Apenas Suspensões</option>
            </select>
          </div>
          <div className="w-full sm:max-w-xs">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              <option value="ALL">Todos os status</option>
              <option value="ACTIVE">Ativo / Pendente</option>
              <option value="SERVED">Cumprido</option>
              <option value="CANCELLED">Cancelado</option>
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
          <p className="text-4xl">🛡️</p>
          <p className="mt-3 text-base font-semibold text-white">Nenhuma punição localizada</p>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            Ajuste os filtros ou aplique uma nova advertência/suspensão.
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
                  {fine.severity === "SUSPENSION" ? "🟥" : "🟨"}
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
                    Aplicada em: {formatDate(fine.date)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-sm font-bold text-white">
                    {getSeverityLabel(fine.severity, fine.matchesSuspended)}
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(fine.status)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && fine.status === "ACTIVE" && (
                    <button
                      onClick={() => handleOpenServe(fine)}
                      className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/25 transition-all cursor-pointer shadow-sm"
                    >
                      Marcar Cumprido
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
                        aria-label="Excluir punição"
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
                  {r.title} ({r.severity === "SUSPENSION" ? `Suspensão: ${r.defaultMatches} j` : "Advertência"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
              Gravidade / Tipo de Punição *
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as "WARNING" | "SUSPENSION")}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              <option value="WARNING">Advertência</option>
              <option value="SUSPENSION">Suspensão por jogos</option>
            </select>
          </div>

          {severity === "SUSPENSION" && (
            <Input
              label="Quantidade de jogos de suspensão *"
              placeholder="Ex: 1"
              type="number"
              min="1"
              max="100"
              value={matchesSuspended}
              onChange={(e) => setMatchesSuspended(e.target.value)}
              required
            />
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
              Status da Punição *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "ACTIVE" | "SERVED" | "CANCELLED")}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              <option value="ACTIVE">Ativo / Pendente</option>
              <option value="SERVED">Cumprido / Cumprida</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>

          <Input
            label="Descrição / Motivo da Punição *"
            placeholder="Ex: Cartão vermelho direto por reclamação desnecessária"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Input
            label="Data da Ocorrência *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

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
              {saving ? "Salvando..." : editingFine ? "Salvar Alterações" : "Aplicar Punição"}
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
            {confirmModal.actionType === "DELETE" ? "Confirmar Exclusão" : "Confirmar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
