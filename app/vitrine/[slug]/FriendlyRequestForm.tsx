"use client";

import { useState } from "react";

interface FriendlyRequestFormProps {
  teamSlug: string;
}

export function FriendlyRequestForm({ teamSlug }: FriendlyRequestFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [requesterTeamName, setRequesterTeamName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [suggestedDates, setSuggestedDates] = useState("");
  const [suggestedVenue, setSuggestedVenue] = useState("");
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
      <div className="rounded-[16px] border border-[#bde0d3] bg-[#e9f8f1] p-6 text-center">
        <p className="text-lg font-semibold text-[#1c5a4b]">
          ✅ Solicitação enviada com sucesso!
        </p>
        <p className="mt-2 text-sm text-[#2f6f5f]">
          Você receberá uma resposta por e-mail.
        </p>
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

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nome do seu time *
        </label>
        <input
          type="text"
          value={requesterTeamName}
          onChange={(e) => setRequesterTeamName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
          className="w-full rounded-[12px] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
          placeholder="Ex: FC Amigos"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          E-mail de contato *
        </label>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
          className="w-full rounded-[12px] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
          placeholder="contato@seutime.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <input
          type="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          maxLength={20}
          className="w-full rounded-[12px] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
          placeholder="(11) 99999-9999"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Datas/horários sugeridos *
        </label>
        <textarea
          value={suggestedDates}
          onChange={(e) => setSuggestedDates(e.target.value)}
          required
          minLength={5}
          maxLength={500}
          rows={3}
          className="w-full rounded-[12px] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
          placeholder="Ex: Sábados à tarde, preferencialmente 15h ou 16h"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Local sugerido
        </label>
        <input
          type="text"
          value={suggestedVenue}
          onChange={(e) => setSuggestedVenue(e.target.value)}
          maxLength={200}
          className="w-full rounded-[12px] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
          placeholder="Ex: Campo do Parque, Rua das Flores"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Valor de cota proposto (R$)
        </label>
        <input
          type="number"
          value={proposedFee}
          onChange={(e) => setProposedFee(e.target.value)}
          min="0"
          step="0.01"
          className="w-full rounded-[12px] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
          placeholder="0.00"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[12px] bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)] disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar Solicitação"}
      </button>
    </form>
  );
}
