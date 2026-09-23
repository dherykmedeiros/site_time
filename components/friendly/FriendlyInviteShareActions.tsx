"use client";

import { useState } from "react";

interface FriendlyInviteShareActionsProps {
  teamName: string;
}

export function FriendlyInviteShareActions({ teamName }: FriendlyInviteShareActionsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(window.location.href);
    } else {
      const input = document.createElement("textarea");
      input.value = window.location.href;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  function shareOnWhatsApp() {
    const text = `Confira a agenda do ${teamName} e envie um convite para amistoso: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex min-h-11 items-center justify-center border-2 border-emerald-500 bg-emerald-500 px-5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-emerald-400"
      >
        {copied ? "Link copiado!" : "Copiar link"}
      </button>
      <button
        type="button"
        onClick={shareOnWhatsApp}
        className="inline-flex min-h-11 items-center justify-center border-2 border-emerald-800 bg-emerald-950/40 px-5 text-xs font-black uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-900/50"
      >
        Compartilhar no WhatsApp
      </button>
    </div>
  );
}
