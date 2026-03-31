"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { playerPositionLabels, playerPositions } from "@/lib/player-positions";
import {
  createPlayerSchema,
  updatePlayerSchema,
  type CreatePlayerInput,
  type UpdatePlayerInput,
} from "@/lib/validations/player";

interface PlayerFormProps {
  defaultValues?: {
    id?: string;
    name?: string;
    position?: string;
    shirtNumber?: number;
    status?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const positionOptions = playerPositions.map((position) => ({
  value: position,
  label: playerPositionLabels[position],
}));

const statusOptions = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "INACTIVE", label: "Inativo" },
];

export function PlayerForm({ defaultValues, onSuccess, onCancel }: PlayerFormProps) {
  const isEditing = !!defaultValues?.id;
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePlayerInput | UpdatePlayerInput>({
    resolver: zodResolver(isEditing ? updatePlayerSchema : createPlayerSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      position: (defaultValues?.position as CreatePlayerInput["position"]) || undefined,
      shirtNumber: defaultValues?.shirtNumber || undefined,
      ...(isEditing && { status: (defaultValues?.status as "ACTIVE" | "INACTIVE") || "ACTIVE" }),
    },
  });

  async function onSubmit(data: CreatePlayerInput | UpdatePlayerInput) {
    setLoading(true);
    setErrorMsg("");

    try {
      const url = isEditing
        ? `/api/players/${defaultValues!.id}`
        : "/api/players";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.code === "SHIRT_NUMBER_TAKEN") {
          setErrorMsg("Número de camisa já em uso no time");
        } else {
          setErrorMsg(result.error || "Erro ao salvar jogador");
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

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Nome
        </label>
        <Input id="name" type="text" placeholder="Nome do jogador" {...register("name")} />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="position" className="mb-1 block text-sm font-medium text-gray-700">
          Posição
        </label>
        <Select
          id="position"
          options={positionOptions}
          placeholder="Selecione a posição"
          {...register("position")}
        />
        {errors.position && (
          <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="shirtNumber" className="mb-1 block text-sm font-medium text-gray-700">
          Número da Camisa
        </label>
        <Input
          id="shirtNumber"
          type="number"
          min={1}
          max={99}
          placeholder="1-99"
          {...register("shirtNumber", { valueAsNumber: true })}
        />
        {errors.shirtNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.shirtNumber.message}</p>
        )}
      </div>

      {isEditing && (
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <Select
            id="status"
            options={statusOptions}
            {...register("status")}
          />
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : isEditing ? "Atualizar" : "Adicionar"}
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
