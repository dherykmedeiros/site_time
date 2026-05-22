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
      <div className="rounded-none border-2 border-emerald-800 bg-[#090d0f] p-6 text-center shadow-[4px_4px_0px_0px_#10b981]">
        <p className="text-lg font-mono font-black text-[#10b981] uppercase tracking-tight">
          [SUCESSO] CANDIDATURA REGISTRADA!
        </p>
        <p className="mt-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          A comissão técnica analisará seu perfil técnico de atleta. Boa sorte!
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4 rounded-none border-2 border-slate-800 bg-[#0f1418] hover:bg-slate-900 text-white font-mono uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
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
    <form onSubmit={handleSubmit} className="space-y-4 font-mono">
      {error && (
        <div className="rounded-none border-2 border-red-800 bg-[#090d0f] p-3 text-xs text-red-500 font-mono font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_#ef4444]">
          [ERRO] {error}
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
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[#10b981] focus:shadow-[3px_3px_0px_0px_#10b981] shadow-none transition-all focus:ring-0"
      />

      <Input
        label="Contato (E-mail ou WhatsApp) *"
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
        placeholder="E-mail ou celular com DDD"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[#10b981] focus:shadow-[3px_3px_0px_0px_#10b981] shadow-none transition-all focus:ring-0"
      />

      <Input
        label="Posição que joga (Opcional)"
        type="text"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        placeholder="Ex: Meio-Campo, Zagueiro, Goleiro..."
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[#10b981] focus:shadow-[3px_3px_0px_0px_#10b981] shadow-none transition-all focus:ring-0"
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
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[#10b981] focus:shadow-[3px_3px_0px_0px_#10b981] shadow-none transition-all focus:ring-0"
      />

      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">
        Campos com * são obrigatórios.
      </p>

      <Button
        type="submit"
        loading={loading}
        className="w-full rounded-none border-2 border-slate-800 bg-[#10b981] text-black font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.9)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] transition-all"
      >
        {loading ? "Enviando..." : "Quero Jogar no Time"}
      </Button>
    </form>
  );
}
