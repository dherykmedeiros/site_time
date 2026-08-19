"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { SuggestedLineupCard } from "@/components/dashboard/SuggestedLineupCard";
import { TrainingLineupManager } from "@/components/matches/TrainingLineupManager";
import type { MatchDetail, MatchLineupResponse } from "@/app/dashboard/matches/[id]/page";

interface MatchLineupTabProps {
  match: MatchDetail;
  lineupData: MatchLineupResponse | null;
  lineupLoading: boolean;
  lineupError: string | null;
  lineupRefreshing: boolean;
  lineupSaving: boolean;
  fetchLineup: (opts?: { refresh?: boolean }) => void;
  handleSaveLineup: (lineup: any) => Promise<void>;
  handleResetSavedLineup: () => Promise<void>;
  buildLineupShareText: () => string;
  showLineupShare: boolean;
  setShowLineupShare: (show: boolean) => void;
  lineupShareText: string;
  setLineupShareText: (text: string) => void;
  setCopyMsg: (msg: string) => void;
}

export function MatchLineupTab({
  match,
  lineupData,
  lineupLoading,
  lineupError,
  lineupRefreshing,
  lineupSaving,
  fetchLineup,
  handleSaveLineup,
  handleResetSavedLineup,
  buildLineupShareText,
  showLineupShare,
  setShowLineupShare,
  lineupShareText,
  setLineupShareText,
  setCopyMsg,
}: MatchLineupTabProps) {
  // If match type is TRAINING, use the dedicated TrainingLineupManager
  if (match.type === "TRAINING") {
    return (
      <TrainingLineupManager
        match={match}
        lineupData={lineupData}
        onSaveLineup={handleSaveLineup}
        saveLoading={lineupSaving}
      />
    );
  }

  return (
    <div className="space-y-6">
      {lineupData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Compartilhar Escalação</h2>
              <button
                onClick={() => {
                  const next = !showLineupShare;
                  setShowLineupShare(next);
                  if (next) setLineupShareText(buildLineupShareText());
                }}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--brand-neon)] hover:bg-white/[0.06] transition-colors"
              >
                {showLineupShare ? "Fechar" : "📋 Gerar texto"}
              </button>
            </div>
          </CardHeader>
          {showLineupShare && (
            <CardContent>
              <textarea
                className="min-h-[160px] w-full rounded-lg border border-[var(--border)] bg-[#090f0c] p-4 font-sans text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                value={lineupShareText}
                onChange={(e) => setLineupShareText(e.target.value)}
                aria-label="Texto da escalação para compartilhar"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(lineupShareText);
                    setCopyMsg("Escalação copiada!");
                    setTimeout(() => setCopyMsg(""), 2500);
                  }}
                >
                  📋 Copiar texto
                </Button>
                <Button
                  onClick={() => {
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(lineupShareText)}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                >
                  📱 Enviar no WhatsApp
                </Button>
                <Button variant="ghost" onClick={() => setLineupShareText(buildLineupShareText())}>
                  🔄 Regenerar
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <SuggestedLineupCard
        loading={lineupLoading}
        error={lineupError}
        lineup={lineupData?.lineup ?? null}
        generatedAt={lineupData?.generatedAt ?? null}
        onRefresh={() => fetchLineup({ refresh: true })}
        canRefresh={!lineupRefreshing}
        onSaveLineup={handleSaveLineup}
        onResetSavedLineup={handleResetSavedLineup}
        saveLoading={lineupSaving}
        imageUrl={lineupData?.imageUrl ?? null}
      />
    </div>
  );
}
