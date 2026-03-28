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
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-4 text-5xl">⚠️</div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Algo deu errado
        </h2>
        <p className="mb-6 text-gray-600">
          Ocorreu um erro inesperado. Tente novamente ou volte para a página
          inicial.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>Tentar novamente</Button>
          <a
            href="/"
            className="text-sm text-blue-600 hover:underline"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}
