"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { playerPositions, playerPositionLabels, playerPositionShortLabels } from "@/lib/player-positions";
import { formatDateOnly, toInputDateString, toApiIsoDate } from "@/lib/utils";

interface Player {
  id: string;
  name: string;
  position: string;
  secondaryPosition?: string | null;
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
    secondaryPosition?: string | null;
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
  const [date, setDate] = useState(() => toInputDateString(new Date()));
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
      const promises: Promise<Response>[] = [fetch("/api/evaluations")];
      if (isCoachOrAdmin) {
        promises.push(fetch("/api/players?status=ACTIVE"));
      }

      const [evalsRes, playersRes] = await Promise.all(promises);

      if (evalsRes.ok) {
        const data = await evalsRes.json();
        setEvaluations(data.evaluations || []);
      }

      if (playersRes && playersRes.ok) {
        const data = await playersRes.json();
        setPlayers(data.players || []);
      }
    } catch {
      toast("Erro ao carregar fichas de avaliação");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authStatus === "authenticated") {
      loadData();
    }
  }, [authStatus, isCoachOrAdmin]);

  function getPositionLabel(pos: string) {
    return playerPositionLabels[pos as keyof typeof playerPositionLabels] || pos;
  }

  function getPositionShortLabel(pos: string) {
    return playerPositionShortLabels[pos as keyof typeof playerPositionShortLabels] || pos;
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

  function handleStartEdit(evaluation: Evaluation) {
    setEditingEval(evaluation);
    setTechnical(evaluation.technical);
    setTactical(evaluation.tactical);
    setPhysical(evaluation.physical);
    setDiscipline(evaluation.discipline);
    setContent(evaluation.content);
    setDate(toInputDateString(evaluation.date));
    setActiveTab("NEW");
    setFormError("");
  }

  async function handleSaveEvaluation(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPlayer) return;

    if (!content.trim()) {
      setFormError("Informe as observações técnicas e comportamentais.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const isEdit = !!editingEval;
      const url = isEdit ? `/api/evaluations/${editingEval.id}` : "/api/evaluations";
      const method = isEdit ? "PATCH" : "POST";

      const bodyData = {
        playerId: selectedPlayer.id,
        technical,
        tactical,
        physical,
        discipline,
        content: content.trim(),
        date: toApiIsoDate(date),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const resData = await res.json();

      if (!res.ok) {
        setFormError(resData.error || "Erro ao salvar avaliação");
        return;
      }

      toast(isEdit ? "Ficha de avaliação atualizada com sucesso!" : "Avaliação registrada com sucesso!");
      setEditingEval(null);
      setTechnical(3);
      setTactical(3);
      setPhysical(3);
      setDiscipline(3);
      setContent("");
      setDate(new Date().toISOString().substring(0, 10));
      setActiveTab("HISTORY");

      await loadData();
    } catch {
      setFormError("Erro de conexão ao salvar avaliação.");
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

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast(data.error || "Erro ao excluir avaliação");
        return;
      }

      toast("Avaliação excluída com sucesso");
      setDeleteModal({ open: false, evalId: null });
      await loadData();
    } catch {
      toast("Erro ao excluir avaliação");
    } finally {
      setDeleting(false);
    }
  }

  // Star selector input component
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-white/5 last:border-0">
        <span className="text-xs font-semibold text-[var(--text)]">{label}</span>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`h-7 w-7 rounded-md text-xs font-bold transition ${
                star <= value
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                  : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10"
              }`}
            >
              {star}★
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Star rating small static display
  function StarRatingDisplay({ rating }: { rating: number }) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xs ${
              star <= Math.round(rating) ? "text-amber-400" : "text-white/10"
            }`}
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

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand)] border-t-transparent" />
      </div>
    );
  }

  // PLAYER READ-ONLY VIEW (My Feedback)
  if (!isCoachOrAdmin) {
    const playerEvals = evaluations; // API returns strictly logged in player's evals for non-coach

    const count = playerEvals.length;
    const avgTech = count > 0 ? playerEvals.reduce((s, e) => s + e.technical, 0) / count : 0;
    const avgTac = count > 0 ? playerEvals.reduce((s, e) => s + e.tactical, 0) / count : 0;
    const avgPhys = count > 0 ? playerEvals.reduce((s, e) => s + e.physical, 0) / count : 0;
    const avgDisc = count > 0 ? playerEvals.reduce((s, e) => s + e.discipline, 0) / count : 0;
    const overallAvg = (avgTech + avgTac + avgPhys + avgDisc) / 4;

    return (
      <div className="space-y-7 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Meu Feedback & Avaliações</h1>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            Acompanhe a avaliação técnica, tática, física e disciplinar fornecida pela comissão técnica.
          </p>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="app-surface rounded-2xl border border-[var(--border)] p-4 flex flex-col justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Média Geral</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-3xl font-black ${getRatingColor(overallAvg)}`}>
                {count > 0 ? overallAvg.toFixed(1) : "-"}
              </span>
              <span className="text-xs text-[var(--text-muted)]">/ 5.0</span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mt-1">{count} {count === 1 ? "avaliação" : "avaliações"}</span>
          </div>

          <div className="app-surface rounded-2xl border border-[var(--border)] p-4 flex flex-col justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Técnica</span>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{count > 0 ? avgTech.toFixed(1) : "-"}</span>
              <StarRatingDisplay rating={avgTech} />
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mt-1">Passe, Finalização, Habilidade</span>
          </div>

          <div className="app-surface rounded-2xl border border-[var(--border)] p-4 flex flex-col justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Tática</span>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{count > 0 ? avgTac.toFixed(1) : "-"}</span>
              <StarRatingDisplay rating={avgTac} />
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mt-1">Posicionamento & Leitura</span>
          </div>

          <div className="app-surface rounded-2xl border border-[var(--border)] p-4 flex flex-col justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Física</span>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{count > 0 ? avgPhys.toFixed(1) : "-"}</span>
              <StarRatingDisplay rating={avgPhys} />
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mt-1">Resistência & Velocidade</span>
          </div>

          <div className="app-surface rounded-2xl border border-[var(--border)] p-4 flex flex-col justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Disciplina</span>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{count > 0 ? avgDisc.toFixed(1) : "-"}</span>
              <StarRatingDisplay rating={avgDisc} />
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mt-1">Comprometimento & Postura</span>
          </div>
        </div>

        {/* Timeline of Feedback */}
        <div className="app-surface rounded-2xl border border-[var(--border)] p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📋</span> Histórico de Fichas do Técnico
          </h2>

          {playerEvals.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-muted)] border border-dashed border-white/5 rounded-2xl">
              <p className="text-4xl">📝</p>
              <p className="mt-3 text-base font-semibold text-white">Nenhum feedback registrado ainda</p>
              <p className="mt-1 text-xs text-[var(--text-subtle)] max-w-sm mx-auto">
                Assim que a comissão técnica publicar uma avaliação do seu desempenho, ela aparecerá aqui com todos os detalhes e notas.
              </p>
            </div>
          ) : (
            <div className="relative border-l border-white/10 pl-6 ml-3 space-y-6">
              {playerEvals.map((ev) => {
                const avg = (ev.technical + ev.tactical + ev.physical + ev.discipline) / 4;
                return (
                  <div key={ev.id} className="relative">
                    <div className="absolute -left-[1.88rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--brand)] ring-4 ring-[#0f172a]" />

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4 shadow-sm hover:border-white/20 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                        <div>
                          <span className="text-xs font-bold text-[var(--brand)] uppercase tracking-wider">
                            Avaliador: {ev.evaluator.name || ev.evaluator.email}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] block mt-0.5">
                            Data: {formatDateOnly(ev.date, { dateStyle: "full" })}
                          </span>
                        </div>
                        <Badge variant="info" className="self-start sm:self-auto px-3 py-1 text-xs font-bold bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/20">
                          Média: {avg.toFixed(2)} ⭐
                        </Badge>
                      </div>

                      {/* Ratings subgrid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 bg-black/20 p-3 rounded-lg border border-white/5">
                        <div>
                          <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] block">Técnica</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm font-bold text-white">{ev.technical}</span>
                            <StarRatingDisplay rating={ev.technical} />
                          </div>
                        </div>
                        <div>
                          <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] block">Tática</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm font-bold text-white">{ev.tactical}</span>
                            <StarRatingDisplay rating={ev.tactical} />
                          </div>
                        </div>
                        <div>
                          <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] block">Física</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm font-bold text-white">{ev.physical}</span>
                            <StarRatingDisplay rating={ev.physical} />
                          </div>
                        </div>
                        <div>
                          <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] block">Disciplina</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm font-bold text-white">{ev.discipline}</span>
                            <StarRatingDisplay rating={ev.discipline} />
                          </div>
                        </div>
                      </div>

                      {/* Text Observations Content */}
                      <div>
                        <span className="text-xs font-bold text-white block mb-1">Observações do Técnico:</span>
                        <p className="text-sm text-[var(--text-subtle)] leading-relaxed whitespace-pre-line bg-white/[0.01] p-3 rounded-lg border border-white/5">
                          {ev.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // COACH / ADMIN FULL MANAGEMENT VIEW
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
      const matchPosition =
        positionFilter === "ALL" ||
        p.position === positionFilter ||
        p.secondaryPosition === positionFilter;
      return matchSearch && matchPosition;
    })
    .sort((a, b) => {
      if (sortBy === "RATING_DESC") return b.overallAvg - a.overallAvg;
      if (sortBy === "RATING_ASC") return a.overallAvg - b.overallAvg;
      if (sortBy === "EVAL_COUNT_DESC") return b.evalCount - a.evalCount;
      return a.name.localeCompare(b.name);
    });

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
            className="w-full sm:w-48 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            <option value="ALL">Todas as posições</option>
            {playerPositions.map((pos) => (
              <option key={pos} value={pos}>
                {getPositionLabel(pos)}
              </option>
            ))}
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

      {/* Players grid list */}
      {filteredPlayers.length === 0 ? (
        <div className="app-surface rounded-2xl border border-[var(--border)] p-12 text-center text-[var(--text-muted)]">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 text-base font-semibold text-white">Nenhum atleta encontrado</p>
          <p className="mt-1 text-xs text-[var(--text-subtle)]">
            Tente ajustar os filtros de busca ou posição para visualizar o elenco.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((p) => (
            <div
              key={p.id}
              onClick={() => handleOpenPlayerDrawer(p)}
              className="app-surface rounded-2xl border border-[var(--border)] p-5 hover:border-[var(--brand)]/50 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center font-bold text-lg text-white">
                      {p.photoUrl ? (
                        <img src={p.photoUrl} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        p.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-[var(--brand)] transition-colors">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <Badge variant="info" className="px-2 py-0 text-[0.65rem] uppercase font-bold">
                          {getPositionShortLabel(p.position)}
                        </Badge>
                        {p.secondaryPosition && (
                          <Badge variant="default" className="px-2 py-0 text-[0.65rem] uppercase font-semibold text-white/70 bg-white/10">
                            Sec: {getPositionShortLabel(p.secondaryPosition)}
                          </Badge>
                        )}
                        {p.shirtNumber && (
                          <span className="text-xs text-[var(--text-muted)] font-semibold">#{p.shirtNumber}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-2xl font-black ${getRatingColor(p.overallAvg)}`}>
                      {p.evalCount > 0 ? p.overallAvg.toFixed(1) : "-"}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] block">/ 5.0</span>
                  </div>
                </div>

                {/* Rating bars */}
                <div className="mt-4 grid grid-cols-4 gap-2 py-2 border-t border-b border-white/5">
                  <div className="text-center">
                    <span className="text-[0.6rem] uppercase font-bold text-[var(--text-muted)] block">Técnica</span>
                    <span className="text-xs font-bold text-white">{p.evalCount > 0 ? p.avgTechnical.toFixed(1) : "-"}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[0.6rem] uppercase font-bold text-[var(--text-muted)] block">Tática</span>
                    <span className="text-xs font-bold text-white">{p.evalCount > 0 ? p.avgTactical.toFixed(1) : "-"}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[0.6rem] uppercase font-bold text-[var(--text-muted)] block">Física</span>
                    <span className="text-xs font-bold text-white">{p.evalCount > 0 ? p.avgPhysical.toFixed(1) : "-"}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[0.6rem] uppercase font-bold text-[var(--text-muted)] block">Disciplina</span>
                    <span className="text-xs font-bold text-white">{p.evalCount > 0 ? p.avgDiscipline.toFixed(1) : "-"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{p.evalCount} {p.evalCount === 1 ? "ficha registrada" : "fichas registradas"}</span>
                <span className="font-semibold text-[var(--brand)] group-hover:underline flex items-center gap-1">
                  Abrir Prontuário →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Player Detail Modal */}
      {selectedPlayer && (
        <Modal
          open={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          title={`Prontuário de Avaliação — ${selectedPlayer.name}`}
        >
          <div className="space-y-5">
            {/* Player Info Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="info" className="px-2.5 py-0.5 rounded-full font-semibold uppercase text-[0.7rem] bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {getPositionLabel(selectedPlayer.position)}
                </Badge>
                {selectedPlayer.secondaryPosition && (
                  <Badge variant="default" className="px-2.5 py-0.5 rounded-full font-semibold uppercase text-[0.7rem] bg-white/10 text-white/80">
                    Sec: {getPositionLabel(selectedPlayer.secondaryPosition)}
                  </Badge>
                )}
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
                          <div className="absolute -left-[1.62rem] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-[var(--brand)] ring-4 ring-[#0f172a]" />

                          <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-3 hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider block">
                                  Avaliador: {ev.evaluator.name || ev.evaluator.email}
                                </span>
                                <span className="text-xs text-[var(--text-muted)] block mt-0.5">
                                  Data: {formatDateOnly(ev.date, { dateStyle: "long" })}
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

                            <p className="text-sm text-[var(--text-subtle)] leading-relaxed whitespace-pre-line">
                              {ev.content}
                            </p>

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
