"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

interface RSVP {
  playerId: string;
  playerName: string;
  status: string;
}

interface PlayerStatInput {
  playerId: string;
  playerName: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
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
  const [homeScore, setHomeScore] = useState<number>(initialHomeScore ?? 0);
  const [awayScore, setAwayScore] = useState<number>(initialAwayScore ?? 0);
  const [opponentBadgeInput, setOpponentBadgeInput] = useState(opponentBadgeUrl ?? "");
  const [isHome, setIsHome] = useState(initialIsHome ?? true);
  const [uploadingBadge, setUploadingBadge] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState<"score" | "stats">(mode === "edit" ? "stats" : "score");

  // Initialize stats for confirmed players
  const confirmedPlayers = rsvps.filter((r) => r.status === "CONFIRMED");
  const initialStatsByPlayer = new Map((initialStats || []).map((item) => [item.playerId, item]));
  const mergedPlayers = [
    ...confirmedPlayers,
    ...((initialStats || [])
      .filter((item) => !confirmedPlayers.some((player) => player.playerId === item.playerId))
      .map((item) => ({
        playerId: item.playerId,
        playerName: item.playerName,
        status: "CONFIRMED",
        respondedAt: null,
      })) as RSVP[]),
  ];

  const [playerStats, setPlayerStats] = useState<PlayerStatInput[]>(
    mergedPlayers.map((r) => ({
      playerId: r.playerId,
      playerName: r.playerName,
      goals: initialStatsByPlayer.get(r.playerId)?.goals ?? 0,
      assists: initialStatsByPlayer.get(r.playerId)?.assists ?? 0,
      yellowCards: initialStatsByPlayer.get(r.playerId)?.yellowCards ?? 0,
      redCards: initialStatsByPlayer.get(r.playerId)?.redCards ?? 0,
    }))
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

  async function handleSubmitScore() {
    setLoading(true);
    setErrorMsg("");

    try {
      // Step 1: Submit score (triggers COMPLETED)
      const scoreRes = await fetch(`/api/matches/${matchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeScore, awayScore }),
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
          playerId: s.playerId,
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
                label="Nosso Time"
                type="number"
                min={0}
                value={homeScore}
                onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
              />
            </div>
            <span className="pt-6 text-2xl font-bold text-gray-400">x</span>
            <div className="flex-1">
              <Input
                label="Adversário"
                type="number"
                min={0}
                value={awayScore}
                onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
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
              Placar final registrado: <strong>{homeScore}</strong> x <strong>{awayScore}</strong>. No pos-jogo voce pode ajustar mando casa/fora e completar escudo adversario.
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
              <label className="block text-sm font-medium text-gray-700">Escudo do adversario (opcional)</label>
              <div className="flex items-center gap-3">
                {opponentBadgeInput ? (
                  <img
                    src={opponentBadgeInput}
                    alt="Escudo adversario"
                    className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
                    <span className="text-lg">VS</span>
                  </div>
                )}
                <label className="cursor-pointer">
                  <span className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
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

          <p className="text-sm text-gray-600">
            {mode === "edit"
              ? "Atualize as estatísticas individuais da partida finalizada."
              : "Registre as estatísticas individuais dos jogadores confirmados."}
          </p>

          {playerStats.length === 0 ? (
            <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-700">
              Nenhum jogador confirmou presença. Pule esta etapa.
            </div>
          ) : (
            <div className="space-y-4">
              {playerStats.map((stat, idx) => (
                <div
                  key={stat.playerId}
                  className="rounded-md border border-gray-200 p-4"
                >
                  <p className="mb-3 font-medium text-gray-900">
                    {stat.playerName}
                  </p>
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
