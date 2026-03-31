"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

const PlayerForm = dynamic(
  () => import("@/components/forms/PlayerForm").then((m) => ({ default: m.PlayerForm })),
  { loading: () => <div className="p-4 text-center text-gray-500">Carregando formulário...</div> }
);

interface Player {
  id: string;
  name: string;
  position: string;
  shirtNumber: number;
  photoUrl: string | null;
  status: "ACTIVE" | "INACTIVE";
  hasAccount: boolean;
  createdAt: string;
}

const positionLabels: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  MIDFIELDER: "Meio-campista",
  FORWARD: "Atacante",
};

export default function SquadPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [inviteModal, setInviteModal] = useState<Player | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"delete" | "promote" | null>(null);
  const [actionPlayer, setActionPlayer] = useState<Player | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter !== "ALL" ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/players${params}`);
      if (res.ok) {
        const data = await res.json();
        setPlayers(data.players);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  async function handleDelete(player: Player) {
    const res = await fetch(`/api/players/${player.id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchPlayers();
      setFeedback(`${player.name} foi marcado como inativo.`);
    } else {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error || "Erro ao remover jogador");
    }
  }

  async function handlePromote(player: Player) {
    const res = await fetch(`/api/players/${player.id}/promote`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "ADMIN" }),
    });

    if (res.ok) {
      await fetchPlayers();
      setFeedback(`${player.name} foi promovido para Admin.`);
    } else {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error || "Erro ao promover jogador");
    }
  }

  async function handleConfirmAction() {
    if (!actionPlayer || !confirmAction) return;

    setActionLoading(true);
    setActionError(null);

    if (confirmAction === "delete") {
      await handleDelete(actionPlayer);
    } else {
      await handlePromote(actionPlayer);
    }

    setActionLoading(false);
    setConfirmAction(null);
    setActionPlayer(null);
  }

  async function handleInvite() {
    if (!inviteModal || !inviteEmail) return;

    setInviteLoading(true);
    setInviteMsg("");

    try {
      const res = await fetch("/api/players/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: inviteModal.id, email: inviteEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setInviteMsg(data.error || "Erro ao enviar convite");
        return;
      }

      setInviteMsg("Convite enviado com sucesso!");
      setTimeout(() => {
        setInviteModal(null);
        setInviteEmail("");
        setInviteMsg("");
      }, 1500);
    } catch {
      setInviteMsg("Erro de conexão");
    } finally {
      setInviteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[22px] border border-[#b7d8ce] bg-gradient-to-r from-[#e4f3ed] via-[#eff7ef] to-[#f7f1e7] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#2a6f60]">
            Gestao de atletas
          </p>
          <h1 className="text-2xl font-bold text-[var(--text)]">Elenco</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/squad/mensalidade"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            💰 Mensalidade
          </Link>
          <Button onClick={() => setShowAddModal(true)}>+ Adicionar Jogador</Button>
        </div>
      </div>

      {feedback && (
        <div className="rounded-[12px] border border-[#bde0d3] bg-[#e9f8f1] p-3 text-sm text-[#1d5f4f]">
          {feedback}
        </div>
      )}

      {actionError && (
        <div className="rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)]">
          {actionError}
        </div>
      )}

      {/* Filters */}
      <div className="app-surface flex flex-wrap gap-2 rounded-[16px] p-3">
        {["ALL", "ACTIVE", "INACTIVE"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              statusFilter === s
                ? "bg-[var(--brand)] text-white"
                : "bg-[#edf2ed] text-[var(--text-muted)] hover:bg-[#e1ebe1]"
            }`}
          >
            {s === "ALL" ? "Todos" : s === "ACTIVE" ? "Ativos" : "Inativos"}
          </button>
        ))}
      </div>

      {/* Player List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="app-surface flex items-center gap-4 rounded-[14px] p-4">
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : players.length === 0 ? (
        <Card className="rounded-[18px]">
          <div className="p-8 text-center text-[var(--text-muted)]">
            <p className="text-lg">Nenhum jogador cadastrado</p>
            <p className="mt-1 text-sm">Adicione jogadores ao elenco para começar.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {players.map((player) => (
            <Card key={player.id} className="rounded-[18px]">
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {player.photoUrl ? (
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-lg font-bold text-white">
                      {player.shirtNumber}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--text)]">
                      {player.name}{" "}
                      <span className="text-sm font-normal text-[var(--text-muted)]">
                        #{player.shirtNumber}
                      </span>
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {positionLabels[player.position] || player.position}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2 sm:hidden">
                      <Badge variant={player.status === "ACTIVE" ? "success" : "warning"}>
                        {player.status === "ACTIVE" ? "Ativo" : "Inativo"}
                      </Badge>
                      {player.hasAccount && (
                        <Badge variant="info">Conta vinculada</Badge>
                      )}
                    </div>
                  </div>
                  <div className="hidden gap-2 sm:flex">
                    <Badge variant={player.status === "ACTIVE" ? "success" : "warning"}>
                      {player.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    </Badge>
                    {player.hasAccount && (
                      <Badge variant="info">Conta vinculada</Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!player.hasAccount && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setInviteModal(player);
                        setInviteEmail("");
                        setInviteMsg("");
                      }}
                    >
                      Convidar
                    </Button>
                  )}
                  {player.hasAccount && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActionPlayer(player);
                        setConfirmAction("promote");
                        setActionError(null);
                      }}
                    >
                      Promover
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingPlayer(player)}
                  >
                    Editar
                  </Button>
                  {player.status === "ACTIVE" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setActionPlayer(player);
                        setConfirmAction("delete");
                        setActionError(null);
                      }}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Player Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Adicionar Jogador"
      >
        <PlayerForm
          onSuccess={() => {
            setShowAddModal(false);
            fetchPlayers();
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Player Modal */}
      <Modal
        open={!!editingPlayer}
        onClose={() => setEditingPlayer(null)}
        title="Editar Jogador"
      >
        {editingPlayer && (
          <PlayerForm
            defaultValues={{
              id: editingPlayer.id,
              name: editingPlayer.name,
              position: editingPlayer.position,
              shirtNumber: editingPlayer.shirtNumber,
              status: editingPlayer.status,
            }}
            onSuccess={() => {
              setEditingPlayer(null);
              fetchPlayers();
            }}
            onCancel={() => setEditingPlayer(null)}
          />
        )}
      </Modal>

      {/* Invite Modal */}
      <Modal
        open={!!inviteModal}
        onClose={() => setInviteModal(null)}
        title={`Convidar ${inviteModal?.name ?? "Jogador"}`}
      >
        <div className="space-y-4">
          {inviteMsg && (
            <div
              className={`rounded-md p-3 text-sm ${
                inviteMsg.includes("sucesso")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {inviteMsg}
            </div>
          )}
          <div>
            <label htmlFor="inviteEmail" className="mb-1 block text-sm font-medium text-gray-700">
              E-mail do jogador
            </label>
            <Input
              id="inviteEmail"
              type="email"
              placeholder="jogador@email.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleInvite} disabled={inviteLoading || !inviteEmail}>
              {inviteLoading ? "Enviando..." : "Enviar Convite"}
            </Button>
            <Button variant="secondary" onClick={() => setInviteModal(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!confirmAction && !!actionPlayer}
        onClose={() => {
          if (actionLoading) return;
          setConfirmAction(null);
          setActionPlayer(null);
        }}
        title={confirmAction === "delete" ? "Remover jogador" : "Promover jogador"}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {confirmAction === "delete"
              ? `Remover ${actionPlayer?.name} do elenco? O jogador será marcado como inativo.`
              : `Promover ${actionPlayer?.name} para Admin (Diretoria)?`}
          </p>
          <div className="flex gap-3">
            <Button
              variant={confirmAction === "delete" ? "danger" : "primary"}
              onClick={handleConfirmAction}
              disabled={actionLoading}
            >
              {actionLoading ? "Processando..." : "Confirmar"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmAction(null);
                setActionPlayer(null);
              }}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
