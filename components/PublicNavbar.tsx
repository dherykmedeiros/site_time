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
  const portalHref = (path: string) => `${prefix || "/"}${path}`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090d0f] border-b-2 border-slate-800 shadow-none">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href={prefix || "/"} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          {badgeUrl ? (
            <img src={badgeUrl} alt="Escudo" className="h-9 w-9 rounded-none object-cover border-2 border-slate-800" />
          ) : (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-none bg-[var(--brand)] text-[#090d0f] border-2 border-slate-800">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
          )}
          <span className="font-mono text-lg font-black tracking-tighter text-white uppercase">{teamName}</span>
        </Link>
        <div className="flex items-center gap-6">
          <a href={portalHref("?tab=album#elenco")} className="hidden text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 hover:text-[var(--brand)] sm:block transition-colors">
            Elenco
          </a>
          <a href={portalHref("?tab=esportes#desempenho")} className="hidden text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 hover:text-[var(--brand)] sm:block transition-colors">
            Desempenho
          </a>
          <a href={portalHref("?tab=secretaria#amistoso")} className="hidden text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 hover:text-[var(--brand)] sm:block transition-colors">
            Solicitar Amistoso
          </a>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="inline-flex min-h-9 items-center justify-center bg-[var(--brand)] hover:bg-[#0f1418] hover:text-white border-2 border-slate-800 text-[#090d0f] text-[9px] font-mono font-black uppercase tracking-widest px-5 rounded-none transition-all duration-150 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            {session ? "Painel Admin" : "Acesso Restrito"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
