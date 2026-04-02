"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { playerPositionLabels, playerPositions } from "@/lib/player-positions";
import {
  createMatchSchema,
  type CreateMatchInput,
} from "@/lib/validations/match";

interface Season {
  id: string;
  name: string;
  type: string;
  status?: string;
}

interface AvailabilityPositionSummary {
  position: string;
  likelyAvailable: number;
  uncertain: number;
  likelyUnavailable: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
}

interface AvailabilitySnapshot {
  date: string;
  activePlayers: number;
  likelyAvailableCount: number;
  uncertainCount: number;
  likelyUnavailableCount: number;
  overallRisk: "LOW" | "MEDIUM" | "HIGH";
}

interface MatchAvailabilityResponse {
  snapshot: AvailabilitySnapshot;
  positions: AvailabilityPositionSummary[];
  explanations: string[];
}

interface MatchFormProps {
  defaultValues?: {
    id?: string;
    date?: string;
    venue?: string;
    opponent?: string;
    isHome?: boolean;
    opponentBadgeUrl?: string | null;
    type?: string;
    seasonId?: string;
    positionLimits?: Array<{ position: string; maxPlayers: number }>;
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
  const [uploadingBadge, setUploadingBadge] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [availabilitySnapshot, setAvailabilitySnapshot] = useState<MatchAvailabilityResponse | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [seasonId, setSeasonId] = useState<string>(defaultValues?.seasonId ?? "");
  const [positionLimitsEnabled, setPositionLimitsEnabled] = useState(
    Boolean(defaultValues?.positionLimits?.length)
  );
  const [positionLimits, setPositionLimits] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const position of playerPositions) {
      const existing = defaultValues?.positionLimits?.find((l) => l.position === position);
      initial[position] = existing ? String(existing.maxPlayers) : "";
    }
    return initial;
  });
  const [opponentBadgePreview, setOpponentBadgePreview] = useState<string | null>(
    defaultValues?.opponentBadgeUrl || null
  );

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
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateMatchInput>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      date: formatDateForInput(defaultValues?.date) || "",
      venue: defaultValues?.venue || "",
      opponent: defaultValues?.opponent || "",
      isHome: defaultValues?.isHome ?? true,
      opponentBadgeUrl: defaultValues?.opponentBadgeUrl || "",
      type: (defaultValues?.type as "FRIENDLY" | "CHAMPIONSHIP") || undefined,
    },
  });

  const watchedDate = watch("date");
  const watchedOpponentBadgeUrl = watch("opponentBadgeUrl");

  useEffect(() => {
    register("isHome");
  }, [register]);

  useEffect(() => {
    if (watchedOpponentBadgeUrl?.trim()) {
      setOpponentBadgePreview(watchedOpponentBadgeUrl.trim());
    } else {
      setOpponentBadgePreview(null);
    }
  }, [watchedOpponentBadgeUrl]);

  async function handleOpponentBadgeUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
        setErrorMsg(data.error || "Erro ao enviar escudo do adversario");
        return;
      }

      setValue("opponentBadgeUrl", data.url, { shouldValidate: true });
      setOpponentBadgePreview(data.url);
    } catch {
      setErrorMsg("Erro ao enviar escudo do adversario");
    } finally {
      setUploadingBadge(false);
    }
  }

  useEffect(() => {
    if (!watchedDate || Number.isNaN(Date.parse(watchedDate))) {
      setAvailabilitySnapshot(null);
      setAvailabilityError(null);
      setAvailabilityLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setAvailabilityLoading(true);
      setAvailabilityError(null);

      try {
        const response = await fetch(`/api/matches/availability?date=${encodeURIComponent(watchedDate)}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          setAvailabilitySnapshot(null);
          setAvailabilityError(data.error || "Nao foi possivel carregar a previsao de quorum.");
          return;
        }

        setAvailabilitySnapshot(data);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        setAvailabilitySnapshot(null);
        setAvailabilityError("Nao foi possivel carregar a previsao de quorum.");
      } finally {
        setAvailabilityLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [watchedDate]);

  const riskLabels: Record<AvailabilitySnapshot["overallRisk"], string> = {
    LOW: "baixo",
    MEDIUM: "medio",
    HIGH: "alto",
  };

  const criticalPositions = availabilitySnapshot?.positions.filter((position) => position.risk !== "LOW").slice(0, 3);

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
        opponentBadgeUrl: data.opponentBadgeUrl?.trim() ? data.opponentBadgeUrl.trim() : null,
      };

      if (seasonId) body.seasonId = seasonId;

      if (positionLimitsEnabled) {
        body.positionLimits = playerPositions
          .map((position) => ({
            position,
            maxPlayers: Number(positionLimits[position] || 0),
          }))
          .filter((limit) => Number.isFinite(limit.maxPlayers) && limit.maxPlayers > 0);
      }

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

      {(availabilityLoading || availabilityError || availabilitySnapshot) && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">
                Previsao de quorum
              </p>
              <p className="text-sm text-[var(--text-subtle)]">
                Isso ajuda a antecipar risco do horario. Nao bloqueia o agendamento.
              </p>
            </div>
            {availabilitySnapshot && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--text)]">
                Risco {riskLabels[availabilitySnapshot.snapshot.overallRisk]}
              </span>
            )}
          </div>

          {availabilityLoading && (
            <p className="mt-3 text-sm text-[var(--text-subtle)]">Calculando previsao...</p>
          )}

          {!availabilityLoading && availabilityError && (
            <div className="mt-3 rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)]">
              {availabilityError}
            </div>
          )}

          {!availabilityLoading && availabilitySnapshot && (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-[12px] bg-white p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-subtle)]">Disponiveis</p>
                  <p className="mt-1 text-xl font-bold text-[var(--text)]">
                    {availabilitySnapshot.snapshot.likelyAvailableCount}
                  </p>
                </div>
                <div className="rounded-[12px] bg-white p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-subtle)]">Incertos</p>
                  <p className="mt-1 text-xl font-bold text-[var(--text)]">
                    {availabilitySnapshot.snapshot.uncertainCount}
                  </p>
                </div>
                <div className="rounded-[12px] bg-white p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-subtle)]">Indisponiveis</p>
                  <p className="mt-1 text-xl font-bold text-[var(--text)]">
                    {availabilitySnapshot.snapshot.likelyUnavailableCount}
                  </p>
                </div>
                <div className="rounded-[12px] bg-white p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-subtle)]">Elenco ativo</p>
                  <p className="mt-1 text-xl font-bold text-[var(--text)]">
                    {availabilitySnapshot.snapshot.activePlayers}
                  </p>
                </div>
              </div>

              {availabilitySnapshot.explanations.length > 0 && (
                <div className="space-y-2">
                  {availabilitySnapshot.explanations.map((item) => (
                    <p key={item} className="text-sm text-[var(--text-subtle)]">
                      {item}
                    </p>
                  ))}
                </div>
              )}

              {criticalPositions && criticalPositions.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {criticalPositions.map((position) => (
                    <div key={position.position} className="rounded-[12px] border border-[#d9e6df] bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                        {playerPositionLabels[position.position as keyof typeof playerPositionLabels] || position.position}
                      </p>
                      <p className="mt-1 text-sm text-[var(--text)]">
                        {position.likelyAvailable} provaveis, {position.uncertain} incertos
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
        label="Mando de campo"
        options={[
          { value: "home", label: "Casa" },
          { value: "away", label: "Visitante" },
        ]}
        value={watch("isHome") === false ? "away" : "home"}
        onChange={(e) => setValue("isHome", e.target.value === "home", { shouldValidate: true })}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--text-subtle)]">
          Escudo do adversario (opcional)
        </label>
        <div className="flex items-center gap-3">
          {opponentBadgePreview ? (
            <img
              src={opponentBadgePreview}
              alt="Escudo adversario"
              className="h-16 w-16 rounded-lg border border-[var(--border)] object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] text-[var(--text-subtle)]">
              <span className="text-lg">VS</span>
            </div>
          )}

          <label className="cursor-pointer">
            <span className="inline-flex items-center rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-soft)]">
              {uploadingBadge ? "Enviando..." : "Fazer upload"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleOpponentBadgeUpload}
              disabled={uploadingBadge}
            />
          </label>
        </div>
      </div>

      <Input
        label="URL do escudo adversário (opcional)"
        placeholder="https://... ou /uploads/..."
        error={errors.opponentBadgeUrl?.message}
        {...register("opponentBadgeUrl")}
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

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
        <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--text)]">
          <input
            type="checkbox"
            checked={positionLimitsEnabled}
            onChange={(e) => setPositionLimitsEnabled(e.target.checked)}
          />
          Definir limite por posição para confirmações
        </label>
        <p className="text-xs text-[var(--text-subtle)]">
          Ajuda a equilibrar o elenco para o jogo. Exemplo: 2 zagueiros, 1 lateral esquerdo, 1 lateral direito.
        </p>

        {positionLimitsEnabled && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {playerPositions.map((position) => (
              <div key={position} className="rounded-lg border border-[var(--border)] bg-white p-3">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                  {playerPositionLabels[position]}
                </label>
                <Input
                  type="number"
                  min={0}
                  max={30}
                  placeholder="Sem limite"
                  value={positionLimits[position]}
                  onChange={(e) =>
                    setPositionLimits((prev) => ({ ...prev, [position]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

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

