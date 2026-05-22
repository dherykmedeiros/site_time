"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface FriendlyRequestFormProps {
  teamSlug: string;
  initialSuggestedDates?: string;
  initialSuggestedVenue?: string;
}

export function FriendlyRequestForm({
  teamSlug,
  initialSuggestedDates = "",
  initialSuggestedVenue = "",
}: FriendlyRequestFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [requesterTeamName, setRequesterTeamName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [suggestedDates, setSuggestedDates] = useState(initialSuggestedDates);
  const [suggestedVenue, setSuggestedVenue] = useState(initialSuggestedVenue);
  const [proposedFee, setProposedFee] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/friendly-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamSlug,
          requesterTeamName,
          contactEmail,
          contactPhone: contactPhone || undefined,
          suggestedDates,
          suggestedVenue: suggestedVenue || undefined,
          proposedFee: proposedFee ? parseFloat(proposedFee) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar solicitação");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-none border-2 border-emerald-800 bg-[#090d0f] p-6 text-center shadow-[4px_4px_0px_0px_#10b981]">
        <p className="text-lg font-mono font-black text-[#10b981] uppercase tracking-tight">
          [SUCESSO] SOLICITAÇÃO ENVIADA!
        </p>
        <p className="mt-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          A comissão técnica analisará a proposta e responderá por e-mail.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4 rounded-none border-2 border-slate-800 bg-[#0f1418] hover:bg-slate-900 text-white font-mono uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          onClick={() => {
            setSuccess(false);
            setRequesterTeamName("");
            setContactEmail("");
            setContactPhone("");
            setSuggestedDates(initialSuggestedDates);
            setSuggestedVenue(initialSuggestedVenue);
            setProposedFee("");
          }}
        >
          Enviar nova solicitação
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-mono">
      {error && (
        <div className="rounded-none border-2 border-red-800 bg-[#090d0f] p-3 text-xs text-red-500 font-mono font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_#ef4444]">
          [ERRO] {error}
        </div>
      )}

      {initialSuggestedDates && (
        <div className="rounded-none border-2 border-slate-800 bg-[#090d0f] p-3 text-xs text-[var(--team-primary)] font-mono font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--team-primary)]">
          [HORÁRIO SELECIONADO] AGENDANDO COM BASE NO HORÁRIO ABERTO SELECIONADO. AJUSTE SE NECESSÁRIO.
        </div>
      )}

      <Input
        label="Nome da sua equipe *"
        type="text"
        value={requesterTeamName}
        onChange={(e) => setRequesterTeamName(e.target.value)}
        required
        minLength={2}
        maxLength={100}
        placeholder="Ex: FC Amigos"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
      />

      <Input
        label="E-mail de contato *"
        type="email"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
        required
        placeholder="contato@suaequipe.com"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
      />

      <Input
        label="Telefone"
        type="tel"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
        maxLength={20}
        placeholder="(11) 99999-9999"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
      />

      <Textarea
        label="Datas/horários sugeridos *"
        value={suggestedDates}
        onChange={(e) => setSuggestedDates(e.target.value)}
        required
        minLength={5}
        maxLength={500}
        rows={3}
        placeholder="Ex: Sábados a tarde, preferencialmente 15h ou 16h"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
      />

      <Input
        label="Local sugerido"
        type="text"
        value={suggestedVenue}
        onChange={(e) => setSuggestedVenue(e.target.value)}
        maxLength={200}
        placeholder="Ex: Campo do Parque, Rua das Flores"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
      />

      <Input
        label="Valor de cota proposto (R$)"
        type="number"
        value={proposedFee}
        onChange={(e) => setProposedFee(e.target.value)}
        min="0"
        step="0.01"
        placeholder="0.00"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
      />

      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">
        Campos com * são obrigatórios. Quanto mais detalhes, mais rápida a resposta.
      </p>

      <Button
        type="submit"
        loading={loading}
        className="w-full rounded-none border-2 border-slate-800 bg-[var(--team-primary)] text-black font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.9)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] transition-all"
      >
        {loading ? "Enviando..." : "Enviar Solicitação"}
      </Button>
    </form>
  );
}
