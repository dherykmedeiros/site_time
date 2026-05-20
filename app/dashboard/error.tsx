"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro no dashboard:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-4">
      <div className="mb-4 text-4xl">😵</div>
      <h2 className="mb-2 text-xl font-bold text-gray-900">
        Erro ao carregar
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Não foi possível carregar esta página. Tente novamente.
      </p>
      
      <div className="flex flex-col items-center gap-3">
        <Button onClick={reset}>Tentar novamente</Button>
      </div>

      {error && (
        <div className="mt-8 w-full max-w-2xl text-left bg-red-50 border border-red-200 rounded-xl p-4">
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
  );
}
