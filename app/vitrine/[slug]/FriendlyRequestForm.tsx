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
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-800">
          ✅ Solicitação enviada com sucesso!
        </p>
        <p className="mt-2 text-sm text-green-600">
          Você receberá uma resposta por e-mail.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
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
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="0.00"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar Solicitação"}
      </button>
    </form>
  );
}
