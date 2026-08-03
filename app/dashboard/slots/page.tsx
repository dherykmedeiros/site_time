"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatDateOnly } from "@/lib/utils";

interface Slot {
  id: string;
  date: string;
  timeLabel: string | null;
  venueLabel: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
}

export default function TeamSlotsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [date, setDate] = useState("");
  const [timeLabel, setTimeLabel] = useState("");
  const [venueLabel, setVenueLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [feedback, setFeedback] = useState("");

  async function loadMySlots() {
    setLoading(true);
    try {
      const res = await fetch("/api/open-slots");
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
      }
    } catch (err) {
      console.error("Erro ao carregar vagas do time", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMySlots();
  }, []);

  async function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!date) {
      setErrorMsg("Selecione a data da vaga.");
      return;
    }

    setActionLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/open-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          timeLabel: timeLabel.trim() || null,
          venueLabel: venueLabel.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao publicar vaga.");
        return;
      }

      setShowAddModal(false);
      setDate("");
      setTimeLabel("");
      setVenueLabel("");
      setNotes("");
      setFeedback("Vaga publicada com sucesso no diretório de jogos!");
      loadMySlots();
    } catch {
      setErrorMsg("Erro de conexão.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteSlot(id: string) {
    if (!confirm("Tem certeza que deseja cancelar esta vaga aberta?")) return;

    try {
      const res = await fetch(`/api/open-slots/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFeedback("Vaga removida.");
        loadMySlots();
      }
    } catch {
      alert("Erro ao remover vaga.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-[rgba(16,185,129,0.2)] bg-[rgba(10,24,20,0.4)] p-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md shadow-xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Amistosos & Desafios
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            Vagas e Horários Abertos
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/vagas"
            target="_blank"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
          >
            🌐 Ver Diretório Público
          </Link>
          <Button
            onClick={() => setShowAddModal(true)}
            className="rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[#010403] bg-[#10b981] hover:bg-[#34d399]"
          >
            + Publicar Nova Vaga
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-400">
          {feedback}
        </div>
      )}

      {/* Slots List */}
      <div className="rounded-3xl border border-white/10 bg-[#161b22] p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Suas Vagas Abertas em Destaque
        </h2>

        {loading ? (
          <p className="text-xs text-[#8fa39b] py-8 text-center">Carregando vagas do time...</p>
        ) : slots.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center text-[#8fa39b]">
            <p className="text-3xl mb-2">⚽</p>
            <p className="text-sm font-bold text-white">Nenhuma vaga publicada no momento</p>
            <p className="text-xs mt-1">Publique datas e horários que seu time tem disponíveis para encontrar novos adversários!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {slots.map((slot) => (
              <div key={slot.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-400">
                      📅 {formatDateOnly(slot.date)}
                    </span>
                    {slot.timeLabel && (
                      <span className="text-xs font-semibold text-white">às {slot.timeLabel}</span>
                    )}
                  </div>

                  <p className="mt-1 text-sm font-semibold text-white">
                    📍 {slot.venueLabel || "Local a combinar"}
                  </p>

                  {slot.notes && (
                    <p className="mt-0.5 text-xs text-[#8fa39b] italic">"{slot.notes}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="text-xs py-1.5 px-3"
                  >
                    Cancelar Vaga
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Publicar Nova Vaga de Amistoso">
        <form onSubmit={handleCreateSlot} className="space-y-4">
          {errorMsg && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          <Input
            label="Data da Partida / Horário Disponível"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <Input
            label="Horário (opcional)"
            placeholder="Ex: 19:00 ou Sábado às 15h"
            value={timeLabel}
            onChange={(e) => setTimeLabel(e.target.value)}
          />

          <Input
            label="Local / Quadra / Campo (opcional)"
            placeholder="Ex: Arena Soccer Betim ou Campo do Zezinho"
            value={venueLabel}
            onChange={(e) => setVenueLabel(e.target.value)}
          />

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-subtle)]">
              Observações / Regras do Amistoso (opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Quadra reservada. Dividimos o valor do aluguel (R$ 120 para cada time)."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#16130f] p-3 text-xs text-white placeholder:text-[#8fa39b] outline-none focus:border-[#36c2a8] transition-colors"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={actionLoading} className="w-full bg-[#10b981] hover:bg-[#34d399] text-black font-bold">
              {actionLoading ? "Publicando..." : "📢 Publicar Vaga no Diretório"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
