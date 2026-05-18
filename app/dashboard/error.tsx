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
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="mb-4 text-4xl">😵</div>
      <h2 className="mb-2 text-xl font-bold text-gray-900">
        Erro ao carregar
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Não foi possível carregar esta página. Tente novamente.
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
