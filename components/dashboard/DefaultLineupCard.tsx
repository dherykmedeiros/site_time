"use client";

import { useEffect, useState } from "react";
import { TacticalBoard, type TacticalBoardPlayer } from "@/components/dashboard/TacticalBoard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  applyBlockPresetToStarters,
  applyFormationToStarters,
  FORMATION_NAMES,
  inferBestFormation,
  type BlockPreset,
  type FormationName,
} from "@/lib/formations";
import { buildLineupFieldPlacements } from "@/lib/lineup-field";
import { playerPositionLabels } from "@/lib/player-positions";

interface Player {
  id: string;
  name: string;
  position: string;
  shirtNumber: number;
}

interface DefaultLineupResponse {
  teamId: string;
  formation: FormationName | null;
  blockPreset: BlockPreset | null;
  starters: Array<{
    playerId: string;
    playerName: string;
    position: string;
    shirtNumber: number;
    fieldX?: number | null;
    fieldY?: number | null;
  }>;
  bench: Array<{
    playerId: string;
    playerName: string;
    position: string;
    shirtNumber: number;
  }>;
}

function clampFieldX(value: number) {
  return Math.min(92, Math.max(8, Math.round(value)));
}

function clampFieldY(value: number) {
  return Math.min(88, Math.max(10, Math.round(value)));
}

