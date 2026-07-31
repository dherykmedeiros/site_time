"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import type { MatchDetail } from "@/app/dashboard/matches/[id]/page";

interface MatchOverviewTabProps {
  match: MatchDetail;
  confirmed: number;
  pending: number;
  declined: number;
  isScheduled: boolean;
  getPregameRecapCardUrl: () => string;
  handleCopyPregameRecapLink: () => void;
  buildConvocacaoText: () => string;
  trackPregameCtaClick: (ctaType: "open_card" | "copy_link" | "whatsapp_share") => void;
}

export function MatchOverviewTab({
  match,
  confirmed,
  pending,
  declined,
  isScheduled,
  getPregameRecapCardUrl,
  handleCopyPregameRecapLink,
  buildConvocacaoText,
  trackPregameCtaClick,
}: MatchOverviewTabProps) {
  if (!isScheduled) {
    return (
      <div className="rounded-[18px] border border-white/5 bg-white/[0.02] p-8 text-center text-[var(--text-subtle)]">
        <p className="text-sm font-semibold text-white/80">Partida Finalizada</p>
        <p className="text-xs text-[#8fa39b] mt-1">
          Esta partida já foi concluída. Vá para a aba "Pós-jogo" para ver estatísticas, avaliações e o craque do jogo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compact Stats Bar */}
      <div className="grid gap-3 grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(16,185,129,0.1)] text-[#34d399]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{confirmed}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Confirmados</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(251,191,36,0.1)] text-[#fbbf24]">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{pending}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Pendentes</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(248,113,113,0.1)] text-[#f87171]">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{declined}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Recusas</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-[var(--text)]">Divulgar Pré-Jogo nas Redes Sociais</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-[#6ee7b7]">Gerar Imagem de Pré-Jogo</p>
              <p className="text-sm text-[var(--text-subtle)]">
                Crie um card de preview personalizado com local, horário, convocados e retrospectiva do time para publicar no Instagram e WhatsApp!
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  const pregameUrl = getPregameRecapCardUrl();
                  if (!pregameUrl) return;
                  trackPregameCtaClick("open_card");
                  window.open(pregameUrl, "_blank", "noopener,noreferrer");
                }}
              >
                🖼️ Abrir card pré-jogo
              </Button>
              <Button variant="secondary" onClick={handleCopyPregameRecapLink}>
                📋 Copiar link do card
              </Button>
              <Button
                onClick={() => {
                  trackPregameCtaClick("whatsapp_share");
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(buildConvocacaoText())}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                📱 Compartilhar no WhatsApp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
