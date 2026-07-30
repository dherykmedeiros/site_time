import React, { ReactNode } from "react";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Componente para exibição de estado vazio (listas vazias, sem dados, etc)
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-[var(--bg-elevated)] border border-[var(--border)] border-dashed rounded-lg ${className}`}>
      {icon && (
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-[var(--bg)] text-[var(--text-subtle)] border border-[var(--border)]">
          <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
        </div>
      )}
      <h3 className="mb-1 text-lg font-medium text-[var(--text)]">
        {title}
      </h3>
      <p className="mb-4 text-sm text-[var(--text-muted)] max-w-sm">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
