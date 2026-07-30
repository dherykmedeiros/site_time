import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import Link from "next/link";
import { Card } from "./Card";

interface StatCardProps {
  /** Rótulo do cartão */
  label: string;
  /** Valor principal */
  value: string | number;
  /** Ícone opcional */
  icon?: ReactNode;
  /** Indicador de tendência opcional */
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  /** Link opcional, se fornecido, o cartão inteiro será um link */
  href?: string;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Componente StatCard para exibição de métricas (KPIs)
 */
export function StatCard({ label, value, icon, trend, href, className = "" }: StatCardProps) {
  const content = (
    <Card className={`p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-200 ${href ? "hover:border-[var(--brand-soft)] hover:shadow-md" : ""} ${className}`}>
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-subtle)]">
          {label}
        </span>
        {icon && (
          <div className="text-[var(--text-muted)] bg-[var(--bg)] p-2 rounded-lg">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-4 mt-auto">
        <h3 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {value}
        </h3>
        
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            trend.direction === 'up' ? 'text-green-500' :
            trend.direction === 'down' ? 'text-[var(--danger)]' :
            'text-[var(--text-muted)]'
          }`}>
            {trend.direction === 'up' && <ArrowUpRight size={16} className="mr-1" />}
            {trend.direction === 'down' && <ArrowDownRight size={16} className="mr-1" />}
            {trend.direction === 'neutral' && <Minus size={16} className="mr-1" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
