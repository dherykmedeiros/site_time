"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Sparkles, ArrowLeftRight } from "lucide-react";

interface RSVP {
  playerId: string;
  playerName: string;
  status: string;
  isGuest?: boolean;
  guestPlayerId?: string | null;
}

interface PlayerStatInput {
  playerId: string;
  guestPlayerId?: string | null;
  playerName: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  teamSide?: "A" | "B";
}

interface SquadPlayer {
  id: string;
  name: string;
  position: string;
  shirtNumber: number;
  status?: string;
}

interface PostGameFormProps {
  matchId: string;
  matchType?: string;
  lineupData?: any;
  rsvps: RSVP[];
  mode?: "create" | "edit";
  initialHomeScore?: number | null;
  initialAwayScore?: number | null;
  initialStats?: PlayerStatInput[];
  initialIsHome?: boolean;
  opponentBadgeUrl?: string | null;
  allowOpponentBadgeEdit?: boolean;
  allowIsHomeEdit?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PostGameForm({
  matchId,
  matchType,
  lineupData,
  rsvps,
  mode = "create",
  initialHomeScore,
  initialAwayScore,
  initialStats,
  initialIsHome,
  opponentBadgeUrl,
  allowOpponentBadgeEdit = false,
  allowIsHomeEdit = false,
  onSuccess,
  onCancel,
}: PostGameFormProps) {
  const isTraining = matchType === "TRAINING";
  const isHomeActual = initialIsHome ?? true;
  const [isHome, setIsHome] = useState(isHomeActual);
  const [ourScore, setOurScore] = useState<number>(
    isHomeActual ? (initialHomeScore ?? 0) : (initialAwayScore ?? 0)
  );
  const [opponentScore, setOpponentScore] = useState<number>(
    isHomeActual ? (initialAwayScore ?? 0) : (initialHomeScore ?? 0)
  );
  const [opponentBadgeInput, setOpponentBadgeInput] = useState(opponentBadgeUrl ?? "");
  const [uploadingBadge, setUploadingBadge] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState<"score" | "stats">(mode === "edit" ? "stats" : "score");

  const [squadPlayers, setSquadPlayers] = useState<SquadPlayer[]>([]);
  const [selectedPlayerToAdd, setSelectedPlayerToAdd] = useState("");
  const [selectedSideToAdd, setSelectedSideToAdd] = useState<"A" | "B">("A");

  // Track team sides for players (A or B)
  const [playerSides, setPlayerSides] = useState<Record<string, "A" | "B">>({});

  // Initialize player sides from lineupData or fetch if missing
  useEffect(() => {
    const sides: Record<string, "A" | "B"> = {};
    if (lineupData?.trainingDivision) {
      const div = lineupData.trainingDivision;
      [...div.teamA.starters, ...div.teamA.bench].forEach((p: any) => {
        const id = p.guestPlayerId || p.playerId || p.id;
        if (id) sides[id] = "A";
      });
      [...div.teamB.starters, ...div.teamB.bench].forEach((p: any) => {
        const id = p.guestPlayerId || p.playerId || p.id;
        if (id) sides[id] = "B";
      });
      setPlayerSides(sides);
    } else if (lineupData?.lineup) {
      [...lineupData.lineup.starters, ...lineupData.lineup.bench].forEach((p: any) => {
        const id = p.guestPlayerId || p.playerId || p.id;
        if (id) sides[id] = p.teamSide === "B" ? "B" : "A";
      });
      setPlayerSides(sides);
    } else if (isTraining) {
      // Fetch lineup to get team sides
      fetch(`/api/matches/${matchId}/lineup`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.lineup) {
            const fetchedSides: Record<string, "A" | "B"> = {};
            [...d.lineup.starters, ...d.lineup.bench].forEach((p: any) => {
              const id = p.guestPlayerId || p.playerId || p.id;
              if (id) fetchedSides[id] = p.teamSide === "B" ? "B" : "A";
            });
            setPlayerSides((prev) => ({ ...fetchedSides, ...prev }));
          }
        })
        .catch(() => {});
    }
  }, [lineupData, isTraining, matchId]);

  useEffect(() => {
    fetch("/api/players")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.players) setSquadPlayers(d.players);
      })
      .catch(() => {});
  }, []);

  // Initialize stats for confirmed players
  const getEffectiveId = (item: { playerId?: string | null; guestPlayerId?: string | null }) =>
    item.guestPlayerId || item.playerId || "";

  const confirmedPlayers = rsvps.filter((r) => r.status === "CONFIRMED");
  const initialStatsByEffectiveId = new Map(
    (initialStats || []).map((item) => [getEffectiveId(item), item])
  );

  const confirmedEffectiveIds = new Set(
    confirmedPlayers.map((r) => r.guestPlayerId || r.playerId)
  );

  const mergedPlayers = [
    ...confirmedPlayers.map((r) => ({
      playerId: r.isGuest ? null : r.playerId,
      guestPlayerId: r.isGuest ? (r.guestPlayerId || r.playerId) : null,
      playerName: r.playerName,
      status: r.status,
    })),
    ...((initialStats || [])
      .filter((item) => {
        const effId = getEffectiveId(item);
        return effId && !confirmedEffectiveIds.has(effId);
      })
      .map((item) => ({
        playerId: item.guestPlayerId ? null : item.playerId,
        guestPlayerId: item.guestPlayerId || null,
        playerName: item.playerName,
        status: "CONFIRMED",
        respondedAt: null,
      }))),
  ];

  const [playerStats, setPlayerStats] = useState<PlayerStatInput[]>(
    mergedPlayers.map((r) => {
      const effId = getEffectiveId(r);
      const stat = initialStatsByEffectiveId.get(effId);
      return {
        playerId: r.playerId || stat?.playerId || "",
        guestPlayerId: r.guestPlayerId || stat?.guestPlayerId || null,
        playerName: r.playerName,
        goals: stat?.goals ?? 0,
        assists: stat?.assists ?? 0,
        yellowCards: stat?.yellowCards ?? 0,
        redCards: stat?.redCards ?? 0,
      };
    })
  );

  const playerStatsEffectiveIds = new Set(
    playerStats.map((ps) => ps.guestPlayerId || ps.playerId)
  );

  const eligiblePlayers = squadPlayers.filter(
    (sp) => !playerStatsEffectiveIds.has(sp.id)
  );

  function updatePlayerStat(
    index: number,
    field: keyof Omit<PlayerStatInput, "playerId" | "playerName" | "teamSide">,
    value: number
  ) {
    setPlayerStats((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function removePlayerStat(indexToRemove: number) {
    setPlayerStats((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  function togglePlayerSide(id: string) {
    setPlayerSides((prev) => ({
      ...prev,
      [id]: prev[id] === "B" ? "A" : "B",
    }));
  }

  // Calculated goals by team
  const goalsSumA = useMemo(() => {
    return playerStats
      .filter((p) => {
        const id = p.guestPlayerId || p.playerId;
        return (playerSides[id] || "A") === "A";
      })
      .reduce((sum, p) => sum + p.goals, 0);
  }, [playerStats, playerSides]);

  const goalsSumB = useMemo(() => {
    return playerStats
      .filter((p) => {
        const id = p.guestPlayerId || p.playerId;
        return playerSides[id] === "B";
      })
      .reduce((sum, p) => sum + p.goals, 0);
  }, [playerStats, playerSides]);

  function handleSyncScoreWithGoals() {
    setOurScore(goalsSumA);
    setOpponentScore(goalsSumB);
  }

  async function handleSubmitScore() {
    setLoading(true);
    setErrorMsg("");

    const payload = isTraining
      ? { homeScore: ourScore, awayScore: opponentScore, isHome: true }
      : isHome
      ? { homeScore: ourScore, awayScore: opponentScore }
      : { homeScore: opponentScore, awayScore: ourScore };

    try {
      // Step 1: Submit score (triggers COMPLETED)
      const scoreRes = await fetch(`/api/matches/${matchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!scoreRes.ok) {
        const data = await scoreRes.json();
        setErrorMsg(data.error || "Erro ao registrar placar");
        return;
      }

      // Move to stats step
      setStep("stats");
    } catch {
      setErrorMsg("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitStats() {
    setLoading(true);
    setErrorMsg("");

    try {
      const metadataPayload: Record<string, unknown> = {};

      if (!isTraining && allowIsHomeEdit) {
        metadataPayload.isHome = isHome;
      }

      if (mode === "edit") {
        if (isTraining || isHome) {
          metadataPayload.homeScore = ourScore;
          metadataPayload.awayScore = opponentScore;
        } else {
          metadataPayload.homeScore = opponentScore;
          metadataPayload.awayScore = ourScore;
        }
      }

      if (!isTraining && allowOpponentBadgeEdit && opponentBadgeInput.trim()) {
        metadataPayload.opponentBadgeUrl = opponentBadgeInput.trim();
      }

      if (Object.keys(metadataPayload).length > 0) {
        const badgeRes = await fetch(`/api/matches/${matchId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metadataPayload),
        });

        if (!badgeRes.ok) {
          const badgeData = await badgeRes.json();
          setErrorMsg(badgeData.error || "Erro ao salvar dados do pós-jogo");
          return;
        }
      }

      if (playerStats.length > 0) {
        // Validate stats
        for (const stat of playerStats) {
          if (stat.yellowCards > 2) {
            setErrorMsg(`${stat.playerName}: máximo 2 cartões amarelos`);
            setLoading(false);
            return;
          }
          if (stat.redCards > 1) {
            setErrorMsg(`${stat.playerName}: máximo 1 cartão vermelho`);
            setLoading(false);
            return;
          }
        }

        const statsPayload = {
          stats: playerStats.map((s) => ({
            playerId: s.guestPlayerId ? null : s.playerId,
            guestPlayerId: s.guestPlayerId || null,
            goals: s.goals,
            assists: s.assists,
            yellowCards: s.yellowCards,
            redCards: s.redCards,
          })),
        };

        const res = await fetch(`/api/matches/${matchId}/stats`, {
          method: mode === "edit" ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(statsPayload),
        });

        if (!res.ok) {
          const data = await res.json();
          if (data.code === "STATS_ALREADY_EXIST") {
            const putRes = await fetch(`/api/matches/${matchId}/stats`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(statsPayload),
            });
            if (!putRes.ok) {
              const putData = await putRes.json();
              setErrorMsg(putData.error || "Erro ao registrar estatísticas");
              return;
            }
          } else {
            setErrorMsg(data.error || "Erro ao registrar estatísticas");
            return;
          }
        }
      }

      onSuccess?.();
    } catch {
      setErrorMsg("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  async function handleSkipStats() {
    onSuccess?.();
  }

  async function handleOpponentBadgeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBadge(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao enviar escudo do adversário");
        return;
      }

      setOpponentBadgeInput(data.url);
    } catch {
      setErrorMsg("Erro ao enviar escudo do adversário");
    } finally {
      setUploadingBadge(false);
    }
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      {step === "score" && (
        <>
          <p className="text-sm text-[var(--text-muted)]">
            {isTraining
              ? "Registre o placar final do Amistoso Treino entre Time A e Time B."
              : "Registre o placar final da partida. Isso marcará a partida como finalizada."}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                label={isTraining ? "Time A (Colete)" : isHome ? "Nosso Time (Casa)" : "Nosso Time (Visitante)"}
                type="number"
                min={0}
                value={ourScore}
                onChange={(e) => setOurScore(parseInt(e.target.value) || 0)}
              />
            </div>
            <span className="pt-6 text-2xl font-bold text-[var(--text-muted)]">x</span>
            <div className="flex-1">
              <Input
                label={isTraining ? "Time B (Sem Colete)" : isHome ? "Adversário (Visitante)" : "Adversário (Casa)"}
                type="number"
                min={0}
                value={opponentScore}
                onChange={(e) => setOpponentScore(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSubmitScore} disabled={loading}>
              {loading ? "Salvando..." : "Registrar Placar"}
            </Button>
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </>
      )}

      {step === "stats" && (
        <>
          {mode === "edit" && (
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-300">
              {isTraining
                ? "No pós-jogo do Amistoso Treino, você pode ajustar o placar do Time A e Time B e as estatísticas de cada lado."
                : "No pós-jogo você pode ajustar placar, mando casa/fora, escudo adversário e estatísticas."}
            </div>
          )}

          {mode === "edit" && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={isTraining ? "Placar Time A" : isHome ? "Placar nosso time (Casa)" : "Placar nosso time (Visitante)"}
                type="number"
                min={0}
                value={ourScore}
                onChange={(e) => setOurScore(parseInt(e.target.value) || 0)}
              />
              <Input
                label={isTraining ? "Placar Time B" : isHome ? "Placar adversário (Visitante)" : "Placar adversário (Casa)"}
                type="number"
                min={0}
                value={opponentScore}
                onChange={(e) => setOpponentScore(parseInt(e.target.value) || 0)}
              />
            </div>
          )}

          {isTraining && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-emerald-400">
                  ⚽ Gols somados: Time A: {goalsSumA} × {goalsSumB} Time B
                </span>
                {(ourScore !== goalsSumA || opponentScore !== goalsSumB) && (
                  <span className="text-yellow-400 text-[11px]">
                    (Diferente do placar registrado: {ourScore} × {opponentScore})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleSyncScoreWithGoals}
                className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-lg transition text-xs shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" /> Sincronizar com Placar
              </button>
            </div>
          )}

          {!isTraining && allowIsHomeEdit && (
            <Select
              label="Mando de campo"
              options={[
                { value: "home", label: "Casa" },
                { value: "away", label: "Visitante" },
              ]}
              value={isHome ? "home" : "away"}
              onChange={(e) => setIsHome(e.target.value === "home")}
            />
          )}

          {!isTraining && allowOpponentBadgeEdit && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#8fa39b]">Escudo do adversário (opcional)</label>
              <div className="flex items-center gap-3">
                {opponentBadgeInput ? (
                  <img
                    src={opponentBadgeInput}
                    alt="Escudo adversário"
                    className="h-16 w-16 rounded-lg border border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-white/10 text-[#8fa39b]">
                    <span className="text-lg">VS</span>
                  </div>
                )}
                <label className="cursor-pointer">
                  <span className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors shadow-sm">
                    {uploadingBadge ? "Enviando..." : "Fazer upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleOpponentBadgeUpload}
                    disabled={uploadingBadge}
                  />
                </label>
              </div>

              <Input
                label="URL do escudo adversário (opcional)"
                placeholder="https://... ou /uploads/..."
                value={opponentBadgeInput}
                onChange={(e) => setOpponentBadgeInput(e.target.value)}
              />
            </div>
          )}

          <p className="text-sm text-[var(--text-muted)] mb-2">
            {isTraining
              ? "Registre gols, assistências e cartões separados por Time A e Time B."
              : mode === "edit"
              ? "Atualize as estatísticas individuais da partida finalizada."
              : "Registre as estatísticas individuais dos jogadores confirmados."}
          </p>

          {/* Adicionar jogador manualmente */}
          {eligiblePlayers.length > 0 && (
            <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4 mb-4 sm:flex-row sm:items-end sm:gap-3">
              <div className="flex-1">
                <Select
                  label="Adicionar jogador manualmente"
                  options={[
                    { value: "", label: "Selecione um jogador..." },
                    ...eligiblePlayers.map((p) => ({
                      value: p.id,
                      label: `${p.name} (#${p.shirtNumber || "-"} - ${p.position || "-"})${p.status === "INACTIVE" ? " (Inativo)" : ""}`,
                    })),
                  ]}
                  value={selectedPlayerToAdd}
                  onChange={(e) => setSelectedPlayerToAdd(e.target.value)}
                />
              </div>
              {isTraining && (
                <div className="w-32">
                  <Select
                    label="Lado"
                    options={[
                      { value: "A", label: "Time A" },
                      { value: "B", label: "Time B" },
                    ]}
                    value={selectedSideToAdd}
                    onChange={(e) => setSelectedSideToAdd(e.target.value as "A" | "B")}
                  />
                </div>
              )}
              <Button
                type="button"
                className="w-full sm:w-auto h-[42px] mt-2 sm:mt-0"
                onClick={() => {
                  if (!selectedPlayerToAdd) return;
                  const player = squadPlayers.find((p) => p.id === selectedPlayerToAdd);
                  if (player) {
                    setPlayerSides((prev) => ({ ...prev, [player.id]: selectedSideToAdd }));
                    setPlayerStats((prev) => [
                      ...prev,
                      {
                        playerId: player.id,
                        guestPlayerId: null,
                        playerName: player.name,
                        goals: 0,
                        assists: 0,
                        yellowCards: 0,
                        redCards: 0,
                      },
                    ]);
                    setSelectedPlayerToAdd("");
                  }
                }}
              >
                Adicionar
              </Button>
            </div>
          )}

          {playerStats.length === 0 ? (
            <div className="rounded-xl border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.1)] p-3 text-sm text-[#fbbf24] mb-4">
              Nenhum jogador confirmou presença. Utilize a seção acima para adicionar jogadores manualmente ou pule esta etapa.
            </div>
          ) : isTraining ? (
            /* Renderização dividida em Time A e Time B */
            <div className="space-y-6">
              {/* TIME A */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black font-black text-xs">
                      A
                    </span>
                    <h3 className="font-black text-sm text-emerald-400 uppercase tracking-wide">
                      Time A (Colete)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    ⚽ {goalsSumA} gols
                  </span>
                </div>

                <div className="space-y-3">
                  {playerStats
                    .filter((p) => (playerSides[p.guestPlayerId || p.playerId] || "A") === "A")
                    .map((stat) => {
                      const actualIdx = playerStats.findIndex(
                        (ps) => (ps.guestPlayerId || ps.playerId) === (stat.guestPlayerId || stat.playerId)
                      );
                      const idKey = stat.guestPlayerId || stat.playerId;

                      return (
                        <div
                          key={idKey}
                          className="rounded-xl border border-white/10 bg-[#090f0c] p-3.5 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-white text-sm flex items-center gap-2">
                              <span>{stat.playerName}</span>
                              {squadPlayers.find((sp) => sp.id === stat.playerId)?.status === "INACTIVE" && (
                                <span className="text-[10px] font-semibold text-red-400 bg-red-950/50 border border-red-800/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Inativo
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => togglePlayerSide(idKey)}
                                className="text-[11px] text-[#8fa39b] hover:text-white inline-flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition"
                                title="Mover para Time B"
                              >
                                <ArrowLeftRight className="w-3 h-3" /> Mover p/ B
                              </button>
                              <button
                                type="button"
                                onClick={() => removePlayerStat(actualIdx)}
                                className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1 hover:bg-red-500/10 rounded-lg transition"
                                title="Remover jogador"
                              >
                                Remover
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                            <Input
                              label="⚽ Gols"
                              type="number"
                              min={0}
                              value={stat.goals}
                              onChange={(e) =>
                                updatePlayerStat(
                                  actualIdx,
                                  "goals",
                                  parseInt(e.target.value) || 0
                                )
                              }
                            />
                            <Input
                              label="🅰️ Assist."
                              type="number"
                              min={0}
                              value={stat.assists}
                              onChange={(e) =>
                                updatePlayerStat(
                                  actualIdx,
                                  "assists",
                                  parseInt(e.target.value) || 0
                                )
                              }
                            />
                            <Input
                              label="🟨 (max 2)"
                              type="number"
                              min={0}
                              max={2}
                              value={stat.yellowCards}
                              onChange={(e) =>
                                updatePlayerStat(
                                  actualIdx,
                                  "yellowCards",
                                  Math.min(2, parseInt(e.target.value) || 0)
                                )
                              }
                            />
                            <Input
                              label="🟥 (max 1)"
                              type="number"
                              min={0}
                              max={1}
                              value={stat.redCards}
                              onChange={(e) =>
                                updatePlayerStat(
                                  actualIdx,
                                  "redCards",
                                  Math.min(1, parseInt(e.target.value) || 0)
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  {playerStats.filter((p) => (playerSides[p.guestPlayerId || p.playerId] || "A") === "A").length === 0 && (
                    <p className="text-xs text-[var(--text-subtle)] italic py-2 text-center">
                      Nenhum jogador no Time A.
                    </p>
                  )}
                </div>
              </div>

              {/* TIME B */}
              <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-black font-black text-xs">
                      B
                    </span>
                    <h3 className="font-black text-sm text-blue-400 uppercase tracking-wide">
                      Time B (Sem Colete)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                    ⚽ {goalsSumB} gols
                  </span>
                </div>

                <div className="space-y-3">
                  {playerStats
                    .filter((p) => playerSides[p.guestPlayerId || p.playerId] === "B")
                    .map((stat) => {
                      const actualIdx = playerStats.findIndex(
                        (ps) => (ps.guestPlayerId || ps.playerId) === (stat.guestPlayerId || stat.playerId)
                      );
                      const idKey = stat.guestPlayerId || stat.playerId;

                      return (
                        <div
                          key={idKey}
                          className="rounded-xl border border-white/10 bg-[#090f0c] p-3.5 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-white text-sm flex items-center gap-2">
                              <span>{stat.playerName}</span>
                              {squadPlayers.find((sp) => sp.id === stat.playerId)?.status === "INACTIVE" && (
                                <span className="text-[10px] font-semibold text-red-400 bg-red-950/50 border border-red-800/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Inativo
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => togglePlayerSide(idKey)}
                                className="text-[11px] text-[#8fa39b] hover:text-white inline-flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition"
                                title="Mover para Time A"
                              >
                                <ArrowLeftRight className="w-3 h-3" /> Mover p/ A
                              </button>
                              <button
                                type="button"
                                onClick={() => removePlayerStat(actualIdx)}
                                className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1 hover:bg-red-500/10 rounded-lg transition"
                                title="Remover jogador"
                              >
                                Remover
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                            <Input
                              label="⚽ Gols"
                              type="number"
                              min={0}
                              value={stat.goals}
                              onChange={(e) =>
                                updatePlayerStat(
                                  actualIdx,
                                  "goals",
                                  parseInt(e.target.value) || 0
                                )
                              }
                            />
                            <Input
                              label="🅰️ Assist."
                              type="number"
                              min={0}
                              value={stat.assists}
                              onChange={(e) =>
                                updatePlayerStat(
                                  actualIdx,
                                  "assists",
                                  parseInt(e.target.value) || 0
                                )
                              }
                            />
                            <Input
                              label="🟨 (max 2)"
                              type="number"
                              min={0}
                              max={2}
                              value={stat.yellowCards}
                              onChange={(e) =>
                                updatePlayerStat(
                                  actualIdx,
                                  "yellowCards",
                                  Math.min(2, parseInt(e.target.value) || 0)
                                )
                              }
                            />
                            <Input
                              label="🟥 (max 1)"
                              type="number"
                              min={0}
                              max={1}
                              value={stat.redCards}
                              onChange={(e) =>
                                updatePlayerStat(
                                  actualIdx,
                                  "redCards",
                                  Math.min(1, parseInt(e.target.value) || 0)
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  {playerStats.filter((p) => playerSides[p.guestPlayerId || p.playerId] === "B").length === 0 && (
                    <p className="text-xs text-[var(--text-subtle)] italic py-2 text-center">
                      Nenhum jogador no Time B.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Lista normal para jogos convencionais */
            <div className="space-y-4">
              {playerStats.map((stat, idx) => (
                <div
                  key={stat.guestPlayerId || stat.playerId || `stat-${idx}`}
                  className="rounded-xl border border-white/10 bg-[#090f0c] p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-semibold text-white flex items-center gap-2">
                      <span>{stat.playerName}</span>
                      {squadPlayers.find((sp) => sp.id === stat.playerId)?.status === "INACTIVE" && (
                        <span className="text-[10px] font-semibold text-red-400 bg-red-950/50 border border-red-800/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Inativo
                        </span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => removePlayerStat(idx)}
                      className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1 hover:bg-red-500/10 rounded-lg transition"
                      title="Remover jogador"
                    >
                      Remover
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Input
                      label="Gols"
                      type="number"
                      min={0}
                      value={stat.goals}
                      onChange={(e) =>
                        updatePlayerStat(
                          idx,
                          "goals",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <Input
                      label="Assist."
                      type="number"
                      min={0}
                      value={stat.assists}
                      onChange={(e) =>
                        updatePlayerStat(
                          idx,
                          "assists",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <Input
                      label="🟨 (max 2)"
                      type="number"
                      min={0}
                      max={2}
                      value={stat.yellowCards}
                      onChange={(e) =>
                        updatePlayerStat(
                          idx,
                          "yellowCards",
                          Math.min(2, parseInt(e.target.value) || 0)
                        )
                      }
                    />
                    <Input
                      label="🟥 (max 1)"
                      type="number"
                      min={0}
                      max={1}
                      value={stat.redCards}
                      onChange={(e) =>
                        updatePlayerStat(
                          idx,
                          "redCards",
                          Math.min(1, parseInt(e.target.value) || 0)
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {(playerStats.length > 0 || mode === "edit") && (
              <Button onClick={handleSubmitStats} disabled={loading}>
                {loading ? "Salvando..." : mode === "edit" ? "Salvar Alterações" : "Salvar Estatísticas"}
              </Button>
            )}
            <Button variant="secondary" onClick={handleSkipStats}>
              {mode === "edit" ? "Cancelar" : playerStats.length > 0 ? "Pular Estatísticas" : "Concluir"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
