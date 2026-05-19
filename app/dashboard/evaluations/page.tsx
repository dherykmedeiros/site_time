"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface Player {
  id: string;
  name: string;
  position: "GK" | "DF" | "MF" | "FW";
  shirtNumber: number | null;
  photoUrl: string | null;
}

interface Evaluation {
  id: string;
  playerId: string;
  player: {
    id: string;
    name: string;
    position: string;
    shirtNumber: number | null;
  };
  evaluator: {
    id: string;
    name: string;
    email: string;
  };
  content: string;
  technical: number;
  tactical: number;
  physical: number;
  discipline: number;
  date: string;
  createdAt: string;
}

export default function EvaluationsPage() {
  const { data: session, status: authStatus } = useSession();
  const role = session?.user?.role;
  const isCoachOrAdmin = role === "ADMIN" || role === "COACH";
  const { toast } = useToast();

  const [players, setPlayers] = useState<Player[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Position and Sorting states
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NAME"); // NAME, RATING_DESC, RATING_ASC, EVAL_COUNT_DESC

  // Selected Player Panel Modal
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeTab, setActiveTab] = useState<"HISTORY" | "NEW">("HISTORY");

  // Form States for creating/editing evaluations
  const [editingEval, setEditingEval] = useState<Evaluation | null>(null);
  const [technical, setTechnical] = useState(3);
  const [tactical, setTactical] = useState(3);
  const [physical, setPhysical] = useState(3);
  const [discipline, setDiscipline] = useState(3);
  const [content, setContent] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete evaluation confirmation states
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; evalId: string | null }>({
    open: false,
    evalId: null,
  });
  const [deleting, setDeleting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [playersRes, evalsRes] = await Promise.all([
        fetch("/api/players?status=ACTIVE"),
        fetch("/api/evaluations"),
      ]);

      if (playersRes.ok) {
        const data = await playersRes.json();
        setPlayers(data.players || []);
      }
      if (evalsRes.ok) {
        const data = await evalsRes.json();
        setEvaluations(data.evaluations || []);
      }
    } catch {
      toast("Erro ao carregar fichas de avaliação");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isCoachOrAdmin) {
      loadData();
    }
  }, [isCoachOrAdmin]);

  if (authStatus === "loading") {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand)] border-t-transparent" />
      </div>
    );
  }

  // Strictly check coach or admin role on frontend
  if (!isCoachOrAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[70vh]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-4xl border border-red-500/20 shadow-md">
          🔒
        </div>
        <h2 className="mt-6 text-2xl font-black text-white">Área Restrita</h2>
        <p className="mt-2 text-sm text-[var(--text-subtle)] max-w-md leading-relaxed">
          Esta área é de acesso exclusivo para a comissão técnica e administradores do time para anotações disciplinares e de desempenho.
        </p>
      </div>
    );
  }

  function handleOpenPlayerDrawer(player: Player) {
    setSelectedPlayer(player);
    setActiveTab("HISTORY");
    setEditingEval(null);
    setTechnical(3);
    setTactical(3);
    setPhysical(3);
    setDiscipline(3);
    setContent("");
    setDate(new Date().toISOString().substring(0, 10));
    setFormError("");
  }

  function handleStartEdit(evalItem: Evaluation) {
    setEditingEval(evalItem);
    setTechnical(evalItem.technical);
    setTactical(evalItem.tactical);
    setPhysical(evalItem.physical);
    setDiscipline(evalItem.discipline);
    setContent(evalItem.content);
    setDate(new Date(evalItem.date).toISOString().substring(0, 10));
    setActiveTab("NEW");
  }

  async function handleSaveEvaluation(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPlayer) return;
    setFormError("");
    setSaving(true);

    const body = {
      playerId: selectedPlayer.id,
      content,
      technical,
      tactical,
      physical,
      discipline,
      date: new Date(date).toISOString(),
    };

    try {
      const url = editingEval ? `/api/evaluations/${editingEval.id}` : "/api/evaluations";
      const method = editingEval ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || "Erro ao salvar avaliação");
        return;
      }

      toast(editingEval ? "Ficha de avaliação atualizada!" : "Nova avaliação adicionada com sucesso!");
      await loadData();
      
      // Reset form
      setEditingEval(null);
      setTechnical(3);
      setTactical(3);
      setPhysical(3);
      setDiscipline(3);
      setContent("");
      setDate(new Date().toISOString().substring(0, 10));
      setActiveTab("HISTORY");
    } catch {
      setFormError("Erro de rede ao conectar com a API");
    } finally {
      setSaving(false);
    }
  }

  function handleOpenDelete(evalId: string) {
    setDeleteModal({ open: true, evalId });
  }

  async function executeDeleteEvaluation() {
    if (!deleteModal.evalId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/evaluations/${deleteModal.evalId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Avaliação excluída com sucesso");
        await loadData();
      } else {
        toast("Erro ao excluir avaliação");
      }
    } catch {
      toast("Erro de conexão");
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, evalId: null });
    }
  }

  // Get position label in Portuguese
  function getPositionLabel(pos: string) {
    switch (pos) {
      case "GK":
        return "Goleiro";
      case "DF":
        return "Defensor";
      case "MF":
        return "Meia";
      case "FW":
        return "Atacante";
      default:
        return pos;
    }
  }

  // Calculate scores for each player
  const playerStats = players.map((player) => {
    const playerEvals = evaluations.filter((e) => e.playerId === player.id);
    const count = playerEvals.length;

    if (count === 0) {
      return {
        ...player,
        avgTechnical: 0,
        avgTactical: 0,
        avgPhysical: 0,
        avgDiscipline: 0,
        overallAvg: 0,
        evalCount: 0,
        lastEvaluated: null,
      };
    }

    const sumTech = playerEvals.reduce((sum, e) => sum + e.technical, 0);
    const sumTac = playerEvals.reduce((sum, e) => sum + e.tactical, 0);
    const sumPhys = playerEvals.reduce((sum, e) => sum + e.physical, 0);
    const sumDisc = playerEvals.reduce((sum, e) => sum + e.discipline, 0);

    const avgTechnical = sumTech / count;
    const avgTactical = sumTac / count;
    const avgPhysical = sumPhys / count;
    const avgDiscipline = sumDisc / count;
    const overallAvg = (avgTechnical + avgTactical + avgPhysical + avgDiscipline) / 4;

    const dates = playerEvals.map((e) => new Date(e.date).getTime());
    const lastEvaluated = new Date(Math.max(...dates));

    return {
      ...player,
      avgTechnical,
      avgTactical,
      avgPhysical,
      avgDiscipline,
      overallAvg,
      evalCount: count,
      lastEvaluated,
    };
  });

  // Filter players list
  const filteredPlayers = playerStats
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchPosition = positionFilter === "ALL" || p.position === positionFilter;
      return matchSearch && matchPosition;
    })
    .sort((a, b) => {
      if (sortBy === "NAME") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "RATING_DESC") {
        return b.overallAvg - a.overallAvg;
      }
      if (sortBy === "RATING_ASC") {
        // Players with no evaluations should go to the end for convenience
        if (a.overallAvg === 0) return 1;
        if (b.overallAvg === 0) return -1;
        return a.overallAvg - b.overallAvg;
      }
      if (sortBy === "EVAL_COUNT_DESC") {
        return b.evalCount - a.evalCount;
      }
      return 0;
    });

  // Helper to render star rating selectors
  function StarSelector({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
  }) {
    return (
      <div className="flex items-center justify-between py-2 border-b border-white/5">
        <span className="text-sm font-semibold text-[var(--text-subtle)]">{label}</span>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`text-2xl transition hover:scale-110 active:scale-95 cursor-pointer ${
                star <= value ? "text-amber-400" : "text-white/10 hover:text-white/20"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Helper to display star ratings
  function StarRatingDisplay({ rating }: { rating: number }) {
    return (
      <div className="flex items-center gap-0.5 text-xs">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= Math.round(rating) ? "text-amber-400" : "text-white/10"}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  function getRatingColor(rating: number) {
    if (rating === 0) return "text-[var(--text-muted)]";
    if (rating >= 4.0) return "text-emerald-400";
    if (rating >= 3.0) return "text-amber-400";
    return "text-red-400";
  }

  const selectedPlayerEvals = selectedPlayer
    ? evaluations.filter((e) => e.playerId === selectedPlayer.id)
    : [];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text)]">Avaliação de Atletas</h1>
        <p className="mt-1 text-sm text-[var(--text-subtle)]">
          Anotações táticas, disciplinares e acompanhamento técnico exclusivo da comissão técnica
        </p>
      </div>

      {/* Filter and sorting controls */}
      <div className="app-surface rounded-2xl border border-[var(--border)] p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="w-full md:max-w-xs">
          <Input
            placeholder="Buscar jogador por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--surface-soft)]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="w-full sm:w-40 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            <option value="ALL">Todas as posições</option>
            <option value="GK">Goleiros</option>
            <option value="DF">Defensores</option>
            <option value="MF">Meio-Campistas</option>
            <option value="FW">Atacantes</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-56 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            <option value="NAME">Ordenar por Nome</option>
            <option value="RATING_DESC">Maior Média Geral</option>
            <option value="RATING_ASC">Menor Média Geral</option>
            <option value="EVAL_COUNT_DESC">Mais Avaliados</option>
          </select>
        </div>
      </div>

      {/* Grid of Players */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-[var(--surface-soft)] border border-white/5" />
          ))}
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="app-surface rounded-2xl border border-dashed border-[var(--border-strong)] p-14 text-center text-[var(--text-muted)]">
          <p className="text-4xl">🏃‍♂️</p>
          <p className="mt-3 text-base font-semibold text-white">Nenhum jogador localizado</p>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            Tente reajustar seus filtros ou adicione novos atletas no elenco.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((p) => (
            <div
              key={p.id}
              onClick={() => handleOpenPlayerDrawer(p)}
              className="app-surface group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] p-5 shadow-sm hover:border-[rgba(16,185,129,0.3)] hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-lg border border-white/5 font-black text-white/50 group-hover:bg-[var(--brand)] group-hover:text-white transition-all">
                    {p.shirtNumber || "—"}
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-[var(--brand)] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                      {getPositionLabel(p.position)}
                    </p>
                  </div>
                </div>

                {/* Performance Average Block */}
                <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 flex items-center justify-between">
                  <span className="text-xs text-[var(--text-subtle)] font-medium">Índice Desportivo</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-base font-black ${getRatingColor(p.overallAvg)}`}>
                      {p.overallAvg > 0 ? p.overallAvg.toFixed(1) : "Sem nota"}
                    </span>
                    {p.overallAvg > 0 && <StarRatingDisplay rating={p.overallAvg} />}
                  </div>
                </div>
              </div>

              {/* Card Footer info */}
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{p.evalCount} {p.evalCount === 1 ? "avaliação" : "avaliações"}</span>
                <span>
                  {p.lastEvaluated
                    ? `Avaliado em: ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(p.lastEvaluated))}`
                    : "Pendente"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Athlete Profile Drawer Modal */}
      {selectedPlayer && (
        <Modal
          open={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          title={`Avaliação de Desempenho: ${selectedPlayer.name}`}
        >
          <div className="space-y-6">
            {/* Sub-Header details */}
            <div className="flex flex-wrap gap-2 items-center justify-between pb-4 border-b border-white/5">
              <div className="flex gap-2 items-center">
                <Badge variant="info" className="px-2.5 py-0.5 rounded-full font-semibold uppercase text-[0.7rem] bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {getPositionLabel(selectedPlayer.position)}
                </Badge>
                {selectedPlayer.shirtNumber && (
                  <Badge variant="default" className="px-2.5 py-0.5 rounded-full font-bold text-[0.7rem] bg-white/5 border border-white/10">
                    Camisa #{selectedPlayer.shirtNumber}
                  </Badge>
                )}
              </div>

              {/* Tabs */}
              <div className="flex rounded-lg bg-white/5 p-0.5">
                <button
                  onClick={() => {
                    setActiveTab("HISTORY");
                    setEditingEval(null);
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                    activeTab === "HISTORY" ? "bg-[var(--brand)] text-white shadow-sm" : "text-[var(--text-subtle)] hover:text-white"
                  }`}
                >
                  Fichas e Histórico
                </button>
                <button
                  onClick={() => setActiveTab("NEW")}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                    activeTab === "NEW" ? "bg-[var(--brand)] text-white shadow-sm" : "text-[var(--text-subtle)] hover:text-white"
                  }`}
                >
                  {editingEval ? "Editar Ficha" : "Registrar Notas"}
                </button>
              </div>
            </div>

            {/* TAB: Evaluation Timeline History */}
            {activeTab === "HISTORY" && (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {selectedPlayerEvals.length === 0 ? (
                  <div className="py-12 text-center text-[var(--text-muted)] border border-dashed border-white/5 rounded-2xl">
                    <p className="text-3xl">📋</p>
                    <p className="mt-2 text-sm font-semibold text-white">Nenhum prontuário registrado</p>
                    <p className="mt-1 text-xs text-[var(--text-subtle)]">
                      Nenhuma anotação técnica ou de comportamento foi feita para este jogador ainda.
                    </p>
                  </div>
                ) : (
                  <div className="relative border-l border-white/10 pl-5 ml-2.5 space-y-6">
                    {selectedPlayerEvals.map((ev) => {
                      const avg = (ev.technical + ev.tactical + ev.physical + ev.discipline) / 4;
                      return (
                        <div key={ev.id} className="relative group">
                          {/* Timeline node circle */}
                          <div className="absolute -left-[1.62rem] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-[var(--brand)] ring-4 ring-[#0f172a]" />

                          <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-3 hover:border-white/10 transition-colors">
                            {/* Evaluation Header */}
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider block">
                                  Avaliador: {ev.evaluator.name}
                                </span>
                                <span className="text-xs text-[var(--text-muted)] block mt-0.5">
                                  Data: {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(ev.date))}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleStartEdit(ev)}
                                  className="rounded-lg bg-white/5 p-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-all cursor-pointer"
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleOpenDelete(ev.id)}
                                  className="rounded-lg bg-red-500/10 p-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25 transition-all cursor-pointer"
                                  title="Excluir"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            {/* Ratings metrics subgrid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 border-t border-b border-white/5">
                              <div>
                                <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] block">Técnica</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-xs font-bold text-white">{ev.technical}</span>
                                  <StarRatingDisplay rating={ev.technical} />
                                </div>
                              </div>
                              <div>
                                <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] block">Tática</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-xs font-bold text-white">{ev.tactical}</span>
                                  <StarRatingDisplay rating={ev.tactical} />
                                </div>
                              </div>
                              <div>
                                <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] block">Física</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-xs font-bold text-white">{ev.physical}</span>
                                  <StarRatingDisplay rating={ev.physical} />
                                </div>
                              </div>
                              <div>
                                <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] block">Disciplina</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-xs font-bold text-white">{ev.discipline}</span>
                                  <StarRatingDisplay rating={ev.discipline} />
                                </div>
                              </div>
                            </div>

                            {/* Text Observations Content */}
                            <p className="text-sm text-[var(--text-subtle)] leading-relaxed whitespace-pre-line">
                              {ev.content}
                            </p>

                            {/* Average index */}
                            <div className="flex justify-end text-xs text-[var(--text-muted)]">
                              <span>Média desta ficha: <strong className="text-white">{avg.toFixed(2)}</strong></span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Register New Evaluation Form */}
            {activeTab === "NEW" && (
              <form onSubmit={handleSaveEvaluation} className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {formError && (
                  <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20">
                    {formError}
                  </p>
                )}

                {/* Rating pillars panel */}
                <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-1">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-2">Fundamentos Técnicos e Comportamento</h4>
                  <StarSelector label="Técnica (Passe, Habilidade, Finalização)" value={technical} onChange={setTechnical} />
                  <StarSelector label="Tática (Posicionamento, Tomada de decisão)" value={tactical} onChange={setTactical} />
                  <StarSelector label="Física (Resistência, Velocidade, Força)" value={physical} onChange={setPhysical} />
                  <StarSelector label="Disciplina (Pontualidade, Postura, Atitude)" value={discipline} onChange={setDiscipline} />
                </div>

                <div className="space-y-4">
                  <Textarea
                    label="Observações Detalhadas e Análise Técnica *"
                    placeholder="Descreva observações de treino, pontos de melhoria, comportamento e anotações técnicas importantes..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={4}
                  />

                  <Input
                    label="Data do Relatório/Treino *"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                  {editingEval && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setEditingEval(null);
                        setTechnical(3);
                        setTactical(3);
                        setPhysical(3);
                        setDiscipline(3);
                        setContent("");
                        setDate(new Date().toISOString().substring(0, 10));
                        setActiveTab("HISTORY");
                      }}
                      disabled={saving}
                    >
                      Cancelar Edição
                    </Button>
                  )}
                  <Button type="submit" loading={saving} disabled={saving}>
                    {saving ? "Salvando..." : editingEval ? "Salvar Alterações" : "Registrar Relatório"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, evalId: null })}
        title="Excluir Relatório de Avaliação"
      >
        <p className="text-sm text-[var(--text-subtle)] leading-relaxed">
          Tem certeza de que deseja excluir permanentemente esta avaliação? Os dados de notas e as anotações escritas do prontuário histórico serão apagados permanentemente.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDeleteModal({ open: false, evalId: null })}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={executeDeleteEvaluation}
            loading={deleting}
          >
            Confirmar Exclusão
          </Button>
        </div>
      </Modal>
    </div>
  );
}
