"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

/**
 * Diálogo de confirmação para ações destrutivas ou importantes
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setInternalLoading(false);
    }
  };

  const isDanger = variant === "danger";
  const isLoading = loading || internalLoading;

  return (
    <Modal open={open} onClose={() => !isLoading && onOpenChange(false)} title="">
      <div className="flex flex-col gap-4 sm:p-2">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${isDanger ? 'bg-[var(--danger-soft)] text-[var(--danger)]' : 'bg-[var(--brand-soft)] text-[var(--brand)]'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)]">
              {title}
            </h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {description}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button 
            variant={isDanger ? "danger" : "primary"} 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
