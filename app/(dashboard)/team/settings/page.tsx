"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { TeamForm } from "@/components/forms/TeamForm";

interface TeamData {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  defaultVenue: string | null;
  badgeUrl: string | null;
}

interface TeamDiscoverySettings {
  city: string | null;
  region: string | null;
  fieldType: "GRASS" | "SYNTHETIC" | "FUTSAL" | "SOCIETY" | "OTHER" | null;
  competitiveLevel: "CASUAL" | "INTERMEDIATE" | "COMPETITIVE" | null;
  publicDirectoryOptIn: boolean;
}

interface OpenMatchSlot {
  id: string;
  date: string;
  timeLabel: string | null;
  venueLabel: string | null;
  notes: string | null;
  status: "OPEN" | "BOOKED" | "CLOSED";
}

const fieldTypeOptions = [
  { value: "", label: "Nao definido" },
  { value: "GRASS", label: "Campo de grama" },
  { value: "SYNTHETIC", label: "Gramado sintetico" },
  { value: "FUTSAL", label: "Futsal" },
  { value: "SOCIETY", label: "Society" },
  { value: "OTHER", label: "Outro" },
];

const levelOptions = [
  { value: "", label: "Nao definido" },
  { value: "CASUAL", label: "Casual" },
  { value: "INTERMEDIATE", label: "Intermediario" },
  { value: "COMPETITIVE", label: "Competitivo" },
];

const fieldTypeLabels: Record<string, string> = {
  GRASS: "Grama",
  SYNTHETIC: "Sintetico",
  FUTSAL: "Futsal",
  SOCIETY: "Society",
  OTHER: "Outro",
};

const levelLabels: Record<string, string> = {
  CASUAL: "Casual",
  INTERMEDIATE: "Intermediario",
  COMPETITIVE: "Competitivo",
};

