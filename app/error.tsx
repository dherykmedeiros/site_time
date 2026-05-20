"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Erro na aplicação:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-4 text-5xl">⚠️</div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Algo deu errado
        </h2>
        <p className="mb-6 text-gray-600">
          Ocorreu um erro inesperado. Tente novamente ou volte para a página
          inicial.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center mb-8">
          <Button onClick={reset}>Tentar novamente</Button>
          <a
            href="/"
            className="text-sm text-blue-600 hover:underline"
          >
            Voltar ao início
          </a>
        </div>

        {error && (
          <div className="mt-8 text-left bg-red-50 border border-red-200 rounded-xl p-4">
            <details className="cursor-pointer group">
              <summary className="text-sm font-semibold text-red-800 hover:text-red-900 focus:outline-none flex items-center gap-2">
                <span>Detalhes técnicos do erro</span>
                <span className="text-xs font-normal text-red-500 group-open:hidden">(clique para expandir)</span>
              </summary>
              <div className="mt-3 overflow-x-auto rounded bg-red-100/50 p-3 font-mono text-xs text-red-900 border border-red-200/50 max-h-60 whitespace-pre-wrap">
                <p className="font-bold mb-1">{error.name}: {error.message}</p>
                {error.stack && <p className="opacity-80 mt-1 text-[10px] leading-relaxed">{error.stack}</p>}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
