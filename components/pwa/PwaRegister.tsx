"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker PWA registrado com sucesso:", registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    console.log("Nova versão do app disponível! Atualizando em segundo plano...");
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error("Falha ao registrar Service Worker:", error);
        });
    }
  }, []);

  return null;
}
