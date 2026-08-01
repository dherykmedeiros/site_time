"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DollarSign, AlertCircle, Users, Calendar, Copy, Check, X } from "lucide-react";
import { ActivityTimeline } from "./ActivityTimeline";

interface Team {
  id: string;
  name: string;
  badgeUrl?: string | null;
}

interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
}

interface FriendlyRequest {
  id: string;
  opponentName: string;
  date: Date;
  status: string;
}

interface OverduePayment {
  playerId: string;
  playerName: string;
  amount: number;
  monthsOverdue: number;
}

interface AdminDashboardProps {
  team: Team;
  metrics: {
    balance: number;
    overdueAmount: number;
    activePlayersCount: number;
    pendingAmistososCount: number;
  };
  transactions: Transaction[];
  friendlyRequests: FriendlyRequest[];
  overduePayments: OverduePayment[];
  nextMatch: {
    id: string;
    date: Date;
    opponentName: string;
    venue: string;
  } | null;
}

/**
 * Componente de painel para a função de Administrador.
 */
export default function AdminDashboard({ team, metrics, transactions, friendlyRequests, overduePayments, nextMatch }: AdminDashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  };

  const isMatchToday = nextMatch ? (() => {
    const d = new Date(nextMatch.date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  })() : false;

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Painel Administrativo`} 
        description={`Visão geral da gestão do time ${team.name}`} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Saldo em Caixa"
          value={formatCurrency(metrics.balance)}
          icon={<DollarSign className="w-5 h-5" />}
          trend={{
            value: 0,
            direction: metrics.balance >= 0 ? "up" : "down"
          }}
          trendValue={metrics.balance >= 0 ? "Positivo" : "Negativo"}
        />
        <StatCard
          title="Mensalidades Pendentes"
          value={formatCurrency(metrics.overdueAmount)}
          icon={<AlertCircle className="w-5 h-5 text-[var(--danger)]" />}
        />
        <StatCard
          title="Elenco Ativo"
          value={metrics.activePlayersCount.toString()}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Pedidos de Amistoso"
          value={metrics.pendingAmistososCount.toString()}
          icon={<Calendar className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Próxima Partida</CardTitle>
              {isMatchToday && (
                <span className="rounded-full bg-red-500/10 border border-red-500/30 px-2.5 py-0.5 text-xs font-bold text-red-400 animate-pulse">
                  🔥 É HOJE!
                </span>
              )}
            </CardHeader>
            <CardContent>
              {nextMatch ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-10 h-10 text-[var(--brand)] animate-bounce" />
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text)]">{nextMatch.opponentName}</h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {formatDate(nextMatch.date)} - {nextMatch.venue}
                      </p>
                    </div>
                  </div>
                  {isMatchToday && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs font-semibold text-red-400">
                      ⚽ Dia de jogo importante do clube! Acesse a página do jogo para gerenciar e registrar eventos em tempo real.
                    </div>
                  )}
                  <div className="flex justify-end pt-2">
                    <Link href={`/dashboard/matches/${nextMatch.id}`} className="w-full sm:w-auto">
                      <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-wider text-[var(--brand)] hover:bg-[var(--brand-soft)]/20">
                        🏟️ Acessar Página da Partida ➔
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-[var(--text-muted)]">
                  Nenhuma partida agendada no momento.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimas Transações</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <EmptyState icon={DollarSign} title="Nenhuma transação" description="O histórico financeiro está vazio." />
              ) : (
                <DataTable
                  columns={[
                    { header: "Data", accessorKey: "date", cell: (row) => formatDate(row.date) },
                    { header: "Descrição", accessorKey: "description" },
                    { 
                      header: "Valor", 
                      accessorKey: "amount", 
                      cell: (row) => (
                        <span className={row.type === "INCOME" ? "text-green-500" : "text-red-500"}>
                          {row.type === "INCOME" ? "+" : "-"}{formatCurrency(row.amount)}
                        </span>
                      )
                    },
                  ]}
                  data={transactions}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pedidos de Amistoso Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {friendlyRequests.length === 0 ? (
                <EmptyState icon={Calendar} title="Nenhum pedido" description="Não há pedidos de amistoso pendentes." />
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {friendlyRequests.map(req => (
                    <li key={req.id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-[var(--text)]">{req.opponentName}</p>
                        <p className="text-sm text-[var(--text-muted)]">{formatDate(req.date)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-green-500 hover:text-green-400 hover:bg-green-500/10"><Check className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10"><X className="w-4 h-4" /></Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mensalidades Atrasadas</CardTitle>
            </CardHeader>
            <CardContent>
              {overduePayments.length === 0 ? (
                <EmptyState icon={AlertCircle} title="Tudo em dia" description="Nenhum jogador possui mensalidades atrasadas." />
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {overduePayments.map(payment => (
                    <li key={payment.playerId} className="py-4 flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-[var(--text)]">{payment.playerName}</span>
                        <span className="text-[var(--danger)] font-semibold">{formatCurrency(payment.amount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[var(--text-muted)]">{payment.monthsOverdue} mês(es) em atraso</span>
                        <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
                          <Copy className="w-3 h-3 mr-1" /> Cobrar
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}