export function DefaultLineupCard() {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [starters, setStarters] = useState<any[]>([]);
  const [bench, setBench] = useState<any[]>([]);
  const [formation, setFormation] = useState<FormationName | null>(null);
  const [blockPreset, setBlockPreset] = useState<BlockPreset>("BALANCED");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch active players
      const playersRes = await fetch("/api/players?status=ACTIVE");
      const playersData = await playersRes.json();
      const activePlayers = playersData.players || [];
      setPlayers(activePlayers);

      // 2. Fetch default lineup
      const lineupRes = await fetch("/api/teams/default-lineup");
      if (lineupRes.ok) {
        const lineupData: DefaultLineupResponse = await lineupRes.json();
        setFormation(lineupData.formation);
        setBlockPreset(lineupData.blockPreset || "BALANCED");

        // Map starters and bench based on saved values
        setStarters(lineupData.starters.map(s => ({
          playerId: s.playerId,
          playerName: s.playerName,
          position: s.position,
          shirtNumber: s.shirtNumber,
          fieldX: s.fieldX ?? null,
          fieldY: s.fieldY ?? null,
        })));

        setBench(lineupData.bench.map(b => ({
          playerId: b.playerId,
          playerName: b.playerName,
          position: b.position,
          shirtNumber: b.shirtNumber,
        })));
      } else {
        // Fallback to empty if not configured
        setStarters([]);
        setBench([]);
      }
    } catch (err) {
      setError("Erro ao carregar dados da escalação padrão.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const placements = buildLineupFieldPlacements(starters);
  const hasManualFieldPositions = starters.some(entry => entry.fieldX != null && entry.fieldY != null);
  const detectedFormation = starters.length > 0 ? inferBestFormation(starters) : null;
  const activeFormation = formation ?? detectedFormation;

  const boardPlayers: TacticalBoardPlayer[] = starters.map((entry) => {
    const placement = placements.find((item) => item.playerId === entry.playerId);
    return {
      player_id: entry.playerId,
      name: entry.playerName,
      short_label: placement?.shortLabel ?? entry.position.slice(0, 3),
      position_label: playerPositionLabels[entry.position as keyof typeof playerPositionLabels] || entry.position,
      position_code: entry.position,
      x_percent: entry.fieldX ?? placement?.x ?? 50,
      y_percent: entry.fieldY ?? placement?.y ?? 50,
    };
  });

  function handleMoveToBench(player: any) {
    setStarters(prev => prev.filter(p => p.playerId !== player.playerId));
    setBench(prev => {
      // Check if already in bench
      if (prev.some(p => p.playerId === player.playerId)) return prev;
      return [{
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position,
        shirtNumber: player.shirtNumber,
      }, ...prev];
    });
  }

  function handleMoveToStarters(player: any) {
    if (starters.length >= 11) {
      alert("A escalação titular deve conter no máximo 11 atletas.");
      return;
    }
    setBench(prev => prev.filter(p => p.playerId !== player.playerId));
    setStarters(prev => {
      if (prev.some(p => p.playerId === player.playerId)) return prev;
      return [...prev, {
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position,
        shirtNumber: player.shirtNumber,
        fieldX: null,
        fieldY: null,
      }];
    });
  }

  function handleApplyFormation(newFormation: FormationName) {
    setFormation(newFormation);
    setStarters(prev => {
      return applyBlockPresetToStarters(blockPreset, applyFormationToStarters(newFormation, prev));
    });
  }

  function handleBlockPresetChange(preset: BlockPreset) {
    setBlockPreset(preset);
    setStarters(prev => {
      const startersWithCoordinates = prev.map(s => {
        if (s.fieldX != null && s.fieldY != null) return s;
        const placement = placements.find(p => p.playerId === s.playerId);
        return {
          ...s,
          fieldX: placement?.x ?? 50,
          fieldY: placement?.y ?? 50,
        };
      });
      return applyBlockPresetToStarters(preset, startersWithCoordinates);
    });
  }

  function handleBoardChange(nextPlayers: TacticalBoardPlayer[]) {
    setStarters(prev => prev.map(entry => {
      const nextPlayer = nextPlayers.find(p => p.player_id === entry.playerId);
      if (!nextPlayer) return entry;
      return {
        ...entry,
        fieldX: clampFieldX(nextPlayer.x_percent),
        fieldY: clampFieldY(nextPlayer.y_percent),
      };
    }));
  }

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    setError(null);
    try {
      const res = await fetch("/api/teams/default-lineup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formation: activeFormation,
          blockPreset,
          starters: starters.map(s => ({
            playerId: s.playerId,
            fieldX: s.fieldX,
            fieldY: s.fieldY,
          })),
          bench: bench.map(b => b.playerId),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar escalação padrão");
      }

      setFeedback("Escalação padrão salva com sucesso!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro de conexão ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!confirm("Tem certeza que deseja limpar a escalação padrão?")) return;
    setSaving(true);
    setFeedback(null);
    setError(null);
    try {
      const res = await fetch("/api/teams/default-lineup", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao limpar escalação padrão");
      }

      setStarters([]);
      setBench([]);
      setFormation(null);
      setBlockPreset("BALANCED");
      setFeedback("Escalação padrão limpa.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro de conexão ao limpar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[var(--text-muted)]">Carregando escalação...</p>;
  }

  // Get active players not currently in starters or bench to display in "Disponíveis" list
  const selectedIds = new Set([
    ...starters.map(s => s.playerId),
    ...bench.map(b => b.playerId),
  ]);
  const availablePlayers = players.filter(p => !selectedIds.has(p.id));

  return (
    <Card className="rounded-[18px]">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#34d399]">Configurações Táticas</p>
            <h2 className="text-lg font-bold text-[var(--text)] mt-1">Escalação Padrão do Time</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Defina a formação, titulares e reservas base que serão exibidos por padrão no portal público do seu clube.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={handleReset} disabled={saving}>
              Limpar Padrão
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Salvar Escalacão Padrão
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {feedback && (
          <div className="rounded-[12px] border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] p-4 text-sm text-[#6ee7b7] font-semibold">
            {feedback}
          </div>
        )}
        {error && (
          <div className="rounded-[12px] border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.1)] p-4 text-sm text-[#fca5a5] font-semibold">
            {error}
          </div>
        )}

        <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,#1a6a4f_0%,#124432_100%)] p-4 text-white">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white">Prancheta Tática Padrão</h3>
              <p className="text-xs text-white/75">
                {hasManualFieldPositions ? "Posicionamento customizado ativo." : "Posicionamento automático por formação."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {activeFormation && <Badge variant="default" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Formação: {activeFormation}</Badge>}
              <Badge variant="info" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">{starters.length} Titulares</Badge>
            </div>
          </div>

          <TacticalBoard
            editable={true}
            players={boardPlayers}
            onChange={handleBoardChange}
            formationOptions={FORMATION_NAMES.map(name => ({ value: name, label: name }))}
            blockPresetOptions={[
              { value: "DEEP", label: "Bloco recuado" },
              { value: "BALANCED", label: "Bloco equilibrado" },
              { value: "HIGH", label: "Bloco alto" },
            ]}
            selectedFormation={activeFormation ?? undefined}
            selectedBlockPreset={blockPreset}
            onFormationChange={f => handleApplyFormation(f as FormationName)}
            onBlockPresetChange={p => handleBlockPresetChange(p as BlockPreset)}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Titulares */}
          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-2">
              <h3 className="font-bold text-[var(--text)] text-sm">Titulares ({starters.length}/11)</h3>
            </div>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {starters.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center">Nenhum titular selecionado.</p>
              ) : (
                starters.map((player) => (
                  <div key={player.playerId} className="flex items-center justify-between rounded-[10px] bg-white/[0.03] border border-white/5 p-2 hover:bg-white/[0.06] transition-colors">
                    <div>
                      <p className="text-xs font-bold text-[var(--text)]">#{player.shirtNumber} {player.playerName}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{playerPositionLabels[player.position as keyof typeof playerPositionLabels] || player.position}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 py-0 px-2" onClick={() => handleMoveToBench(player)}>
                      Remover
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Banco de Reservas */}
          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-2">
              <h3 className="font-bold text-[var(--text)] text-sm">Banco de Reservas ({bench.length})</h3>
            </div>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {bench.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center">Nenhum reserva selecionado.</p>
              ) : (
                bench.map((player) => (
                  <div key={player.playerId} className="flex items-center justify-between rounded-[10px] bg-white/[0.03] border border-white/5 p-2 hover:bg-white/[0.06] transition-colors">
                    <div>
                      <p className="text-xs font-bold text-[var(--text)]">#{player.shirtNumber} {player.playerName}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{playerPositionLabels[player.position as keyof typeof playerPositionLabels] || player.position}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="text-[#34d399] hover:text-[#6ee7b7] hover:bg-[#10b981]/10 h-7 py-0 px-2" onClick={() => handleMoveToStarters(player)}>
                        Titular
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 py-0 px-2" onClick={() => setBench(prev => prev.filter(p => p.playerId !== player.playerId))}>
                        Dispensar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Atletas Disponíveis */}
          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-2">
              <h3 className="font-bold text-[var(--text)] text-sm">Outros Atletas ({availablePlayers.length})</h3>
            </div>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {availablePlayers.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center">Todos os atletas escalados.</p>
              ) : (
                availablePlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between rounded-[10px] bg-white/[0.03] border border-white/5 p-2 hover:bg-white/[0.06] transition-colors">
                    <div>
                      <p className="text-xs font-bold text-[var(--text)]">#{player.shirtNumber} {player.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{playerPositionLabels[player.position as keyof typeof playerPositionLabels] || player.position}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="text-[#34d399] hover:text-[#6ee7b7] hover:bg-[#10b981]/10 h-7 py-0 px-2" onClick={() => handleMoveToStarters({ playerId: player.id, playerName: player.name, position: player.position, shirtNumber: player.shirtNumber })}>
                        Titular
                      </Button>
                      <Button size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 h-7 py-0 px-2" onClick={() => setBench(prev => [...prev, { playerId: player.id, playerName: player.name, position: player.position, shirtNumber: player.shirtNumber }])}>
                        Reserva
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
