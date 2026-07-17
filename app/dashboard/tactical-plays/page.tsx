"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Plus, Trash, Play, Save, RotateCcw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { FORMATION_NAMES, type FormationName } from "@/lib/formations";
import { playerPositionLabels } from "@/lib/player-positions";
import { trackOperationalEvent } from "@/lib/telemetry";

interface Waypoint {
  x: number;
  y: number;
}

interface PlayerMove {
  label: string;
  position: string;
  startX: number;
  startY: number;
  waypoints: Waypoint[];
  endX: number;
  endY: number;
  role: "runner" | "passer" | "target" | "decoy";
}

interface Movements {
  formation: string;
  players: PlayerMove[];
}

interface TacticalPlay {
  id: string;
  name: string;
  description: string | null;
  category: string;
  movements: Movements;
  createdAt: string;
}

const CATEGORIES = [
  { value: "CORNER_KICK", label: "Escanteio" },
  { value: "FREE_KICK", label: "Falta" },
  { value: "THROW_IN", label: "Lateral" },
  { value: "GOAL_KICK", label: "Tiro de Meta" },
  { value: "PENALTY", label: "Pênalti" },
  { value: "GENERAL", label: "Geral / Outros" },
];

const ROLES = [
  { value: "passer", label: "🎯 Batedor (Cobrador)" },
  { value: "runner", label: "🏃‍♂️ Corredor (Passagem)" },
  { value: "target", label: "⚽ Alvo da Jogada" },
  { value: "decoy", label: "🛡️ Distração (Cria espaço)" },
];

