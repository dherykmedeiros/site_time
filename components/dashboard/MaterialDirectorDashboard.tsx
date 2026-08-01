"use client";

import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Package, AlertTriangle, ArrowRightLeft, ShoppingCart, Check, X } from "lucide-react";

interface Team {
  id: string;
  name: string;
  badgeUrl?: string | null;
}

interface LowStockItem {
  id: string;
  name: string;
  availableQty: number;
  minQty: number;
}

interface RecentMovement {
  id: string;
  playerName: string;
  equipmentName: string;
  date: Date;
  status: "BORROWED" | "RETURNED";
}

interface PendingOrder {
  id: string;
  equipmentName: string;
  requestedBy: string;
  date: Date;
}

interface MaterialDirectorDashboardProps {
  team: Team;
  metrics: {
    totalItems: number;
    lowStockCount: number;
    activeLoansCount: number;
    pendingOrdersCount: number;
  };
  lowStockItems: LowStockItem[];
  recentMovements: RecentMovement[];
  pendingOrders: PendingOrder[];
}

/**
 * Componente de painel para a função de Diretor de Material.
 */
export default function MaterialDirectorDashboard({
  team,
  metrics,
  lowStockItems,
  recentMovements,
  pendingOrders,
}: MaterialDirectorDashboardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Materiais" 
        description={`Controle de patrimônio e uniformes do time ${team.name}`} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Patrimônio Total"
          value={metrics.totalItems.toString()}
          icon={<Package className="w-5 h-5" />}
        />
        <StatCard
          title="Estoque Crítico"
          value={metrics.lowStockCount.toString()}
          icon={<AlertTriangle className="w-5 h-5 text-[var(--danger)]" />}
        />
        <StatCard
          title="Retiradas Ativas"
          value={metrics.activeLoansCount.toString()}
          icon={<ArrowRightLeft className="w-5 h-5" />}
        />
        <StatCard
          title="Pedidos Pendentes"
          value={metrics.pendingOrdersCount.toString()}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico Recente de Movimentações</CardTitle>
            </CardHeader>
            <CardContent>
              {recentMovements.length === 0 ? (
                <EmptyState icon={ArrowRightLeft} title="Sem movimentações" description="O histórico de retiradas e devoluções está vazio." />
              ) : (
                <DataTable
                  columns={[
                    { header: "Data", accessorKey: "date", cell: (row) => formatDate(row.date) },
                    { header: "Atleta", accessorKey: "playerName" },
                    { header: "Equipamento", accessorKey: "equipmentName" },
                    { 
                      header: "Status", 
                      accessorKey: "status",
                      cell: (row) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === "BORROWED" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"}`}>
                          {row.status === "BORROWED" ? "Emprestado" : "Devolvido"}
                        </span>
                      )
                    },
                  ]}
                  data={recentMovements}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alerta de Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <EmptyState icon={Package} title="Estoque Regular" description="Nenhum item abaixo da quantidade mínima." />
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {lowStockItems.map(item => (
                    <li key={item.id} className="py-4 flex justify-between items-center">
                      <span className="font-medium text-[var(--text)]">{item.name}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-[var(--danger)] font-bold">Disponível: {item.availableQty}</span>
                        <span className="text-[var(--text-muted)]">Mínimo: {item.minQty}</span>
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
              <CardTitle>Pedidos para Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingOrders.length === 0 ? (
                <EmptyState icon={ShoppingCart} title="Nenhum pedido" description="Não há solicitações pendentes." />
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {pendingOrders.map(order => (
                    <li key={order.id} className="py-4 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-[var(--text)]">{order.equipmentName}</p>
                          <p className="text-xs text-[var(--text-muted)]">Solicitado por: {order.requestedBy}</p>
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">{formatDate(order.date)}</span>
                      </div>
                      <div className="flex gap-2 justify-end mt-2">
                        <Button size="sm" variant="ghost" className="text-green-500 hover:text-green-400 hover:bg-green-500/10"><Check className="w-4 h-4 mr-1" /> Aprovar</Button>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10"><X className="w-4 h-4 mr-1" /> Rejeitar</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
