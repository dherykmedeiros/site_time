"use client";

import { useMemo, useState } from "react";

type RecapShareContext = "public_match" | "public_player" | "dashboard_match_postgame";

type RecapEntityType = "match" | "player";

interface RecapShareActionsProps {
  entityId: string;
  entityType: RecapEntityType;
  context: RecapShareContext;
  labelPrefix: string;
}

export function RecapShareActions({
  entityId,
  entityType,
  context,
  labelPrefix,
}: RecapShareActionsProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const recapUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `/api/og/${entityType}-recap/${entityId}`;
    }

    return `${window.location.origin}/api/og/${entityType}-recap/${entityId}`;
  }, [entityType, entityId]);

  function track(ctaType: "open_card" | "copy_link" | "whatsapp_share") {
    fetch("/api/telemetry/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "recap_cta_clicked",
        context,
        ctaType,
        entityType,
        entityId,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  function handleOpenCard() {
    track("open_card");
    window.open(recapUrl, "_blank", "noopener,noreferrer");
  }

  function handleCopyLink() {
    track("copy_link");
    navigator.clipboard.writeText(recapUrl).then(() => {
      setFeedback("Link do recap copiado!");
      setTimeout(() => setFeedback(null), 2200);
    });
  }

  function handleWhatsAppShare() {
    track("whatsapp_share");
    const message = `${labelPrefix}: ${recapUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleOpenCard}
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--brand)] px-4 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Abrir card recap
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
        >
          Copiar link
        </button>
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
        >
          Compartilhar no WhatsApp
        </button>
      </div>
      {feedback && (
        <p className="text-sm text-[#1d5f4f]">{feedback}</p>
      )}
    </div>
  );
}
