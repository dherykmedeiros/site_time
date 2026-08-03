"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user already dismissed or installed recently
    const dismissed = localStorage.getItem("pwa_install_dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return; // Don't show again for 7 days
      }
    }

    // Check if running as standalone PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    if (isIosDevice) {
      setShowPrompt(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        console.log("Usuário aceitou a instalação do PWA.");
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa_install_dismissed", Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md rounded-2xl border border-emerald-500/30 bg-[#0d1410] p-4 text-white shadow-2xl backdrop-blur-lg print:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/icons/icon-192x192.png" alt="Site Time" className="h-12 w-12 rounded-xl border border-emerald-500/30 shadow-md" />
          <div>
            <h4 className="text-sm font-black text-white">Instalar o App Site Time</h4>
            <p className="text-xs text-[#8fa39b] leading-tight mt-0.5">
              Acesse escalações, partidas e confirmações de presença com velocidade nativa no seu celular.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white p-1 font-bold text-lg leading-none"
          title="Fechar"
        >
          ×
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
        {isIos ? (
          <p className="text-[11px] text-emerald-400 font-medium">
            💡 Toque em <strong>Compartilhar</strong> <span className="text-sm">⎋</span> e depois em <strong>"Adicionar à Tela de Início"</strong>.
          </p>
        ) : (
          <>
            <span className="text-[11px] text-[#8fa39b]">Sem downloads da loja de apps</span>
            <Button
              onClick={handleInstallClick}
              className="bg-[#10b981] hover:bg-[#34d399] text-black font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl"
            >
              📲 Instalar App
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
