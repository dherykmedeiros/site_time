"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { Handshake, Receipt, Package, CheckCircle, XCircle, Clock, Calendar, MapPin, DollarSign, ExternalLink } from "lucide-react";

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

interface EquipmentOrder {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status: "PENDING" | "ORDERED" | "RECEIVED" | "CANCELLED";
  notes: string | null;
  createdAt: string;
}

export default function ApprovalsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isAdmin = role === "ADMIN";
  const isMaterialDirector = role === "MATERIAL_DIRECTOR" || isAdmin;
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"friendly" | "equipment">("friendly");

  // Friendly requests state
  const [friendlyRequests, setFriendlyRequests] = useState<FriendlyRequest[]>([]);
  const [loadingFriendly, setLoadingFriendly] = useState(true);

  // Friendly request action modal
  const [selectedFriendly, setSelectedFriendly] = useState<FriendlyRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [matchDate, setMatchDate] = useState("");
  const [matchVenue, setMatchVenue] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Equipment orders state
  const [equipmentOrders, setEquipmentOrders] = useState<EquipmentOrder[]>([]);
  const [loadingEquipment, setLoadingEquipment] = useState(true);

  const loadFriendlyRequests = useCallback(async () => {
    setLoadingFriendly(true);
    try {
      const res = await fetch("/api/friendly-requests?status=PENDING");
      if (res.ok) {
        const data = await res.json();
        setFriendlyRequests(data.requests || []);
      }
    } catch {
      toast("Erro ao carregar solicitações de amistosos", "error");
    } finally {
      setLoadingFriendly(false);
    }
  }, [toast]);

  const loadEquipmentOrders = useCallback(async () => {
    setLoadingEquipment(true);
    try {
      const res = await fetch("/api/equipments/orders");
      if (res.ok) {
        const data = await res.json();
        const pending = (data.orders || []).filter((o: EquipmentOrder) => o.status === "PENDING");
        setEquipmentOrders(pending);
      }
    } catch {
      toast("Erro ao carregar pedidos de equipamento", "error");
    } finally {
      setLoadingEquipment(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isAdmin) loadFriendlyRequests();
    if (isMaterialDirector) loadEquipmentOrders();
  }, [isAdmin, isMaterialDirector, loadFriendlyRequests, loadEquipmentOrders]);

  // Handle friendly request approve/reject
  async function handleFriendlyAction() {
    if (!selectedFriendly || !actionType) return;
    setActionLoading(true);

    try {
      const body: Record<string, string> = { action: actionType };
      if (actionType === "approve") {
        if (matchDate) body.matchDate = new Date(matchDate).toISOString();
        if (matchVenue) body.matchVenue = matchVenue;
      } else {
        body.rejectionReason = rejectionReason;
      }

      const res = await fetch(`/api/friendly-requests/${selectedFriendly.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao processar");
      }

      toast(
        actionType === "approve"
          ? "Amistoso aprovado e partida criada com sucesso!"
          : "Solicitação de amistoso recusada.",
        "success"
      );

      setSelectedFriendly(null);
      setActionType(null);
      setMatchDate("");
      setMatchVenue("");
      setRejectionReason("");
      await loadFriendlyRequests();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro de conexão", "error");
    } finally {
      setActionLoading(false);
    }
  }

  // Handle equipment order status update
  async function handleUpdateEquipmentStatus(orderId: string, status: "ORDERED" | "CANCELLED") {
    try {
      const res = await fetch(`/api/equipments/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar");
      }

      toast(status === "ORDERED" ? "Pedido aprovado/pedido ao fornecedor!" : "Pedido cancelado.", "success");
      await loadEquipmentOrders();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro de conexão", "error");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Central de Pendências & Aprovações"
        description="Gestão unificada de solicitações externas, comprovantes e pedidos operacionais"
      />

      {/* Counters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isAdmin && (
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Solicitações de Amistoso</p>
                  <p className="text-2xl font-bold text-[var(--text)]">{friendlyRequests.length}</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setActiveTab("friendly")}>Ver Lista</Button>
            </CardContent>
          </Card>
        )}

        {isMaterialDirector && (
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Pedidos de Material</p>
                  <p className="text-2xl font-bold text-[var(--text)]">{equipmentOrders.length}</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setActiveTab("equipment")}>Ver Lista</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="bg-[var(--bg-elevated)] p-1 rounded-xl">
          {isAdmin && (
            <TabsTrigger value="friendly" className="gap-2">
              <Handshake className="w-4 h-4" />
              Solicitações de Amistoso ({friendlyRequests.length})
            </TabsTrigger>
          )}
          {isMaterialDirector && (
            <TabsTrigger value="equipment" className="gap-2">
              <Package className="w-4 h-4" />
              Pedidos de Material ({equipmentOrders.length})
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab 1: Friendly Requests */}
        {isAdmin && (
          <TabsContent value="friendly" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-amber-400" />
                  Solicitações de Jogos Amistosos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingFriendly ? (
                  <p className="text-sm text-[var(--text-muted)] py-8 text-center">Carregando solicitações...</p>
                ) : friendlyRequests.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-xl">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                    <p className="font-bold text-sm text-[var(--text)]">Nenhuma solicitação pendente</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Todas as solicitações de amistosos já foram processadas.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {friendlyRequests.map((req) => (
                      <div key={req.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-[var(--text)]">{req.requesterTeamName}</span>
                            <Badge variant="warning">Pendente</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Datas: {req.suggestedDates}</span>
                            {req.suggestedVenue && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Local: {req.suggestedVenue}</span>}
                            {req.proposedFee !== null && <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Taxa: R$ {req.proposedFee.toFixed(2)}</span>}
                          </div>
                          <p className="text-xs text-[var(--text-muted)]">Contato: {req.contactEmail} {req.contactPhone ? `| ${req.contactPhone}` : ""}</p>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 md:flex-initial"
                            onClick={() => {
                              setSelectedFriendly(req);
                              setActionType("approve");
                              setMatchVenue(req.suggestedVenue || "");
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" /> Aceitar
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="text-red-400 hover:bg-red-500/10 border-red-500/20 flex-1 md:flex-initial"
                            onClick={() => {
                              setSelectedFriendly(req);
                              setActionType("reject");
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1.5" /> Recusar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tab 2: Equipment Orders */}
        {isMaterialDirector && (
          <TabsContent value="equipment" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-400" />
                  Pedidos de Aquisição de Material
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingEquipment ? (
                  <p className="text-sm text-[var(--text-muted)] py-8 text-center">Carregando pedidos...</p>
                ) : equipmentOrders.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-xl">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                    <p className="font-bold text-sm text-[var(--text)]">Nenhum pedido pendente</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Todos os pedidos de material foram atendidos ou cancelados.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {equipmentOrders.map((ord) => (
                      <div key={ord.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-[var(--text)]">{ord.name}</span>
                            <Badge variant="warning">Pendente</Badge>
                          </div>
                          <p className="text-xs text-[var(--text-muted)]">
                            Categoria: <strong className="text-[var(--text)]">{ord.category}</strong> | Qtd: <strong className="text-[var(--text)]">{ord.quantity}</strong>
                          </p>
                          {ord.notes && <p className="text-xs italic text-[var(--text-muted)]">&quot;{ord.notes}&quot;</p>}
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 md:flex-initial"
                            onClick={() => handleUpdateEquipmentStatus(ord.id, "ORDERED")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" /> Fazer Pedido
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="text-red-400 hover:bg-red-500/10 border-red-500/20 flex-1 md:flex-initial"
                            onClick={() => handleUpdateEquipmentStatus(ord.id, "CANCELLED")}
                          >
                            <XCircle className="w-4 h-4 mr-1.5" /> Cancelar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Friendly Request Modal */}
      <Modal
        open={Boolean(selectedFriendly && actionType)}
        onClose={() => {
          setSelectedFriendly(null);
          setActionType(null);
        }}
        title={actionType === "approve" ? "Aprovar Desafio de Amistoso" : "Recusar Desafio de Amistoso"}
      >
        {selectedFriendly && actionType === "approve" && (
          <div className="space-y-4">
            <p className="text-xs text-[var(--text-muted)]">
              Ao aprovar o desafio contra <strong>{selectedFriendly.requesterTeamName}</strong>, uma nova partida oficial será automaticamente agendada na plataforma.
            </p>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Data e Horário do Jogo
              </label>
              <Input
                type="datetime-local"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Local da Partida
              </label>
              <Input
                type="text"
                placeholder="Ex: Arena Soccer Sintético"
                value={matchVenue}
                onChange={(e) => setMatchVenue(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setSelectedFriendly(null)}>Cancelar</Button>
              <Button onClick={handleFriendlyAction} disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-700">
                {actionLoading ? "Confirmando..." : "Confirmar e Agendar Jogo"}
              </Button>
            </div>
          </div>
        )}

        {selectedFriendly && actionType === "reject" && (
          <div className="space-y-4">
            <p className="text-xs text-[var(--text-muted)]">
              Informe o motivo da recusa para enviar uma notificação ao time <strong>{selectedFriendly.requesterTeamName}</strong>.
            </p>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Motivo da Recusa
              </label>
              <Textarea
                placeholder="Ex: Sem disponibilidade de horários na semana solicitada."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setSelectedFriendly(null)}>Cancelar</Button>
              <Button onClick={handleFriendlyAction} disabled={actionLoading} className="bg-red-600 hover:bg-red-700">
                {actionLoading ? "Processando..." : "Confirmar Recusa"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
