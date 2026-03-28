"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface FriendlyRequest {
  id: string;
  requesterTeamName: string;
  contactEmail: string;
  contactPhone: string | null;
  suggestedDates: string;
  suggestedVenue: string | null;
  proposedFee: number | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Solicitações de Amistoso
        </h1>
      </div>

      {/* Filter */}
      <div className="w-48">
        <Select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={filterOptions}
        />
      </div>

      {/* List */}
      {loading ? (
        <p className="text-center text-gray-500">Carregando...</p>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nenhuma solicitação encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {req.requesterTeamName}
                      </h3>
                      <Badge variant={statusVariants[req.status]}>
                        {statusLabels[req.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      📧 {req.contactEmail}
                      {req.contactPhone && ` • 📞 ${req.contactPhone}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      📅 {req.suggestedDates}
                    </p>
                    {req.suggestedVenue && (
                      <p className="text-sm text-gray-600">
                        📍 {req.suggestedVenue}
                      </p>
                    )}
                    {req.proposedFee != null && (
                      <p className="text-sm text-gray-600">
                        💰 R$ {req.proposedFee.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Recebido em{" "}
                      {new Date(req.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  {req.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => openApproveModal(req)}
                      >
                        ✅ Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => openRejectModal(req)}
                      >
                        ❌ Rejeitar
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
        open={actionType === "approve"}
        onClose={closeModal}
        title="Aprovar Amistoso"
      >
        <div className="space-y-4">
          {actionError && (
            <p className="text-sm text-red-600">{actionError}</p>
          )}
          <p className="text-sm text-gray-600">
            Ao aprovar, uma partida será criada automaticamente no calendário do
            time.
          </p>
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
        open={actionType === "reject"}
        onClose={closeModal}
        title="Rejeitar Amistoso"
      >
        <div className="space-y-4">
          {actionError && (
            <p className="text-sm text-red-600">{actionError}</p>
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
