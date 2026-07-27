"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDateOnly, formatDate } from "@/lib/utils";
import { useSession } from "next-auth/react";

const TransactionForm = dynamic(
  () => import("@/components/forms/TransactionForm").then((m) => ({ default: m.TransactionForm })),
  { loading: () => <div className="p-4 text-center text-gray-500">Carregando formulário...</div> }
);

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
  matchId: string | null;
  matchOpponent: string | null;
  matchDate: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MonthlySummary {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: Array<{
    category: string;
    type: "INCOME" | "EXPENSE";
    total: number;
    count: number;
  }>;
}

const categoryLabels: Record<string, string> = {
  MEMBERSHIP: "Mensalidade",
  FRIENDLY_FEE: "Cota de Amistoso",
  MATCH_FEE: "Taxa de Jogo",
  VENUE_RENTAL: "Aluguel de Quadra",
  REFEREE: "Arbitragem",
  EQUIPMENT: "Material Esportivo",
  OTHER: "Outros",
};

const typeFilterOptions = [
  { value: "", label: "Todos" },
  { value: "INCOME", label: "Receitas" },
  { value: "EXPENSE", label: "Despesas" },
];

const categoryFilterOptions = [
  { value: "", label: "Todas" },
  { value: "MEMBERSHIP", label: "Mensalidade" },
  { value: "FRIENDLY_FEE", label: "Cota de Amistoso" },
  { value: "MATCH_FEE", label: "Taxa de Jogo" },
  { value: "VENUE_RENTAL", label: "Aluguel de Quadra" },
  { value: "REFEREE", label: "Arbitragem" },
  { value: "EQUIPMENT", label: "Material Esportivo" },
  { value: "OTHER", label: "Outros" },
];

