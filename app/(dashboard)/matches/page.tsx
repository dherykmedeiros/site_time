"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";

const MatchForm = dynamic(
  () => import("@/components/forms/MatchForm").then((m) => ({ default: m.MatchForm })),
  { loading: () => <div className="p-4 text-center text-gray-500">Carregando formulário...</div> }
);

interface MatchSummary {
  id: string;
  date: string;
  venue: string;
  opponent: string;
  type: "FRIENDLY" | "CHAMPIONSHIP";
  homeScore: number | null;
  awayScore: number | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  shareToken: string;
  rsvpSummary: {
    confirmed: number;
    declined: number;
    pending: number;
  };
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  SCHEDULED: "Agendada",
  COMPLETED: "Finalizada",
  CANCELLED: "Cancelada",
};

const statusVariants: Record<string, "info" | "success" | "danger"> = {
  SCHEDULED: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};

const typeLabels: Record<string, string> = {
  FRIENDLY: "Amistoso",
  CHAMPIONSHIP: "Campeonato",
};

const statusFilterOptions = [
  { value: "ALL", label: "Todos os status" },
  { value: "SCHEDULED", label: "Agendadas" },
  { value: "COMPLETED", label: "Finalizadas" },
  { value: "CANCELLED", label: "Canceladas" },
];

const typeFilterOptions = [
  { value: "ALL", label: "Todos os tipos" },
  { value: "FRIENDLY", label: "Amistoso" },
  { value: "CHAMPIONSHIP", label: "Campeonato" },
];

function formatMatchDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (typeFilter !== "ALL") params.set("type", typeFilter);
      const qs = params.toString();
      const res = await fetch(`/api/matches${qs ? `?${qs}` : ""}`);
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Jogos</h1>
        <Button onClick={() => setShowAddModal(true)}>+ Agendar Partida</Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="w-48">
          <Select
            options={statusFilterOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select
            options={typeFilterOptions}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Match list */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="flex gap-2">
                  <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">Nenhuma partida encontrada.</p>
          <p className="mt-2 text-sm text-gray-400">
            Agende a primeira partida do time!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <Link key={match.id} href={`/matches/${match.id}`}>
              <Card className="p-4 transition-shadow hover:shadow-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        vs {match.opponent}
                      </span>
                      <Badge variant={statusVariants[match.status]}>
                        {statusLabels[match.status]}
                      </Badge>
                      <Badge variant="default">{typeLabels[match.type]}</Badge>
                    </div>
                    <div className="mt-1 flex gap-4 text-sm text-gray-500">
                      <span>📅 {formatMatchDate(match.date)}</span>
                      <span>📍 {match.venue}</span>
                    </div>
                    {match.status === "COMPLETED" &&
                      match.homeScore !== null &&
                      match.awayScore !== null && (
                        <div className="mt-1 text-sm font-medium text-gray-700">
                          Placar: {match.homeScore} x {match.awayScore}
                        </div>
                      )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-green-600">
                      ✅ {match.rsvpSummary.confirmed}
                    </span>
                    <span className="text-red-600">
                      ❌ {match.rsvpSummary.declined}
                    </span>
                    <span className="text-yellow-600">
                      ⏳ {match.rsvpSummary.pending}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Add match modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Agendar Partida"
      >
        <MatchForm
          onSuccess={() => {
            setShowAddModal(false);
            fetchMatches();
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
}
