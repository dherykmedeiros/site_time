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
    homeScore?: number | null;
    awayScore?: number | null;
    pixKey?: string | null;
    latitude?: number | null;
    longitude?: number | null;
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
  const [recordType, setRecordType] = useState<"SCHEDULED" | "COMPLETED">(() => {
    if (defaultValues?.id) {
      return defaultValues.homeScore !== undefined && defaultValues.homeScore !== null ? "COMPLETED" : "SCHEDULED";
    }
    return "SCHEDULED";
  });

  useEffect(() => {
    fetch("/api/seasons")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.seasons) {
          setSeasons(
            d.seasons.filter(
              (s: Season & { status: string }) =>
                s.status === "ACTIVE" || s.id === defaultValues?.seasonId
            )
          );
        }
      })
      .catch(() => {});
  }, [defaultValues?.seasonId]);

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
    reset,
  } = useForm<CreateMatchInput>({
    resolver: zodResolver(createMatchSchema) as any,
    defaultValues: {
      date: formatDateForInput(defaultValues?.date) || "",
      venue: defaultValues?.venue || "",
      opponent: defaultValues?.opponent || "",
      isHome: defaultValues?.isHome ?? true,
      opponentBadgeUrl: defaultValues?.opponentBadgeUrl || "",
      type: (defaultValues?.type as "FRIENDLY" | "CHAMPIONSHIP") || undefined,
      homeScore: defaultValues?.homeScore !== null ? defaultValues?.homeScore : undefined,
      awayScore: defaultValues?.awayScore !== null ? defaultValues?.awayScore : undefined,
      pixKey: defaultValues?.pixKey || "",
      mapsUrl: (defaultValues?.latitude !== undefined && defaultValues?.latitude !== null &&
                defaultValues?.longitude !== undefined && defaultValues?.longitude !== null)
        ? `https://www.google.com/maps/search/?api=1&query=${defaultValues.latitude},${defaultValues.longitude}`
        : "",
    },
  });

  useEffect(() => {
    if (!isEditing && !defaultValues?.positionLimits?.length) {
      fetch("/api/teams")
        .then((r) => (r.ok ? r.json() : null))
        .then((team) => {
          if (team) {
            if (team.defaultVenue && !defaultValues?.venue) {
              setValue("venue", team.defaultVenue);
            }
            if (team.defaultPositionLimitsEnabled && team.defaultPositionLimits) {
              setPositionLimitsEnabled(true);
              setPositionLimits((prev) => {
                const updated = { ...prev };
                for (const pos of playerPositions) {
                  if (team.defaultPositionLimits[pos] !== undefined && team.defaultPositionLimits[pos] !== null) {
                    updated[pos] = String(team.defaultPositionLimits[pos]);
                  }
                }
                return updated;
              });
            }
          }
        })
        .catch(() => {});
    }
  }, [isEditing, defaultValues, setValue]);

  const watchedDate = watch("date");
  const watchedOpponentBadgeUrl = watch("opponentBadgeUrl");
  const isPastDate = watchedDate ? new Date(watchedDate) < new Date() : false;

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
    if (recordType === "COMPLETED" || !watchedDate || Number.isNaN(Date.parse(watchedDate))) {
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

  async function onSubmit(data: any) {
    setLoading(true);
    setErrorMsg("");

    if (recordType === "COMPLETED") {
      const hVal = data.homeScore;
      const aVal = data.awayScore;
      if (
        hVal === undefined ||
        hVal === null ||
        hVal === "" ||
        Number.isNaN(Number(hVal)) ||
        aVal === undefined ||
        aVal === null ||
        aVal === "" ||
        Number.isNaN(Number(aVal))
      ) {
        setErrorMsg("Por favor, preencha o placar de ambas as equipes para registrar um jogo passado.");
        setLoading(false);
        return;
      }
    }

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
        pixKey: data.pixKey?.trim() ? data.pixKey.trim() : null,
        mapsUrl: data.mapsUrl?.trim() || null,
        status: recordType,
      };

      if (recordType === "SCHEDULED") {
        body.homeScore = null;
        body.awayScore = null;
      }

      body.seasonId = seasonId || null;

      if (recordType === "SCHEDULED" && positionLimitsEnabled) {
        body.positionLimits = playerPositions
          .map((position) => ({
            position,
            maxPlayers: Number(positionLimits[position] || 0),
          }))
          .filter((limit) => Number.isFinite(limit.maxPlayers) && limit.maxPlayers > 0);
      } else {
        body.positionLimits = [];
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

      if (!isEditing) {
        reset();
        setOpponentBadgePreview(null);
        setAvailabilitySnapshot(null);
        setPositionLimitsEnabled(false);
        const initialLimits: Record<string, string> = {};
        for (const position of playerPositions) {
          initialLimits[position] = "";
        }
        setPositionLimits(initialLimits);
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
        <div className="rounded-[12px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] p-3 text-sm text-[#fca5a5]">
          {errorMsg}
        </div>
      )}

      {/* Selector de Tipo de Registro (Pill Switcher) */}
      <div className="mb-6 space-y-2">
        <label className="block text-xs font-black uppercase tracking-[0.15em] text-[var(--text-muted)]">
          Tipo de Registro
        </label>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/[0.03] border border-white/5 p-1">
          <button
            type="button"
            onClick={() => setRecordType("SCHEDULED")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
              recordType === "SCHEDULED"
                ? "bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.25)] text-[#34d399] shadow-sm"
                : "border border-transparent text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <span className="text-sm">📅</span> Agendar Jogo (Futuro)
          </button>
          <button
            type="button"
            onClick={() => setRecordType("COMPLETED")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
              recordType === "COMPLETED"
                ? "bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.25)] text-[#34d399] shadow-sm"
                : "border border-transparent text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <span className="text-sm">🏆</span> Registrar Jogo Passado
          </button>
        </div>
      </div>

      <Input
        label="Data e Horário"
        type="datetime-local"
        error={errors.date?.message}
        {...register("date")}
      />

      {recordType === "SCHEDULED" && (availabilityLoading || availabilityError || availabilitySnapshot) && (
        <div className="rounded-xl border border-[rgba(16,185,129,0.15)] bg-[rgba(10,24,20,0.3)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
                Previsão de Quorum
              </p>
              <p className="text-xs text-[#8fa39b]">
                Isso ajuda a antecipar o risco do horário. Não bloqueia o agendamento.
              </p>
            </div>
            {availabilitySnapshot && (
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Risco {riskLabels[availabilitySnapshot.snapshot.overallRisk]}
              </span>
            )}
          </div>

          {availabilityLoading && (
            <p className="mt-3 text-sm text-[#8fa39b]">Calculando previsão...</p>
          )}

          {!availabilityLoading && availabilityError && (
            <div className="mt-3 rounded-[12px] border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.06)] p-3 text-sm text-[#f87171]">
              {availabilityError}
            </div>
          )}

          {!availabilityLoading && availabilitySnapshot && (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                <div className="rounded-[12px] bg-[#090f0c] border border-white/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Disponíveis</p>
                  <p className="mt-1 text-xl font-black text-white">
                    {availabilitySnapshot.snapshot.likelyAvailableCount}
                  </p>
                </div>
                <div className="rounded-[12px] bg-[#090f0c] border border-white/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Incertos</p>
                  <p className="mt-1 text-xl font-black text-[#fbbf24]">
                    {availabilitySnapshot.snapshot.uncertainCount}
                  </p>
                </div>
                <div className="rounded-[12px] bg-[#090f0c] border border-white/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Indisponíveis</p>
                  <p className="mt-1 text-xl font-black text-[#f87171]">
                    {availabilitySnapshot.snapshot.likelyUnavailableCount}
                  </p>
                </div>
                <div className="rounded-[12px] bg-[#090f0c] border border-white/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">Elenco Ativo</p>
                  <p className="mt-1 text-xl font-black text-white">
                    {availabilitySnapshot.snapshot.activePlayers}
                  </p>
                </div>
              </div>

              {availabilitySnapshot.explanations.length > 0 && (
                <div className="space-y-2">
                  {availabilitySnapshot.explanations.map((item) => (
                    <p key={item} className="text-xs text-[#8fa39b]">
                      {item}
                    </p>
                  ))}
                </div>
              )}

              {criticalPositions && criticalPositions.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {criticalPositions.map((position) => (
                    <div key={position.position} className="rounded-[12px] border border-white/10 bg-[#090f0c] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">
                        {playerPositionLabels[position.position as keyof typeof playerPositionLabels] || position.position}
                      </p>
                      <p className="mt-1 text-xs text-white">
                        {position.likelyAvailable} prováveis, {position.uncertain} incertos
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

      <div className="space-y-1">
        <Input
          label="Link do Google Maps (opcional)"
          placeholder="Ex: https://maps.app.goo.gl/XYZ ou coordenadas"
          error={errors.mapsUrl?.message}
          {...register("mapsUrl")}
        />
        <p className="text-[11px] text-[var(--text-subtle)] leading-relaxed">
          Cole o link compartilhado do Google Maps (ex: <code>https://maps.app.goo.gl/...</code> ou coordenadas diretas no formato <code>latitude, longitude</code>) para habilitar o check-in automático a 500m dos atletas.
        </p>
      </div>

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
        onChange={(e) => {
          const newIsHome = e.target.value === "home";
          const currentIsHome = watch("isHome") ?? true;
          if (newIsHome !== currentIsHome) {
            const currentHomeScore = watch("homeScore");
            const currentAwayScore = watch("awayScore");
            setValue("isHome", newIsHome, { shouldValidate: true });
            setValue("homeScore", currentAwayScore, { shouldValidate: true });
            setValue("awayScore", currentHomeScore, { shouldValidate: true });
          }
        }}
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
            <span className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors shadow-sm">
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

      <Input
        label="Chave Pix para Pagamento da Taxa (opcional)"
        placeholder="Ex: Celular, E-mail, CPF ou Chave Aleatória"
        error={errors.pixKey?.message}
        {...register("pixKey")}
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

      {recordType === "COMPLETED" && (
        <div className="rounded-xl border border-[rgba(16,185,129,0.2)] bg-[rgba(10,24,20,0.3)] p-4 space-y-3 shadow-md backdrop-blur-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#34d399]">
            Resultado da Partida
          </p>
          <p className="text-xs text-[#8fa39b]">
            Insira o placar final para registrar esta partida diretamente como concluída no histórico.
          </p>
          <div className="grid gap-4 grid-cols-2">
            <Input
              label={watch("isHome") === false ? "Gols do Adversário (Casa)" : "Gols do Time (Casa)"}
              type="number"
              min={0}
              placeholder="Ex: 3"
              error={errors.homeScore?.message}
              {...register("homeScore")}
            />
            <Input
              label={watch("isHome") === false ? "Gols do Time (Visitante)" : "Gols do Adversário (Visitante)"}
              type="number"
              min={0}
              placeholder="Ex: 1"
              error={errors.awayScore?.message}
              {...register("awayScore")}
            />
          </div>
        </div>
      )}

      {recordType === "SCHEDULED" && (
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
                <div key={position} className="rounded-lg border border-white/10 bg-[#090f0c] p-3">
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
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Salvando..."
            : isEditing
            ? recordType === "COMPLETED"
              ? "Salvar Resultado"
              : "Atualizar"
            : recordType === "COMPLETED"
            ? "Registrar Jogo"
            : "Agendar"}
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

