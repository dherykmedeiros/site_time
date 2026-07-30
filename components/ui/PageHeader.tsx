import React, { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  categoryLabel?: string;
  className?: string;
}

/**
 * Cabeçalho de página padronizado
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  categoryLabel,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-start md:justify-between pb-6 mb-6 border-b border-[var(--border)] ${className}`}>
      <div className="flex flex-col gap-1.5">
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
        {categoryLabel && (
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--brand)]">
            {categoryLabel}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--text)] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[var(--text-muted)] text-sm max-w-xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
}
