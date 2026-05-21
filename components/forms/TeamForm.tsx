"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { updateTeamSchema, createTeamSchema, type UpdateTeamInput } from "@/lib/validations/team";

interface TeamFormProps {
  defaultValues?: {
    name?: string;
    shortName?: string;
    description?: string;
    primaryColor?: string;
    secondaryColor?: string;
    defaultVenue?: string;
    badgeUrl?: string;
  };
  onSuccess?: () => void;
  isCreating?: boolean;
}

export function TeamForm({ defaultValues, onSuccess, isCreating = false }: TeamFormProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [badgePreview, setBadgePreview] = useState<string | null>(
    defaultValues?.badgeUrl || null
  );
  const [uploadingBadge, setUploadingBadge] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTeamInput>({
    resolver: zodResolver(isCreating ? createTeamSchema : updateTeamSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      shortName: defaultValues?.shortName || "",
      description: defaultValues?.description || "",
      primaryColor: defaultValues?.primaryColor || "#0000FF",
      secondaryColor: defaultValues?.secondaryColor || "#FFFFFF",
      defaultVenue: defaultValues?.defaultVenue || "",
    },
  });

  async function handleBadgeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBadge(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao enviar imagem");
        return;
      }

      setBadgePreview(data.url);

      if (isCreating) {
        setSuccessMsg("Escudo enviado. Salve o time para concluir.");
      } else {
        const patchRes = await fetch("/api/teams", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ badgeUrl: data.url }),
        });

        const patchData = await patchRes.json().catch(() => ({}));
        if (!patchRes.ok) {
          setErrorMsg(patchData.error || "Imagem enviada, mas não foi possível salvar no time");
          return;
        }

        setSuccessMsg("Escudo atualizado!");
      }
    } catch {
      setErrorMsg("Erro ao enviar imagem");
    } finally {
      setUploadingBadge(false);
    }
  }

  async function onSubmit(data: UpdateTeamInput) {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const method = isCreating ? "POST" : "PATCH";
      const res = await fetch("/api/teams", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          shortName: data.shortName?.trim()
            ? data.shortName.trim().toUpperCase()
            : isCreating
              ? undefined
              : null,
          badgeUrl: badgePreview ?? undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMsg(result.error || "Erro ao salvar configurações");
        return;
      }

      setSuccessMsg(isCreating ? "Time criado com sucesso!" : "Configurações salvas!");
      onSuccess?.();
    } catch {
      setErrorMsg("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMsg && (
        <div className="rounded-[12px] border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.1)] p-4 text-sm text-[#fca5a5] font-semibold">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="rounded-[12px] border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] p-4 text-sm text-[#6ee7b7] font-semibold">
          {successMsg}
        </div>
      )}

      {/* Badge Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--text)]">
          Escudo do Time
        </label>
        <div className="flex items-center gap-4">
          {badgePreview ? (
            <img
              src={badgePreview}
              alt="Escudo"
              className="h-20 w-20 rounded-lg border border-[var(--border)] object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] text-[var(--text-subtle)]">
              <span className="text-2xl">⚽</span>
            </div>
          )}
          <div>
            <label className="cursor-pointer">
              <span className="inline-flex items-center rounded-[10px] border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-white/[0.08] transition-colors">
                {uploadingBadge ? "Enviando..." : "Alterar Escudo"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleBadgeUpload}
                disabled={uploadingBadge}
              />
            </label>
            <p className="mt-1 text-xs text-[var(--text-subtle)]">JPEG, PNG ou WebP. Máx. 5 MB.</p>
          </div>
        </div>
      </div>

      <Input
        label="Nome do Time"
        {...register("name")}
        error={errors.name?.message}
        placeholder="Ex: FC Amigos do Bairro"
      />

      <Input
        label="Sigla do time"
        {...register("shortName")}
        error={errors.shortName?.message}
        placeholder="Ex: MCA"
        maxLength={6}
      />

      <Textarea
        label="Descrição"
        {...register("description")}
        error={errors.description?.message}
        placeholder="Conte um pouco sobre seu time..."
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Cor Primária"
          type="color"
          {...register("primaryColor")}
          error={errors.primaryColor?.message}
        />
        <Input
          label="Cor Secundária"
          type="color"
          {...register("secondaryColor")}
          error={errors.secondaryColor?.message}
        />
      </div>

      <Input
        label="Local Padrão de Jogos"
        {...register("defaultVenue")}
        error={errors.defaultVenue?.message}
        placeholder="Ex: Quadra do Parque Central"
      />

      <Button type="submit" loading={loading} className="w-full">
        {isCreating ? "Criar Time" : "Salvar Configurações"}
      </Button>
    </form>
  );
}
