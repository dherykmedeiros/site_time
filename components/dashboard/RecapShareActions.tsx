"use client";

import { useMemo, useState, useEffect } from "react";

function isColorLight(colorStr: string): boolean {
  if (!colorStr) return false;
  
  let r = 0, g = 0, b = 0;
  
  const rgbMatch = colorStr.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) {
    r = parseInt(rgbMatch[1], 10);
    g = parseInt(rgbMatch[2], 10);
    b = parseInt(rgbMatch[3], 10);
  } else {
    const cleanHex = colorStr.replace("#", "").trim();
    if (cleanHex.length !== 6 && cleanHex.length !== 3) return false;
    if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    } else {
      r = parseInt(cleanHex.substring(0, 1) + cleanHex.substring(0, 1), 16);
      g = parseInt(cleanHex.substring(1, 2) + cleanHex.substring(1, 2), 16);
      b = parseInt(cleanHex.substring(2, 3) + cleanHex.substring(2, 3), 16);
    }
  }
  
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 135; // slightly higher threshold to ensure high readability
}

type RecapShareContext = "public_match" | "public_player" | "dashboard_match_postgame";

type RecapEntityType = "match" | "player";

type OgFormat = "landscape" | "stories";
type OgTheme = "classic" | "dark" | "vibrant";

interface RecapShareActionsProps {
  entityId: string;
  entityType: RecapEntityType;
  context: RecapShareContext;
  labelPrefix: string;
  vitrineUrl?: string;
  format?: OgFormat;
  theme?: OgTheme;
}

export function RecapShareActions({
  entityId,
  entityType,
  context,
  labelPrefix,
  vitrineUrl: vitrineUrlProp,
  format: formatProp,
  theme: themeProp,
}: RecapShareActionsProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<OgFormat>(formatProp ?? "landscape");
  const [selectedTheme, setSelectedTheme] = useState<OgTheme>(themeProp ?? "classic");
  const [isBrandLight, setIsBrandLight] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getBrandProp = () => {
        const docBrand = window.getComputedStyle(document.documentElement).getPropertyValue("--brand").trim();
        if (docBrand) return docBrand;
        const bodyBrand = window.getComputedStyle(document.body).getPropertyValue("--brand").trim();
        if (bodyBrand) return bodyBrand;
        return null;
      };
      
      const brandVal = getBrandProp();
      if (brandVal) {
        setIsBrandLight(isColorLight(brandVal));
      }
    }
  }, []);

  const recapRouteSegment = entityType === "match" ? "team-recap" : "player-recap";

  const ogUrl = useMemo(() => {
    const base = typeof window === "undefined"
      ? `/api/og/${recapRouteSegment}/${entityId}`
      : `${window.location.origin}/api/og/${recapRouteSegment}/${entityId}`;

    const params = new URLSearchParams();
    if (selectedFormat !== "landscape") params.set("format", selectedFormat);
    if (selectedTheme !== "classic") params.set("theme", selectedTheme);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }, [recapRouteSegment, entityId, selectedFormat, selectedTheme]);

  const vitrineUrl = useMemo(() => {
    if (vitrineUrlProp) {
      if (typeof window !== "undefined" && !vitrineUrlProp.startsWith("http")) {
        return `${window.location.origin}${vitrineUrlProp}`;
      }
      return vitrineUrlProp;
    }
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return ogUrl;
  }, [vitrineUrlProp, ogUrl]);

  const supportsNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  function track(ctaType: "open_card" | "copy_link" | "whatsapp_share" | "download_png" | "native_share") {
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
    window.open(ogUrl, "_blank", "noopener,noreferrer");
  }

  function handleCopyLink() {
    track("copy_link");
    navigator.clipboard.writeText(vitrineUrl).then(() => {
      setFeedback("Link do recap copiado!");
      setTimeout(() => setFeedback(null), 2200);
    });
  }

  function handleWhatsAppShare() {
    track("whatsapp_share");
    const message = `${labelPrefix}: ${vitrineUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function handleDownload() {
    track("download_png");
    try {
      const res = await fetch(ogUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recap-${entityType}-${entityId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setFeedback("Imagem baixada!");
      setTimeout(() => setFeedback(null), 2200);
    } catch {
      setFeedback("Erro ao baixar imagem");
      setTimeout(() => setFeedback(null), 2200);
    }
  }

  async function handleNativeShare() {
    track("native_share");
    try {
      const res = await fetch(ogUrl);
      const blob = await res.blob();
      const file = new File([blob], `recap-${entityType}-${entityId}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: labelPrefix,
          url: vitrineUrl,
        });
      } else {
        await navigator.clipboard.writeText(vitrineUrl);
        setFeedback("Link copiado! (Compartilhamento nativo não suportado)");
        setTimeout(() => setFeedback(null), 2200);
      }
    } catch {
      // User cancelled or error — silently ignore
    }
  }

  const brandTextColor = isBrandLight ? "text-slate-950 font-black" : "text-white font-bold";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className={`inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--brand)] px-4 text-sm transition hover:opacity-90 ${brandTextColor}`}
        >
          Baixar PNG
        </button>
        <button
          type="button"
          onClick={supportsNativeShare ? handleNativeShare : handleCopyLink}
          className={`inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--brand)] px-4 text-sm transition hover:opacity-90 ${brandTextColor}`}
        >
          Compartilhar
        </button>
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
        >
          WhatsApp
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
          onClick={handleOpenCard}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
        >
          Abrir card recap
        </button>
      </div>

      {/* Format + Theme selectors */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-[var(--text-muted)] font-medium">Formato:</span>
          {([["landscape", "Paisagem"], ["stories", "Stories"]] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setSelectedFormat(val)}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                selectedFormat === val
                  ? `bg-[var(--brand)] ${brandTextColor}`
                  : "border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-soft)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[var(--text-muted)] font-medium">Tema:</span>
          {([["classic", "Clássico"], ["dark", "Escuro"], ["vibrant", "Vibrante"]] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setSelectedTheme(val)}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                selectedTheme === val
                  ? `bg-[var(--brand)] ${brandTextColor}`
                  : "border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-soft)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <p className="text-sm text-[#1d5f4f]">{feedback}</p>
      )}
    </div>
  );
}
