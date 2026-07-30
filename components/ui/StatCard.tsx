import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import Link from "next/link";
import { Card } from "./Card";

interface StatCardProps {
  /** Rótulo do cartão */
  label?: string;
  title?: string;
  /** Valor principal */
  value: string | number;
  /** Ícone opcional */
  icon?: ReactNode;
  /** Indicador de tendência opcional */
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  } | "up" | "down" | "neutral";
  trendValue?: string | number;
  /** Link opcional, se fornecido, o cartão inteiro será um link */
  href?: string;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Componente StatCard para exibição de métricas (KPIs)
 */
export function StatCard({ label, title, value, icon, trend, trendValue, href, className = "" }: StatCardProps) {
  const displayLabel = label || title || "";

  const renderTrend = () => {
    if (!trend) return null;

    let direction: "up" | "down" | "neutral" = "neutral";
    let val: string | number = "";

    if (typeof trend === "object" && trend !== null) {
      direction = trend.direction;
      val = trendValue !== undefined ? trendValue : (trend.value !== undefined ? trend.value : "");
    } else {
      direction = trend;
      val = trendValue !== undefined ? trendValue : "";
    }

    return (
      <div className={`flex items-center text-sm font-medium ${
        direction === 'up' ? 'text-green-500' :
        direction === 'down' ? 'text-[var(--danger)]' :
        'text-[var(--text-muted)]'
      }`}>
        {direction === 'up' && <ArrowUpRight size={16} className="mr-1" />}
        {direction === 'down' && <ArrowDownRight size={16} className="mr-1" />}
        {direction === 'neutral' && <Minus size={16} className="mr-1" />}
        {val}{typeof val === "number" ? "%" : ""}
      </div>
    );
  };

  const content = (
    <Card className={`p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-200 ${href ? "hover:border-[var(--brand-soft)] hover:shadow-md" : ""} ${className}`}>
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-subtle)]">
          {displayLabel}
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
        {renderTrend()}
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
