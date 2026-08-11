"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useSession } from "next-auth/react";

interface FriendlyRequest {
  id: string;
  requesterTeamName: string;
  contactEmail: string;
  contactPhone: string | null;
  suggestedDates: string;
  suggestedVenue: string | null;
  proposedFee: number | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requesterTeamId?: string | null;
  requesterTeam?: {
    id: string;
    name: string;
    slug: string;
    badgeUrl: string | null;
    city: string | null;
    region: string | null;
  } | null;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
};

const statusVariants: Record<string, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

const filterOptions = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Pendentes" },
  { value: "APPROVED", label: "Aprovados" },
  { value: "REJECTED", label: "Rejeitados" },
];

export default function FriendlyRequestsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [requests, setRequests] = useState<FriendlyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  // Action modal
  const [selectedRequest, setSelectedRequest] = useState<FriendlyRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [matchDate, setMatchDate] = useState("");
  const [matchVenue, setMatchVenue] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  async function loadRequests() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/friendly-requests?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAction() {
    if (!selectedRequest || !actionType) return;
    setActionLoading(true);
    setActionError("");

    try {
      const body: Record<string, string> = { action: actionType };
      if (actionType === "approve") {
        if (matchDate) body.matchDate = new Date(matchDate).toISOString();
        if (matchVenue) body.matchVenue = matchVenue;
      } else {
        body.rejectionReason = rejectionReason;
      }

      const res = await fetch(`/api/friendly-requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao processar");
      }

      closeModal();
      loadRequests();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Erro ao processar");
    } finally {
      setActionLoading(false);
    }
  }

  function openApproveModal(req: FriendlyRequest) {
    setSelectedRequest(req);
    setActionType("approve");
    setMatchDate("");
    setMatchVenue(req.suggestedVenue || "");
    setActionError("");
  }

  function openRejectModal(req: FriendlyRequest) {
    setSelectedRequest(req);
    setActionType("reject");
    setRejectionReason("");
    setActionError("");
  }

  function closeModal() {
    setSelectedRequest(null);
    setActionType(null);
    setActionError("");
  }

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[22px] border border-[rgba(16,185,129,0.18)] bg-[rgba(10,24,20,0.4)] p-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Relacionamento entre Times
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Solicitações de Amistoso</h1>
        </div>
      </div>

      {/* Filter */}
      <div className="app-surface w-full max-w-xs rounded-[16px] p-4">
        <Select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={filterOptions}
        />
      </div>

      {/* List */}
      {loading ? (
        <p className="text-center text-[var(--text-muted)]">Carregando...</p>
      ) : requests.length === 0 ? (
        <Card className="rounded-[18px]">
          <CardContent className="py-12 text-center">
            <p className="text-[var(--text-muted)]">Nenhuma solicitação encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} className="rounded-[18px]">
              <CardContent className="py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-[var(--text)]">
                        {req.requesterTeamName}
                      </h3>
                      <Badge variant={statusVariants[req.status]}>
                        {statusLabels[req.status]}
                      </Badge>

                      {req.requesterTeam && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">
                          🛡️ Time Cadastrado no VARzea
                        </span>
                      )}
                    </div>

                    {req.requesterTeam && (
                      <p className="text-xs text-emerald-400/90 font-mono font-semibold pt-0.5">
                        📍 {req.requesterTeam.city || "Cidade N/I"} {req.requesterTeam.region ? `(${req.requesterTeam.region})` : ""} ·{" "}
                        <a
                          href={`/${req.requesterTeam.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:text-emerald-300"
                        >
                          Ver Arena do Clube ↗
                        </a>
                      </p>
                    )}

                    <p className="text-sm text-[var(--text-muted)]">
                      📧 {req.contactEmail}
                      {req.contactPhone && ` • 📞 ${req.contactPhone}`}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      📅 {req.suggestedDates}
                    </p>
                    {req.suggestedVenue && (
                      <p className="text-sm text-[var(--text-muted)]">
                        📍 {req.suggestedVenue}
                      </p>
                    )}
                    {req.proposedFee != null && (
                      <p className="text-sm text-[var(--text-muted)]">
                        💰 R$ {req.proposedFee.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xs text-[var(--text-muted)]/85">
                      Recebido em{" "}
                      {new Date(req.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  {isAdmin && req.status === "PENDING" && (
                    <div className="flex gap-2 self-start">
                      <Button
                        size="sm"
                        onClick={() => openApproveModal(req)}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => openRejectModal(req)}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Approve Modal */}
      <Modal
        open={isAdmin && actionType === "approve"}
        onClose={closeModal}
        title="Aprovar Amistoso"
      >
        <div className="space-y-4">
          {actionError && (
            <p className="rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)]">{actionError}</p>
          )}
          {selectedRequest?.requesterTeam ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-mono">
              ⚡ <strong>TIME CADASTRADO NO VARZEA!</strong>
              <p className="mt-1">
                Ao aprovar, a partida será agendada automaticamente nos calendários do <strong>{session?.user?.teamId ? "seu time" : "time anfitrião"}</strong> e do <strong>{selectedRequest.requesterTeamName}</strong>, criando convocações (RSVP) para os elencos de ambos os clubes.
              </p>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              Ao aprovar, uma partida será criada automaticamente no calendário do time.
            </p>
          )}
          <Input
            label="Data da Partida"
            type="datetime-local"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
          />
          <Input
            label="Local Confirmado"
            value={matchVenue}
            onChange={(e) => setMatchVenue(e.target.value)}
            placeholder="Local da partida"
          />
          <div className="flex gap-2">
            <Button onClick={handleAction} disabled={actionLoading}>
              {actionLoading ? "Processando..." : "Confirmar Aprovação"}
            </Button>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        open={isAdmin && actionType === "reject"}
        onClose={closeModal}
        title="Rejeitar Amistoso"
      >
        <div className="space-y-4">
          {actionError && (
            <p className="rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)]">{actionError}</p>
          )}
          <Textarea
            label="Motivo da rejeição"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Informe o motivo..."
          />
          <div className="flex gap-2">
            <Button
              variant="danger"
              onClick={handleAction}
              disabled={actionLoading}
            >
              {actionLoading ? "Processando..." : "Confirmar Rejeição"}
            </Button>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
