"use client";

import React, { useState, useTransition } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RadarChart } from "@/components/ui/RadarChart";
import { Calendar, CheckCircle, XCircle, HelpCircle, Trophy, Goal, Activity, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface Team {
  id: string;
  name: string;
  badgeUrl?: string | null;
}

interface PlayerDashboardProps {
  team: Team;
  metrics: {
    rsvpRate: number;
    goals: number;
    assists: number;
    avgRating: number;
    pendingPaymentsAmount: number;
  };
  nextMatch: {
    id: string;
    date: Date;
    opponentName: string;
    venue: string;
  } | null;
  myRsvpStatus: "CONFIRMED" | "DECLINED" | "PENDING" | null;
  recentEvaluations: {
    id: string;
    date: Date;
    technical: number;
    tactical: number;
    physical: number;
    discipline: number;
    content: string;
  }[];
  pendingFinesAndFees: {
    id: string;
    description: string;
    amount: number;
    dueDate: Date;
  }[];
}

/**
 * Componente de painel para a função de Jogador (Centro do Atleta).
 */
export default function PlayerDashboard({
  team,
  metrics,
  nextMatch,
  myRsvpStatus: initialRsvp,
  recentEvaluations,
  pendingFinesAndFees,
}: PlayerDashboardProps) {
  const [rsvpStatus, setRsvpStatus] = useState(initialRsvp);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(date));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const handleRsvp = (status: "CONFIRMED" | "DECLINED" | "PENDING") => {
    startTransition(() => {
      // Simulação de action/fetch
      setRsvpStatus(status);
      toast("Presença atualizada com sucesso.", "success");
    });
  };

  // Prepara dados para o RadarChart usando a avaliação mais recente, se houver
  const latestEval = recentEvaluations[0];
  const radarData = latestEval
    ? {
        technical: latestEval.technical,
        tactical: latestEval.tactical,
        physical: latestEval.physical,
        discipline: latestEval.discipline,
      }
    : { technical: 0, tactical: 0, physical: 0, discipline: 0 };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Centro do Atleta" 
        description={`Suas estatísticas e compromissos pelo ${team.name}`} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Presença"
          value={`${metrics.rsvpRate}%`}
          icon={<Activity className="w-5 h-5" />}
        />
        <StatCard
          title="Meus Gols"
          value={metrics.goals.toString()}
          icon={<Goal className="w-5 h-5" />}
        />
        <StatCard
          title="Minha Nota (Média)"
          value={metrics.avgRating.toFixed(1)}
          icon={<Trophy className="w-5 h-5" />}
        />
        <StatCard
          title="Pendências"
          value={formatCurrency(metrics.pendingPaymentsAmount)}
          icon={<DollarSign className="w-5 h-5 text-[var(--danger)]" />}
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
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-12 h-12 text-[var(--brand)]" />
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--text)]">{nextMatch.opponentName}</h3>
                      <p className="text-[var(--text-muted)]">{formatDate(nextMatch.date)} - {nextMatch.venue}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-[var(--border)]">
                    <p className="mb-4 font-medium">Você vai para o jogo?</p>
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => handleRsvp("CONFIRMED")} 
                        disabled={isPending}
                        className={`flex-1 ${rsvpStatus === "CONFIRMED" ? "bg-green-600 hover:bg-green-700" : "bg-green-600/20 text-green-500 hover:bg-green-600/30"}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Vou
                      </Button>
                      <Button 
                        onClick={() => handleRsvp("DECLINED")} 
                        disabled={isPending}
                        className={`flex-1 ${rsvpStatus === "DECLINED" ? "bg-red-600 hover:bg-red-700" : "bg-red-600/20 text-red-500 hover:bg-red-600/30"}`}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Não Vou
                      </Button>
                      <Button 
                        onClick={() => handleRsvp("PENDING")} 
                        disabled={isPending}
                        className={`flex-1 ${rsvpStatus === "PENDING" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/30"}`}
                      >
                        <HelpCircle className="w-4 h-4 mr-2" /> Dúvida
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState icon={Calendar} title="Sem compromissos" description="Nenhuma partida agendada no momento." />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Última Avaliação de Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              {latestEval ? (
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/2 h-64">
                    <RadarChart data={radarData} />
                  </div>
                  <div className="w-full md:w-1/2 space-y-4">
                    <h4 className="font-semibold text-lg">Comentário do Treinador:</h4>
                    <p className="text-[var(--text-muted)] italic">"{latestEval.content}"</p>
                    <p className="text-sm text-[var(--text-muted)] text-right">- {new Date(latestEval.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              ) : (
                <EmptyState icon={Activity} title="Sem avaliações" description="Você ainda não foi avaliado pelo treinador." />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Obrigações Financeiras</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingFinesAndFees.length === 0 ? (
                <EmptyState icon={CheckCircle} title="Tudo em dia!" description="Você não possui pendências financeiras." />
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {pendingFinesAndFees.map(item => (
                    <li key={item.id} className="py-4 flex flex-col gap-1">
                      <div className="flex justify-between font-medium">
                        <span>{item.description}</span>
                        <span className="text-[var(--danger)]">{formatCurrency(item.amount)}</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">
                        Vencimento: {new Date(item.dueDate).toLocaleDateString("pt-BR")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
