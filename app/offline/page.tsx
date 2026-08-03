"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center text-white">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-5xl shadow-xl mb-6">
        📡
      </div>

      <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
        Você está sem conexão com a internet
      </h1>

      <p className="mt-3 max-w-md text-sm text-[#8fa39b] leading-relaxed">
        Não se preocupe! O <strong>Site Time</strong> salvou os dados do seu elenco e partidas mais recentes. Conecte-se novamente à rede para atualizar informações em tempo real.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => window.location.reload()} className="bg-[#10b981] hover:bg-[#34d399] text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl">
          🔄 Tentar Reconectar
        </Button>
        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
        >
          🏠 Voltar ao Início
        </Link>
      </div>

      <div className="mt-12 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs text-[#8fa39b] max-w-xs">
        💡 <strong>Dica:</strong> Se você instalou o app na tela inicial do seu celular, seus dados continuarão disponíveis mesmo sem internet.
      </div>
    </div>
  );
}
