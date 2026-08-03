"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Shield, ClipboardList, CheckCircle2, Clock, Calendar, ChevronRight, UserCheck, AlertCircle } from "lucide-react";
import { formatDateOnly } from "@/lib/utils";

interface MatchReportItem {
  matchId: string;
  date: string;
  opponent: string;
  isHome: boolean;
  opponentBadgeUrl: string | null;
  type: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  coachPlayerId: string | null;
  coachPlayer: {
    id: string;
    name: string;
    fullName: string | null;
    photoUrl: string | null;
    shirtNumber: number;
    position: string;
  } | null;
  reportStatus: "PUBLISHED" | "DRAFT" | "PENDING";
  evaluationsCount: number;
  participantsCount: number;
  canEdit: boolean;
  updatedAt: string | null;
}

export default function CoachReportsHubPage() {
  const [reports, setReports] = useState<MatchReportItem[]>([]);
  const [canManageCoach, setCanManageCoach] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PUBLISHED" | "PENDING" | "MY_COACH">("ALL");

  const loadReports = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/coach-reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data.matches || []);
        setCanManageCoach(data.canManageCoach ?? false);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Acesso restrito à central de relatórios dos treinadores.");
      }
    } catch {
      setErrorMsg("Erro de conexão ao carregar relatórios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const filteredReports = reports.filter((m) => {
    if (filter === "PUBLISHED") return m.reportStatus === "PUBLISHED";
    if (filter === "PENDING") return m.reportStatus === "PENDING" || m.reportStatus === "DRAFT";
    if (filter === "MY_COACH") return m.canEdit;
    return true;
  });

  const totalMatches = reports.length;
  const publishedCount = reports.filter((r) => r.reportStatus === "PUBLISHED").length;
  const pendingCount = reports.filter((r) => r.reportStatus !== "PUBLISHED").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <Card className="border-red-500/20 bg-red-500/5 p-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-red-400">Acesso Restrito</h2>
        <p className="text-sm text-[var(--text-subtle)] mt-1">{errorMsg}</p>
        <div className="mt-4">
          <Link href="/dashboard">
            <Button variant="secondary">Voltar ao Painel</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Central de Relatórios dos Jogos
            </h1>
            <p className="text-xs text-[#8fa39b] mt-0.5">
              Análises táticas pós-jogo, estratégias titulares, leitura de substituições e avaliações dos atletas emitidas pelos treinadores.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-white/10 bg-white/[0.02]">
          <span className="block text-xs font-bold text-[#8fa39b]">Total de Partidas</span>
          <span className="block text-2xl font-black text-white mt-1">{totalMatches}</span>
        </Card>
        <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
          <span className="block text-xs font-bold text-emerald-400">Relatórios Concluídos</span>
          <span className="block text-2xl font-black text-emerald-400 mt-1">{publishedCount}</span>
        </Card>
        <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
          <span className="block text-xs font-bold text-yellow-400">Pendentes / Em Rascunho</span>
          <span className="block text-2xl font-black text-yellow-400 mt-1">{pendingCount}</span>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "ALL"
              ? "bg-[#10b981] text-black font-black"
              : "bg-white/5 text-[#8fa39b] hover:bg-white/10 hover:text-white"
          }`}
        >
          Todas as Partidas ({reports.length})
        </button>
        <button
          onClick={() => setFilter("PUBLISHED")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "PUBLISHED"
              ? "bg-[#10b981] text-black font-black"
              : "bg-white/5 text-[#8fa39b] hover:bg-white/10 hover:text-white"
          }`}
        >
          🟢 Concluídos ({publishedCount})
        </button>
        <button
          onClick={() => setFilter("PENDING")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "PENDING"
              ? "bg-[#10b981] text-black font-black"
              : "bg-white/5 text-[#8fa39b] hover:bg-white/10 hover:text-white"
          }`}
        >
          🟡 Pendentes ({pendingCount})
        </button>
        <button
          onClick={() => setFilter("MY_COACH")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "MY_COACH"
              ? "bg-[#10b981] text-black font-black"
              : "bg-white/5 text-[#8fa39b] hover:bg-white/10 hover:text-white"
          }`}
        >
          👔 Onde Sou Treinador
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <Card className="p-8 text-center text-xs text-[#8fa39b] italic">
            Nenhuma partida encontrada para este filtro.
          </Card>
        ) : (
          filteredReports.map((m) => {
            const isCompleted = m.status === "COMPLETED";
            const dateFormatted = new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "America/Sao_Paulo",
            }).format(new Date(m.date));

            return (
              <Card
                key={m.matchId}
                className="hover:border-emerald-500/30 transition-all duration-200 overflow-hidden"
              >
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">vs {m.opponent}</span>
                      <Badge variant="default">
                        {m.isHome ? "🏠 Casa" : "✈️ Visitante"}
                      </Badge>
                      <Badge variant={isCompleted ? "success" : "info"}>
                        {isCompleted ? "Finalizada" : "Agendada"}
                      </Badge>
                      {m.reportStatus === "PUBLISHED" ? (
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-400">
                          🟢 Relatório Concluído
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 text-[10px] font-black text-yellow-400">
                          ⏳ Relatório Pendente
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#8fa39b] flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {dateFormatted}
                    </p>

                    {/* Treinador Responsável */}
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-[#8fa39b]">Treinador:</span>
                      {m.coachPlayer ? (
                        <span className="font-bold text-white">
                          #{m.coachPlayer.shirtNumber} - {m.coachPlayer.name}
                        </span>
                      ) : (
                        <span className="text-yellow-400 font-semibold italic">
                          Ainda não designado pelo Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link href={`/dashboard/matches/${m.matchId}?section=coach_report`}>
                      <Button
                        className={
                          m.canEdit
                            ? "bg-[#10b981] hover:bg-[#34d399] text-black font-bold text-xs"
                            : "bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                        }
                      >
                        {m.canEdit ? "✍️ Editar Relatório" : "📄 Ver Relatório Tático"}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
