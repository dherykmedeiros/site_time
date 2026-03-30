"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";

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
  { value: "VENUE_RENTAL", label: "Aluguel de Quadra" },
  { value: "REFEREE", label: "Arbitragem" },
  { value: "EQUIPMENT", label: "Material Esportivo" },
  { value: "OTHER", label: "Outros" },
];

export default function FinancesPage() {
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

  // Tab: "list" | "summary"
  const [activeTab, setActiveTab] = useState<"list" | "summary">("list");

  // Summary state
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [summaryMonth, setSummaryMonth] = useState(new Date().getMonth() + 1);
  const [summaryYear, setSummaryYear] = useState(new Date().getFullYear());
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, categoryFilter]);

  useEffect(() => {
    if (activeTab === "summary") {
      loadSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, summaryMonth, summaryYear]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Finanças</h1>
        <Button onClick={() => setShowForm(true)}>+ Nova Transação</Button>
      </div>

      {feedback && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {feedback}
        </div>
      )}

      {actionError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Balance Card */}
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-sm text-gray-500">Saldo Total</p>
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
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "list"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Transações
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "summary"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Resumo Mensal
        </button>
      </div>

      {activeTab === "list" && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
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
            <p className="text-center text-gray-500">Carregando...</p>
          ) : transactions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">Nenhuma transação encontrada.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => (
                <Card key={t.id}>
                  <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {t.type === "INCOME" ? "💰" : "💸"}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {t.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {categoryLabels[t.category] || t.category} •{" "}
                          {new Date(t.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-11 sm:pl-0">
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
                      <button
                        onClick={() => {
                          setDeleteTarget(t.id);
                          setActionError(null);
                        }}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Excluir
                      </button>
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
              <span className="text-sm text-gray-500">
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
            <p className="text-center text-gray-500">Carregando resumo...</p>
          ) : summary ? (
            <div className="space-y-4">
              {/* Totals */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="py-4 text-center">
                    <p className="text-sm text-gray-500">Receitas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(summary.totalIncome)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4 text-center">
                    <p className="text-sm text-gray-500">Despesas</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(summary.totalExpense)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4 text-center">
                    <p className="text-sm text-gray-500">Balanço</p>
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
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900">
                      Detalhamento por Categoria
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {summary.byCategory.map((entry, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2"
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
                            <span className="text-sm text-gray-900">
                              {categoryLabels[entry.category] ||
                                entry.category}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium text-gray-900">
                              {formatCurrency(entry.total)}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
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
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">
                  Nenhum dado para o período selecionado.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Add Transaction Modal */}
      <Modal
        open={showForm}
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
        open={!!deleteTarget}
        onClose={() => {
          if (deleteLoading) return;
          setDeleteTarget(null);
        }}
        title="Excluir transação"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
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
