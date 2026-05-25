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
    foundedYear?: number | null;
    kitHomeUrl?: string | null;
    kitAwayUrl?: string | null;
    kitGkUrl?: string | null;
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

  // Kits Previews & Uploading states
  const [kitHomePreview, setKitHomePreview] = useState<string | null>(
    defaultValues?.kitHomeUrl || null
  );
  const [kitAwayPreview, setKitAwayPreview] = useState<string | null>(
    defaultValues?.kitAwayUrl || null
  );
  const [kitGkPreview, setKitGkPreview] = useState<string | null>(
    defaultValues?.kitGkUrl || null
  );

  const [uploadingKitHome, setUploadingKitHome] = useState(false);
  const [uploadingKitAway, setUploadingKitAway] = useState(false);
  const [uploadingKitGk, setUploadingKitGk] = useState(false);

  const {
    register,
    handleSubmit,
    formState,
  } = useForm<any>({
    resolver: zodResolver(isCreating ? createTeamSchema : updateTeamSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      shortName: defaultValues?.shortName || "",
      description: defaultValues?.description || "",
      primaryColor: defaultValues?.primaryColor || "#0c6f5d",
      secondaryColor: defaultValues?.secondaryColor || "#f6f8f5",
      defaultVenue: defaultValues?.defaultVenue || "",
      foundedYear: defaultValues?.foundedYear ?? undefined,
    },
  });
  const errors = formState.errors as any;

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

  async function handleKitUpload(e: React.ChangeEvent<HTMLInputElement>, kitType: "Home" | "Away" | "Gk") {
    const file = e.target.files?.[0];
    if (!file) return;

    if (kitType === "Home") setUploadingKitHome(true);
    else if (kitType === "Away") setUploadingKitAway(true);
    else setUploadingKitGk(true);

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao enviar imagem");
        return;
      }

      if (kitType === "Home") setKitHomePreview(data.url);
      else if (kitType === "Away") setKitAwayPreview(data.url);
      else setKitGkPreview(data.url);

      if (isCreating) {
        setSuccessMsg(`Uniforme ${kitType === "Home" ? "Titular" : kitType === "Away" ? "Visitante" : "Goleiro"} enviado. Salve o time para concluir.`);
      } else {
        const fieldName = kitType === "Home" ? "kitHomeUrl" : kitType === "Away" ? "kitAwayUrl" : "kitGkUrl";
        const patchRes = await fetch("/api/teams", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [fieldName]: data.url }),
        });

        const patchData = await patchRes.json().catch(() => ({}));
        if (!patchRes.ok) {
          setErrorMsg(patchData.error || "Imagem enviada, mas não foi possível salvar no time");
          return;
        }

        setSuccessMsg(`Uniforme ${kitType === "Home" ? "Titular" : kitType === "Away" ? "Visitante" : "Goleiro"} atualizado!`);
      }
    } catch {
      setErrorMsg("Erro ao enviar imagem");
    } finally {
      if (kitType === "Home") setUploadingKitHome(false);
      else if (kitType === "Away") setUploadingKitAway(false);
      else setUploadingKitGk(false);
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
          kitHomeUrl: kitHomePreview ?? undefined,
          kitAwayUrl: kitAwayPreview ?? undefined,
          kitGkUrl: kitGkPreview ?? undefined,
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

      <Input
        label="Ano de Fundação"
        type="number"
        {...register("foundedYear")}
        error={errors.foundedYear?.message}
        placeholder="Ex: 1995"
      />

      {/* Kit Uploads */}
      <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
          👕 Imagens dos Uniformes (Opcional)
        </h3>
        <p className="text-xs text-[var(--text-subtle)]">
          Selecione fotos reais ou mockups dos mantos do seu clube. Se deixado em branco, o portal continuará desenhando os mantos dinâmicos em SVG.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Home Kit */}
          <div className="space-y-2 flex flex-col items-center text-center">
            <span className="text-xs font-semibold text-[var(--text)]">Manto Titular</span>
            <div className="relative group overflow-hidden h-32 w-28 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-center">
              {kitHomePreview ? (
                <img
                  src={kitHomePreview}
                  alt="Manto Titular"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <span className="text-3xl text-[var(--text-subtle)] opacity-40">👕</span>
              )}
            </div>
            <label className="cursor-pointer mt-1">
              <span className="inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text)] hover:bg-white/[0.08] transition-colors">
                {uploadingKitHome ? "Enviando..." : "Upload"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleKitUpload(e, "Home")}
                disabled={uploadingKitHome}
              />
            </label>
          </div>

          {/* Away Kit */}
          <div className="space-y-2 flex flex-col items-center text-center">
            <span className="text-xs font-semibold text-[var(--text)]">Manto Visitante</span>
            <div className="relative group overflow-hidden h-32 w-28 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-center">
              {kitAwayPreview ? (
                <img
                  src={kitAwayPreview}
                  alt="Manto Visitante"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <span className="text-3xl text-[var(--text-subtle)] opacity-40">👕</span>
              )}
            </div>
            <label className="cursor-pointer mt-1">
              <span className="inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text)] hover:bg-white/[0.08] transition-colors">
                {uploadingKitAway ? "Enviando..." : "Upload"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleKitUpload(e, "Away")}
                disabled={uploadingKitAway}
              />
            </label>
          </div>

          {/* Gk Kit */}
          <div className="space-y-2 flex flex-col items-center text-center">
            <span className="text-xs font-semibold text-[var(--text)]">Manto do Goleiro</span>
            <div className="relative group overflow-hidden h-32 w-28 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-center">
              {kitGkPreview ? (
                <img
                  src={kitGkPreview}
                  alt="Manto do Goleiro"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <span className="text-3xl text-[var(--text-subtle)] opacity-40">🧤</span>
              )}
            </div>
            <label className="cursor-pointer mt-1">
              <span className="inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text)] hover:bg-white/[0.08] transition-colors">
                {uploadingKitGk ? "Enviando..." : "Upload"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleKitUpload(e, "Gk")}
                disabled={uploadingKitGk}
              />
            </label>
          </div>
        </div>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        {isCreating ? "Criar Time" : "Salvar Configurações"}
      </Button>
    </form>
  );
}

