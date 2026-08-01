import React, { ReactNode } from "react";
import { BreadcrumbRoot, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "./Breadcrumb";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: ReactNode | BreadcrumbItemData[];
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
  const renderBreadcrumbs = () => {
    if (!breadcrumbs) return null;
    if (Array.isArray(breadcrumbs)) {
      return (
        <BreadcrumbRoot>
          {breadcrumbs.map((item, idx) => (
            <BreadcrumbItem key={idx}>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbRoot>
      );
    }
    return breadcrumbs;
  };

  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-start md:justify-between pb-6 mb-6 border-b border-[var(--border)] ${className}`}>
      <div className="flex flex-col gap-1.5">
        {breadcrumbs && <div className="mb-2">{renderBreadcrumbs()}</div>}
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