export default function TeamSettingsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTeam, setHasTeam] = useState(true);
  const [settings, setSettings] = useState<TeamDiscoverySettings>({
    city: null,
    region: null,
    fieldType: null,
    competitiveLevel: null,
    publicDirectoryOptIn: false,
  });
  const [slots, setSlots] = useState<OpenMatchSlot[]>([]);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [slotSaving, setSlotSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [slotDate, setSlotDate] = useState("");
  const [slotTimeLabel, setSlotTimeLabel] = useState("");
  const [slotVenueLabel, setSlotVenueLabel] = useState("");
  const [slotNotes, setSlotNotes] = useState("");

  async function loadTeam() {
    try {
      const res = await fetch("/api/teams");
      if (res.status === 404) {
        setHasTeam(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
        setHasTeam(true);
      }
    } catch {
      setHasTeam(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeam();
  }, []);

  useEffect(() => {
    if (!isAdmin || !hasTeam) return;

    async function loadDiscoverySettings() {
      try {
        const res = await fetch("/api/teams/open-slots");
        if (!res.ok) return;

        const data = await res.json();
        if (data?.team) {
          setSettings({
            city: data.team.city ?? null,
            region: data.team.region ?? null,
            fieldType: data.team.fieldType ?? null,
            competitiveLevel: data.team.competitiveLevel ?? null,
            publicDirectoryOptIn: Boolean(data.team.publicDirectoryOptIn),
          });
        }
        setSlots(Array.isArray(data?.slots) ? data.slots : []);
      } catch {
        // Keep settings UI available even if discovery endpoint fails temporarily.
      }
    }

    loadDiscoverySettings();
  }, [isAdmin, hasTeam]);

  async function saveDiscoverySettings() {
    setSettingsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/teams/open-slots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: settings.city || null,
          region: settings.region || null,
          fieldType: settings.fieldType || null,
          competitiveLevel: settings.competitiveLevel || null,
          publicDirectoryOptIn: settings.publicDirectoryOptIn,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Nao foi possivel salvar configuracoes de descoberta.");
      }

      setFeedback("Configuracoes de descoberta salvas.");
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Erro ao salvar configuracoes.");
    } finally {
      setSettingsSaving(false);
    }
  }

  async function createOpenSlot() {
    if (!slotDate) {
      setFeedback("Informe a data e hora do slot.");
      return;
    }

    setSlotSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/teams/open-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(slotDate).toISOString(),
          timeLabel: slotTimeLabel || null,
          venueLabel: slotVenueLabel || null,
          notes: slotNotes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Nao foi possivel criar o slot.");
      }

      setSlots((current) => [...current, data].sort((a, b) => a.date.localeCompare(b.date)));
      setSlotDate("");
      setSlotTimeLabel("");
      setSlotVenueLabel("");
      setSlotNotes("");
      setFeedback("Slot aberto criado com sucesso.");
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Erro ao criar slot.");
    } finally {
      setSlotSaving(false);
    }
  }

  async function closeSlot(slotId: string) {
    setFeedback(null);

    try {
      const res = await fetch("/api/teams/open-slots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slotId, status: "CLOSED" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Nao foi possivel fechar o slot.");
      }

      setSlots((current) =>
        current.map((slot) => (slot.id === slotId ? { ...slot, status: data.status } : slot))
      );
      setFeedback("Slot fechado.");
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Erro ao fechar slot.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--text-muted)]">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-[22px] border border-[#f0d3b0] bg-gradient-to-r from-[#fff4e7] via-[#fff8ef] to-[#fffdf8] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#9a5b1b]">
            Acesso restrito
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--text)]">
            Configuracoes do Time
          </h1>
        </div>

        <Card className="rounded-[18px]">
          <CardContent className="py-8">
            <p className="text-sm text-[var(--text-muted)]">
              Somente administradores podem editar as configuracoes do time.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-[22px] border border-[#b7d8ce] bg-gradient-to-r from-[#e4f3ed] via-[#eff7ef] to-[#f7f1e7] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#2a6f60]">
          Identidade do clube
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--text)]">
          {hasTeam ? "Configuracoes do Time" : "Criar Time"}
        </h1>
      </div>

      {!hasTeam && (
        <div className="rounded-[14px] border border-[#bde0d3] bg-[#e9f8f1] p-4 text-sm text-[#1d5f4f]">
          Voce ainda nao criou um time. Preencha as informacoes abaixo para comecar.
        </div>
      )}

      <Card className="rounded-[18px]">
        <CardHeader>
          <h2 className="text-lg font-semibold text-[var(--text)]">
            {hasTeam ? "Perfil do Time" : "Novo Time"}
          </h2>
        </CardHeader>
        <CardContent>
          <TeamForm
            isCreating={!hasTeam}
            defaultValues={
              team
                ? {
                    name: team.name,
                    description: team.description || "",
                    primaryColor: team.primaryColor || "#0c6f5d",
                    secondaryColor: team.secondaryColor || "#f6f8f5",
                    defaultVenue: team.defaultVenue || "",
                    badgeUrl: team.badgeUrl || "",
                  }
                : undefined
            }
            onSuccess={() => {
              loadTeam();
              setHasTeam(true);
            }}
          />
        </CardContent>
      </Card>

      {team?.slug && (
        <Card className="rounded-[18px]">
          <CardContent className="py-4">
            <p className="text-sm text-[var(--text-muted)]">
              <strong>Vitrine publica:</strong>{" "}
              <a
                href={`/vitrine/${team.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--brand)] hover:underline"
              >
                /vitrine/{team.slug}
              </a>
            </p>
          </CardContent>
        </Card>
      )}

      {hasTeam && (
        <Card className="rounded-[18px]">
          <CardHeader>
            <h2 className="text-lg font-semibold text-[var(--text)]">Diretorio de descoberta</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2 text-sm text-[var(--text)]">
              <input
                type="checkbox"
                checked={settings.publicDirectoryOptIn}
                onChange={(e) =>
                  setSettings((current) => ({ ...current, publicDirectoryOptIn: e.target.checked }))
                }
              />
              Exibir este time no diretorio publico de amistosos
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Cidade"
                value={settings.city || ""}
                onChange={(e) => setSettings((current) => ({ ...current, city: e.target.value }))}
                placeholder="Ex.: Sao Paulo"
              />
              <Input
                label="Regiao"
                value={settings.region || ""}
                onChange={(e) => setSettings((current) => ({ ...current, region: e.target.value }))}
                placeholder="Ex.: Zona Norte"
              />
              <Select
                label="Tipo de campo"
                options={fieldTypeOptions}
                value={settings.fieldType || ""}
                onChange={(e) =>
                  setSettings((current) => ({
                    ...current,
                    fieldType: (e.target.value || null) as TeamDiscoverySettings["fieldType"],
                  }))
                }
              />
              <Select
                label="Nivel competitivo"
                options={levelOptions}
                value={settings.competitiveLevel || ""}
                onChange={(e) =>
                  setSettings((current) => ({
                    ...current,
                    competitiveLevel: (e.target.value || null) as TeamDiscoverySettings["competitiveLevel"],
                  }))
                }
              />
            </div>
            <Button onClick={saveDiscoverySettings} loading={settingsSaving}>
              Salvar configuracoes de descoberta
            </Button>
          </CardContent>
        </Card>
      )}

      {hasTeam && (
        <Card className="rounded-[18px]">
          <CardHeader>
            <h2 className="text-lg font-semibold text-[var(--text)]">Agenda aberta de amistosos</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Data e hora"
                type="datetime-local"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
              />
              <Input
                label="Faixa de horario"
                value={slotTimeLabel}
                onChange={(e) => setSlotTimeLabel(e.target.value)}
                placeholder="Ex.: Sabado 15h"
              />
              <Input
                label="Local"
                value={slotVenueLabel}
                onChange={(e) => setSlotVenueLabel(e.target.value)}
                placeholder="Ex.: Campo do bairro"
              />
            </div>
            <Textarea
              label="Observacoes"
              value={slotNotes}
              onChange={(e) => setSlotNotes(e.target.value)}
              placeholder="Informacoes adicionais para o amistoso"
            />
            <Button onClick={createOpenSlot} loading={slotSaving}>
              Criar slot aberto
            </Button>

            <div className="space-y-2">
              {slots.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">Nenhum slot cadastrado ainda.</p>
              ) : (
                slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex flex-col gap-2 rounded-[12px] border border-[var(--border)] bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">
                        {new Date(slot.date).toLocaleString("pt-BR")}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {(slot.timeLabel || "Horario a definir") + " • " + (slot.venueLabel || "Local a definir")}
                      </p>
                      {slot.notes && (
                        <p className="mt-1 text-xs text-[var(--text-muted)]">{slot.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--text-subtle)]">
                        {slot.status}
                      </span>
                      {slot.status === "OPEN" && (
                        <Button variant="secondary" size="sm" onClick={() => closeSlot(slot.id)}>
                          Fechar slot
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {hasTeam && team?.slug && (
        <Card className="rounded-[18px]">
          <CardHeader>
            <h2 className="text-lg font-semibold text-[var(--text)]">Previa publica do discovery</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[18px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-soft)_72%,white_28%)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
                    Como seu time aparece no diretorio
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[var(--text)]">{team.name}</h3>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {settings.publicDirectoryOptIn
                      ? "Seu time esta pronto para aparecer no discovery publico."
                      : "Seu time ainda nao aparece no discovery publico ate ativar o opt-in."}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                    settings.publicDirectoryOptIn
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {settings.publicDirectoryOptIn ? "Publicado" : "Rascunho"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-subtle)]">
                {settings.city && <span className="rounded-full border border-[var(--border)] bg-white/75 px-2 py-1">Cidade: {settings.city}</span>}
                {settings.region && <span className="rounded-full border border-[var(--border)] bg-white/75 px-2 py-1">Regiao: {settings.region}</span>}
                {settings.fieldType && (
                  <span className="rounded-full border border-[var(--border)] bg-white/75 px-2 py-1">
                    Campo: {fieldTypeLabels[settings.fieldType]}
                  </span>
                )}
                {settings.competitiveLevel && (
                  <span className="rounded-full border border-[var(--border)] bg-white/75 px-2 py-1">
                    Nivel: {levelLabels[settings.competitiveLevel]}
                  </span>
                )}
                {!settings.city && !settings.region && !settings.fieldType && !settings.competitiveLevel && (
                  <span className="rounded-full border border-[var(--border)] bg-white/75 px-2 py-1">
                    Complete os dados para melhorar a descoberta
                  </span>
                )}
              </div>

              <div className="mt-4 rounded-[14px] border border-[var(--border)] bg-white/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                  Agenda aberta
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                  {slots.filter((slot) => slot.status === "OPEN").length > 0
                    ? `${slots.filter((slot) => slot.status === "OPEN").length} slot(s) visiveis no discovery`
                    : "Nenhum slot OPEN publicado ainda"}
                </p>
                {slots.find((slot) => slot.status === "OPEN") && (
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Proximo: {new Date(slots.find((slot) => slot.status === "OPEN")!.date).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="/vitrine"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                Abrir diretorio publico
              </a>
              <a
                href={`/vitrine/${team.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--brand)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
              >
                Abrir vitrine do time
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {feedback && (
        <div className="rounded-[14px] border border-[#bde0d3] bg-[#e9f8f1] p-4 text-sm text-[#1d5f4f]">
          {feedback}
        </div>
      )}
    </div>
  );
}
