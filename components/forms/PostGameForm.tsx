"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PostGameForm({
  matchId,
  rsvps,
  onSuccess,
  onCancel,
}: PostGameFormProps) {
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState<"score" | "stats">("score");

  // Initialize stats for confirmed players
  const confirmedPlayers = rsvps.filter((r) => r.status === "CONFIRMED");
  const [playerStats, setPlayerStats] = useState<PlayerStatInput[]>(
    confirmedPlayers.map((r) => ({
      playerId: r.playerId,
      playerName: r.playerName,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
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
        method: "POST",
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
          <p className="text-sm text-gray-600">
            Registre as estatísticas individuais dos jogadores confirmados.
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
              {playerStats.length > 0 ? "Pular Estatísticas" : "Concluir"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
