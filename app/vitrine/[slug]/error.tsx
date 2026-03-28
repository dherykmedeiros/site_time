"use client";

import { useEffect } from "react";

export default function VitrineError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro na vitrine:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="mb-4 text-5xl">⚠️</div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">
        Erro ao carregar a vitrine
      </h2>
      <p className="mb-6 text-gray-600">
        Não foi possível carregar esta página. Tente novamente.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Tentar novamente
      </button>
    </div>
  );
}
