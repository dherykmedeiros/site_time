"use client";

import { useState } from "react";
import { Share2, MessageCircle, Copy, Check } from "lucide-react";

interface RecapShareButtonsClientProps {
  teamName: string;
  opponent: string;
  homeScore: number;
  awayScore: number;
  isHome: boolean;
  shareToken: string;
}

export function RecapShareButtonsClient({
  teamName,
  opponent,
  homeScore,
  awayScore,
  isHome,
  shareToken,
}: RecapShareButtonsClientProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/matches/${shareToken}/recap`;
  };

  const getScoreText = () => {
    const mainScore = isHome ? homeScore : awayScore;
    const oppScore = isHome ? awayScore : homeScore;
    return `${mainScore} x ${oppScore}`;
  };

  const handleWhatsAppShare = () => {
    const shareUrl = getShareUrl();
    const scoreText = getScoreText();
    const message = `⚽ *RECAP PÓS-JOGO:* Confira o resumo completo da grande partida entre *${teamName}* e *${opponent}*! Placar final: *${scoreText}*. Veja os artilheiros, melhores momentos e a escalação tática aqui: ${shareUrl}`;
    
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopyLink = () => {
    const shareUrl = getShareUrl();
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
      <button
        onClick={handleWhatsAppShare}
        className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#10b981] hover:bg-[#059669] text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
      >
        <MessageCircle size={18} className="stroke-[2.5]" />
        Compartilhar no WhatsApp
      </button>

      <button
        onClick={handleCopyLink}
        className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 rounded-full border border-emerald-500/20 hover:border-emerald-500/40 bg-white/5 hover:bg-white/10 text-white font-extrabold text-sm uppercase tracking-wider transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
      >
        {copied ? (
          <>
            <Check size={18} className="text-[#34d399] stroke-[2.5]" />
            Copiado!
          </>
        ) : (
          <>
            <Copy size={18} className="text-[var(--text-muted)]" />
            Copiar Link da Página
          </>
        )}
      </button>
    </div>
  );
}
