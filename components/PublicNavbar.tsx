"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

interface PublicNavbarProps {
  teamName: string;
  badgeUrl: string | null;
  slug?: string;
}

export function PublicNavbar({ teamName, badgeUrl, slug }: PublicNavbarProps) {
  const { data: session } = useSession();
  const prefix = slug ? `/${slug}` : "";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090d0f]/95 border-b border-[rgba(255,255,255,0.08)] shadow-md backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href={prefix || "/"} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          {badgeUrl ? (
            <img src={badgeUrl} alt="Escudo" className="h-9 w-9 rounded-md object-cover border border-white/10" />
          ) : (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brand)] text-white font-black text-sm">⚽</span>
          )}
          <span className="font-mono text-lg font-black tracking-tight text-white uppercase">{teamName}</span>
        </Link>
        <div className="flex items-center gap-6">
          <a href={`${prefix}#elenco`} className="hidden text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white sm:block transition-colors">
            Elenco
          </a>
          <a href={`${prefix}#retrospecto`} className="hidden text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white sm:block transition-colors">
            Desempenho
          </a>
          <a href={`${prefix}#amistoso`} className="hidden text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white sm:block transition-colors">
            Solicitar Amistoso
          </a>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="inline-flex min-h-9 items-center justify-center bg-[var(--brand)] hover:bg-[var(--brand-strong)] text-[#090d0f] text-[10px] font-black uppercase tracking-wider px-5 rounded-md transition-all duration-150 shadow-sm"
          >
            {session ? "Painel Admin" : "Acesso Restrito"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
