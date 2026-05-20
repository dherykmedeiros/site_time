"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  BarChart2, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Lock, 
  Users, 
  Save, 
  AlertCircle, 
  Info,
  ChevronRight,
  Shield
} from "lucide-react";

interface PlayerSummary {
  id: string;
  name: string;
  photoUrl: string | null;
}

interface DatePollVote {
  id: string;
  optionId: string;
  playerId: string;
  player: PlayerSummary;
}

interface DatePollOption {
  id: string;
  pollId: string;
  date: string;
  label: string | null;
  votes: DatePollVote[];
}

interface DatePoll {
  id: string;
  title: string;
  closedAt: string | null;
  createdAt: string;
  options: DatePollOption[];
  match?: {
    id: string;
    opponent: string;
    venue: string;
  } | null;
}

interface MatchSummary {
  id: string;
  opponent: string;
  date: string;
  venue: string;
}

export default function PollsDashboardPage() {
  const { data: session } = useSession();
  const [polls, setPolls] = useState<DatePoll[]>([]);
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [isActivePlayer, setIsActivePlayer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Voting temporary states (keeps track of checkbox changes per poll ID)
  // Record<pollId, Record<optionId, boolean>>
  const [tempVotes, setTempVotes] = useState<Record<string, Record<string, boolean>>>({});
  const [votingLoading, setVotingLoading] = useState<Record<string, boolean>>({});

  // Poll creation states
  const [newTitle, setNewTitle] = useState("");
  const [newMatchId, setNewMatchId] = useState("");
  const [newOptions, setNewOptions] = useState<string[]>([""]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState<"active" | "closed">("active");

  const isAdminOrCoach = session?.user?.role === "ADMIN" || session?.user?.role === "COACH";

  // Load everything on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        // 1. Load my player profile
        const meRes = await fetch("/api/players/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          setMyPlayerId(meData.id);
          setIsActivePlayer(meData.status === "ACTIVE");
        }

        // 2. Load polls
        await fetchPolls();

        // 3. Load scheduled matches (for creators)
        if (isAdminOrCoach) {
          const matchRes = await fetch("/api/matches?status=SCHEDULED");
          if (matchRes.ok) {
            const matchData = await matchRes.json();
            setMatches(matchData.matches || []);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Não foi possível carregar os dados das enquetes.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [session, isAdminOrCoach]);

  async function fetchPolls() {
    const res = await fetch("/api/polls");
    if (!res.ok) throw new Error("Erro ao buscar enquetes");
    const data = await res.json();
    setPolls(data);

    // Initialize temp votes state from loaded polls
    const initialTempVotes: Record<string, Record<string, boolean>> = {};
    data.forEach((poll: DatePoll) => {
      initialTempVotes[poll.id] = {};
      poll.options.forEach((opt) => {
        const hasVoted = opt.votes.some((v) => v.playerId === myPlayerId);
        initialTempVotes[poll.id][opt.id] = hasVoted;
      });
    });
    setTempVotes(initialTempVotes);
  }

  // Handle changing checkboxes
  const handleCheckboxChange = (pollId: string, optionId: string, checked: boolean) => {
    setTempVotes((prev) => ({
      ...prev,
      [pollId]: {
        ...prev[pollId],
        [optionId]: checked,
      },
    }));
  };

  // Submit votes for a poll
  const submitVotes = async (pollId: string) => {
    if (!myPlayerId || !isActivePlayer) {
      alert("Apenas jogadores integrados e ativos podem votar.");
      return;
    }

    setVotingLoading((prev) => ({ ...prev, [pollId]: true }));
    try {
      const selectedOptionIds = Object.entries(tempVotes[pollId] || {})
        .filter(([_, checked]) => checked)
        .map(([optId]) => optId);

      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIds: selectedOptionIds }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        alert(errJson.error || "Erro ao registrar voto.");
        return;
      }

      // Reload polls to reflect update
      await fetchPolls();
      alert("Seus votos foram registrados com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao registrar votos.");
    } finally {
      setVotingLoading((prev) => ({ ...prev, [pollId]: false }));
    }
  };

  // Close poll action (Admin/Coach only)
  const closePoll = async (pollId: string) => {
    if (!confirm("Tem certeza que deseja encerrar esta votação de datas?")) {
      return;
    }

    try {
      const res = await fetch(`/api/polls/${pollId}/close`, {
        method: "POST",
      });

      if (!res.ok) {
        const errJson = await res.json();
        alert(errJson.error || "Erro ao encerrar enquete.");
        return;
      }

      await fetchPolls();
      alert("Enquete encerrada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao encerrar enquete.");
    }
  };

  // Dynamic creation dynamic fields logic
  const addOptionField = () => {
    setNewOptions([...newOptions, ""]);
  };

  const removeOptionField = (index: number) => {
    if (newOptions.length === 1) return;
    setNewOptions(newOptions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };

  // Create poll submit
  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(false);

    if (!newTitle.trim()) {
      setCreateError("O título da enquete é obrigatório.");
      return;
    }

    // Filter empty options
    const optionsToSubmit = newOptions.filter((opt) => opt.trim() !== "");
    if (optionsToSubmit.length === 0) {
      setCreateError("Você deve fornecer pelo menos uma opção de data.");
      return;
    }

    setCreateLoading(true);
    try {
      // options must be ISO strings
      const isoOptions = optionsToSubmit.map((opt) => new Date(opt).toISOString());

      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          options: isoOptions,
          matchId: newMatchId || undefined,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        setCreateError(errJson.error || "Erro ao criar enquete.");
        return;
      }

      setCreateSuccess(true);
      setNewTitle("");
      setNewMatchId("");
      setNewOptions([""]);
      await fetchPolls();
    } catch (err) {
      console.error(err);
      setCreateError("Erro interno ao tentar criar a enquete.");
    } finally {
      setCreateLoading(false);
    }
  };

  // Date formatting helpers
  const formatPollDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayName = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(d);
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);

    return `${capitalizedDay}, ${formattedDate}`;
  };

  // Helper to check if user had voted on an option initially
  const hasVotedOnOption = (pollId: string, optionId: string) => {
    const poll = polls.find((p) => p.id === pollId);
    if (!poll) return false;
    const option = poll.options.find((o) => o.id === optionId);
    if (!option) return false;
    return option.votes.some((v) => v.playerId === myPlayerId);
  };

  // Check if anything changed between initial state and temp votes to enable Save button
  const isSaveEnabled = (pollId: string) => {
    const poll = polls.find((p) => p.id === pollId);
    if (!poll || poll.closedAt) return false;
    return poll.options.some((opt) => {
      const initial = opt.votes.some((v) => v.playerId === myPlayerId);
      const current = tempVotes[pollId]?.[opt.id] ?? false;
      return initial !== current;
    });
  };

  // Tab Filtering
  const activePolls = polls.filter((p) => p.closedAt === null);
  const closedPolls = polls.filter((p) => p.closedAt !== null);
  const filteredPolls = activeTab === "active" ? activePolls : closedPolls;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header bar and info alert */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-muted)]">
            Decisão Coletiva e Disponibilidade
          </p>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
            Votação de Datas para Partidas
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[var(--bg-elevated)] border border-[rgba(16,185,129,0.15)] px-4 py-2.5 rounded-xl">
          <Info size={14} className="text-[#34d399]" />
          <span className="font-semibold text-white/95">
            {isActivePlayer ? (
              <span className="text-[#34d399]">Jogador Ativo (Apto a votar)</span>
            ) : (
              <span className="text-rose-400">Perfil inativo ou não vinculado (Apenas visualização)</span>
            )}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: LIST OF POLLS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active / Closed Tabs */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setActiveTab("active")}
              className={`pb-3.5 px-6 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "active"
                  ? "border-[#10b981] text-[#34d399]"
                  : "border-transparent text-[#8fa39b] hover:text-white"
              }`}
            >
              Ativas ({activePolls.length})
            </button>
            <button
              onClick={() => setActiveTab("closed")}
              className={`pb-3.5 px-6 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "closed"
                  ? "border-[#10b981] text-[#34d399]"
                  : "border-transparent text-[#8fa39b] hover:text-white"
              }`}
            >
              Encerradas ({closedPolls.length})
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-[var(--text-muted)]">Carregando enquetes de datas...</p>
            </div>
          ) : error ? (
            <div className="app-surface p-6 border-red-500/20 text-center text-rose-400 text-xs font-semibold">
              {error}
            </div>
          ) : filteredPolls.length === 0 ? (
            <div className="app-surface p-12 text-center text-[var(--text-muted)] text-xs font-semibold">
              Nenhuma enquete {activeTab === "active" ? "ativa" : "encerrada"} no momento.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPolls.map((poll) => {
                // Calculate total unique players who voted in this poll
                const uniqueVoters = new Set<string>();
                poll.options.forEach((opt) => {
                  opt.votes.forEach((v) => uniqueVoters.add(v.playerId));
                });
                const totalPollVoters = uniqueVoters.size;

                return (
                  <div key={poll.id} className="app-surface p-6 space-y-6 border-white/5 relative overflow-hidden">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1 text-left">
                        {poll.match && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#34d399] bg-[#10b981]/15 border border-[#10b981]/25 px-2.5 py-0.5 rounded">
                            Temporária: vs {poll.match.opponent}
                          </span>
                        )}
                        <h3 className="text-base font-bold text-white uppercase">{poll.title}</h3>
                        <p className="text-[10px] text-[#8fa39b] font-medium">
                          Criada em: {new Date(poll.createdAt).toLocaleDateString("pt-BR")} • Total de votantes: {totalPollVoters}
                        </p>
                      </div>

                      {/* Admin closing action / status */}
                      <div className="flex items-center gap-2 self-start">
                        {poll.closedAt ? (
                          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full">
                            <Lock size={10} /> Enquete Encerrada
                          </span>
                        ) : (
                          <>
                            {isAdminOrCoach && (
                              <button
                                onClick={() => closePoll(poll.id)}
                                className="inline-flex min-h-8 items-center justify-center rounded-lg border border-rose-500/30 hover:border-rose-500 hover:bg-rose-500/10 px-3.5 text-[9px] font-black uppercase tracking-wider text-rose-400 hover:text-white transition-all cursor-pointer"
                              >
                                Encerrar Enquete
                              </button>
                            )}
                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399] px-3 py-1 rounded-full">
                              Ativa
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Options list */}
                    <div className="space-y-4">
                      {poll.options.map((opt) => {
                        const optVotesCount = opt.votes.length;
                        // Calculate percentage of this option
                        const percentage = totalPollVoters > 0 
                          ? Math.round((optVotesCount / totalPollVoters) * 100) 
                          : 0;

                        const isVotedLocal = tempVotes[poll.id]?.[opt.id] ?? false;

                        return (
                          <div key={opt.id} className="space-y-2">
                            <div className="flex items-center justify-between gap-3 text-xs">
                              {/* Left: Input Checkbox and Label */}
                              <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  disabled={!!poll.closedAt || !isActivePlayer}
                                  checked={isVotedLocal}
                                  onChange={(e) => handleCheckboxChange(poll.id, opt.id, e.target.checked)}
                                  className="w-4 h-4 accent-[#10b981] rounded border-white/10 bg-black disabled:opacity-50 cursor-pointer"
                                />
                                <div className="text-left">
                                  <span className="font-bold text-white group-hover:text-[#34d399]">
                                    {formatPollDate(opt.date)}
                                  </span>
                                  {opt.label && (
                                    <span className="block text-[10px] text-[#8fa39b] font-medium">{opt.label}</span>
                                  )}
                                </div>
                              </label>

                              {/* Right: Vote count and percentage */}
                              <span className="font-black text-[#34d399] shrink-0">
                                {optVotesCount} {optVotesCount === 1 ? "voto" : "votos"} ({percentage}%)
                              </span>
                            </div>

                            {/* Progress bar container */}
                            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                              <div 
                                className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>

                            {/* Player avatars */}
                            {opt.votes.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 pt-1 pl-7">
                                {opt.votes.map((v) => (
                                  <div 
                                    key={v.id} 
                                    title={v.player.name}
                                    className="w-5.5 h-5.5 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-[7px] font-black text-white shrink-0"
                                  >
                                    {v.player.photoUrl ? (
                                      <img src={v.player.photoUrl} alt={v.player.name} className="w-full h-full object-cover" />
                                    ) : (
                                      v.player.name.substring(0, 2).toUpperCase()
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer: Save/Vote action buttons */}
                    {!poll.closedAt && isActivePlayer && (
                      <div className="flex justify-end pt-2 border-t border-white/5">
                        <button
                          onClick={() => submitVotes(poll.id)}
                          disabled={!isSaveEnabled(poll.id) || votingLoading[poll.id]}
                          className={`inline-flex min-h-10 items-center justify-center rounded-full px-6 text-xs font-bold uppercase tracking-wider text-black transition-all cursor-pointer gap-2 ${
                            isSaveEnabled(poll.id)
                              ? "bg-[#10b981] hover:bg-[#34d399] shadow-lg shadow-emerald-500/10 transform hover:-translate-y-0.5 active:translate-y-0"
                              : "bg-[#8fa39b]/35 text-white/50 cursor-not-allowed"
                          }`}
                        >
                          {votingLoading[poll.id] ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save size={14} className="stroke-[2.5]" />
                          )}
                          Salvar Meus Votos
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: POLL CREATION FOR ADMINS / COACHES */}
        <div className="space-y-6">
          {isAdminOrCoach ? (
            <div className="app-surface p-6 border-white/5 space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                <BarChart2 size={18} className="text-[#10b981]" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                  Criar Nova Votação
                </h3>
              </div>

              <form onSubmit={handleCreatePoll} className="space-y-5 text-left">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#8fa39b]">
                    Título da Enquete *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Treinamento Extra ou Amistoso"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white text-xs placeholder-white/20 focus:border-[#10b981]/50 focus:outline-none"
                  />
                </div>

                {/* Match Attachment (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#8fa39b]">
                    Vincular Partida Temporária
                  </label>
                  <select
                    value={newMatchId}
                    onChange={(e) => setNewMatchId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#090f0c] border border-white/10 rounded-xl text-white text-xs focus:border-[#10b981]/50 focus:outline-none"
                  >
                    <option value="" className="text-white/30">Nenhuma partida</option>
                    {matches.map((m) => (
                      <option key={m.id} value={m.id} className="text-white">
                        vs {m.opponent} ({new Date(m.date).toLocaleDateString("pt-BR")})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Datetime Fields */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#8fa39b]">
                      Opções de Data/Hora *
                    </label>
                    <button
                      type="button"
                      onClick={addOptionField}
                      className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#34d399] hover:underline cursor-pointer"
                    >
                      <Plus size={11} className="stroke-[2.5]" />
                      Adicionar Data
                    </button>
                  </div>

                  <div className="space-y-2">
                    {newOptions.map((opt, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="datetime-local"
                          required
                          value={opt}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 bg-black border border-white/10 rounded-xl text-white text-xs focus:border-[#10b981]/50 focus:outline-none"
                        />
                        {newOptions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOptionField(index)}
                            className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-white/5 transition-all cursor-pointer"
                            title="Remover opção"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message display */}
                {createError && (
                  <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-xs font-semibold">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{createError}</span>
                  </div>
                )}
                {createSuccess && (
                  <div className="flex items-center gap-2 text-[#34d399] bg-[#10b981]/10 border border-[#10b981]/20 p-3 rounded-xl text-xs font-semibold">
                    <CheckCircle size={14} className="shrink-0" />
                    <span>Votação criada com sucesso!</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={createLoading}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#10b981] hover:bg-[#34d399] px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 transform shadow-lg shadow-emerald-500/10 w-full cursor-pointer"
                >
                  {createLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Criar Enquete de Datas"
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="app-surface p-6 border-white/5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <Shield size={16} className="text-[#8fa39b]" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                  Controle de Votações
                </h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                As enquetes de datas e horários de partidas são de gerenciamento exclusivo da comissão técnica e administração do time.
              </p>
              <p className="text-xs text-[#34d399] bg-[#10b981]/5 border border-[#10b981]/15 p-3 rounded-xl font-medium">
                Você pode registrar seu voto em qualquer enquete ativa exibida no painel. O voto é livre e editável a qualquer momento enquanto a enquete estiver ativa!
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
