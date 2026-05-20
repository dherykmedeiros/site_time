"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface RecruitmentFormProps {
  teamSlug: string;
}

export function RecruitmentForm({ teamSlug }: RecruitmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamSlug,
          name,
          contact,
          position: position || undefined,
          message: message || undefined,
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
      <div className="rounded-[18px] border border-[#10b981]/30 bg-[#10b981]/10 p-6 text-center backdrop-blur-md">
        <p className="text-lg font-semibold text-[#34d399]">
          Candidatura enviada com sucesso!
        </p>
        <p className="mt-2 text-sm text-[#8fa39b]">
          A comissão técnica avaliará seu perfil e entrará em contato. Boa sorte!
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4 border-[#10b981]/50 text-[#34d399] hover:bg-[#10b981]/20"
          onClick={() => {
            setSuccess(false);
            setName("");
            setContact("");
            setPosition("");
            setMessage("");
          }}
        >
          Enviar nova candidatura
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-[14px] border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Input
        label="Seu Nome *"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        maxLength={100}
        placeholder="Ex: João Silva"
        className="bg-black/40 border-[#8fa39b]/20 text-white placeholder-gray-500 focus:border-[#10b981]"
      />

      <Input
        label="Contato (E-mail ou WhatsApp) *"
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
        placeholder="E-mail ou celular com DDD"
        className="bg-black/40 border-[#8fa39b]/20 text-white placeholder-gray-500 focus:border-[#10b981]"
      />

      <Input
        label="Posição que joga (Opcional)"
        type="text"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        placeholder="Ex: Meio-Campo, Zagueiro, Goleiro..."
        className="bg-black/40 border-[#8fa39b]/20 text-white placeholder-gray-500 focus:border-[#10b981]"
      />

      <Textarea
        label="Por que quer entrar no time? *"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        minLength={5}
        maxLength={500}
        rows={3}
        placeholder="Fale um pouco sobre sua experiência e vontade de vestir o manto!"
        className="bg-black/40 border-[#8fa39b]/20 text-white placeholder-gray-500 focus:border-[#10b981]"
      />

      <p className="text-xs text-[#8fa39b]">
        Campos com * são obrigatórios.
      </p>

      <Button
        type="submit"
        loading={loading}
        className="w-full bg-[#10b981] hover:bg-[#34d399] text-[#030708] font-bold"
      >
        {loading ? "Enviando..." : "Quero Jogar no Time"}
      </Button>
    </form>
  );
}
