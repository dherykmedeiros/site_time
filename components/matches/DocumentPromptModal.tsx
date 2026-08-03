"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface DocumentPromptModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (fullName: string, cpf: string) => Promise<void>;
  initialFullName?: string;
  initialCpf?: string;
}

export function DocumentPromptModal({
  open,
  onClose,
  onConfirm,
  initialFullName = "",
  initialCpf = "",
}: DocumentPromptModalProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [cpf, setCpf] = useState(initialCpf);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setFullName(initialFullName);
    setCpf(initialCpf);
  }, [initialFullName, initialCpf]);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic CPF formatting: 000.000.000-00
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
    }
    setCpf(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg("Informe seu nome completo conforme documento oficial.");
      return;
    }
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      setErrorMsg("Informe um CPF válido contendo 11 dígitos.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await onConfirm(fullName.trim(), cpf.trim());
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao salvar dados do documento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="📋 Identificação para Lista de Presença">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
          <p className="font-bold">⚠️ Atenção:</p>
          <p className="mt-0.5 leading-relaxed">
            Esta partida exige Nome Completo e CPF para emissão da lista oficial de acesso/embarque. Seus dados serão salvos de forma segura no seu perfil.
          </p>
        </div>

        <Input
          label="Nome Completo (como no documento)"
          placeholder="Ex: João da Silva Santos"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          label="CPF"
          placeholder="000.000.000-00"
          value={cpf}
          onChange={handleCpfChange}
          maxLength={14}
          required
        />

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="w-1/2">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="w-1/2 bg-[#10b981] hover:bg-[#34d399] text-black font-bold">
            {loading ? "Salvando..." : "✅ Salvar & Confirmar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
