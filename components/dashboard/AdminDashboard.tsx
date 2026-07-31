"use client";

import React from "react";
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
}

/**
 * Componente de painel para a função de Administrador.
 */
export default function AdminDashboard({ team, metrics, transactions, friendlyRequests, overduePayments }: AdminDashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  };

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
