"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  createMatchSchema,
  type CreateMatchInput,
} from "@/lib/validations/match";

interface Season {
  id: string;
  name: string;
  type: string;
}

interface MatchFormProps {
  defaultValues?: {
    id?: string;
    date?: string;
    venue?: string;
    opponent?: string;
    type?: string;
    seasonId?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const typeOptions = [
  { value: "FRIENDLY", label: "Amistoso" },
  { value: "CHAMPIONSHIP", label: "Campeonato" },
];

const typeLabels: Record<string, string> = {
  LEAGUE: "Liga",
  CUP: "Copa",
  TOURNAMENT: "Torneio",
};

export function MatchForm({ defaultValues, onSuccess, onCancel }: MatchFormProps) {
  const isEditing = !!defaultValues?.id;
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [seasonId, setSeasonId] = useState<string>(defaultValues?.seasonId ?? "");

  useEffect(() => {
    fetch("/api/seasons")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.seasons) {
          setSeasons(d.seasons.filter((s: Season & { status: string }) => s.status === "ACTIVE"));
        }
      })
      .catch(() => {});
  }, []);

  // Format date for datetime-local input
  const formatDateForInput = (isoDate?: string) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMatchInput>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      date: formatDateForInput(defaultValues?.date) || "",
      venue: defaultValues?.venue || "",
      opponent: defaultValues?.opponent || "",
      type: (defaultValues?.type as "FRIENDLY" | "CHAMPIONSHIP") || undefined,
    },
  });

  async function onSubmit(data: CreateMatchInput) {
    setLoading(true);
    setErrorMsg("");

    try {
      const url = isEditing
        ? `/api/matches/${defaultValues!.id}`
        : "/api/matches";
      const method = isEditing ? "PATCH" : "POST";

      // Convert datetime-local to ISO string
      const body: Record<string, unknown> = {
        ...data,
        date: new Date(data.date).toISOString(),
      };

      if (seasonId) body.seasonId = seasonId;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.code === "DATE_IN_PAST") {
          setErrorMsg("A data deve ser no futuro");
        } else {
          setErrorMsg(result.error || "Erro ao salvar partida");
        }
        return;
      }

      onSuccess?.();
    } catch {
      setErrorMsg("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <Input
        label="Data e Horário"
        type="datetime-local"
        error={errors.date?.message}
        {...register("date")}
      />

      <Input
        label="Local"
        placeholder="Ex: Campo do Parque"
        error={errors.venue?.message}
        {...register("venue")}
      />

      <Input
        label="Adversário"
        placeholder="Nome do time adversário"
        error={errors.opponent?.message}
        {...register("opponent")}
      />

      <Select
        label="Tipo"
        options={typeOptions}
        placeholder="Selecione o tipo"
        error={errors.type?.message}
        {...register("type")}
      />

      {seasons.length > 0 && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-subtle)]">
            Temporada (opcional)
          </label>
          <select
            value={seasonId}
            onChange={(e) => setSeasonId(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            <option value="">— Nenhuma temporada —</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({typeLabels[s.type] || s.type})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : isEditing ? "Atualizar" : "Agendar"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

