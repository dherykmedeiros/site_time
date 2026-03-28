"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { formatCurrency } from "@/lib/utils";
import { CardSkeleton, TableSkeleton } from "@/components/ui/Skeleton";

const RankingTable = dynamic(
  () => import("@/components/dashboard/RankingTable").then((m) => ({ default: m.RankingTable })),
  { loading: () => <TableSkeleton rows={5} /> }
);

interface TeamOverview {
  id: string;
  name: string;
  slug: string;
  badgeUrl: string | null;
  primaryColor: string | null;
  _count: {
    players: number;
    matches: number;
  };
}

interface RankingsData {
  rankings: {
    topScorers?: Array<{ playerId: string; playerName: string; total: number }>;
    topAssisters?: Array<{ playerId: string; playerName: string; total: number }>;
    mostCards?: Array<{ playerId: string; playerName: string; yellowCards: number; redCards: number }>;
  };
  teamRecord: {
    totalMatches: number;
    wins: number;
    draws: number;
    losses: number;
    winRate: number;
    goalsScored: number;
    goalsConceded: number;
  };
}

export default function DashboardHomePage() {
  const [team, setTeam] = useState<TeamOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTeam, setHasTeam] = useState(true);
  const [rankings, setRankings] = useState<RankingsData | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/teams");
        if (res.status === 404) {
          setHasTeam(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setTeam(data);

          // Load rankings and balance in parallel
          const [rankingsRes, financeRes] = await Promise.all([
            fetch("/api/stats/rankings?limit=5").catch(() => null),
            fetch("/api/finances?limit=1").catch(() => null),
          ]);

          if (rankingsRes?.ok) {
            setRankings(await rankingsRes.json());
          }
          if (financeRes?.ok) {
            const finData = await financeRes.json();
            setBalance(finData.balance);
          }
        }
      } catch {
        setHasTeam(false);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 animate-pulse rounded-lg bg-gray-200" />
          <div>
            <div className="mb-2 h-6 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <TableSkeleton rows={5} />
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  if (!hasTeam || !team) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo ao Site Time!</h1>
        <p className="mt-2 text-gray-600">
          Você ainda não criou um time. Configure seu time para começar.
        </p>
        <Link href="/team/settings">
          <Button className="mt-6">Criar Time</Button>
        </Link>
      </div>
    );
  }

  const record = rankings?.teamRecord;

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="flex items-center gap-4">
        {team.badgeUrl ? (
          <img
            src={team.badgeUrl}
            alt={`Escudo ${team.name}`}
            className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
          />
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-lg text-2xl text-white"
            style={{ backgroundColor: team.primaryColor || "#1e40af" }}
          >
            ⚽
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
          <a
            href={`/vitrine/${team.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Ver Vitrine Pública
          </a>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Jogadores"
          value={team._count.players}
          icon="👥"
          color="blue"
        />
        <StatsCard
          label="Partidas"
          value={team._count.matches}
          icon="⚽"
          color="green"
        />
        <StatsCard
          label="Aproveitamento"
          value={record ? `${record.winRate}%` : "—"}
          icon="📊"
          color="purple"
          sublabel={
            record
              ? `${record.wins}V ${record.draws}E ${record.losses}D`
              : undefined
          }
        />
        <StatsCard
          label="Saldo Caixinha"
          value={balance != null ? formatCurrency(balance) : "—"}
          icon="💰"
          color={balance != null && balance >= 0 ? "green" : "red"}
        />
      </div>

      {/* Team Record */}
      {record && record.totalMatches > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Retrospecto do Time
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{record.wins}</p>
                <p className="text-xs text-gray-500">Vitórias</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{record.draws}</p>
                <p className="text-xs text-gray-500">Empates</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{record.losses}</p>
                <p className="text-xs text-gray-500">Derrotas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {record.goalsScored} : {record.goalsConceded}
                </p>
                <p className="text-xs text-gray-500">Gols (Pró : Contra)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rankings */}
      {rankings && (
        <div className="grid gap-6 lg:grid-cols-2">
          {rankings.rankings.topScorers && rankings.rankings.topScorers.length > 0 && (
            <RankingTable
              title="🥇 Artilheiros"
              data={rankings.rankings.topScorers}
              type="goals"
            />
          )}
          {rankings.rankings.topAssisters && rankings.rankings.topAssisters.length > 0 && (
            <RankingTable
              title="🅰️ Assistências"
              data={rankings.rankings.topAssisters}
              type="assists"
            />
          )}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/squad">
              <Button variant="secondary">👥 Gerenciar Elenco</Button>
            </Link>
            <Link href="/matches">
              <Button variant="secondary">⚽ Ver Partidas</Button>
            </Link>
            <Link href="/finances">
              <Button variant="secondary">💰 Finanças</Button>
            </Link>
            <Link href="/friendly-requests">
              <Button variant="secondary">🤝 Amistosos</Button>
            </Link>
            <Link href="/team/settings">
              <Button variant="secondary">⚙️ Configurações</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
