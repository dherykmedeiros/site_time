"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface Rule {
  id: string;
  title: string;
  description: string;
  fineAmount: number | null;
  createdAt: string;
}

export default function RulesPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const { toast } = useToast();

  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fineAmount, setFineAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    ruleId: string | null;
    title: string;
    message: string;
  }>({ open: false, ruleId: null, title: "", message: "" });
  const [confirmLoading, setConfirmLoading] = useState(false);

  async function loadRules() {
    setLoading(true);
    try {
      const res = await fetch("/api/rules");
      if (res.ok) {
        const data = await res.json();
        setRules(data.rules || []);
      }
    } catch {
      toast("Erro ao carregar regras");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRules();
  }, []);

  function handleOpenCreate() {
    setEditingRule(null);
    setTitle("");
    setDescription("");
    setFineAmount("");
    setFormError("");
    setShowModal(true);
  }

  function handleOpenEdit(rule: Rule) {
    setEditingRule(rule);
    setTitle(rule.title);
    setDescription(rule.description);
    setFineAmount(rule.fineAmount !== null ? String(rule.fineAmount) : "");
    setFormError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const body = {
      title,
      description,
      fineAmount: fineAmount ? parseFloat(fineAmount) : null,
    };

    try {
      const url = editingRule ? `/api/rules/${editingRule.id}` : "/api/rules";
      const method = editingRule ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || "Erro ao salvar regra");
        return;
      }

      setShowModal(false);
      await loadRules();
      toast(editingRule ? "Regra atualizada com sucesso!" : "Regra criada com sucesso!");
    } catch {
      setFormError("Erro de conexão com o servidor");
    } finally {
      setSaving(false);
    }
  }

  function handleOpenDelete(rule: Rule) {
    setConfirmModal({
      open: true,
      ruleId: rule.id,
      title: "Excluir Regra",
      message: `Tem certeza que deseja excluir a regra "${rule.title}"? Esta ação não pode ser desfeita.`,
    });
  }

  async function executeDelete() {
    if (!confirmModal.ruleId) return;
    setConfirmLoading(true);
    try {
      const res = await fetch(`/api/rules/${confirmModal.ruleId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Regra excluída com sucesso");
        await loadRules();
      } else {
        toast("Erro ao excluir regra");
      }
    } catch {
      toast("Erro de conexão");
    } finally {
      setConfirmLoading(false);
      setConfirmModal({ open: false, ruleId: null, title: "", message: "" });
    }
  }

  function formatBRL(amount: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Regras do Time</h1>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            Consulte as diretrizes e multas acordadas para a equipe
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90 cursor-pointer"
          >
            + Nova Regra
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-[var(--surface-soft)] border border-white/5" />
          ))}
        </div>
      ) : rules.length === 0 ? (
        <div className="app-surface rounded-2xl border border-dashed border-[var(--border-strong)] p-14 text-center text-[var(--text-muted)]">
          <p className="text-4xl">📋</p>
          <p className="mt-3 text-base font-semibold text-white">Nenhuma regra cadastrada</p>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            As diretrizes e normas de convivência do time aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="app-surface flex flex-col justify-between rounded-2xl border border-[var(--border)] p-6 shadow-[var(--shadow-sm)] hover:border-[rgba(16,185,129,0.3)] transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-lg text-white leading-snug">{rule.title}</h3>
                  <span className="flex-shrink-0 text-xl">📋</span>
                </div>

                <p className="text-sm text-[var(--text-subtle)] leading-relaxed whitespace-pre-line">
                  {rule.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                <div>
                  {rule.fineAmount !== null ? (
                    <Badge variant="warning" className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-3 py-1 font-semibold text-xs rounded-full">
                      Multa: {formatBRL(rule.fineAmount)}
                    </Badge>
                  ) : (
                    <Badge variant="info" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 font-semibold text-xs rounded-full">
                      Advertência / Sem Multa
                    </Badge>
                  )}
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(rule)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15 transition-all cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleOpenDelete(rule)}
                      className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                      aria-label="Excluir regra"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingRule ? "Editar Regra" : "Nova Regra"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20">
              {formError}
            </p>
          )}

          <Input
            label="Título da Regra *"
            placeholder="Ex: Atraso para o Jogo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Descrição / Detalhes *"
            placeholder="Descreva a regra de forma clara. Ex: Chegar pelo menos 30 minutos antes do horário marcado para o início do jogo."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />

          <Input
            label="Valor da Punição (R$, opcional)"
            placeholder="Ex: 15.00"
            type="number"
            step="0.01"
            min="0"
            value={fineAmount}
            onChange={(e) => setFineAmount(e.target.value)}
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
              {saving ? "Salvando..." : editingRule ? "Salvar Alterações" : "Criar Regra"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
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
            variant="danger"
            size="sm"
            onClick={executeDelete}
            loading={confirmLoading}
          >
            Confirmar Exclusão
          </Button>
        </div>
      </Modal>
    </div>
  );
}
