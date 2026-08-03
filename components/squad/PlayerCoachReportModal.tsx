"use client";

import React, { useState, useEffect } from "react";
import { Shield, Star, X, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PlayerCoachReportModalProps {
  matchId: string | null;
  onClose: () => void;
}

interface EvaluationData {
  matchId: string;
  opponent: string;
  date: string;
  isHome: boolean;
  homeScore: number | null;
  awayScore: number | null;
  coachName: string;
  coachFullName: string | null;
  coachPhotoUrl: string | null;
  rating: number;
  feedback: string;
}

export function PlayerCoachReportModal({ matchId, onClose }: PlayerCoachReportModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<EvaluationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;

    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);

    fetch(`/api/players/me/coach-evaluations/${matchId}`)
      .then(async (res) => {
        if (res.ok) {
          const json = await res.json();
          if (isMounted) setData(json);
        } else {
          const err = await res.json().catch(() => ({}));
          if (isMounted) setErrorMsg(err.error || "Parecer do treinador não disponível para esta partida.");
        }
      })
      .catch(() => {
        if (isMounted) setErrorMsg("Erro de conexão ao buscar parecer do treinador.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [matchId]);

  if (!matchId) return null;

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 9) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (rating >= 7) return "bg-green-500/10 text-green-400 border-green-500/30";
    if (rating >= 5) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/10 text-red-400 border-red-500/30";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#16130f] p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Parecer Individual do Treinador</h3>
              <p className="text-[11px] text-[#8fa39b] flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-400" /> Acesso individual restrito a você
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#8fa39b] hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-8 text-center text-xs text-[#8fa39b] font-medium animate-pulse">
            Carregando sua avaliação individual...
          </div>
        ) : errorMsg ? (
          <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-center text-xs text-yellow-400 space-y-2">
            <AlertCircle className="h-6 w-6 mx-auto" />
            <p>{errorMsg}</p>
          </div>
        ) : data ? (
          <div className="space-y-4">
            {/* Informações da Partida */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <div>
                <span className="text-xs font-bold text-white block">
                  {data.isHome ? "vs" : "@"} {data.opponent}
                </span>
                <span className="text-[10px] text-[#8fa39b]">
                  {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(data.date))}
                </span>
              </div>

              {data.homeScore != null && data.awayScore != null && (
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-black text-white">
                  {data.homeScore} x {data.awayScore}
                </span>
              )}
            </div>

            {/* Treinador Responsável */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400 overflow-hidden">
                  {data.coachPhotoUrl ? (
                    <img src={data.coachPhotoUrl} alt={data.coachName} className="h-full w-full object-cover" />
                  ) : (
                    data.coachName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider block">
                    Treinador Responsável
                  </span>
                  <span className="text-xs font-bold text-white">{data.coachName}</span>
                </div>
              </div>

              {/* Sua Nota */}
              <div className="text-right">
                <span className="text-[9px] font-black uppercase text-[#8fa39b] tracking-wider block">
                  Sua Nota
                </span>
                <span className={`px-2.5 py-0.5 rounded-md border font-black text-xs inline-block ${getRatingBadgeColor(data.rating)}`}>
                  {data.rating} ⭐
                </span>
              </div>
            </div>

            {/* Parecer Individual do Treinador */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white block">
                Parecer do Treinador Sobre Sua Atuação:
              </label>
              <div className="p-4 rounded-xl border border-white/10 bg-black/40 text-xs text-[var(--text)] leading-relaxed italic">
                "{data.feedback}"
              </div>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <Button onClick={onClose} variant="secondary" className="text-xs font-bold px-5">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
