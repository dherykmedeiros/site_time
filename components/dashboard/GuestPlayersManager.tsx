"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { playerPositionLabels, playerPositions } from "@/lib/player-positions";
import { Plus, Trash2, Users } from "lucide-react";

interface GuestPlayer {
  id: string;
  name: string;
  shirtNumber: number | null;
  position: (typeof playerPositions)[number] | null;
}

interface GuestPlayersManagerProps {
  matchId: string;
}

export function GuestPlayersManager({ matchId }: GuestPlayersManagerProps) {
  const [guests, setGuests] = useState<GuestPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [shirtNumber, setShirtNumber] = useState("");
  const [position, setPosition] = useState<string>("");

  useEffect(() => {
    fetchGuests();
  }, [matchId]);

  async function fetchGuests() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${matchId}/guests`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao carregar convidados");
      setGuests(data.guests);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${matchId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          shirtNumber: shirtNumber ? parseInt(shirtNumber, 10) : null,
          position: position || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao adicionar convidado");

      setGuests((prev) => [...prev, data.guest]);
      setName("");
      setShirtNumber("");
      setPosition("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteGuest(id: string) {
    if (!confirm("Tem certeza que deseja remover este jogador convidado?")) return;

    setError(null);
    try {
      const res = await fetch(`/api/matches/${matchId}/guests?guestPlayerId=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao remover convidado");

      setGuests((prev) => prev.filter((g) => g.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  const positionOptions = playerPositions.map((pos) => ({
    value: pos,
    label: playerPositionLabels[pos],
  }));

  return (
    <Card>
      <CardHeader>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">
            Jogadores Convidados
          </p>
          <h2 className="text-lg font-semibold text-[var(--text)]">Gestão de Convidados</h2>
          <p className="text-sm text-[var(--text-subtle)]">
            Adicione jogadores de fora do elenco para participarem especificamente desta partida.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-[12px] border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.1)] p-3 text-sm text-[#fca5a5] font-semibold">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[1.8fr_1.2fr]">
          {/* Guest Players List */}
          <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <h3 className="mb-3 font-semibold text-[var(--text)] flex items-center gap-2">
              <Users className="h-4 w-4 text-[var(--brand)]" />
              Convidados Escalados ({guests.length})
            </h3>

            {loading ? (
              <p className="text-sm text-[var(--text-subtle)] py-4">Carregando convidados...</p>
            ) : guests.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-white/10 rounded-[12px] p-6 bg-white/[0.01]">
                <p className="text-sm text-[var(--text-subtle)]">Nenhum jogador convidado adicionado.</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Use o formulário ao lado para adicionar.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {guests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-center justify-between gap-3 rounded-[12px] border border-white/5 bg-white/[0.03] p-3 hover:bg-white/[0.06] transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--brand-soft)] text-xs font-bold text-[var(--brand)]">
                        {guest.shirtNumber ? `#${guest.shirtNumber}` : "-"}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text)] text-sm">{guest.name}</p>
                        {guest.position && (
                          <span className="text-xs text-[var(--text-muted)]">
                            {playerPositionLabels[guest.position]}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteGuest(guest.id)}
                      className="rounded-[8px] p-2 text-[var(--text-muted)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[#fca5a5] transition-all"
                      title="Remover Convidado"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Guest Player Form */}
          <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4 h-fit">
            <h3 className="mb-4 font-semibold text-[var(--text)] flex items-center gap-2">
              <Plus className="h-4 w-4 text-[var(--brand)]" />
              Novo Convidado
            </h3>

            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <Input
                  label="Nome Completo"
                  placeholder="Ex: João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    label="Número da Camisa"
                    placeholder="Ex: 10"
                    type="number"
                    min="1"
                    max="99"
                    value={shirtNumber}
                    onChange={(e) => setShirtNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Select
                    label="Posição"
                    placeholder="Selecione..."
                    options={positionOptions}
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" loading={saving}>
                Adicionar Convidado
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
