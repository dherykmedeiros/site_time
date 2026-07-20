"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PlayerSelfProfileForm } from "@/components/forms/PlayerSelfProfileForm";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { playerPositionLabels } from "@/lib/player-positions";

const PlayerForm = dynamic(
  () => import("@/components/forms/PlayerForm").then((m) => ({ default: m.PlayerForm })),
  { loading: () => <div className="p-4 text-center text-gray-500">Carregando formulário...</div> }
);

interface Player {
  id: string;
  name: string;
  position: string;
  secondaryPosition?: string | null;
  shirtNumber: number;
  photoUrl: string | null;
  status: "ACTIVE" | "INACTIVE";
  hasAccount: boolean;
  role?: "ADMIN" | "PLAYER" | "COACH" | "MATERIAL_DIRECTOR";
  createdAt: string;
}

interface ProfileTarget {
  id: string;
  name: string;
}

const positionLabels: Record<string, string> = playerPositionLabels;

export default function SquadPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isAdmin = role === "ADMIN";
  const isCoachOrAdmin = role === "ADMIN" || role === "COACH";

  const [players, setPlayers] = useState<Player[]>([]);
  const [selfPlayerId, setSelfPlayerId] = useState<string | null>(null);
  const [profileTarget, setProfileTarget] = useState<ProfileTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [inviteModal, setInviteModal] = useState<Player | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg] = useState("");
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"delete" | "promote" | "resetPassword" | null>(null);
  const [actionPlayer, setActionPlayer] = useState<Player | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "COACH" | "MATERIAL_DIRECTOR" | "PLAYER">("PLAYER");
  const [monthlyFeesEnabled, setMonthlyFeesEnabled] = useState(true);

  const roleLabels: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
    ADMIN: { label: "Admin", variant: "danger" },
    COACH: { label: "Técnico", variant: "warning" },
    MATERIAL_DIRECTOR: { label: "Dir. Material", variant: "info" },
  };

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

  useEffect(() => {
    let active = true;

    async function fetchOwnPlayer() {
      try {
        const res = await fetch("/api/players/me");
        if (!res.ok) return;

        const data = await res.json();
        if (active && data?.id) {
          setSelfPlayerId(data.id);
        }
      } catch {
        // ignore
      }
    }

    fetchOwnPlayer();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    async function loadTeamConfig() {
      try {
        const res = await fetch("/api/teams");
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.monthlyFeesEnabled === "boolean") {
            setMonthlyFeesEnabled(data.monthlyFeesEnabled);
          }
        }
      } catch {
        // ignore
      }
    }
    loadTeamConfig();
  }, []);

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

  async function handlePromote(player: Player, role: string) {
    const res = await fetch(`/api/players/${player.id}/promote`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    if (res.ok) {
      await fetchPlayers();
      setFeedback(`Nível de autorização de ${player.name} atualizado com sucesso.`);
    } else {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error || "Erro ao atualizar permissão");
    }
  }

  async function handleResetPassword(player: Player) {
    const res = await fetch(`/api/players/${player.id}/reset-password`, {
      method: "POST",
    });

    if (res.ok) {
      setFeedback(`Senha do jogador ${player.name} foi resetada para a senha padrão "123456" com sucesso.`);
    } else {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error || "Erro ao resetar senha");
    }
  }

  async function handleConfirmAction() {
    if (!actionPlayer || !confirmAction) return;

    setActionLoading(true);
    setActionError(null);

    if (confirmAction === "delete") {
      await handleDelete(actionPlayer);
    } else if (confirmAction === "resetPassword") {
      await handleResetPassword(actionPlayer);
    } else {
      await handlePromote(actionPlayer, selectedRole);
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

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[22px] border border-[rgba(16,185,129,0.18)] bg-[rgba(10,24,20,0.4)] p-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Gestão de Atletas
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Elenco</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {isCoachOrAdmin && (
            <>
              {monthlyFeesEnabled && (
                <Link
                  href="/dashboard/squad/mensalidade"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
                >
                  💰 Mensalidade
                </Link>
              )}
              <Button onClick={() => setShowAddModal(true)} className="rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[#010403] bg-[#10b981] hover:bg-[#34d399]">
                + Adicionar Jogador
              </Button>
            </>
          )}
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

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="app-surface flex flex-wrap gap-2 rounded-[16px] p-2">
          {["ALL", "ACTIVE", "INACTIVE"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                statusFilter === s
                  ? "bg-[var(--brand)] text-white"
                  : "bg-[var(--bg)] text-[var(--text-muted)] hover:bg-[var(--border)] border border-[var(--border)]"
              }`}
            >
              {s === "ALL" ? "Todos" : s === "ACTIVE" ? "Ativos" : "Inativos"}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 pl-9 text-xs font-bold text-[var(--text)] outline-none focus:border-[var(--brand)] transition-colors shadow-sm"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
        </div>
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
      ) : filteredPlayers.length === 0 ? (
        <Card className="rounded-[18px]">
          <div className="p-8 text-center text-[var(--text-muted)]">
            <p className="text-sm font-bold">Nenhum jogador encontrado</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]/80">Tente buscar por outro termo ou mude os filtros.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPlayers.map((player) => (
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
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-lg font-bold text-white uppercase">
                      {player.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--text)]">
                      {player.name}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {positionLabels[player.position] || player.position}
                      {player.secondaryPosition && (
                        <span className="ml-1 text-xs opacity-75 font-medium">
                          (Sec: {positionLabels[player.secondaryPosition] || player.secondaryPosition})
                        </span>
                      )}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2 sm:hidden">
                      <Badge variant={player.status === "ACTIVE" ? "success" : "warning"}>
                        {player.status === "ACTIVE" ? "Ativo" : "Inativo"}
                      </Badge>
                      {player.hasAccount && (
                        <Badge variant="info">Conta vinculada</Badge>
                      )}
                      {player.role && roleLabels[player.role] && (
                        <Badge variant={roleLabels[player.role].variant}>
                          {roleLabels[player.role].label}
                        </Badge>
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
                    {player.role && roleLabels[player.role] && (
                      <Badge variant={roleLabels[player.role].variant}>
                        {roleLabels[player.role].label}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {player.id === selfPlayerId && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setProfileTarget({ id: player.id, name: player.name })}
                      >
                        Meu perfil
                      </Button>
                      <Link
                        href="/dashboard/evaluations"
                        className="inline-flex items-center justify-center rounded-lg border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.08)] px-3 py-1.5 text-xs font-bold text-blue-400 transition hover:bg-[rgba(59,130,246,0.15)] hover:border-[rgba(59,130,246,0.5)]"
                      >
                        📈 Meu Feedback
                      </Link>
                    </>
                  )}
                  {/* Link to full individual profile page */}
                  <Link
                    href={`/dashboard/squad/${player.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] px-3 py-1.5 text-xs font-bold text-[#34d399] transition hover:bg-[rgba(16,185,129,0.15)] hover:border-[rgba(16,185,129,0.5)]"
                  >
                    🏅 Ver Perfil
                  </Link>
                  {isCoachOrAdmin && player.id !== selfPlayerId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setProfileTarget({ id: player.id, name: player.name })}
                    >
                      Perfil
                    </Button>
                  )}
                  {isCoachOrAdmin && !player.hasAccount && (
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
                  {isAdmin && player.hasAccount && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActionPlayer(player);
                          setConfirmAction("promote");
                          setSelectedRole(player.role || "PLAYER");
                          setActionError(null);
                        }}
                      >
                        Permissão
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-500 hover:text-amber-400"
                        onClick={() => {
                          setActionPlayer(player);
                          setConfirmAction("resetPassword");
                          setActionError(null);
                        }}
                      >
                        Resetar Senha
                      </Button>
                    </>
                  )}
                  {isCoachOrAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingPlayer(player)}
                    >
                      Editar
                    </Button>
                  )}
                  {isCoachOrAdmin && player.status === "ACTIVE" && (
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
        open={isCoachOrAdmin && showAddModal}
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
        open={isCoachOrAdmin && !!editingPlayer}
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
        open={isCoachOrAdmin && !!inviteModal}
        onClose={() => setInviteModal(null)}
        title={`Convidar ${inviteModal?.name ?? "Jogador"}`}
      >
        <div className="space-y-4">
          {inviteMsg && (
            <div
              className={`rounded-xl p-3 text-xs font-semibold border ${
                inviteMsg.includes("sucesso")
                  ? "bg-[rgba(16,185,129,0.1)] text-[#34d399] border-[rgba(16,185,129,0.2)]"
                  : "bg-[rgba(239,68,68,0.1)] text-[#f87171] border-[rgba(239,68,68,0.2)]"
              }`}
            >
              {inviteMsg}
            </div>
          )}
          <div>
            <label htmlFor="inviteEmail" className="mb-1 block text-sm font-semibold text-[#8fa39b]">
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
        open={!!profileTarget}
        onClose={() => setProfileTarget(null)}
        title={profileTarget?.id === selfPlayerId ? "Meu perfil" : `Perfil de ${profileTarget?.name ?? "jogador"}`}
        className="w-[min(94vw,720px)]"
      >
        {profileTarget ? (
          <PlayerSelfProfileForm
            playerId={profileTarget.id}
            canEdit={profileTarget.id === selfPlayerId}
          />
        ) : null}
      </Modal>

      <Modal
        open={((confirmAction === "promote" ? isAdmin : confirmAction === "resetPassword" ? isAdmin : isCoachOrAdmin)) && !!confirmAction && !!actionPlayer}
        onClose={() => {
          if (actionLoading) return;
          setConfirmAction(null);
          setActionPlayer(null);
        }}
        title={confirmAction === "delete" ? "Remover jogador" : confirmAction === "resetPassword" ? "Resetar Senha" : "Alterar Nível de Autoridade"}
      >
        <div className="space-y-4">
          {confirmAction === "delete" ? (
            <p className="text-sm text-gray-400">
              Remover {actionPlayer?.name} do elenco? O jogador será marcado como inativo.
            </p>
          ) : confirmAction === "resetPassword" ? (
            <p className="text-sm text-gray-300">
              Tem certeza que deseja resetar a senha de <strong>{actionPlayer?.name}</strong>? A nova senha dele será definida para a senha padrão <strong>123456</strong> e ele precisará alterá-la no próximo acesso.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Selecione o nível de autoridade de <strong>{actionPlayer?.name}</strong> na plataforma:
              </p>
              <div className="flex flex-col gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                >
                  <option value="PLAYER" className="bg-neutral-900 text-white">Atleta (Comum)</option>
                  <option value="COACH" className="bg-neutral-900 text-white">Técnico (Jogadores & Avaliações)</option>
                  <option value="MATERIAL_DIRECTOR" className="bg-neutral-900 text-white">Diretor de Material (Equipamentos)</option>
                  <option value="ADMIN" className="bg-neutral-900 text-white">Administrador (Controle Total)</option>
                </select>
              </div>
            </div>
          )}
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
