"use client";

import { useEffect, useMemo, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export function PushSubscriptionCard() {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");

  const supported = useMemo(
    () =>
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window,
    []
  );

  useEffect(() => {
    fetch("/api/push/public-key")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.configured && typeof data.vapidPublicKey === "string") {
          setPublicKey(data.vapidPublicKey);
        }
      })
      .catch(() => {});
  }, []);

  async function subscribe() {
    if (!supported) {
      setStatusText("Este navegador não suporta notificações push.");
      return;
    }

    if (!publicKey) {
      setStatusText("Chave pública VAPID não configurada.");
      return;
    }

    setLoading(true);
    setStatusText("");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatusText("Permissão negada para notificações.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      let sub = await registration.pushManager.getSubscription();
      if (!sub) {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatusText(data.error || "Falha ao ativar notificações.");
        return;
      }

      setStatusText("Notificações ativadas com sucesso.");
    } catch {
      setStatusText("Erro ao ativar notificações.");
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    if (!supported) return;

    setLoading(true);
    setStatusText("");

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (!sub) {
        setStatusText("Nenhuma assinatura ativa no navegador.");
        return;
      }

      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });

      await sub.unsubscribe();
      setStatusText("Notificações desativadas.");
    } catch {
      setStatusText("Erro ao desativar notificações.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="app-surface rounded-[22px] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
        Notificações
      </p>
      <h3 className="mt-2 text-lg font-bold text-[var(--text)]">Push no navegador</h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Receba alertas de partidas e atualizações importantes sem depender de WhatsApp.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={subscribe}
          disabled={loading || !supported}
          className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Processando..." : "Ativar push"}
        </button>
        <button
          onClick={unsubscribe}
          disabled={loading || !supported}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)] disabled:opacity-60"
        >
          Desativar
        </button>
      </div>

      {!supported && (
        <p className="mt-3 text-sm text-amber-600">Push não suportado neste navegador/dispositivo.</p>
      )}

      {statusText && (
        <p className="mt-3 text-sm text-[var(--text-subtle)]" role="status" aria-live="polite">
          {statusText}
        </p>
      )}
    </section>
  );
}
