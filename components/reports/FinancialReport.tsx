"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#1c1815] px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-bold text-white">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value?.toLocaleString("pt-BR", {
            style: entry.name.includes("%") ? undefined : "currency",
            currency: "BRL",
          })}
          {entry.name.includes("%") ? "%" : ""}
        </p>
      ))}
    </div>
  );
};

const COLORS = ["#34d399", "#2fa791", "#36c2a8", "#22d3ee", "#818cf8"];
const EXPENSE_COLORS = ["#f87171", "#d05a3e", "#fb923c", "#fbbf24", "#a78bfa"];

export default function FinancialReport({
  data,
  loading,
  error,
}: {
  data: any;
  loading: boolean;
  error: string;
}) {
  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="animate-pulse text-sm text-[#8fa39b]">Carregando relatório...</p>
      </div>
    );
  if (error)
    return (
      <div className="rounded-xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.06)] p-4 text-sm text-[#f87171]">
        {error}
      </div>
    );
  if (!data)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[#8fa39b]">Nenhum dado encontrado</p>
      </div>
    );

  const formatCurrency = (value: number) =>
    Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const incomeCategories = data.byCategory.filter((c: any) => c.type === "INCOME");
  const expenseCategories = data.byCategory.filter((c: any) => c.type === "EXPENSE");

  return (
    <div className="space-y-6">
      {/* Action Header for Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#16130f] p-4 print:hidden">
        <div>
          <h3 className="text-sm font-bold text-white">Relatório Financeiro do Time</h3>
          <p className="text-xs text-[#8fa39b]">Exporte o fluxo de caixa consolidado para planilhas ou impressão em PDF</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/finances/export"
            download
            className="inline-flex items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            📊 Baixar Planilha CSV (Excel)
          </a>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
          >
            🖨️ Imprimir PDF
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Receita Total
          </p>
          <p className="text-2xl font-black text-[#34d399]">
            {formatCurrency(data.overview.totalIncome)}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Despesas Totais
          </p>
          <p className="text-2xl font-black text-[#f87171]">
            {formatCurrency(data.overview.totalExpenses)}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Saldo
          </p>
          <p
            className={`text-2xl font-black ${
              data.overview.netBalance >= 0 ? "text-[#34d399]" : "text-[#f87171]"
            }`}
          >
            {formatCurrency(data.overview.netBalance)}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Adimplência
          </p>
          <p className="text-2xl font-black text-white">
            {data.overview.membershipCollectionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Area Chart - Income vs Expenses */}
      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
        <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
          Fluxo de Caixa Mensal
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.monthly}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#8fa39b" }} />
              <Area
                type="monotone"
                dataKey="income"
                name="Receitas"
                stroke="#34d399"
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Despesas"
                stroke="#f87171"
                fillOpacity={1}
                fill="url(#colorExpenses)"
              />
              <Line type="monotone" dataKey="net" name="Saldo Líquido" stroke="#36c2a8" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Charts - Categories */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Receitas por Categoria
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                  nameKey="categoryLabel"
                >
                  {incomeCategories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#8fa39b" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
          <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Despesas por Categoria
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                  nameKey="categoryLabel"
                >
                  {expenseCategories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#8fa39b" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart - Membership */}
      <div className="rounded-xl border border-white/[0.06] bg-[#16130f] p-4">
        <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
          Status de Mensalidades
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.membershipStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8fa39b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#8fa39b" }} />
              <Bar dataKey="paid" name="Pagos" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pendentes" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
