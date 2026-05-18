"use client";

import { ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={`m-auto w-[min(92vw,560px)] rounded-[20px] border border-[var(--border)] bg-[#080d0b] p-0 shadow-[var(--shadow-md)] backdrop:bg-[#020506]/85 backdrop:backdrop-blur-md ${className}`}
      onClose={onClose}
    >
      <div className="w-full">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text)] transition-colors"
            aria-label="Fechar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4 sm:px-6">{children}</div>
      </div>
    </dialog>
  );
}
