"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

interface TransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const categoryOptions = [
  { value: "MEMBERSHIP", label: "Mensalidade" },
  { value: "FRIENDLY_FEE", label: "Cota de Amistoso" },
  { value: "VENUE_RENTAL", label: "Aluguel de Quadra" },
  { value: "REFEREE", label: "Arbitragem" },
  { value: "EQUIPMENT", label: "Material Esportivo" },
  { value: "OTHER", label: "Outros" },
];

export function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("MEMBERSHIP");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/finances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          description,
          category,
          date: new Date(date).toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("INCOME")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            type === "INCOME"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          💰 Receita
        </button>
        <button
          type="button"
          onClick={() => setType("EXPENSE")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            type === "EXPENSE"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          💸 Despesa
        </button>
      </div>

      <Input
        label="Valor (R$)"
        type="number"
        step="0.01"
        min="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Textarea
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        minLength={2}
        maxLength={200}
      />

      <Select
        label="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={categoryOptions}
      />

      <Input
        label="Data"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
        required
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
