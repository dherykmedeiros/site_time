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
      <div className="rounded-[18px] border border-[#bde0d3] bg-[#e9f8f1] p-6 text-center">
        <p className="text-lg font-semibold text-[#1c5a4b]">
          Solicitacao enviada com sucesso!
        </p>
        <p className="mt-2 text-sm text-[#2f6f5f]">
          Voce recebera uma resposta por e-mail.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4"
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
          Enviar nova solicitacao
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-[14px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[#9a3422]">
          {error}
        </div>
      )}

      {initialSuggestedDates && (
        <div className="rounded-[14px] border border-[#bde0d3] bg-[#e9f8f1] p-3 text-sm text-[#1d5f4f]">
          O formulario ja foi preenchido com uma data aberta selecionada. Ajuste os detalhes se precisar.
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
      />

      <Input
        label="E-mail de contato *"
        type="email"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
        required
        placeholder="contato@suaequipe.com"
      />

      <Input
        label="Telefone"
        type="tel"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
        maxLength={20}
        placeholder="(11) 99999-9999"
      />

      <Textarea
        label="Datas/horarios sugeridos *"
        value={suggestedDates}
        onChange={(e) => setSuggestedDates(e.target.value)}
        required
        minLength={5}
        maxLength={500}
        rows={3}
        placeholder="Ex: Sabados a tarde, preferencialmente 15h ou 16h"
      />

      <Input
        label="Local sugerido"
        type="text"
        value={suggestedVenue}
        onChange={(e) => setSuggestedVenue(e.target.value)}
        maxLength={200}
        placeholder="Ex: Campo do Parque, Rua das Flores"
      />

      <Input
        label="Valor de cota proposto (R$)"
        type="number"
        value={proposedFee}
        onChange={(e) => setProposedFee(e.target.value)}
        min="0"
        step="0.01"
        placeholder="0.00"
      />

      <p className="text-xs text-[var(--text-subtle)]">
        Campos com * sao obrigatorios. Quanto mais detalhes, mais rapida a resposta.
      </p>

      <Button
        type="submit"
        loading={loading}
        className="w-full"
      >
        {loading ? "Enviando..." : "Enviar Solicitação"}
      </Button>
    </form>
  );
}