export default function TacticalPlaysPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isCoachOrAdmin = role === "ADMIN" || role === "COACH";

  const [plays, setPlays] = useState<TacticalPlay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Editor states
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlayId, setEditingPlayId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("CORNER_KICK");
  const [selectedFormation, setSelectedFormation] = useState<FormationName>("4-4-2");

  // Core board state
  const [boardPlayers, setBoardPlayers] = useState<PlayerMove[]>([]);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [adjustingEndPosition, setAdjustingEndPosition] = useState(false);

  // Visualizing board states
  const [activePlay, setActivePlay] = useState<TacticalPlay | null>(null);

  const fieldRef = useRef<HTMLDivElement>(null);
  const [fieldSize, setFieldSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    fetchPlays();
  }, [selectedCategory]);

  useEffect(() => {
    if (!fieldRef.current) return;
    const observer = new ResizeObserver(() => {
      if (fieldRef.current) {
        setFieldSize({
          width: fieldRef.current.clientWidth,
          height: fieldRef.current.clientHeight,
        });
      }
    });
    observer.observe(fieldRef.current);
    return () => observer.disconnect();
  }, [isEditing, activePlay]);

  async function fetchPlays() {
    setLoading(true);
    setError(null);
    try {
      const url = selectedCategory
        ? `/api/teams/tactical-plays?category=${selectedCategory}`
        : "/api/teams/tactical-plays";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPlays(data);
      } else {
        setError("Erro ao carregar as jogadas ensaiadas");
      }
    } catch {
      setError("Erro de conexão ao buscar jogadas");
    } finally {
      setLoading(false);
    }
  }

  // Load default layout when changing formation in editor
  useEffect(() => {
    if (!isEditing || editingPlayId) return;
    initializeDefaultPlacements(selectedFormation);
  }, [selectedFormation, isEditing, editingPlayId]);

  function initializeDefaultPlacements(formation: FormationName) {
    // Generate default positions for 11 players
    const defaultPositions: Record<string, { x: number; y: number; label: string }> = {
      GOALKEEPER: { x: 10, y: 50, label: "GK" },
      DEFENDER_1: { x: 30, y: 35, label: "ZAG" },
      DEFENDER_2: { x: 30, y: 65, label: "ZAG" },
      LEFT_BACK: { x: 30, y: 15, label: "LAT" },
      RIGHT_BACK: { x: 30, y: 85, label: "LAT" },
      MIDFIELDER_1: { x: 55, y: 35, label: "MEI" },
      MIDFIELDER_2: { x: 55, y: 65, label: "MEI" },
      DEFENSIVE_MID: { x: 45, y: 50, label: "VOL" },
      FORWARD_1: { x: 75, y: 35, label: "ATA" },
      FORWARD_2: { x: 75, y: 65, label: "ATA" },
      LEFT_WINGER: { x: 70, y: 15, label: "PON" },
      RIGHT_WINGER: { x: 70, y: 85, label: "PON" },
    };

    let selectedKeys: string[] = ["GOALKEEPER"];

    if (formation === "4-4-2") {
      selectedKeys.push("DEFENDER_1", "DEFENDER_2", "LEFT_BACK", "RIGHT_BACK", "DEFENSIVE_MID", "MIDFIELDER_1", "MIDFIELDER_2", "FORWARD_1", "FORWARD_2", "LEFT_WINGER");
    } else if (formation === "4-3-3") {
      selectedKeys.push("DEFENDER_1", "DEFENDER_2", "LEFT_BACK", "RIGHT_BACK", "DEFENSIVE_MID", "MIDFIELDER_1", "MIDFIELDER_2", "FORWARD_1", "LEFT_WINGER", "RIGHT_WINGER");
    } else {
      selectedKeys.push("DEFENDER_1", "DEFENDER_2", "LEFT_BACK", "RIGHT_BACK", "DEFENSIVE_MID", "MIDFIELDER_1", "MIDFIELDER_2", "FORWARD_1", "FORWARD_2", "LEFT_WINGER");
    }

    const defaultMoves: PlayerMove[] = selectedKeys.slice(0, 11).map((key, i) => {
      const pos = defaultPositions[key] || { x: 50, y: 50, label: "JOG" };
      return {
        label: `#${i + 2} ${pos.label}`,
        position: key.includes("GOAL") ? "GOALKEEPER" : "MIDFIELDER",
        startX: pos.x,
        startY: pos.y,
        waypoints: [],
        endX: pos.x,
        endY: pos.y,
        role: "runner" as const,
      };
    });

    setBoardPlayers(defaultMoves);
    setSelectedPlayerIndex(null);
  }

  function handleFieldClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!isEditing || !fieldRef.current || selectedPlayerIndex === null) return;

    const rect = fieldRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setBoardPlayers((prev) =>
      prev.map((player, idx) => {
        if (idx !== selectedPlayerIndex) return player;
        if (adjustingEndPosition) {
          return { ...player, endX: Math.round(clickX), endY: Math.round(clickY) };
        } else {
          return { ...player, startX: Math.round(clickX), startY: Math.round(clickY), endX: Math.round(clickX), endY: Math.round(clickY) };
        }
      })
    );
  }

  async function handleSavePlay() {
    if (!name.trim()) return;

    const payload = {
      name,
      description: description.trim() || undefined,
      category,
      movements: {
        formation: selectedFormation,
        players: boardPlayers,
      },
    };

    try {
      const url = editingPlayId
        ? `/api/teams/tactical-plays/${editingPlayId}`
        : "/api/teams/tactical-plays";
      const method = editingPlayId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsEditing(false);
        setEditingPlayId(null);
        setName("");
        setDescription("");
        fetchPlays();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeletePlay(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta jogada ensaiada?")) return;
    try {
      const res = await fetch(`/api/teams/tactical-plays/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (activePlay?.id === id) setActivePlay(null);
        fetchPlays();
      }
    } catch (err) {
      console.error(err);
    }
  }

  function startCreatePlay() {
    setEditingPlayId(null);
    setName("");
    setDescription("");
    setCategory("CORNER_KICK");
    setSelectedFormation("4-4-2");
    setIsEditing(true);
    setActivePlay(null);
  }

  function startEditPlay(play: TacticalPlay) {
    setEditingPlayId(play.id);
    setName(play.name);
    setDescription(play.description || "");
    setCategory(play.category);
    setSelectedFormation(play.movements.formation as FormationName);
    setBoardPlayers(play.movements.players);
    setSelectedPlayerIndex(null);
    setAdjustingEndPosition(false);
    setIsEditing(true);
    setActivePlay(null);
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">
            Prancheta Estratégica
          </p>
          <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-white font-serif">
            Jogadas Ensaiadas
          </h1>
          <p className="text-xs text-[#8fa39b]">
            Desenhe e organize posicionamento, batedores e corridas táticas para faltas e escanteios.
          </p>
        </div>
        {isCoachOrAdmin && !isEditing && (
          <Button onClick={startCreatePlay} className="text-xs font-black uppercase tracking-wider text-[#010403] bg-[#10b981] hover:bg-[#34d399]">
            <Plus className="mr-1.5 h-4 w-4" /> Criar Jogada Ensaiada
          </Button>
        )}
      </div>

      {/* Editor / Creator Mode */}
      {isEditing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 rounded-[22px] border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b border-white/5 p-4 flex flex-row items-center justify-between">
              <span className="text-sm font-bold text-white uppercase tracking-wide">
                {editingPlayId ? "Editar Jogada" : "Nova Jogada Ensaiada"}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSavePlay} disabled={!name} className="text-xs font-black uppercase tracking-wider text-[#010403] bg-[#10b981] hover:bg-[#34d399]">
                  <Save className="mr-1.5 h-4.5 w-4.5" /> Salvar Jogada
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#8fa39b] mb-1">Nome da Jogada</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Escanteio Curto no 2º Pau"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-[var(--brand)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#8fa39b] mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-[var(--brand)] focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#8fa39b] mb-1">Formação Base</label>
                  <select
                    value={selectedFormation}
                    onChange={(e) => setSelectedFormation(e.target.value as FormationName)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-[var(--brand)] focus:outline-none"
                  >
                    {FORMATION_NAMES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#8fa39b] mb-1">Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Instruções para o batedor e corrida dos atacantes..."
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-[var(--brand)] focus:outline-none"
                />
              </div>

              {/* Soccer Field Board */}
              <div className="relative">
                <div
                  ref={fieldRef}
                  onClick={handleFieldClick}
                  className="relative aspect-[3/2] w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#164e35] cursor-crosshair shadow-lg"
                >
                  {/* Soccer Field markings */}
                  <div className="absolute inset-4 border border-white/40 pointer-events-none" />
                  <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-white/40 pointer-events-none" />
                  <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 pointer-events-none" />
                  <div className="absolute left-4 top-[25%] bottom-[25%] w-[12%] border border-l-0 border-white/40 pointer-events-none" />
                  <div className="absolute right-4 top-[25%] bottom-[25%] w-[12%] border border-r-0 border-white/40 pointer-events-none" />
                  
                  {/* Movement Arrows Overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                      </marker>
                      <marker id="arrow-passer" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                      </marker>
                    </defs>
                    {boardPlayers.map((player, idx) => {
                      if (player.startX === player.endX && player.startY === player.endY) return null;
                      const x1 = (player.startX / 100) * fieldSize.width;
                      const y1 = (player.startY / 100) * fieldSize.height;
                      const x2 = (player.endX / 100) * fieldSize.width;
                      const y2 = (player.endY / 100) * fieldSize.height;
                      const color = player.role === "passer" ? "#fbbf24" : "#10b981";
                      const marker = player.role === "passer" ? "url(#arrow-passer)" : "url(#arrow)";

                      return (
                        <line
                          key={idx}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={color}
                          strokeWidth="2.5"
                          strokeDasharray="4,4"
                          markerEnd={marker}
                        />
                      );
                    })}
                  </svg>

                  {/* Player Tokens */}
                  {boardPlayers.map((player, idx) => {
                    const isSelected = selectedPlayerIndex === idx;
                    const x = isSelected && adjustingEndPosition ? player.endX : player.startX;
                    const y = isSelected && adjustingEndPosition ? player.endY : player.startY;

                    // Class styles based on role
                    let tokenStyle = "bg-green-600 border-white text-white";
                    if (player.role === "passer") tokenStyle = "bg-amber-500 border-amber-300 text-slate-900";
                    else if (player.role === "target") tokenStyle = "bg-red-600 border-red-400 text-white";
                    else if (player.role === "decoy") tokenStyle = "bg-blue-600 border-blue-400 text-white";

                    return (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlayerIndex(idx);
                        }}
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        className={`absolute flex h-9 w-9 items-center justify-center rounded-full border-2 text-[10px] font-black shadow-md shrink-0 transition-all ${tokenStyle} ${
                          isSelected ? "ring-4 ring-emerald-400/50 scale-110" : ""
                        }`}
                      >
                        {player.label.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-[10px] text-white/80 px-2 py-1 rounded border border-white/10 flex items-center gap-1.5 pointer-events-none">
                  <HelpCircle className="h-3.5 w-3.5" /> Clique em um token para selecioná-lo e reposicionar no campo
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Config sidebar inside editor */}
          <div className="space-y-4">
            <Card className="rounded-[22px] border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden">
              <CardHeader className="border-b border-white/5 p-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-white">Configurar Atleta</h3>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {selectedPlayerIndex !== null ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#8fa39b] mb-1">Apelido/Número</label>
                      <input
                        type="text"
                        value={boardPlayers[selectedPlayerIndex].label}
                        onChange={(e) =>
                          setBoardPlayers((prev) =>
                            prev.map((p, idx) => (idx === selectedPlayerIndex ? { ...p, label: e.target.value } : p))
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-[var(--brand)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#8fa39b] mb-1">Função na Jogada</label>
                      <select
                        value={boardPlayers[selectedPlayerIndex].role}
                        onChange={(e) =>
                          setBoardPlayers((prev) =>
                            prev.map((p, idx) =>
                              idx === selectedPlayerIndex ? { ...p, role: e.target.value as PlayerMove["role"] } : p
                            )
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-[var(--brand)] focus:outline-none"
                      >
                        {ROLES.map((roleOpt) => (
                          <option key={roleOpt.value} value={roleOpt.value}>{roleOpt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Movement Toggle */}
                    <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3 space-y-2">
                      <p className="text-xs font-semibold text-white">Adicionar Vetor de Corrida:</p>
                      <div className="flex gap-2">
                        <Button
                          variant={!adjustingEndPosition ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setAdjustingEndPosition(false)}
                          className="flex-1 text-[11px]"
                        >
                          📍 Início
                        </Button>
                        <Button
                          variant={adjustingEndPosition ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setAdjustingEndPosition(true)}
                          className="flex-1 text-[11px]"
                        >
                          🏃‍♂️ Destino (Vetor)
                        </Button>
                      </div>
                      <p className="text-[10px] text-[#8fa39b]">
                        {!adjustingEndPosition
                          ? "Clique no campo para reposicionar a posição inicial do jogador."
                          : "Clique no campo para esticar a seta verde e definir o ponto de corrida dele."}
                      </p>
                      {boardPlayers[selectedPlayerIndex].startX !== boardPlayers[selectedPlayerIndex].endX && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setBoardPlayers((prev) =>
                              prev.map((p, idx) =>
                                idx === selectedPlayerIndex ? { ...p, endX: p.startX, endY: p.startY } : p
                              )
                            )
                          }
                          className="w-full text-[10px] text-red-400 hover:text-red-300"
                        >
                          <RotateCcw className="mr-1 h-3 w-3" /> Limpar Corrida / Arrow
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#8fa39b] italic text-center py-6">
                    Selecione um jogador no campo para editar o apelido, definir batedores/corredores e trajetórias.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Viewing & Listing Mode */}
      {!isEditing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of tactical plays */}
          <div className="space-y-4">
            {/* Filter Category */}
            <Card className="rounded-[22px] border border-white/5 bg-white/[0.02] p-4">
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#8fa39b] mb-1.5">Filtro por Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-[var(--brand)] focus:outline-none"
              >
                <option value="">Todas as Categorias</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </Card>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-2xl border border-white/5 bg-white/[0.01]" />
                ))}
              </div>
            ) : error ? (
              <p className="text-sm text-red-400 font-semibold">{error}</p>
            ) : plays.length === 0 ? (
              <p className="text-sm text-[#8fa39b] italic">Nenhuma jogada tática cadastrada nesta categoria.</p>
            ) : (
              <div className="space-y-3">
                {plays.map((play) => {
                  const batedores = play.movements.players.filter((p) => p.role === "passer");
                  return (
                    <div
                      key={play.id}
                      onClick={() => setActivePlay(play)}
                      className={`cursor-pointer rounded-[22px] border transition-all overflow-hidden bg-transparent ${
                        activePlay?.id === play.id
                          ? "border-emerald-500 bg-emerald-500/[0.02] shadow-[0_4px_20px_rgba(16,185,129,0.1)]"
                          : "border-white/5 bg-white/[0.01] hover:border-white/10"
                      }`}
                    >
                      <CardContent className="p-4 flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            {CATEGORIES.find((c) => c.value === play.category)?.label || "Jogada"}
                          </span>
                          <h3 className="font-bold text-white text-sm">{play.name}</h3>
                          {play.description && (
                            <p className="text-xs text-[#8fa39b] line-clamp-2">{play.description}</p>
                          )}
                          {batedores.length > 0 && (
                            <p className="text-[10px] text-amber-400 font-semibold mt-1">
                              🎯 Cobrador: {batedores.map((b) => b.label).join(", ")}
                            </p>
                          )}
                        </div>
                        {isCoachOrAdmin && (
                          <div className="flex gap-1.5 ml-2" onClick={(e) => e.stopPropagation()}>
                            <Button size="sm" variant="ghost" onClick={() => startEditPlay(play)} className="h-7 w-7 p-0">
                              ✏️
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeletePlay(play.id)} className="h-7 w-7 p-0 text-red-400 hover:text-red-300">
                              🗑️
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Visualization board */}
          <div className="lg:col-span-2 space-y-4">
            {activePlay ? (
              <Card className="rounded-[22px] border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden">
                <CardHeader className="border-b border-white/5 p-4 flex flex-row items-center justify-between">
                  <div>
                    <h2 className="text-md font-bold text-white leading-none">{activePlay.name}</h2>
                    <p className="text-xs text-[#8fa39b] mt-1.5">
                      Baseada na Formação: {activePlay.movements.formation}
                    </p>
                  </div>
                  <span className="text-xs text-[#8fa39b] bg-white/5 px-2 py-1 rounded border border-white/10">
                    Visualização
                  </span>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {activePlay.description && (
                    <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-xs text-white/80">
                      <strong>Esquema estratégico:</strong> {activePlay.description}
                    </div>
                  )}

                  {/* 2D Board Display with Arrows */}
                  <div
                    ref={fieldRef}
                    className="relative aspect-[3/2] w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#164e35] shadow-inner shadow-black/40"
                  >
                    <div className="absolute inset-4 border border-white/40 pointer-events-none" />
                    <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-white/40 pointer-events-none" />
                    <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 pointer-events-none" />
                    <div className="absolute left-4 top-[25%] bottom-[25%] w-[12%] border border-l-0 border-white/40 pointer-events-none" />
                    <div className="absolute right-4 top-[25%] bottom-[25%] w-[12%] border border-r-0 border-white/40 pointer-events-none" />

                    {/* SVG Arrows Overlay */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <marker id="arrow-view" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                        </marker>
                        <marker id="arrow-view-passer" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                        </marker>
                      </defs>
                      {activePlay.movements.players.map((player, idx) => {
                        if (player.startX === player.endX && player.startY === player.endY) return null;
                        const x1 = (player.startX / 100) * fieldSize.width;
                        const y1 = (player.startY / 100) * fieldSize.height;
                        const x2 = (player.endX / 100) * fieldSize.width;
                        const y2 = (player.endY / 100) * fieldSize.height;
                        const color = player.role === "passer" ? "#fbbf24" : "#10b981";
                        const marker = player.role === "passer" ? "url(#arrow-view-passer)" : "url(#arrow-view)";

                        return (
                          <line
                            key={idx}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={color}
                            strokeWidth="2.5"
                            strokeDasharray="4,4"
                            markerEnd={marker}
                          />
                        );
                      })}
                    </svg>

                    {/* Player Tokens */}
                    {activePlay.movements.players.map((player, idx) => {
                      // Token colors based on roles
                      let tokenStyle = "bg-green-600 border-white text-white";
                      if (player.role === "passer") tokenStyle = "bg-amber-500 border-amber-300 text-slate-900";
                      else if (player.role === "target") tokenStyle = "bg-red-600 border-red-400 text-white";
                      else if (player.role === "decoy") tokenStyle = "bg-blue-600 border-blue-400 text-white";

                      return (
                        <div
                          key={idx}
                          style={{
                            left: `${player.startX}%`,
                            top: `${player.startY}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          className={`absolute flex h-9 w-9 items-center justify-center rounded-full border-2 text-[10px] font-black shadow-md ${tokenStyle}`}
                          title={`${player.label} - ${player.role}`}
                        >
                          {player.label.split(" ")[0]}
                        </div>
                      );
                    })}
                  </div>

                  {/* Legends list */}
                  <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">Legenda das Funções</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {activePlay.movements.players
                        .filter((p) => p.role === "passer" || p.role === "target")
                        .map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-1.5">
                            <span className="text-white font-medium">{p.label}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.role === "passer" ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
                            }`}>
                              {p.role === "passer" ? "🎯 Batedor" : "⚽ Alvo"}
                            </span>
                          </div>
                        ))}
                      {activePlay.movements.players
                        .filter((p) => p.role === "runner" && (p.startX !== p.endX || p.startY !== p.endY))
                        .map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-1.5">
                            <span className="text-white font-medium">{p.label}</span>
                            <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] font-bold">
                              🏃‍♂️ Corredor (Vetor)
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.01] p-12 text-center h-full flex flex-col items-center justify-center">
                <Play className="h-8 w-8 text-emerald-400 mb-3" />
                <h3 className="text-sm font-semibold text-white">Visualização de Prancheta</h3>
                <p className="text-xs text-[#8fa39b] mt-1 max-w-xs">
                  Selecione uma jogada ensaiada na lista ao lado para projetar o esquema estratégico e a movimentação no campo.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
