"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

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

  useEffect(() => {
    fetch("/api/players")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.players) setSquadPlayers(d.players);
      })
      .catch(() => {});
  }, []);

  // Initialize stats for confirmed players
  const confirmedPlayers = rsvps.filter((r) => r.status === "CONFIRMED");
  const initialStatsByPlayer = new Map((initialStats || []).map((item) => [item.playerId, item]));
  const mergedPlayers = [
    ...confirmedPlayers.map((r) => ({
      playerId: r.playerId,
      guestPlayerId: r.isGuest ? r.playerId : null,
      playerName: r.playerName,
      status: r.status,
    })),
    ...((initialStats || [])
      .filter((item) => !confirmedPlayers.some((player) => player.playerId === item.playerId))
      .map((item) => ({
        playerId: item.playerId,
        guestPlayerId: item.guestPlayerId,
        playerName: item.playerName,
        status: "CONFIRMED",
        respondedAt: null,
      }))),
  ];

  const [playerStats, setPlayerStats] = useState<PlayerStatInput[]>(
    mergedPlayers.map((r) => ({
      playerId: r.playerId,
      guestPlayerId: r.guestPlayerId || null,
      playerName: r.playerName,
      goals: initialStatsByPlayer.get(r.playerId)?.goals ?? 0,
      assists: initialStatsByPlayer.get(r.playerId)?.assists ?? 0,
      yellowCards: initialStatsByPlayer.get(r.playerId)?.yellowCards ?? 0,
      redCards: initialStatsByPlayer.get(r.playerId)?.redCards ?? 0,
    }))
  );

  const eligiblePlayers = squadPlayers.filter(
    (sp) => !playerStats.some((ps) => ps.playerId === sp.id)
  );

  function updatePlayerStat(
    index: number,
    field: keyof Omit<PlayerStatInput, "playerId" | "playerName">,
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

  async function handleSubmitScore() {
    setLoading(true);
    setErrorMsg("");

    const payload = isHome
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

      if (allowIsHomeEdit) {
        metadataPayload.isHome = isHome;
      }

      if (mode === "edit") {
        if (isHome) {
          metadataPayload.homeScore = ourScore;
          metadataPayload.awayScore = opponentScore;
        } else {
          metadataPayload.homeScore = opponentScore;
          metadataPayload.awayScore = ourScore;
        }
      }

      if (allowOpponentBadgeEdit && opponentBadgeInput.trim()) {
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
          setErrorMsg(badgeData.error || "Erro ao salvar dados do pos-jogo");
          return;
        }
      }

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
        setErrorMsg(data.error || "Erro ao registrar estatísticas");
        return;
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
        setErrorMsg(data.error || "Erro ao enviar escudo do adversario");
        return;
      }

      setOpponentBadgeInput(data.url);
    } catch {
      setErrorMsg("Erro ao enviar escudo do adversario");
    } finally {
      setUploadingBadge(false);
    }
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {step === "score" && (
        <>
          <p className="text-sm text-gray-600">
            Registre o placar final da partida. Isso marcará a partida como
            finalizada.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                label={isHome ? "Nosso Time (Casa)" : "Nosso Time (Visitante)"}
                type="number"
                min={0}
                value={ourScore}
                onChange={(e) => setOurScore(parseInt(e.target.value) || 0)}
              />
            </div>
            <span className="pt-6 text-2xl font-bold text-gray-400">x</span>
            <div className="flex-1">
              <Input
                label={isHome ? "Adversário (Visitante)" : "Adversário (Casa)"}
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
            <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
              No pos-jogo voce pode ajustar placar, mando casa/fora, escudo adversario (se vazio) e estatisticas.
            </div>
          )}

          {mode === "edit" && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={isHome ? "Placar nosso time (Casa)" : "Placar nosso time (Visitante)"}
                type="number"
                min={0}
                value={ourScore}
                onChange={(e) => setOurScore(parseInt(e.target.value) || 0)}
              />
              <Input
                label={isHome ? "Placar adversario (Visitante)" : "Placar adversario (Casa)"}
                type="number"
                min={0}
                value={opponentScore}
                onChange={(e) => setOpponentScore(parseInt(e.target.value) || 0)}
              />
            </div>
          )}

          {allowIsHomeEdit && (
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

          {allowOpponentBadgeEdit && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#8fa39b]">Escudo do adversário (opcional)</label>
              <div className="flex items-center gap-3">
                {opponentBadgeInput ? (
                  <img
                    src={opponentBadgeInput}
                    alt="Escudo adversario"
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
                label="URL do escudo adversario (opcional)"
                placeholder="https://... ou /uploads/..."
                value={opponentBadgeInput}
                onChange={(e) => setOpponentBadgeInput(e.target.value)}
              />
            </div>
          )}

          <p className="text-sm text-gray-600 mb-4">
            {mode === "edit"
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
              <Button
                type="button"
                className="w-full sm:w-auto h-[42px] mt-2 sm:mt-0"
                onClick={() => {
                  if (!selectedPlayerToAdd) return;
                  const player = squadPlayers.find((p) => p.id === selectedPlayerToAdd);
                  if (player) {
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
          ) : (
            <div className="space-y-4">
              {playerStats.map((stat, idx) => (
                <div
                  key={stat.playerId}
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
            {playerStats.length > 0 && (
              <Button onClick={handleSubmitStats} disabled={loading}>
                {loading ? "Salvando..." : "Salvar Estatísticas"}
              </Button>
            )}
            <Button variant="secondary" onClick={handleSkipStats}>
              {mode === "edit" ? "Fechar" : playerStats.length > 0 ? "Pular Estatísticas" : "Concluir"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
