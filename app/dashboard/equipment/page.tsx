"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { 
  Package, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  ClipboardList, 
  ShoppingBag,
  ArrowRightLeft,
  Truck,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  category: "UNIFORM" | "SOCKS" | "BALL" | "OTHER";
  totalQty: number;
  availableQty: number;
  minQty: number;
  damagedQty: number;
  lostQty: number;
  status: "NEW" | "GOOD" | "USED" | "POOR";
  location: string | null;
  notes: string | null;
  createdAt: string;
}

interface EquipmentOrder {
  id: string;
  name: string;
  category: "UNIFORM" | "SOCKS" | "BALL" | "OTHER";
  quantity: number;
  status: "PENDING" | "ORDERED" | "RECEIVED" | "CANCELLED";
  notes: string | null;
  createdAt: string;
}

export default function EquipmentPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isAllowedToEdit = role === "ADMIN" || role === "MATERIAL_DIRECTOR";
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"inventory" | "orders">("inventory");

  // Inventory list state
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  // Orders list state
  const [orders, setOrders] = useState<EquipmentOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Search and filter states for inventory
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Add / Edit Equipment Modal States
  const [formModal, setFormModal] = useState({ open: false, isEdit: false, equipmentId: null as string | null });
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"UNIFORM" | "SOCKS" | "BALL" | "OTHER">("UNIFORM");
  const [totalQty, setTotalQty] = useState(0);
  const [availableQty, setAvailableQty] = useState(0);
  const [minQty, setMinQty] = useState(0);
  const [damagedQty, setDamagedQty] = useState(0);
  const [lostQty, setLostQty] = useState(0);
  const [status, setStatus] = useState<"NEW" | "GOOD" | "USED" | "POOR">("GOOD");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete Equipment Modal States
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; eqId: string | null }>({ open: false, eqId: null });
  const [deleting, setDeleting] = useState(false);

  // Add / Edit Order Modal States
  const [orderModal, setOrderModal] = useState({ open: false, isEdit: false, orderId: null as string | null });
  const [orderName, setOrderName] = useState("");
  const [orderCategory, setOrderCategory] = useState<"UNIFORM" | "SOCKS" | "BALL" | "OTHER">("UNIFORM");
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderStatus, setOrderStatus] = useState<"PENDING" | "ORDERED" | "RECEIVED" | "CANCELLED">("PENDING");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderSaving, setOrderSaving] = useState(false);
  const [orderFormError, setOrderFormError] = useState("");

  // Delete Order Modal States
  const [deleteOrderModal, setDeleteOrderModal] = useState<{ open: boolean; orderId: string | null }>({ open: false, orderId: null });
  const [deletingOrder, setDeletingOrder] = useState(false);

  async function loadEquipments() {
    setLoading(true);
    try {
      const res = await fetch("/api/equipments");
      if (res.ok) {
        const data = await res.json();
        setEquipments(data.equipments || []);
      } else {
        toast("Erro ao carregar inventário de equipamentos");
      }
    } catch {
      toast("Erro de conexão ao carregar materiais");
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders() {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/equipments/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        toast("Erro ao carregar pedidos de materiais");
      }
    } catch {
      toast("Erro de conexão ao carregar pedidos");
    } finally {
      setOrdersLoading(false);
    }
  }

  useEffect(() => {
    loadEquipments();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") {
      loadOrders();
    }
  }, [activeTab]);

  // Equipment actions
  function handleOpenAdd() {
    setName("");
    setCategory("UNIFORM");
    setTotalQty(1);
    setAvailableQty(1);
    setMinQty(0);
    setDamagedQty(0);
    setLostQty(0);
    setStatus("GOOD");
    setLocation("");
    setNotes("");
    setFormError("");
    setFormModal({ open: true, isEdit: false, equipmentId: null });
  }

  function handleOpenEdit(eq: Equipment) {
    setName(eq.name);
    setCategory(eq.category);
    setTotalQty(eq.totalQty);
    setAvailableQty(eq.availableQty);
    setMinQty(eq.minQty || 0);
    setDamagedQty(eq.damagedQty);
    setLostQty(eq.lostQty);
    setStatus(eq.status);
    setLocation(eq.location || "");
    setNotes(eq.notes || "");
    setFormError("");
    setFormModal({ open: true, isEdit: true, equipmentId: eq.id });
  }

  async function handleSaveEquipment(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    // Arithmetic validation check
    if (availableQty + damagedQty + lostQty !== totalQty) {
      setFormError("A soma de Disponíveis, Danificados e Perdidos deve ser exatamente igual à Quantidade Total.");
      return;
    }

    setSaving(true);
    const body = {
      name,
      category,
      totalQty,
      availableQty,
      minQty,
      damagedQty,
      lostQty,
      status,
      location: location || "",
      notes: notes || "",
    };

    try {
      const url = formModal.isEdit ? `/api/equipments/${formModal.equipmentId}` : "/api/equipments";
      const method = formModal.isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast(formModal.isEdit ? "Equipamento atualizado com sucesso!" : "Novo material adicionado ao inventário!");
        await loadEquipments();
        setFormModal({ open: false, isEdit: false, equipmentId: null });
      } else {
        const err = await res.json();
        setFormError(err.error || "Erro ao salvar equipamento");
      }
    } catch {
      setFormError("Erro de rede");
    } finally {
      setSaving(false);
    }
  }

  function handleOpenDelete(eqId: string) {
    setDeleteModal({ open: true, eqId });
  }

  async function executeDeleteEquipment() {
    if (!deleteModal.eqId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/equipments/${deleteModal.eqId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Equipamento excluído do inventário");
        await loadEquipments();
      } else {
        toast("Erro ao excluir equipamento");
      }
    } catch {
      toast("Erro de conexão");
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, eqId: null });
    }
  }

  // Material Orders handlers
  function handleOpenAddOrder() {
    setOrderName("");
    setOrderCategory("UNIFORM");
    setOrderQuantity(1);
    setOrderStatus("PENDING");
    setOrderNotes("");
    setOrderFormError("");
    setOrderModal({ open: true, isEdit: false, orderId: null });
  }

  function handleOpenEditOrder(ord: EquipmentOrder) {
    setOrderName(ord.name);
    setOrderCategory(ord.category);
    setOrderQuantity(ord.quantity);
    setOrderStatus(ord.status);
    setOrderNotes(ord.notes || "");
    setOrderFormError("");
    setOrderModal({ open: true, isEdit: true, orderId: ord.id });
  }

  async function handleSaveOrder(e: React.FormEvent) {
    e.preventDefault();
    setOrderFormError("");
    setOrderSaving(true);

    const body = {
      name: orderName,
      category: orderCategory,
      quantity: orderQuantity,
      status: orderStatus,
      notes: orderNotes || "",
    };

    try {
      const url = orderModal.isEdit ? `/api/equipments/orders/${orderModal.orderId}` : "/api/equipments/orders";
      const method = orderModal.isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast(orderModal.isEdit ? "Pedido atualizado com sucesso!" : "Novo pedido de material registrado!");
        await loadOrders();
        setOrderModal({ open: false, isEdit: false, orderId: null });
      } else {
        const err = await res.json();
        setOrderFormError(err.error || "Erro ao salvar pedido");
      }
    } catch {
      setOrderFormError("Erro de rede");
    } finally {
      setOrderSaving(false);
    }
  }

  function handleOpenDeleteOrder(orderId: string) {
    setDeleteOrderModal({ open: true, orderId });
  }

  async function executeDeleteOrder() {
    if (!deleteOrderModal.orderId) return;
    setDeletingOrder(true);
    try {
      const res = await fetch(`/api/equipments/orders/${deleteOrderModal.orderId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Pedido de material excluído");
        await loadOrders();
      } else {
        toast("Erro ao excluir pedido");
      }
    } catch {
      toast("Erro de conexão");
    } finally {
      setDeletingOrder(false);
      setDeleteOrderModal({ open: false, orderId: null });
    }
  }

  async function handleQuickStatusChange(orderId: string, newStatus: "PENDING" | "ORDERED" | "RECEIVED" | "CANCELLED") {
    try {
      const res = await fetch(`/api/equipments/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast("Status do pedido atualizado com sucesso!");
        await loadOrders();
      } else {
        toast("Erro ao atualizar status");
      }
    } catch {
      toast("Erro de conexão");
    }
  }

  // Helpers
  function getCategoryLabel(cat: string) {
    switch (cat) {
      case "UNIFORM": return "Uniforme";
      case "SOCKS": return "Meião";
      case "BALL": return "Bola";
      case "OTHER": return "Outros";
      default: return cat;
    }
  }

  function getCategoryIcon(cat: string) {
    switch (cat) {
      case "UNIFORM": return "👕";
      case "SOCKS": return "🧦";
      case "BALL": return "⚽";
      default: return "📦";
    }
  }

  function getStatusBadge(st: string) {
    switch (st) {
      case "NEW":
        return (
          <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-full px-2 py-0.5 text-[0.65rem] uppercase font-bold">
            Novo
          </Badge>
        );
      case "GOOD":
        return (
          <Badge variant="success" className="bg-green-500/10 text-green-400 border-green-500/20 rounded-full px-2 py-0.5 text-[0.65rem] uppercase font-bold">
            Bom
          </Badge>
        );
      case "USED":
        return (
          <Badge variant="warning" className="bg-amber-500/10 text-amber-400 border-amber-500/20 rounded-full px-2 py-0.5 text-[0.65rem] uppercase font-bold">
            Usado
          </Badge>
        );
      case "POOR":
        return (
          <Badge variant="danger" className="bg-red-500/10 text-red-400 border-red-500/20 rounded-full px-2 py-0.5 text-[0.65rem] uppercase font-bold">
            Ruim
          </Badge>
        );
      default:
        return null;
    }
  }

  function getOrderStatusBadge(st: string) {
    switch (st) {
      case "PENDING":
        return (
          <Badge variant="warning" className="bg-amber-500/10 text-amber-400 border-amber-500/20 rounded-full px-2.5 py-1 text-[0.65rem] uppercase font-black tracking-wider flex items-center gap-1 w-fit">
            <HelpCircle className="h-3 w-3" /> Pendente
          </Badge>
        );
      case "ORDERED":
        return (
          <Badge variant="info" className="bg-blue-500/10 text-blue-400 border-blue-500/20 rounded-full px-2.5 py-1 text-[0.65rem] uppercase font-black tracking-wider flex items-center gap-1 w-fit">
            <Truck className="h-3 w-3 animate-pulse" /> Encomendado
          </Badge>
        );
      case "RECEIVED":
        return (
          <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-full px-2.5 py-1 text-[0.65rem] uppercase font-black tracking-wider flex items-center gap-1 w-fit">
            <CheckCircle2 className="h-3 w-3" /> Recebido
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="danger" className="bg-red-500/10 text-red-400 border-red-500/20 rounded-full px-2.5 py-1 text-[0.65rem] uppercase font-black tracking-wider flex items-center gap-1 w-fit">
            <XCircle className="h-3 w-3" /> Cancelado
          </Badge>
        );
      default:
        return null;
    }
  }

  // Calculate inventory totals
  const totalItems = equipments.reduce((sum, eq) => sum + eq.totalQty, 0);
  const totalAvailable = equipments.reduce((sum, eq) => sum + eq.availableQty, 0);
  const totalDamaged = equipments.reduce((sum, eq) => sum + eq.damagedQty, 0);
  const totalLost = equipments.reduce((sum, eq) => sum + eq.lostQty, 0);
  const healthPercent = totalItems > 0 ? (totalAvailable / totalItems) * 100 : 100;

  // Filter equipments list
  const filteredEquipments = equipments.filter((eq) => {
    const matchSearch = eq.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "ALL" || eq.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Gestão de Equipamentos</h1>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            Controle de inventário de uniformes, meiões, bolas de jogo e materiais desportivos do time
          </p>
        </div>
        {isAllowedToEdit && (
          <div>
            {activeTab === "inventory" ? (
              <Button onClick={handleOpenAdd} className="sm:self-center bg-[#2a6f60] hover:bg-[#205448]">
                + Adicionar Equipamento
              </Button>
            ) : (
              <Button onClick={handleOpenAddOrder} className="sm:self-center bg-cyan-600 hover:bg-cyan-700">
                + Registrar Pedido
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Tabs Toggler */}
      <div className="flex gap-4 border-b border-white/5 pb-1">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`pb-2.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "inventory"
              ? "border-[#2a6f60] text-white font-extrabold"
              : "border-transparent text-[var(--text-subtle)] hover:text-white"
          }`}
        >
          <Package className="h-4 w-4" />
          📦 Inventário Geral
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-2.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "orders"
              ? "border-cyan-500 text-white font-extrabold"
              : "border-transparent text-[var(--text-subtle)] hover:text-white"
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          📋 Pedidos de Materiais
        </button>
      </div>

      {/* Tab Content: INVENTORY */}
      {activeTab === "inventory" && (
        <>
          {/* KPI Cards Panel */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="app-surface rounded-2xl border border-[var(--border)] p-4 flex flex-col justify-between shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Materiais Totais</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-white">{totalItems}</span>
                <span className="text-xs text-[var(--text-subtle)]">unidades</span>
              </div>
            </div>

            <div className="app-surface rounded-2xl border border-[var(--border)] p-4 flex flex-col justify-between shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-green-400">Em Campo (Disponíveis)</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-green-400">{totalAvailable}</span>
                <span className="text-xs text-[var(--text-subtle)]">utilizáveis</span>
              </div>
            </div>

            <div className="app-surface rounded-2xl border border-[var(--border)] p-4 flex flex-col justify-between shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Baixas (Danos / Perdas)</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-red-400">{totalDamaged + totalLost}</span>
                <span className="text-xs text-[var(--text-subtle)]">
                  ({totalDamaged}D / {totalLost}P)
                </span>
              </div>
            </div>

            <div className="app-surface rounded-2xl border border-[var(--border)] p-4 flex flex-col justify-between shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Saúde do Estoque</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-blue-400">{healthPercent.toFixed(0)}%</span>
                <span className="text-xs text-[var(--text-subtle)]">em bom estado</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="app-surface rounded-2xl border border border-white/5 bg-white/[0.01] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
            <div className="w-full sm:max-w-xs">
              <Input
                placeholder="Buscar material por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--surface-soft)] border-white/10"
              />
            </div>

            <div className="w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-48 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              >
                <option value="ALL">Todas as categorias</option>
                <option value="UNIFORM">👕 Uniformes</option>
                <option value="SOCKS">🧦 Meiões</option>
                <option value="BALL">⚽ Bolas</option>
                <option value="OTHER">📦 Outros</option>
              </select>
            </div>
          </div>

          {/* Inventory Grid */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-[var(--surface-soft)] border border-white/5" />
              ))}
            </div>
          ) : filteredEquipments.length === 0 ? (
            <div className="app-surface rounded-2xl border border-dashed border-[var(--border-strong)] p-14 text-center text-[var(--text-muted)]">
              <p className="text-4xl">👕</p>
              <p className="mt-3 text-base font-semibold text-white">Nenhum equipamento localizado</p>
              <p className="mt-1 text-sm text-[var(--text-subtle)]">
                Tente reajustar seus filtros de busca ou crie novos itens.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEquipments.map((eq) => {
                const pctAvailable = eq.totalQty > 0 ? (eq.availableQty / eq.totalQty) * 100 : 0;
                const pctDamaged = eq.totalQty > 0 ? (eq.damagedQty / eq.totalQty) * 100 : 0;
                const pctLost = eq.totalQty > 0 ? (eq.lostQty / eq.totalQty) * 100 : 0;

                return (
                  <div
                    key={eq.id}
                    className={`app-surface rounded-2xl border p-5 shadow-sm hover:border-[var(--brand-soft)] transition-all flex flex-col justify-between ${
                      eq.availableQty > (eq.minQty || 0)
                        ? "border-[var(--border)] hover:shadow-emerald-500/5 hover:border-emerald-500/30"
                        : eq.availableQty === (eq.minQty || 0)
                        ? "border-amber-500/20 hover:shadow-amber-500/5 hover:border-amber-500/40"
                        : "border-red-500/30 hover:shadow-red-500/5 hover:border-red-500/50"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xl font-bold">
                            {getCategoryIcon(eq.category)}
                          </div>
                          <div>
                            <h3 className="font-bold text-white leading-tight">{eq.name}</h3>
                            <span className="text-[0.68rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                              {getCategoryLabel(eq.category)}
                            </span>
                          </div>
                        </div>
                        <div>{getStatusBadge(eq.status)}</div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {eq.location && (
                          <div className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)] font-medium bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                            <span>📍</span>
                            <span>{eq.location}</span>
                          </div>
                        )}
                        {(() => {
                          const min = eq.minQty || 0;
                          const avail = eq.availableQty;
                          if (avail > min) {
                            return (
                              <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-full px-2.5 py-1 text-[0.65rem] uppercase font-bold">
                                🟢 Estoque Saudável
                              </Badge>
                            );
                          } else if (avail === min) {
                            return (
                              <Badge variant="warning" className="bg-amber-500/10 text-amber-400 border-amber-500/20 rounded-full px-2.5 py-1 text-[0.65rem] uppercase font-bold">
                                🟡 No Limite
                              </Badge>
                            );
                          } else {
                            return (
                              <Badge variant="danger" className="bg-red-500/10 text-red-400 border-red-500/20 rounded-full px-2.5 py-1 text-[0.65rem] uppercase font-bold animate-pulse">
                                🔴 Abaixo do Mínimo
                              </Badge>
                            );
                          }
                        })()}
                      </div>

                      <div className="space-y-1.5">
                        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden flex">
                          {eq.totalQty > 0 ? (
                            <>
                              <div style={{ width: `${pctAvailable}%` }} className="h-full bg-emerald-500" title="Disponível" />
                              <div style={{ width: `${pctDamaged}%` }} className="h-full bg-amber-500" title="Danificado" />
                              <div style={{ width: `${pctLost}%` }} className="h-full bg-red-500" title="Perdido" />
                            </>
                          ) : (
                            <div className="h-full w-full bg-white/5" />
                          )}
                        </div>

                        <div className="grid grid-cols-5 gap-1 text-[0.68rem] text-center font-bold">
                          <div className="rounded-lg bg-white/5 py-1 text-white border border-white/5">
                            <span className="block text-[var(--text-muted)] font-medium text-[0.6rem] uppercase">Total</span>
                            {eq.totalQty}
                          </div>
                          <div className="rounded-lg bg-white/5 py-1 text-white/70 border border-white/5">
                            <span className="block text-[var(--text-muted)] font-medium text-[0.6rem] uppercase">Mínimo</span>
                            {eq.minQty || 0}
                          </div>
                          <div className={`rounded-lg py-1 border ${
                            eq.availableQty > (eq.minQty || 0)
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : eq.availableQty === (eq.minQty || 0)
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            <span className={`block font-medium text-[0.6rem] uppercase ${
                              eq.availableQty > (eq.minQty || 0)
                                ? "text-emerald-500/50"
                                : eq.availableQty === (eq.minQty || 0)
                                ? "text-amber-500/50"
                                : "text-red-500/50"
                            }`}>Dispo.</span>
                            {eq.availableQty}
                          </div>
                          <div className="rounded-lg bg-amber-500/10 py-1 text-amber-400 border border-amber-500/10">
                            <span className="block text-amber-500/50 font-medium text-[0.6rem] uppercase">Danif.</span>
                            {eq.damagedQty}
                          </div>
                          <div className="rounded-lg bg-red-500/10 py-1 text-red-400 border border-red-500/10">
                            <span className="block text-red-500/50 font-medium text-[0.6rem] uppercase">Perd.</span>
                            {eq.lostQty}
                          </div>
                        </div>
                      </div>

                      {eq.notes && (
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-xs text-[var(--text-subtle)] leading-relaxed italic whitespace-pre-line">
                            "{eq.notes}"
                          </p>
                        </div>
                      )}
                    </div>

                    {isAllowedToEdit && (
                      <div className="mt-5 pt-3 border-t border-white/5 flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(eq)}
                          className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1 border border-white/5"
                        >
                          <span>✏️</span>
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleOpenDelete(eq.id)}
                          className="rounded-lg bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25 transition-all cursor-pointer flex items-center gap-1 border border-red-500/10"
                        >
                          <span>✕</span>
                          <span>Excluir</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Tab Content: MATERIAL ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {ordersLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl bg-[var(--surface-soft)] border border-white/5" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="app-surface rounded-2xl border border-dashed border-[var(--border-strong)] p-14 text-center text-[var(--text-muted)]">
              <ShoppingBag className="h-10 w-10 text-white/20 mx-auto mb-3" />
              <p className="text-base font-semibold text-white">Nenhum pedido de material registrado</p>
              <p className="mt-1 text-sm text-[var(--text-subtle)]">
                Utilize o botão "Registrar Pedido" no canto superior para solicitar a compra ou reposição de materiais.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="app-surface rounded-2xl border border-white/5 bg-white/[0.01] p-5 shadow-sm flex flex-col justify-between hover:border-cyan-500/20 transition-all"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-lg font-bold">
                          {getCategoryIcon(ord.category)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white leading-tight">{ord.name}</h3>
                          <span className="text-[0.68rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            {getCategoryLabel(ord.category)}
                          </span>
                        </div>
                      </div>
                      <div>{getOrderStatusBadge(ord.status)}</div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-baseline gap-2 rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-sm text-white w-fit font-bold">
                      <span className="text-xs text-[var(--text-muted)] font-medium uppercase mr-1">Quantidade pedida:</span>
                      {ord.quantity} <span className="text-xs text-[var(--text-subtle)] font-normal ml-0.5">unidades</span>
                    </div>

                    {/* Notes */}
                    {ord.notes && (
                      <div className="pt-2.5 border-t border-white/5">
                        <p className="text-xs text-[var(--text-subtle)] leading-relaxed italic whitespace-pre-line">
                          "{ord.notes}"
                        </p>
                      </div>
                    )}

                    <div className="text-[10px] text-[var(--text-muted)] font-semibold font-mono">
                      Solicitado em: {new Date(ord.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>

                  {/* Actions & Status Quick Flow */}
                  {isAllowedToEdit && (
                    <div className="mt-5 pt-3 border-t border-white/5 flex flex-wrap justify-between items-center gap-3">
                      {/* Flow status */}
                      <div className="flex items-center gap-1.5">
                        {ord.status === "PENDING" && (
                          <button
                            onClick={() => handleQuickStatusChange(ord.id, "ORDERED")}
                            className="rounded-lg bg-blue-500/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all cursor-pointer"
                          >
                            📦 Comprar
                          </button>
                        )}
                        {ord.status === "ORDERED" && (
                          <button
                            onClick={() => handleQuickStatusChange(ord.id, "RECEIVED")}
                            className="rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer"
                          >
                            ✓ Receber
                          </button>
                        )}
                      </div>

                      {/* Edit / Delete */}
                      <div className="flex gap-2 ml-auto">
                        <button
                          onClick={() => handleOpenEditOrder(ord)}
                          className="p-2 rounded-lg hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                          title="Editar pedido"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleOpenDeleteOrder(ord.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors cursor-pointer"
                          title="Excluir pedido"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Inventory Modal */}
      {formModal.open && (
        <Modal
          open={formModal.open}
          onClose={() => setFormModal({ open: false, isEdit: false, equipmentId: null })}
          title={formModal.isEdit ? "Editar Equipamento" : "Adicionar Equipamento"}
        >
          <form onSubmit={handleSaveEquipment} className="space-y-4">
            {formError && (
              <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20 leading-normal">
                {formError}
              </p>
            )}

            <Input
              label="Nome do Equipamento/Material *"
              placeholder="Ex: Bola de Jogo Penalty, Meiões Verdes, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-subtle)] uppercase">Categoria *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                >
                  <option value="UNIFORM">👕 Uniforme</option>
                  <option value="SOCKS">🧦 Meião</option>
                  <option value="BALL">⚽ Bola</option>
                  <option value="OTHER">📦 Outros</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-subtle)] uppercase">Conservação Geral *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                >
                  <option value="NEW">Novo</option>
                  <option value="GOOD">Bom</option>
                  <option value="USED">Usado</option>
                  <option value="POOR">Ruim</option>
                </select>
              </div>
            </div>

            <Input
              label="Localização Física"
              placeholder="Ex: Sacola de Treino A, Armário de Rouparia..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-4">
              <h4 className="text-xs uppercase tracking-wider font-bold text-white">Controle de Quantidades Físicas</h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <Input
                  label="Qtd Total *"
                  type="number"
                  min="0"
                  value={totalQty}
                  onChange={(e) => setTotalQty(parseInt(e.target.value) || 0)}
                  required
                />
                <Input
                  label="Disponível *"
                  type="number"
                  min="0"
                  value={availableQty}
                  onChange={(e) => setAvailableQty(parseInt(e.target.value) || 0)}
                  required
                />
                <Input
                  label="Mínimo Aceitável *"
                  type="number"
                  min="0"
                  value={minQty}
                  onChange={(e) => setMinQty(parseInt(e.target.value) || 0)}
                  required
                />
                <Input
                  label="Danificado *"
                  type="number"
                  min="0"
                  value={damagedQty}
                  onChange={(e) => setDamagedQty(parseInt(e.target.value) || 0)}
                  required
                />
                <Input
                  label="Perdido *"
                  type="number"
                  min="0"
                  value={lostQty}
                  onChange={(e) => setLostQty(parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="text-[0.7rem] text-[var(--text-muted)] flex justify-between font-medium">
                <span>Total de Unidades: <strong>{totalQty}</strong></span>
                <span className={availableQty + damagedQty + lostQty === totalQty ? "text-emerald-400" : "text-amber-500 font-bold"}>
                  Soma Calculada: {availableQty + damagedQty + lostQty} {availableQty + damagedQty + lostQty === totalQty ? "✓ (Ok)" : "⚠ (Diferente)"}
                </span>
              </div>
            </div>

            <Textarea
              label="Observações Finais"
              placeholder="Notas adicionais sobre o lote, datas de compra ou observações de conservação..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setFormModal({ open: false, isEdit: false, equipmentId: null })}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={saving} disabled={saving}>
                {saving ? "Salvando..." : formModal.isEdit ? "Salvar Alterações" : "Adicionar Item"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Equipment Confirmation Modal */}
      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, eqId: null })}
        title="Excluir Equipamento"
      >
        <p className="text-sm text-[var(--text-subtle)] leading-relaxed">
          Tem certeza de que deseja remover permanentemente este item do inventário de equipamentos do time? Essa ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDeleteModal({ open: false, eqId: null })}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={executeDeleteEquipment}
            loading={deleting}
          >
            Confirmar Exclusão
          </Button>
        </div>
      </Modal>

      {/* Add / Edit Order Modal */}
      {orderModal.open && (
        <Modal
          open={orderModal.open}
          onClose={() => setOrderModal({ open: false, isEdit: false, orderId: null })}
          title={orderModal.isEdit ? "Editar Pedido de Material" : "Registrar Pedido de Material"}
        >
          <form onSubmit={handleSaveOrder} className="space-y-4">
            {orderFormError && (
              <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20 leading-normal">
                {orderFormError}
              </p>
            )}

            <Input
              label="Nome do Material/Pedido *"
              placeholder="Ex: 5 Novas Bolas Penalty S11, Jogo de coletes azul"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-subtle)] uppercase">Categoria *</label>
                <select
                  value={orderCategory}
                  onChange={(e) => setOrderCategory(e.target.value as any)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                >
                  <option value="UNIFORM">👕 Uniforme</option>
                  <option value="SOCKS">🧦 Meião</option>
                  <option value="BALL">⚽ Bola</option>
                  <option value="OTHER">📦 Outros</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-subtle)] uppercase">Status do Pedido *</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as any)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                >
                  <option value="PENDING">Pendente</option>
                  <option value="ORDERED">Encomendado / Comprado</option>
                  <option value="RECEIVED">Recebido</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>
            </div>

            <Input
              label="Quantidade Desejada *"
              type="number"
              min="1"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              required
            />

            <Textarea
              label="Observações / Justificativa"
              placeholder="Descreva a finalidade do material, links de compra ou orçamentos se houver..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              rows={3}
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOrderModal({ open: false, isEdit: false, orderId: null })}
                disabled={orderSaving}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={orderSaving} disabled={orderSaving}>
                {orderSaving ? "Salvando..." : orderModal.isEdit ? "Salvar Alterações" : "Adicionar Pedido"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Order Confirmation Modal */}
      <Modal
        open={deleteOrderModal.open}
        onClose={() => setDeleteOrderModal({ open: false, orderId: null })}
        title="Excluir Pedido"
      >
        <p className="text-sm text-[var(--text-subtle)] leading-relaxed">
          Tem certeza de que deseja remover permanentemente este pedido de material? Essa ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDeleteOrderModal({ open: false, orderId: null })}
            disabled={deletingOrder}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={executeDeleteOrder}
            loading={deletingOrder}
          >
            Confirmar Exclusão
          </Button>
        </div>
      </Modal>
    </div>
  );
}
