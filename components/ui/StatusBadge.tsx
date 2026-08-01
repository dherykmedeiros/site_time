import React from "react";
import { Badge } from "./Badge";

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" | "outline" | "secondary" }> = {
  // Sucesso
  ACTIVE: { label: "Ativo", variant: "success" },
  CONFIRMED: { label: "Confirmado", variant: "success" },
  PAID: { label: "Pago", variant: "success" },
  COMPLETED: { label: "Concluído", variant: "success" },
  APPROVED: { label: "Aprovado", variant: "success" },
  
  // Alerta/Atenção
  PENDING: { label: "Pendente", variant: "warning" },
  SCHEDULED: { label: "Agendado", variant: "warning" },
  OPEN: { label: "Aberto", variant: "warning" },
  
  // Erro/Perigo
  INACTIVE: { label: "Inativo", variant: "danger" },
  DECLINED: { label: "Recusado", variant: "danger" },
  CANCELLED: { label: "Cancelado", variant: "danger" },
  REJECTED: { label: "Rejeitado", variant: "danger" },
  
  // Padrão/Neutro
  DRAFT: { label: "Rascunho", variant: "default" },
  NOT_STARTED: { label: "Não Iniciado", variant: "default" },
};

const dotColorMap = {
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  default: "bg-gray-500",
  outline: "bg-gray-500",
  secondary: "bg-gray-500"
};

/**
 * Badge semântico para exibição de status com tradução automática
 */
export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();
  const config = statusMap[normalizedStatus] || { label: status, variant: "default" };
  const dotColorClass = dotColorMap[config.variant as keyof typeof dotColorMap] || "bg-gray-500";
  
  return (
    <Badge variant={config.variant as any} className={`flex items-center gap-1.5 ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColorClass}`} aria-hidden="true" />
      {config.label}
    </Badge>
  );
}
