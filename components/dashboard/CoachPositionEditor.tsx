"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { playerPositions, playerPositionLabels } from "@/lib/player-positions";
import { useRouter } from "next/navigation";

interface CoachPositionEditorProps {
  playerId: string;
  playerName: string;
  currentPosition: string;
  currentSecondaryPosition?: string | null;
  isCoachOrAdmin: boolean;
}

const positionOptions = playerPositions.map((pos) => ({
  value: pos,
  label: playerPositionLabels[pos],
}));

const secondaryOptions = [
  { value: "", label: "Nenhuma (Apenas Principal)" },
  ...positionOptions,
];

export function CoachPositionEditor({
  playerId,
  playerName,
  currentPosition,
  currentSecondaryPosition,
  isCoachOrAdmin,
}: CoachPositionEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(currentPosition);
  const [secondaryPosition, setSecondaryPosition] = useState(currentSecondaryPosition || "");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isCoachOrAdmin) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/players/${playerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position,
          secondaryPosition: secondaryPosition || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao atualizar posições");
        return;
      }

      toast("Posições do jogador atualizadas com sucesso!");
      setOpen(false);
      router.refresh();
    } catch {
      setErrorMsg("Erro de conexão ao salvar posições");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          setPosition(currentPosition);
          setSecondaryPosition(currentSecondaryPosition || "");
          setErrorMsg("");
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-1 font-semibold"
      >
        <span>✏️</span> Alterar Posições
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={`Alterar Posições — ${playerName}`}>
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          {errorMsg && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 font-semibold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Posição Principal *
            </label>
            <Select
              options={positionOptions}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Posição Secundária
            </label>
            <Select
              options={secondaryOptions}
              value={secondaryPosition}
              onChange={(e) => setSecondaryPosition(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading} disabled={loading}>
              {loading ? "Salvando..." : "Salvar Posições"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
