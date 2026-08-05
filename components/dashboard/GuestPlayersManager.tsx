"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { playerPositionLabels, playerPositions } from "@/lib/player-positions";
import { Plus, Trash2, Users, UserPlus, X } from "lucide-react";

interface GuestPlayer {
  id: string;
  name: string;
  cpf?: string | null;
  shirtNumber: number | null;
  position: (typeof playerPositions)[number] | null;
}

interface GuestPlayersManagerProps {
  matchId: string;
  requiresDocumentDetails?: boolean;
  onGuestsChange?: () => void;
}

export function GuestPlayersManager({ matchId, requiresDocumentDetails: propRequiresDoc, onGuestsChange }: GuestPlayersManagerProps) {
  const [guests, setGuests] = useState<GuestPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresDocumentDetails, setRequiresDocumentDetails] = useState<boolean>(propRequiresDoc ?? false);

  // Form State for Adding Guest
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [shirtNumber, setShirtNumber] = useState("");
  const [position, setPosition] = useState<string>("");

  // State for Promoting Guest to Official Player
  const [promotingGuest, setPromotingGuest] = useState<GuestPlayer | null>(null);
  const [promoteShirtNumber, setPromoteShirtNumber] = useState("");
  const [promotePosition, setPromotePosition] = useState("");
  const [promoteError, setPromoteError] = useState<string | null>(null);

  useEffect(() => {
    fetchGuests();
  }, [matchId]);

  useEffect(() => {
    if (propRequiresDoc !== undefined) {
      setRequiresDocumentDetails(propRequiresDoc);
    }
  }, [propRequiresDoc]);

  async function fetchGuests() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${matchId}/guests`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao carregar convidados");
      setGuests(data.guests);
      if (data.requiresDocumentDetails !== undefined) {
        setRequiresDocumentDetails(data.requiresDocumentDetails);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    setCpf(value);
  };

  async function handleAddGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const cleanCpf = cpf.replace(/\D/g, "");
    if (requiresDocumentDetails && cleanCpf.length !== 11) {
      setError("Esta partida exige um CPF válido com 11 dígitos para o convidado.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${matchId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          cpf: cpf.trim() || null,
          shirtNumber: shirtNumber ? parseInt(shirtNumber, 10) : null,
          position: position || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao adicionar convidado");

      setGuests((prev) => [...prev, data.guest]);
      setName("");
      setCpf("");
      setShirtNumber("");
      setPosition("");
      onGuestsChange?.();
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
      if (promotingGuest?.id === id) {
        setPromotingGuest(null);
      }
      onGuestsChange?.();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handlePromoteGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!promotingGuest) return;

    setSaving(true);
    setPromoteError(null);
    try {
      const res = await fetch(`/api/matches/${matchId}/guests/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestPlayerId: promotingGuest.id,
          shirtNumber: promoteShirtNumber ? parseInt(promoteShirtNumber, 10) : null,
          position: promotePosition || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao integrar jogador");

      setGuests((prev) => prev.filter((g) => g.id !== promotingGuest.id));
      setPromotingGuest(null);
      setPromoteShirtNumber("");
      setPromotePosition("");
      alert(data.message || "Jogador integrado ao time com sucesso!");
      onGuestsChange?.();
    } catch (err: any) {
      setPromoteError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startPromotion(guest: GuestPlayer) {
    setPromotingGuest(guest);
    setPromoteShirtNumber(guest.shirtNumber?.toString() || "");
    setPromotePosition(guest.position || "");
    setPromoteError(null);
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
            Adicione jogadores de fora do elenco para participarem especificamente desta partida ou integre-os de forma definitiva ao time.
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
                    className={`flex items-center justify-between gap-3 rounded-[12px] border p-3 transition-all duration-200 ${
                      promotingGuest?.id === guest.id
                        ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                        : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--brand-soft)] text-xs font-bold text-[var(--brand)]">
                        {guest.shirtNumber ? `#${guest.shirtNumber}` : "-"}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text)] text-sm">{guest.name}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                          {guest.position && (
                            <span>{playerPositionLabels[guest.position]}</span>
                          )}
                          {guest.cpf && (
                            <span className="font-mono text-[11px] bg-white/5 px-1.5 py-0.5 rounded text-[var(--text-subtle)]">
                              CPF: {guest.cpf}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => startPromotion(guest)}
                        className="rounded-[8px] p-2 text-[var(--text-muted)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] transition-all flex items-center justify-center"
                        title="Integrar ao time (Tornar Oficial)"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="rounded-[8px] p-2 text-[var(--text-muted)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[#fca5a5] transition-all flex items-center justify-center"
                        title="Remover Convidado"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Column: Add or Promote form */}
          <div className="space-y-4">
            {promotingGuest ? (
              /* Promote Guest Player Form */
              <div className="rounded-[14px] border border-[var(--brand)] bg-[var(--brand-soft)]/20 p-4 h-fit relative">
                <button
                  onClick={() => setPromotingGuest(null)}
                  className="absolute top-3 right-3 rounded-md p-1 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text)]"
                  title="Cancelar"
                >
                  <X className="h-4 w-4" />
                </button>

                <h3 className="mb-2 font-semibold text-[var(--text)] flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-[var(--brand)]" />
                  Integrar ao Elenco
                </h3>
                
                <p className="text-xs text-[var(--text-subtle)] mb-4 leading-relaxed">
                  Você está promovendo o convidado <strong>{promotingGuest.name}</strong> a jogador oficial. Gols, cartões e estatísticas registradas como convidado serão migrados automaticamente para seu perfil oficial!
                </p>

                {promoteError && (
                  <div className="rounded-[12px] border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.1)] p-2.5 text-xs text-[#fca5a5] font-semibold mb-4">
                    {promoteError}
                  </div>
                )}

                <form onSubmit={handlePromoteGuest} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input
                        label="Número Camisa"
                        placeholder="Ex: 10"
                        type="number"
                        min="1"
                        max="99"
                        value={promoteShirtNumber}
                        onChange={(e) => setPromoteShirtNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Select
                        label="Posição"
                        placeholder="Selecione..."
                        options={positionOptions}
                        value={promotePosition}
                        onChange={(e) => setPromotePosition(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-1/3"
                      onClick={() => setPromotingGuest(null)}
                    >
                      Voltar
                    </Button>
                    <Button type="submit" className="w-2/3" loading={saving}>
                      Confirmar
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              /* Add Guest Player Form */
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

                  <div>
                    <Input
                      label={requiresDocumentDetails ? "CPF *" : "CPF (Opcional)"}
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={handleCpfChange}
                      required={requiresDocumentDetails}
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
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
