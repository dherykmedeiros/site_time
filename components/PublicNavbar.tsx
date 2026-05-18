"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

interface PublicNavbarProps {
  teamName: string;
  badgeUrl: string | null;
}

export function PublicNavbar({ teamName, badgeUrl }: PublicNavbarProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full glassmorphism border-b border-[var(--border)] shadow-[var(--shadow-sm)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          {badgeUrl ? (
            <img src={badgeUrl} alt="Escudo" className="h-10 w-10 rounded-xl object-cover border border-[var(--border)]" />
          ) : (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand)] text-white font-bold">⚽</span>
          )}
          <span className="font-display text-xl font-bold tracking-tight text-[var(--text)]">{teamName}</span>
        </Link>
        <div className="flex items-center gap-6">
          <a href="/#elenco" className="hidden text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--brand)] sm:block transition-colors">
            Elenco
          </a>
          <a href="/#retrospecto" className="hidden text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--brand)] sm:block transition-colors">
            Desempenho
          </a>
          <a href="/#amistoso" className="hidden text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--brand)] sm:block transition-colors">
            Solicitar Amistoso
          </a>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="inline-flex min-h-9 items-center justify-center rounded-full bg-[var(--brand)] px-5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[var(--brand-strong)] hover:scale-105 active:scale-95 transform duration-150"
          >
            {session ? "Painel Admin" : "Acesso Restrito"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
