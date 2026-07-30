"use client";

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  /** Indica se o drawer está aberto */
  open: boolean;
  /** Função para fechar o drawer */
  onClose: () => void;
  /** Título do drawer */
  title?: string;
  /** Conteúdo do drawer */
  children: React.ReactNode;
  /** Lado em que o drawer aparece (left ou right) */
  side?: "left" | "right";
  /** Tamanho do drawer (sm, md, lg) */
  size?: "sm" | "md" | "lg";
}

/**
 * Componente Drawer para exibição de painel lateral
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  size = "md",
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    },
    [open, onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const sizeClasses = {
    sm: "w-full sm:w-[320px]",
    md: "w-full sm:w-[480px]",
    lg: "w-full sm:w-[640px]",
  };

  const sideClasses = {
    left: "left-0 top-0 bottom-0 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 border-r border-[var(--border)]",
    right: "right-0 top-0 bottom-0 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 border-l border-[var(--border)]",
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-labelledby={title ? "drawer-title" : undefined}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        data-state={open ? "open" : "closed"}
        className={`absolute bg-[var(--bg-elevated)] shadow-xl transition-transform duration-300 ease-in-out flex flex-col ${sideClasses[side]} ${sizeClasses[size]}`}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          {title ? (
            <h2 id="drawer-title" className="text-lg font-semibold text-[var(--text)]">
              {title}
            </h2>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--bg)] text-[var(--text-subtle)] hover:text-[var(--text)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 text-[var(--text)]">
          {children}
        </div>
      </div>
    </div>
  );
}