export default function FinancesPage() {
  const { data: session, status: authStatus } = useSession();
  const role = session?.user?.role;
  const isAllowed = role === "ADMIN" || role === "MATERIAL_DIRECTOR";

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Filters
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Tab: "list" | "summary" | "charges"
  const [activeTab, setActiveTab] = useState<"list" | "summary" | "charges">("list");

  // Summary state
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [summaryMonth, setSummaryMonth] = useState(new Date().getMonth() + 1);
  const [summaryYear, setSummaryYear] = useState(new Date().getFullYear());
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Match Charges state
  const [matches, setMatches] = useState<any[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [chargeTargetMatch, setChargeTargetMatch] = useState<any | null>(null);
  const [chargeAmount, setChargeAmount] = useState("");
  const [chargeSaving, setChargeSaving] = useState(false);

  // Match Payment Checklist state
  const [checklistTargetMatch, setChecklistTargetMatch] = useState<any | null>(null);
  const [checklistPlayers, setChecklistPlayers] = useState<any[]>([]);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [togglingPlayerId, setTogglingPlayerId] = useState<string | null>(null);

  async function loadTransactions(page = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (typeFilter) params.set("type", typeFilter);
      if (categoryFilter) params.set("category", categoryFilter);

      const res = await fetch(`/api/finances?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setBalance(data.balance);
        setPagination(data.pagination);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadSummary() {
    setSummaryLoading(true);
    try {
      const res = await fetch(
        `/api/finances/summary?month=${summaryMonth}&year=${summaryYear}`
      );
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } finally {
      setSummaryLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleteLoading(true);
    setActionError(null);

    const res = await fetch(`/api/finances/${id}`, { method: "DELETE" });

    if (res.ok) {
      setDeleteTarget(null);
      setFeedback("Transação excluída com sucesso.");
      await loadTransactions(pagination.page);
    } else {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error || "Erro ao excluir transação");
    }

    setDeleteLoading(false);
  }

  async function loadMatches() {
    setMatchesLoading(true);
    try {
      const res = await fetch("/api/matches");
      if (res.ok) {
        const data = await res.json();
        // Sort by date descending
        const sorted = (data.matches || []).sort((a: any, b: any) => b.date.localeCompare(a.date));
        setMatches(sorted);
      }
    } catch (err) {
      console.error("Erro ao carregar partidas para cobrancas", err);
    } finally {
      setMatchesLoading(false);
    }
  }

  async function loadChecklistPlayers(matchId: string) {
    setChecklistLoading(true);
    try {
      const res = await fetch(`/api/matches/${matchId}/charges`);
      if (res.ok) {
        const data = await res.json();
        setChecklistPlayers(data.players || []);
      }
    } catch (err) {
      console.error("Erro ao carregar checklist", err);
    } finally {
      setChecklistLoading(false);
    }
  }

  async function handleTogglePayment(playerId: string, isPaid: boolean) {
    if (!checklistTargetMatch) return;
    setTogglingPlayerId(playerId);
    setActionError(null);
    try {
      const method = isPaid ? "POST" : "DELETE";
      const res = await fetch(`/api/matches/${checklistTargetMatch.id}/charges/${playerId}`, {
        method,
      });
      if (res.ok) {
        setChecklistPlayers((prev) =>
          prev.map((p) => {
            if (p.id === playerId) {
              return {
                ...p,
                payment: isPaid ? { amount: checklistTargetMatch.chargeAmount } : null,
              };
            }
            return p;
          })
        );
        loadTransactions(pagination.page);
      } else {
        const data = await res.json().catch(() => ({}));
        setActionError(data.error || "Erro ao atualizar pagamento");
      }
    } catch (err) {
      setActionError("Erro de conexão");
    } finally {
      setTogglingPlayerId(null);
    }
  }

  async function handleSaveCharge() {
    if (!chargeTargetMatch || !chargeAmount) return;
    setChargeSaving(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/matches/${chargeTargetMatch.id}/charges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(chargeAmount) }),
      });
      if (res.ok) {
        setChargeTargetMatch(null);
        setChargeAmount("");
        setFeedback("Cobrança gerada com sucesso!");
        await loadMatches();
      } else {
        const data = await res.json().catch(() => ({}));
        setActionError(data.error || "Erro ao gerar cobrança");
      }
    } catch (err) {
      setActionError("Erro de conexão");
    } finally {
      setChargeSaving(false);
    }
  }

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, categoryFilter]);

  useEffect(() => {
    if (activeTab === "summary") {
      loadSummary();
    } else if (activeTab === "charges") {
      loadMatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, summaryMonth, summaryYear]);

  if (authStatus === "loading") {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#10b981] border-t-transparent" />
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[70vh]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-4xl border border-red-500/20 shadow-md">
          🔒
        </div>
        <h2 className="mt-6 text-2xl font-black text-white">Área Restrita</h2>
        <p className="mt-2 text-sm text-[var(--text-subtle)] max-w-md leading-relaxed">
          Esta área é de acesso exclusivo para diretores de material e administradores do time para controle financeiro.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[22px] border border-[rgba(16,185,129,0.18)] bg-[rgba(10,24,20,0.4)] p-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Controle Financeiro
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Finanças</h1>
        </div>
        {isAllowed ? (
          <Button onClick={() => setShowForm(true)} className="rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[#010403] bg-[#10b981] hover:bg-[#34d399]">
            + Nova Transação
          </Button>
        ) : null}
      </div>

      {feedback && (
        <div className="rounded-[12px] border border-[#bde0d3] bg-[#e9f8f1] p-3 text-sm text-[#1d5f4f]">
          {feedback}
        </div>
      )}

      {actionError && (
        <div className="rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)]">
          {actionError}
        </div>
      )}

      {/* Balance Card */}
      <Card className="rounded-[18px]">
        <CardContent className="py-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">Saldo Total</p>
          <p
            className={`text-3xl font-bold ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(balance)}
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="app-surface flex w-fit gap-2 rounded-full border p-1">
        <button
          onClick={() => setActiveTab("list")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "list"
              ? "bg-[var(--brand)] text-white"
              : "text-[var(--text-muted)] hover:bg-[#eef2ee]"
          }`}
        >
          Transações
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "summary"
              ? "bg-[var(--brand)] text-white"
              : "text-[var(--text-muted)] hover:bg-[#eef2ee]"
          }`}
        >
          Resumo Mensal
        </button>
        <button
          onClick={() => setActiveTab("charges")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "charges"
              ? "bg-[var(--brand)] text-white"
              : "text-[var(--text-muted)] hover:bg-[#eef2ee]"
          }`}
        >
          Cobranças de Jogos
        </button>
      </div>

      {activeTab === "list" && (
        <>
          {/* Filters */}
          <div className="app-surface flex flex-wrap gap-4 rounded-[16px] p-4">
            <div className="w-40">
              <Select
                label="Tipo"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={typeFilterOptions}
              />
            </div>
            <div className="w-48">
              <Select
                label="Categoria"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={categoryFilterOptions}
              />
            </div>
          </div>

          {/* List */}
          {loading ? (
            <p className="text-center text-[var(--text-muted)]">Carregando...</p>
          ) : transactions.length === 0 ? (
            <Card className="rounded-[18px]">
              <CardContent className="py-12 text-center">
                <p className="text-[var(--text-muted)]">Nenhuma transação encontrada.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => (
                <Card key={t.id} className="rounded-[18px]">
                  <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {t.type === "INCOME" ? "💰" : "💸"}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[var(--text)]">
                          {t.description}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {categoryLabels[t.category] || t.category} •{" "}
                          {formatDateOnly(t.date, { dateStyle: "short" })}
                        </p>
                        {t.matchId && (
                          <p className="mt-1 text-xs text-[#2a6f60]">
                            Vinculada a {t.matchOpponent ? `vs ${t.matchOpponent}` : "uma partida"}
                            {t.matchDate ? ` em ${formatDateOnly(t.matchDate, { dateStyle: "short" })}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-11 sm:pl-0">
                      {t.matchId && <Badge variant="info">Partida</Badge>}
                      <span
                        className={`font-bold ${
                          t.type === "INCOME"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {t.type === "INCOME" ? "+" : "-"}{" "}
                        {formatCurrency(t.amount)}
                      </span>
                      {isAllowed && (
                        <button
                          onClick={() => {
                            setDeleteTarget(t.id);
                            setActionError(null);
                          }}
                          className="text-xs font-semibold text-[var(--danger)] hover:underline"
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => loadTransactions(pagination.page - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm text-[var(--text-muted)]">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadTransactions(pagination.page + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}

      {activeTab === "summary" && (
        <>
          {/* Month/Year selectors */}
          <div className="flex gap-4">
            <div className="w-32">
              <Select
                label="Mês"
                value={summaryMonth.toString()}
                onChange={(e) => setSummaryMonth(parseInt(e.target.value))}
                options={Array.from({ length: 12 }, (_, i) => ({
                  value: (i + 1).toString(),
                  label: new Date(2000, i).toLocaleString("pt-BR", { month: "long" }),
                }))}
              />
            </div>
            <div className="w-32">
              <Select
                label="Ano"
                value={summaryYear.toString()}
                onChange={(e) => setSummaryYear(parseInt(e.target.value))}
                options={Array.from({ length: 5 }, (_, i) => {
                  const y = new Date().getFullYear() - 2 + i;
                  return { value: y.toString(), label: y.toString() };
                })}
              />
            </div>
          </div>

          {summaryLoading ? (
            <p className="text-center text-[var(--text-muted)]">Carregando resumo...</p>
          ) : summary ? (
            <div className="space-y-4">
              {/* Totals */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="rounded-[18px]">
                  <CardContent className="py-4 text-center">
                    <p className="text-sm text-[var(--text-muted)]">Receitas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(summary.totalIncome)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-[18px]">
                  <CardContent className="py-4 text-center">
                    <p className="text-sm text-[var(--text-muted)]">Despesas</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(summary.totalExpense)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-[18px]">
                  <CardContent className="py-4 text-center">
                    <p className="text-sm text-[var(--text-muted)]">Balanco</p>
                    <p
                      className={`text-2xl font-bold ${
                        summary.balance >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(summary.balance)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* By Category */}
              {summary.byCategory.length > 0 && (
                <Card className="rounded-[18px]">
                  <CardHeader>
                    <h3 className="font-semibold text-[var(--text)]">
                      Detalhamento por Categoria
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {summary.byCategory.map((entry, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border border-[#e5ece5] bg-[#f8fbf8] px-4 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                entry.type === "INCOME"
                                  ? "success"
                                  : "danger"
                              }
                            >
                              {entry.type === "INCOME"
                                ? "Receita"
                                : "Despesa"}
                            </Badge>
                            <span className="text-sm text-[var(--text)]">
                              {categoryLabels[entry.category] ||
                                entry.category}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium text-[var(--text)]">
                              {formatCurrency(entry.total)}
                            </span>
                            <span className="ml-2 text-xs text-[var(--text-muted)]">
                              ({entry.count} lançamento
                              {entry.count !== 1 ? "s" : ""})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="rounded-[18px]">
              <CardContent className="py-12 text-center">
                <p className="text-[var(--text-muted)]">
                  Nenhum dado para o período selecionado.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
      {activeTab === "charges" && (
        <>
          {matchesLoading ? (
            <p className="text-center text-[var(--text-muted)]">Carregando partidas...</p>
          ) : matches.length === 0 ? (
            <Card className="rounded-[18px]">
              <CardContent className="py-12 text-center">
                <p className="text-[var(--text-muted)]">Nenhuma partida registrada no sistema.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {matches.map((m) => {
                const matchDateStr = formatDate(m.date);
                return (
                  <Card key={m.id} className="rounded-[18px]">
                    <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⚽</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-white">
                            vs {m.opponent}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {matchDateStr} • {m.venue}
                          </p>
                          {m.hasCharge && m.chargeAmount && (
                            <p className="mt-1 text-xs text-[#34d399] font-bold">
                              Taxa definida: {formatCurrency(m.chargeAmount)} por atleta
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-11 sm:pl-0">
                        {m.hasCharge ? (
                          <>
                            <Badge variant="success">Cobrança Ativa</Badge>
                            <Button
                              onClick={() => {
                                setChecklistTargetMatch(m);
                                loadChecklistPlayers(m.id);
                              }}
                              className="rounded-xl px-3 py-1.5 text-xs font-bold bg-[#10b981] hover:bg-[#34d399] text-black"
                            >
                              Controlar Taxa
                            </Button>
                          </>
                        ) : (
                          <>
                            <Badge variant="warning">Sem Cobrança</Badge>
                            <Button
                              onClick={() => {
                                setChargeTargetMatch(m);
                                setChargeAmount("");
                              }}
                              variant="secondary"
                              className="rounded-xl px-3 py-1.5 text-xs font-bold"
                            >
                              Gerar Cobrança
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Generate Charge Modal */}
      <Modal
        open={!!chargeTargetMatch}
        onClose={() => setChargeTargetMatch(null)}
        title={`Gerar Cobrança - vs ${chargeTargetMatch?.opponent}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-muted)]">
            Defina o valor do rateio por atleta para a partida contra o <strong>{chargeTargetMatch?.opponent}</strong>.
          </p>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#8fa39b]">
              Valor por jogador (R$)
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={chargeAmount}
              onChange={(e) => setChargeAmount(e.target.value)}
              placeholder="Ex.: 15.00"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSaveCharge}
              disabled={chargeSaving || !chargeAmount}
            >
              {chargeSaving ? "Gerando..." : "Gerar Taxa"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setChargeTargetMatch(null)}
              disabled={chargeSaving}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Match Payment Checklist Modal */}
      <Modal
        open={!!checklistTargetMatch}
        onClose={() => setChecklistTargetMatch(null)}
        title={`Controle de Pagamentos - vs ${checklistTargetMatch?.opponent}`}
        className="w-[min(94vw,620px)]"
      >
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-2 border-b border-white/5 pb-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Valor definido por atleta</p>
              <p className="text-lg font-black text-[#34d399]">
                {checklistTargetMatch ? formatCurrency(checklistTargetMatch.chargeAmount) : ""}
              </p>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-xs text-[var(--text-muted)]">Total Arrecadado</p>
              <p className="text-lg font-black text-white">
                {formatCurrency(
                  checklistPlayers
                    .filter((p) => p.payment)
                    .reduce((sum, p) => sum + (checklistTargetMatch?.chargeAmount || 0), 0)
                )}
              </p>
            </div>
          </div>

          {checklistLoading ? (
            <p className="text-center py-4 text-[var(--text-muted)]">Carregando atletas...</p>
          ) : checklistPlayers.length === 0 ? (
            <p className="text-center py-4 text-[var(--text-muted)]">Nenhum jogador ativo no elenco.</p>
          ) : (
            <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
              {checklistPlayers.map((p) => {
                const isPaid = !!p.payment;
                const isToggling = togglingPlayerId === p.id;
                
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xs font-black text-[var(--brand)]">
                        {p.shirtNumber}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{p.name}</p>
                        <div className="mt-0.5 flex gap-1">
                          {p.present ? (
                            <Badge variant="success" className="text-[9px] px-1 py-0 scale-95 origin-left">Presente</Badge>
                          ) : p.rsvp === "CONFIRMED" ? (
                            <Badge variant="info" className="text-[9px] px-1 py-0 scale-95 origin-left">Confirmado RSVP</Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isPaid}
                        disabled={isToggling}
                        onChange={(e) => handleTogglePayment(p.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand)]"></div>
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-white/5">
            <Button variant="secondary" onClick={() => setChecklistTargetMatch(null)}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Transaction Modal */}
      <Modal
        open={isAllowed && showForm}
        onClose={() => setShowForm(false)}
        title="Nova Transação"
      >
        <TransactionForm
          onSuccess={() => {
            setShowForm(false);
            loadTransactions();
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal
        open={isAllowed && !!deleteTarget}
        onClose={() => {
          if (deleteLoading) return;
          setDeleteTarget(null);
        }}
        title="Excluir transação"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-muted)]">
            Deseja realmente excluir esta transação?
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Excluindo..." : "Confirmar exclusão"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteLoading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
