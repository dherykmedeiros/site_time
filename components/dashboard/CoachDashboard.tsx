"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Percent, Goal, Shield, ClipboardCheck, Calendar } from "lucide-react";
import { ActivityTimeline } from "./ActivityTimeline";

interface Team {
  id: string;
  name: string;
  badgeUrl?: string | null;
}

interface CoachDashboardProps {
  team: Team;
  metrics: {
    winRate: number;
    avgGoalsScored: number;
    avgGoalsConceded: number;
    pendingEvaluationsCount: number;
  };
  nextMatch: {
    id: string;
    date: Date;
    opponentName: string;
    venue: string;
    type: string;
  } | null;
  rsvpSummary: {
    confirmed: number;
    declined: number;
    tentative: number;
    noResponse: number;
    list: any[];
  };
  performanceHistory: ("W" | "D" | "L")[];
  topScorers: { playerName: string; total: number }[];
  topAssisters: { playerName: string; total: number }[];
}

/**
 * Componente de painel para a função de Treinador.
 */
export default function CoachDashboard({
  team,
  metrics,
  nextMatch,
  rsvpSummary,
  performanceHistory,
  topScorers,
  topAssisters,
}: CoachDashboardProps) {
  const [activeTab, setActiveTab] = useState("scorers");

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(date));
  };

  const getFormGuideColor = (result: "W" | "D" | "L") => {
    switch (result) {
      case "W": return "bg-green-500 text-white";
      case "D": return "bg-yellow-500 text-white";
      case "L": return "bg-red-500 text-white";
    }
  };

  const getFormGuideLabel = (result: "W" | "D" | "L") => {
    switch (result) {
      case "W": return "V";
      case "D": return "E";
      case "L": return "D";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Painel do Treinador" 
        description={`Gestão tática e técnica do time ${team.name}`} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Aproveitamento"
          value={`${metrics.winRate}%`}
          icon={<Percent className="w-5 h-5" />}
        />
        <StatCard
          title="Média Gols Marcados"
          value={metrics.avgGoalsScored.toFixed(1)}
          icon={<Goal className="w-5 h-5" />}
        />
        <StatCard
          title="Média Gols Sofridos"
          value={metrics.avgGoalsConceded.toFixed(1)}
          icon={<Shield className="w-5 h-5" />}
        />
        <StatCard
          title="Avaliações Pendentes"
          value={metrics.pendingEvaluationsCount.toString()}
          icon={<ClipboardCheck className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Próxima Partida</CardTitle>
            </CardHeader>
            <CardContent>
              {nextMatch ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-[var(--border)] pb-4">
                    <Calendar className="w-10 h-10 text-[var(--brand)]" />
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text)]">{nextMatch.opponentName}</h3>
                      <p className="text-sm text-[var(--text-muted)]">{formatDate(nextMatch.date)} - {nextMatch.venue}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Presenças (RSVP)</h4>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center p-3 bg-[var(--bg-elevated)] rounded-xl flex-1 border border-[var(--border)]">
                        <span className="text-2xl font-bold text-green-500">{rsvpSummary.confirmed}</span>
                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Confirmados</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-[var(--bg-elevated)] rounded-xl flex-1 border border-[var(--border)]">
                        <span className="text-2xl font-bold text-red-500">{rsvpSummary.declined}</span>
                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Ausentes</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-[var(--bg-elevated)] rounded-xl flex-1 border border-[var(--border)]">
                        <span className="text-2xl font-bold text-yellow-500">{rsvpSummary.tentative}</span>
                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Dúvida</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-[var(--text-muted)]">Nenhuma partida agendada.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retrospecto Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-center">
                {performanceHistory.length > 0 ? (
                  performanceHistory.map((result, idx) => (
                    <div key={idx} className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm ${getFormGuideColor(result)}`}>
                      {getFormGuideLabel(result)}
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-[var(--text-muted)]">Nenhum histórico recente.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Destaques do Elenco</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="scorers">Artilharia</TabsTrigger>
                  <TabsTrigger value="assisters">Assistências</TabsTrigger>
                </TabsList>
                <TabsContent value="scorers" className="mt-4 space-y-4">
                  {topScorers.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] text-center">Nenhum dado disponível.</p>
                  ) : (
                    <ul className="space-y-3">
                      {topScorers.map((player, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-[var(--bg-elevated)] p-3 rounded-lg border border-[var(--border)]">
                          <span className="font-medium text-[var(--text)]">{player.playerName}</span>
                          <span className="font-bold text-[var(--brand)]">{player.total} gols</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
                <TabsContent value="assisters" className="mt-4 space-y-4">
                  {topAssisters.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] text-center">Nenhum dado disponível.</p>
                  ) : (
                    <ul className="space-y-3">
                      {topAssisters.map((player, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-[var(--bg-elevated)] p-3 rounded-lg border border-[var(--border)]">
                          <span className="font-medium text-[var(--text)]">{player.playerName}</span>
                          <span className="font-bold text-[var(--brand)]">{player.total} assist.</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}
