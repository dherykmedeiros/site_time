"use client";

import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    // Initial check
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-bounce rounded-xl border border-yellow-500/30 bg-[#1c1917] p-3 text-xs font-semibold text-yellow-400 shadow-2xl backdrop-blur-md print:hidden flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">📡</span>
          <span>Você está offline. Exibindo dados salvos em cache.</span>
        </div>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-emerald-500/30 bg-[#062016] p-3 text-xs font-semibold text-emerald-400 shadow-2xl backdrop-blur-md print:hidden flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">✅</span>
          <span>Conexão reestabelecida! Atualizando dados...</span>
        </div>
      </div>
    );
  }

  return null;
}
