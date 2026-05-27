"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { 
  Package, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  ShieldAlert,
  ArrowRightLeft,
  Shirt,
  Info
} from "lucide-react";

interface TeamEquipment {
  id: string;
  name: string;
  category: string;
  availableQty: number;
  totalQty: number;
}

interface MatchEquipment {
  id?: string;
  equipmentId: string | null;
  name: string;
  quantitySent: number;
  quantityReturned: number;
  returned: boolean;
  notes: string | null;
}

interface PlayerJersey {
  playerId: string;
  playerName: string;
  shirtNumber: number;
}

interface MatchEquipmentCardProps {
  matchId: string;
  onSaveSuccess?: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  UNIFORM: "Uniforme",
  SOCKS: "Meiões",
  BALL: "Bolas",
  OTHER: "Outros",
};

export function MatchEquipmentCard({ matchId, onSaveSuccess }: MatchEquipmentCardProps) {
  const [teamEquipments, setTeamEquipments] = useState<TeamEquipment[]>([]);
  const [matchEquipments, setMatchEquipments] = useState<MatchEquipment[]>([]);
  const [playerJerseys, setPlayerJerseys] = useState<PlayerJersey[]>([]);
  const [matchStatus, setMatchStatus] = useState<string>("SCHEDULED");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states to add equipment
  const [selectedEquipId, setSelectedEquipId] = useState<string>("custom");
  const [customName, setCustomName] = useState("");
  const [qtySent, setQtySent] = useState<number>(1);

  useEffect(() => {
    fetchEquipments();
  }, [matchId]);

  async function fetchEquipments() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${matchId}/equipments`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao carregar materiais");
      
      const teamEquips = data.teamEquipments || [];
      const savedMatchEquips = data.matchEquipments || [];
      const jerseys = data.playerJerseys || [];

      // Generate synthesized items for any jersey that doesn't have a savedMatchEquips entry yet
      const synthesizedEquips: MatchEquipment[] = [...savedMatchEquips];

      jerseys.forEach((pj: PlayerJersey) => {
        const uniformName = `Uniforme #${pj.shirtNumber} - ${pj.playerName}`;
        const exists = savedMatchEquips.some(
          (me: MatchEquipment) => me.equipmentId === null && me.name.toLowerCase() === uniformName.toLowerCase()
        );
        if (!exists) {
          synthesizedEquips.push({
            equipmentId: null,
            name: uniformName,
            quantitySent: 1,
            quantityReturned: 0,
            returned: false,
            notes: null,
          });
        }
      });

      setTeamEquipments(teamEquips);
      setMatchEquipments(synthesizedEquips);
      setPlayerJerseys(jerseys);
      setMatchStatus(data.matchStatus || "SCHEDULED");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAddMaterial() {
    let name = "";
    let equipId: string | null = null;

    if (selectedEquipId === "custom") {
      if (!customName.trim()) {
        setError("Nome do material customizado é obrigatório");
        return;
      }
      name = customName.trim();
    } else {
      const equip = teamEquipments.find((e) => e.id === selectedEquipId);
      if (!equip) return;
      name = equip.name;
      equipId = equip.id;
    }

    // Check if already in list
    const exists = matchEquipments.some(
      (me) => (equipId && me.equipmentId === equipId) || (!equipId && me.name.toLowerCase() === name.toLowerCase())
    );

    if (exists) {
      setError(`O material "${name}" já foi adicionado à lista`);
      return;
    }

    const newItem: MatchEquipment = {
      equipmentId: equipId,
      name,
      quantitySent: qtySent,
      quantityReturned: 0,
      returned: false,
      notes: null,
    };

    setMatchEquipments((prev) => [...prev, newItem]);
    setError(null);
    setCustomName("");
    setQtySent(1);
  }

  // Uniform return handlers
  function handleToggleUniformReturned(name: string, checked: boolean) {
    setMatchEquipments((prev) =>
      prev.map((item) => {
        if (item.name !== name) return item;
        return {
          ...item,
          returned: checked,
          quantityReturned: checked ? 1 : 0,
        };
      })
    );
  }

  function handleUpdateUniformNotes(name: string, notesVal: string) {
    setMatchEquipments((prev) =>
      prev.map((item) => (item.name === name ? { ...item, notes: notesVal || null } : item))
    );
  }

  // Team material return handlers
  function handleUpdateTeamMaterialQtySent(name: string, val: number) {
    setMatchEquipments((prev) =>
      prev.map((item) => {
        if (item.name !== name) return item;
        const newQtySent = Math.max(1, val);
        const isReturned = item.quantityReturned >= newQtySent;
        return {
          ...item,
          quantitySent: newQtySent,
          returned: isReturned,
        };
      })
    );
  }

  function handleUpdateTeamMaterialQtyReturned(name: string, val: number) {
    setMatchEquipments((prev) =>
      prev.map((item) => {
        if (item.name !== name) return item;
        const newQtyReturned = Math.max(0, val);
        const isReturned = newQtyReturned >= item.quantitySent;
        return {
          ...item,
          quantityReturned: newQtyReturned,
          returned: isReturned,
        };
      })
    );
  }

  function handleToggleTeamMaterialReturned(name: string, checked: boolean) {
    setMatchEquipments((prev) =>
      prev.map((item) => {
        if (item.name !== name) return item;
        return {
          ...item,
          returned: checked,
          quantityReturned: checked ? item.quantitySent : 0,
        };
      })
    );
  }

  function handleUpdateTeamMaterialNotes(name: string, notesVal: string) {
    setMatchEquipments((prev) =>
      prev.map((item) => (item.name === name ? { ...item, notes: notesVal || null } : item))
    );
  }

  function handleRemoveTeamMaterial(name: string) {
    setMatchEquipments((prev) => prev.filter((item) => item.name !== name));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/matches/${matchId}/equipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipments: matchEquipments }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar materiais da partida");

      setMatchEquipments(data.matchEquipments);
      setSuccessMsg("Controle de devolução salvo com sucesso!");
      
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Filter lists
  const uniformItems = matchEquipments.filter(
    (me) => me.equipmentId === null && me.name.startsWith("Uniforme #")
  );

  const teamMaterialItems = matchEquipments.filter(
    (me) => !(me.equipmentId === null && me.name.startsWith("Uniforme #"))
  );

  const isCompleted = matchStatus === "COMPLETED";

  // Calculations
  const totalItems = matchEquipments.length;
  const returnedItems = matchEquipments.filter((me) => me.returned).length;
  const pendingItems = totalItems - returnedItems;

  return (
    <Card className="overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-lg">
      <CardHeader className="border-b border-white/5 bg-white/[0.02]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60] flex items-center gap-1.5">
                <ArrowRightLeft className="h-3 w-3" />
                Controle Pós-Jogo
              </p>
              {isCompleted ? (
                <Badge variant="success" className="text-[10px] uppercase font-black tracking-widest bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                  🏆 Jogo Finalizado (Modo Devolução)
                </Badge>
              ) : (
                <Badge variant="info" className="text-[10px] uppercase font-black tracking-widest bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
                  ⚽ Planejamento de Partida
                </Badge>
              )}
            </div>
            <h2 className="text-lg font-bold text-[var(--text)] mt-1.5">Devolução de Materiais e Uniformes</h2>
            <p className="text-sm text-[var(--text-subtle)]">
              {isCompleted 
                ? "Confirme se todos os uniformes entregues aos atletas e materiais de inventário voltaram."
                : "Selecione os materiais levados para o jogo e controle a devolução pós-partida."
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={fetchEquipments}
              disabled={loading || saving}
              className="text-xs font-semibold text-[var(--text-subtle)] hover:text-[var(--text)]"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Recarregar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={loading || saving}
              className="bg-[#2a6f60] hover:bg-[#205448] text-white font-semibold transition-all px-4"
            >
              {saving ? "Salvando..." : "Salvar Controle"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {error && (
          <div className="flex items-start gap-3 rounded-[12px] border border-red-500/35 bg-red-500/10 p-4 text-sm text-red-200">
            <ShieldAlert className="h-5 w-5 shrink-0 text-red-400" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-3 rounded-[12px] border border-emerald-500/35 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* 1. Add Material Box (Hiden on Completed Matches) */}
        {!isCompleted && (
          <div className="rounded-[14px] border border-white/5 bg-white/[0.03] p-4">
            <h3 className="text-sm font-bold text-[var(--text)] mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-[#2a6f60]" />
              Adicionar Materiais para a Partida (Pré-Jogo)
            </h3>
            <div className="grid gap-4 sm:grid-cols-[1.5fr_1.5fr_0.8fr_auto] items-end">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-subtle)] mb-1">Selecione do Inventário</label>
                <select
                  value={selectedEquipId}
                  onChange={(e) => setSelectedEquipId(e.target.value)}
                  className="w-full rounded-[10px] border border-white/10 bg-white/[0.05] p-2 text-sm text-[var(--text)] focus:border-[#2a6f60] focus:ring-1 focus:ring-[#2a6f60] focus:outline-none"
                >
                  <option value="custom" className="bg-[#18181b] text-white">✍️ Item Customizado (Digitar nome)</option>
                  {teamEquipments.map((e) => (
                    <option key={e.id} value={e.id} className="bg-[#18181b] text-white">
                      {e.name} ({CATEGORY_LABELS[e.category] || e.category}) - Qtd: {e.availableQty}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEquipId === "custom" && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-subtle)] mb-1">Nome do Material</label>
                  <Input
                    type="text"
                    placeholder="Ex: Coletes Verdes, Faixa Capitão"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-white/[0.05] border-white/10"
                  />
                </div>
              )}

              {selectedEquipId !== "custom" && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-subtle)] mb-1">Detalhes do Estoque</label>
                  <div className="rounded-[10px] border border-dashed border-white/10 px-3 py-2 text-xs text-[var(--text-subtle)] bg-white/[0.01]">
                    Disponível: {teamEquipments.find(e => e.id === selectedEquipId)?.availableQty ?? 0} unidades
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[var(--text-subtle)] mb-1">Qtd Levada</label>
                <Input
                  type="number"
                  min="1"
                  value={qtySent}
                  onChange={(e) => setQtySent(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white/[0.05] border-white/10 text-center"
                />
              </div>

              <Button
                type="button"
                onClick={handleAddMaterial}
                className="bg-white/10 hover:bg-white/15 text-[var(--text)] font-semibold rounded-[10px]"
              >
                <Plus className="h-4 w-4 mr-1 text-[#2a6f60]" />
                Adicionar
              </Button>
            </div>
          </div>
        )}

        {/* 2. Metrics & Status */}
        {totalItems > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-[12px] border border-white/5 bg-white/[0.02] p-3 text-center">
              <span className="block text-xs text-[var(--text-subtle)] font-medium">Total de Itens</span>
              <span className="text-xl font-bold text-[var(--text)]">{totalItems}</span>
            </div>
            <div className="rounded-[12px] border border-white/5 bg-emerald-500/5 p-3 text-center">
              <span className="block text-xs text-emerald-400 font-medium font-bold">Devolvidos</span>
              <span className="text-xl font-bold text-emerald-400">{returnedItems}</span>
            </div>
            <div className="rounded-[12px] border border-white/5 bg-amber-500/5 p-3 text-center">
              <span className="block text-xs text-amber-400 font-medium font-bold">Pendentes</span>
              <span className="text-xl font-bold text-amber-400">{pendingItems}</span>
            </div>
          </div>
        )}

        {/* 3. Section: Player Jerseys (Auto Populated from Attendance) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Shirt className="h-4 w-4 text-[#2a6f60]" />
            <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wide">
              Devolução de Uniformes dos Atletas
            </h3>
            <span className="text-xs text-[var(--text-subtle)] ml-auto font-medium">
              (Camisas entregues aos presentes com número != 0)
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-[var(--text-subtle)]">Carregando camisas dos atletas...</p>
          ) : uniformItems.length === 0 ? (
            <div className="flex items-center gap-2.5 rounded-[12px] border border-white/5 bg-white/[0.01] p-4 text-xs text-[var(--text-subtle)]">
              <Info className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>Nenhum atleta presente foi escalado com número de camisa diferente de 0 no bordero. Defina as camisas no bordero primeiro.</span>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {uniformItems.map((item, idx) => {
                // Parse jersey number and name out of standard format "Uniforme #XX - Nome"
                const numberMatch = item.name.match(/#(\d+)/);
                const nameMatch = item.name.match(/-\s*(.*)/);
                const jerseyNumber = numberMatch ? numberMatch[1] : "?";
                const playerName = nameMatch ? nameMatch[1] : item.name;

                return (
                  <div 
                    key={idx}
                    className={`flex flex-col gap-3 rounded-[12px] border p-4 transition-all ${
                      item.returned 
                        ? "border-emerald-500/20 bg-emerald-500/[0.02]" 
                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Round jersey icon badge */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2a6f60] font-mono font-black text-sm text-white shadow-md">
                          {jerseyNumber}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[var(--text)] truncate">{playerName}</p>
                          <p className="text-[10px] text-[var(--text-subtle)] font-medium">Camisa Atribuída</p>
                        </div>
                      </div>

                      {/* Returned Checkbox */}
                      <label className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/5 px-2.5 py-1.5 hover:bg-white/10 transition-colors cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={item.returned}
                          onChange={(e) => handleToggleUniformReturned(item.name, e.target.checked)}
                          className="rounded border-white/10 bg-white/[0.05] text-[#2a6f60] focus:ring-[#2a6f60] h-4 w-4"
                        />
                        <span className={`text-xs font-bold uppercase tracking-wider ${item.returned ? 'text-emerald-400' : 'text-[var(--text-subtle)]'}`}>
                          {item.returned ? "Devolvido" : "Pendente"}
                        </span>
                      </label>
                    </div>

                    {/* Incidents/Notes */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Registrar avaria, mancha ou perda..."
                        value={item.notes ?? ""}
                        onChange={(e) => handleUpdateUniformNotes(item.name, e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-[8px] px-2.5 py-1.5 text-xs text-[var(--text)] placeholder-white/30 focus:border-[#2a6f60] focus:outline-none"
                      />
                      {(!item.returned && !item.notes) && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] text-amber-400 font-semibold uppercase tracking-wider animate-pulse">
                          <FileText className="h-2.5 w-2.5" /> Adicionar Nota
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Section: Team Materials (Cones, Vests, Balls) */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Package className="h-4 w-4 text-[#2a6f60]" />
            <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wide">
              Devolução de Materiais Coletivos do Time
            </h3>
            <span className="text-xs text-[var(--text-subtle)] ml-auto font-medium">
              (Equipamentos do estoque levados a campo)
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-[var(--text-subtle)]">Carregando materiais do time...</p>
          ) : teamMaterialItems.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-white/10 rounded-[14px] bg-white/[0.01]">
              <Package className="h-6 w-6 text-white/20 mx-auto mb-2" />
              <p className="text-xs font-semibold text-[var(--text-subtle)]">Nenhum material coletivo adicionado para a partida.</p>
              {!isCompleted && <p className="text-[10px] text-gray-500 mt-0.5">Use o painel de pré-jogo acima para adicionar coletes, bolas, cones, etc.</p>}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-[14px] border border-white/5 bg-white/[0.01]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.03] text-xs font-semibold text-[var(--text-subtle)] uppercase">
                    <th className="p-3">Material</th>
                    <th className="p-3 text-center w-24">Levados</th>
                    <th className="p-3 text-center w-24">Devolvidos</th>
                    <th className="p-3 text-center w-28">Status</th>
                    <th className="p-3">Observações / Incidentes</th>
                    {!isCompleted && <th className="p-3 text-center w-16">Ações</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {teamMaterialItems.map((item, idx) => (
                    <tr 
                      key={idx} 
                      className={`hover:bg-white/[0.02] transition-colors ${
                        item.returned 
                          ? "bg-emerald-500/[0.01]" 
                          : item.quantityReturned > 0 
                            ? "bg-amber-500/[0.01]" 
                            : "bg-red-500/[0.01]"
                      }`}
                    >
                      {/* Name */}
                      <td className="p-3">
                        <span className="font-semibold text-[var(--text)]">{item.name}</span>
                      </td>

                      {/* Qty Sent */}
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="1"
                          value={item.quantitySent}
                          disabled={isCompleted}
                          onChange={(e) => handleUpdateTeamMaterialQtySent(item.name, parseInt(e.target.value) || 0)}
                          className="w-16 rounded-[8px] border border-white/10 bg-white/[0.05] disabled:bg-transparent disabled:border-transparent p-1 text-center text-sm font-semibold text-[var(--text)] focus:border-[#2a6f60] focus:ring-1 focus:ring-[#2a6f60] focus:outline-none"
                        />
                      </td>

                      {/* Qty Returned */}
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="0"
                          value={item.quantityReturned}
                          onChange={(e) => handleUpdateTeamMaterialQtyReturned(item.name, parseInt(e.target.value) || 0)}
                          className="w-16 rounded-[8px] border border-white/10 bg-white/[0.05] p-1 text-center text-sm font-semibold text-[var(--text)] focus:border-[#2a6f60] focus:ring-1 focus:ring-[#2a6f60] focus:outline-none"
                        />
                      </td>

                      {/* Status Checkbox / Badges */}
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <label className="flex items-center gap-1.5 text-xs text-[var(--text)] cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={item.returned}
                              onChange={(e) => handleToggleTeamMaterialReturned(item.name, e.target.checked)}
                              className="rounded border-white/10 bg-white/[0.05] text-[#2a6f60] focus:ring-[#2a6f60] h-3.5 w-3.5"
                            />
                            <span className="font-medium">Completo</span>
                          </label>
                          {item.returned ? (
                            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                              <CheckCircle className="h-3 w-3" /> Devolvido
                            </span>
                          ) : item.quantityReturned > 0 ? (
                            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                              <AlertCircle className="h-3 w-3" /> Pendente ({item.quantitySent - item.quantityReturned})
                            </span>
                          ) : (
                            <span className="text-[10px] text-red-400 font-semibold flex items-center gap-0.5">
                              <AlertCircle className="h-3 w-3" /> Não Devolvido
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Notes / Incidents */}
                      <td className="p-3">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Descreva perdas ou avarias se houver..."
                            value={item.notes ?? ""}
                            onChange={(e) => handleUpdateTeamMaterialNotes(item.name, e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-[8px] px-2.5 py-1.5 text-xs text-[var(--text)] placeholder-white/30 focus:border-[#2a6f60] focus:outline-none"
                          />
                          {(item.quantityReturned < item.quantitySent && !item.notes) && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] text-amber-400 font-semibold uppercase tracking-wider animate-pulse">
                              <FileText className="h-2.5 w-2.5" /> Adicionar Nota
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      {!isCompleted && (
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveTeamMaterial(item.name)}
                            className="p-1.5 rounded-[8px] hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                            title="Remover Material"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
