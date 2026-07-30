import React, { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbRootProps {
  children: ReactNode;
  className?: string;
}

/**
 * Container principal do Breadcrumb
 */
export function BreadcrumbRoot({ children, className = "" }: BreadcrumbRootProps) {
  return (
    <nav aria-label="Navegação estrutural" className={className}>
      <ol className="flex items-center space-x-1.5 text-sm text-[var(--text-muted)] sm:space-x-2.5">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;
          
          const isLast = index === React.Children.count(children) - 1;
          
          return (
            <li className="flex items-center space-x-1.5 sm:space-x-2.5">
              {child}
              {!isLast && <ChevronRight className="w-4 h-4 text-[var(--text-subtle)] flex-shrink-0" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export interface BreadcrumbItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * Item interno do Breadcrumb (Link ou Página atual)
 */
export function BreadcrumbItem({ children, className = "" }: BreadcrumbItemProps) {
  return <span className={`flex items-center ${className}`}>{children}</span>;
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

/**
 * Link de navegação do Breadcrumb
 */
export function BreadcrumbLink({ className = "", children, ...props }: BreadcrumbLinkProps) {
  return (
    <a
      className={`hover:text-[var(--text)] hover:underline transition-colors ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Indicador da página atual no Breadcrumb
 */
export function BreadcrumbPage({ className = "", children, ...props }: BreadcrumbPageProps) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={`font-medium text-[var(--text)] ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
