"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface OpenSlotInfo {
  id: string;
  date: string;
  timeLabel: string | null;
  venueLabel: string | null;
  notes: string | null;
  team: {
    name: string;
    badgeUrl: string | null;
    city: string | null;
  };
}

interface ChallengeModalProps {
  slot: OpenSlotInfo | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChallengeModal({ slot, onClose, onSuccess }: ChallengeModalProps) {
  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fee, setFee] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!slot) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slot) return;
    if (!teamName.trim() || !email.trim()) {
      setErrorMsg("Preencha o nome do seu time e seu e-mail de contato.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/open-slots/${slot.id}/challenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterTeamName: teamName.trim(),
          contactEmail: email.trim(),
          contactPhone: phone.trim() || null,
          proposedFee: fee ? parseFloat(fee) : null,
          message: message.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao enviar desafio");
        return;
      }

      onSuccess();
    } catch {
      setErrorMsg("Erro de conexão ao enviar desafio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={!!slot} onClose={onClose} title={`Desafiar ${slot.team.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-[#8fa39b]">
          <p className="font-bold text-white mb-1">Detalhes do Horário:</p>
          <p>📅 {new Date(slot.date).toLocaleDateString("pt-BR")} {slot.timeLabel ? `às ${slot.timeLabel}` : ""}</p>
          <p>📍 {slot.venueLabel || "Local a combinar"} {slot.team.city ? `(${slot.team.city})` : ""}</p>
        </div>

        <Input
          label="Nome do Seu Time"
          placeholder="Ex: Resenha F.C."
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />

        <Input
          label="E-mail de Contato"
          type="email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="WhatsApp / Telefone de Contato (opcional)"
          placeholder="(85) 99999-9999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Input
          label="Proposta de Taxa de Jogo / Cota (R$ opcional)"
          type="number"
          placeholder="Ex: 150.00"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />

        <div>
          <label className="mb-1 block text-xs font-semibold text-[var(--text-subtle)]">
            Mensagem / Observações (opcional)
          </label>

          <textarea
            rows={3}
            placeholder="Ex: Jogamos com uniforme azul. Aceitam dividir a taxa da quadra?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#16130f] p-3 text-xs text-white placeholder:text-[#8fa39b] outline-none focus:border-[#36c2a8] transition-colors"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={loading} className="w-full bg-[#10b981] hover:bg-[#34d399] text-black font-bold">
            {loading ? "Enviando Desafio..." : "⚔️ Confirmar Envio do Desafio"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
