"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { playerPositionLabels } from "@/lib/player-positions";

interface AvailabilityRule {
  id?: string;
  dayOfWeek: number;
  startMinutes: number;
  endMinutes: number;
  frequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY_OPTIONAL";
  availability: "AVAILABLE" | "PREFERABLE" | "UNAVAILABLE";
  notes: string | null;
}

interface SelfProfile {
  id: string;
  name: string;
  fullName: string | null;
  position: string;
  shirtNumber: number;
  status: "ACTIVE" | "INACTIVE";
  photoUrl: string | null;
  age: number | null;
  phone: string | null;
  description: string | null;
}

interface PlayerSelfProfileFormProps {
  playerId?: string;
  canEdit?: boolean;
}

export function PlayerSelfProfileForm({ playerId, canEdit = true }: PlayerSelfProfileFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [availabilitySuccess, setAvailabilitySuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<SelfProfile | null>(null);
  const [availabilityRules, setAvailabilityRules] = useState<AvailabilityRule[]>([]);

  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const weekDayOptions = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Segunda" },
    { value: 2, label: "Terça" },
    { value: 3, label: "Quarta" },
    { value: 4, label: "Quinta" },
    { value: 5, label: "Sexta" },
    { value: 6, label: "Sábado" },
  ];

  const frequencyOptions = [
    { value: "WEEKLY", label: "Toda semana" },
    { value: "BIWEEKLY", label: "Quinzenal" },
    { value: "MONTHLY_OPTIONAL", label: "Mensal / eventual" },
  ] as const;

  const availabilityOptions = [
    { value: "AVAILABLE", label: "Consigo ir" },
    { value: "PREFERABLE", label: "Boa chance" },
    { value: "UNAVAILABLE", label: "Normalmente nao consigo" },
  ] as const;

  function minutesToTimeInput(value: number) {
    const hours = String(Math.floor(value / 60)).padStart(2, "0");
    const minutes = String(value % 60).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function timeInputToMinutes(value: string) {
    const [hours, minutes] = value.split(":").map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return 0;
    }

    return hours * 60 + minutes;
  }

  function createEmptyAvailabilityRule(): AvailabilityRule {
    return {
      dayOfWeek: 2,
      startMinutes: 1140,
      endMinutes: 1320,
      frequency: "WEEKLY",
      availability: "AVAILABLE",
      notes: null,
    };
  }

  function handleInputValueChange(
    setter: (value: string) => void
  ): InputHTMLAttributes<HTMLInputElement>["onChange"] {
    return (event: ChangeEvent<HTMLInputElement>) => setter(event.target.value);
  }

  function handleTextareaValueChange(
    setter: (value: string) => void
  ): TextareaHTMLAttributes<HTMLTextAreaElement>["onChange"] {
    return (event: ChangeEvent<HTMLTextAreaElement>) => setter(event.target.value);
  }

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setErrorMsg(null);
      setAvailabilityError(null);

      try {
        const endpoint = playerId ? `/api/players/${playerId}` : "/api/players/me";
        const availabilityEndpoint = playerId ? null : "/api/players/me/availability";
        const [profileRes, availabilityRes] = await Promise.all([
          fetch(endpoint),
          availabilityEndpoint ? fetch(availabilityEndpoint) : Promise.resolve(null),
        ]);

        if (profileRes.status === 404) {
          setProfile(null);
          return;
        }

        const data = await profileRes.json();
        if (!profileRes.ok) {
          setErrorMsg(data.error || "Erro ao carregar perfil");
          return;
        }

        setProfile(data);
        setFullName(data.fullName || "");
        setPhotoUrl(data.photoUrl || null);
        setAge(data.age != null ? String(data.age) : "");
        setPhone(data.phone || "");
        setDescription(data.description || "");

        if (availabilityRes) {
          const availabilityData = await availabilityRes.json();
          if (availabilityRes.ok) {
            setAvailabilityRules(availabilityData.rules ?? []);
          } else if (availabilityRes.status !== 404) {
            setAvailabilityError(availabilityData.error || "Erro ao carregar disponibilidade");
          }
        }
      } catch {
        setErrorMsg("Erro de conexao");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [playerId]);

  function updateAvailabilityRule(index: number, next: Partial<AvailabilityRule>) {
    setAvailabilityRules((current) =>
      current.map((rule, ruleIndex) => (ruleIndex === index ? { ...rule, ...next } : rule))
    );
  }

  function addAvailabilityRule() {
    setAvailabilityRules((current) => [...current, createEmptyAvailabilityRule()]);
  }

  function removeAvailabilityRule(index: number) {
    setAvailabilityRules((current) => current.filter((_, ruleIndex) => ruleIndex !== index));
  }

  async function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao enviar foto");
        return;
      }

      setPhotoUrl(data.url);
      setSuccessMsg("Foto enviada com sucesso. Clique em Salvar para confirmar.");
    } catch {
      setErrorMsg("Erro de conexao no upload");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      fullName: fullName.trim() || null,
      photoUrl,
      age: age.trim() ? Number(age) : null,
      phone: phone.trim() || null,
      description: description.trim() || null,
    };

    try {
      const res = await fetch("/api/players/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao salvar perfil");
        return;
      }

      setProfile(data);
      setSuccessMsg("Perfil atualizado com sucesso.");
    } catch {
      setErrorMsg("Erro de conexao");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvailabilitySave() {
    setSavingAvailability(true);
    setAvailabilityError(null);
    setAvailabilitySuccess(null);

    try {
      const res = await fetch("/api/players/me/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rules: availabilityRules.map((rule) => ({
            dayOfWeek: rule.dayOfWeek,
            startMinutes: rule.startMinutes,
            endMinutes: rule.endMinutes,
            frequency: rule.frequency,
            availability: rule.availability,
            notes: rule.notes?.trim() ? rule.notes.trim() : undefined,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAvailabilityError(data.error || "Erro ao salvar disponibilidade");
        return;
      }

      setAvailabilityRules(data.rules ?? []);
      setAvailabilitySuccess("Disponibilidade recorrente atualizada com sucesso.");
    } catch {
      setAvailabilityError("Erro de conexao ao salvar disponibilidade");
    } finally {
      setSavingAvailability(false);
    }
  }

  if (loading) {
    return (
      <Card className="rounded-[18px]">
        <CardContent className="py-8">
          <p className="text-sm text-[var(--text-muted)]">Carregando meu perfil...</p>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Card className="rounded-[18px] border border-[#b7d8ce]">
      <CardHeader>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Meu perfil</p>
          <h2 className="text-lg font-bold text-[var(--text)]">
            {canEdit ? "Atualize seus dados basicos" : "Perfil do jogador"}
          </h2>
        </div>
      </CardHeader>
      <CardContent>
        {errorMsg && (
          <div className="mb-4 rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)]">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-[12px] border border-[#bde0d3] bg-[#e9f8f1] p-3 text-sm text-[#1d5f4f]">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nome de jogador (administracao)" value={profile.name} disabled readOnly />
            <Input
              label="Posicao (administracao)"
              value={playerPositionLabels[profile.position as keyof typeof playerPositionLabels] || profile.position}
              disabled
              readOnly
            />
            <Input label="Numero (administracao)" value={`#${profile.shirtNumber}`} disabled readOnly />
            <Input
              label="Status (administracao)"
              value={profile.status === "ACTIVE" ? "Ativo" : "Inativo"}
              disabled
              readOnly
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nome completo"
              value={fullName}
              onChange={handleInputValueChange(setFullName)}
              maxLength={120}
              placeholder="Seu nome completo"
              disabled={!canEdit}
            />
            <Input
              label="Idade"
              type="number"
              min={10}
              max={99}
              value={age}
              onChange={handleInputValueChange(setAge)}
              placeholder="Ex: 28"
              disabled={!canEdit}
            />
          </div>

          <Input
            label="Telefone"
            value={phone}
            onChange={handleInputValueChange(setPhone)}
            maxLength={30}
            placeholder="Ex: (11) 99999-9999"
            disabled={!canEdit}
          />

          <Textarea
            label="Descricao"
            value={description}
            onChange={handleTextareaValueChange(setDescription)}
            maxLength={500}
            placeholder="Fale um pouco sobre voce no time"
            rows={4}
            disabled={!canEdit}
          />

          <div className="space-y-2">
            <p className="text-sm font-semibold text-[var(--text)]">Foto</p>
            <div className="flex flex-wrap items-center gap-4">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Foto do jogador"
                  className="h-16 w-16 rounded-full border border-[var(--border)] object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[var(--border)] text-xl text-[var(--text-subtle)]">
                  👤
                </div>
              )}

              {canEdit && (
                <label className="cursor-pointer">
                  <span className="inline-flex items-center rounded-[10px] border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)]">
                    {uploadingPhoto ? "Enviando..." : "Alterar foto"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                  />
                </label>
              )}
              <p className="text-xs text-[var(--text-subtle)]">JPEG, PNG ou WebP. Maximo 5 MB.</p>
            </div>
          </div>

          {canEdit && (
            <div className="pt-1">
              <Button type="submit" disabled={saving || uploadingPhoto}>
                {saving ? "Salvando..." : "Salvar meu perfil"}
              </Button>
            </div>
          )}
        </form>

        {!playerId && (
          <div className="mt-8 border-t border-[var(--border)] pt-6">
            <div className="mb-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">
                Disponibilidade recorrente
              </p>
              <h3 className="text-base font-bold text-[var(--text)]">
                Ajude o admin a prever bons horarios
              </h3>
              <p className="text-sm text-[var(--text-subtle)]">
                Isso nao confirma sua presenca nos jogos. A confirmacao real continua acontecendo no RSVP.
              </p>
            </div>

            {availabilityError && (
              <div className="mb-4 rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)]">
                {availabilityError}
              </div>
            )}

            {availabilitySuccess && (
              <div className="mb-4 rounded-[12px] border border-[#bde0d3] bg-[#e9f8f1] p-3 text-sm text-[#1d5f4f]">
                {availabilitySuccess}
              </div>
            )}

            <div className="space-y-4">
              {availabilityRules.length === 0 && (
                <div className="rounded-[12px] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-subtle)]">
                  Nenhuma regra cadastrada ainda. Adicione os horarios em que voce costuma conseguir jogar.
                </div>
              )}

              {availabilityRules.map((rule, index) => (
                <div key={rule.id ?? `rule-${index}`} className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <div className="grid gap-4 lg:grid-cols-5">
                    <label className="space-y-1 text-sm font-semibold text-[var(--text)]">
                      <span>Dia</span>
                      <select
                        className="block w-full rounded-[12px] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)]"
                        value={rule.dayOfWeek}
                        disabled={!canEdit}
                        onChange={(event) => updateAvailabilityRule(index, { dayOfWeek: Number(event.target.value) })}
                      >
                        {weekDayOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <Input
                      label="Inicio"
                      type="time"
                      value={minutesToTimeInput(rule.startMinutes)}
                      disabled={!canEdit}
                      onChange={(event) => updateAvailabilityRule(index, { startMinutes: timeInputToMinutes(event.target.value) })}
                    />

                    <Input
                      label="Fim"
                      type="time"
                      value={minutesToTimeInput(rule.endMinutes)}
                      disabled={!canEdit}
                      onChange={(event) => updateAvailabilityRule(index, { endMinutes: timeInputToMinutes(event.target.value) })}
                    />

                    <label className="space-y-1 text-sm font-semibold text-[var(--text)]">
                      <span>Frequencia</span>
                      <select
                        className="block w-full rounded-[12px] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)]"
                        value={rule.frequency}
                        disabled={!canEdit}
                        onChange={(event) =>
                          updateAvailabilityRule(index, {
                            frequency: event.target.value as AvailabilityRule["frequency"],
                          })
                        }
                      >
                        {frequencyOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1 text-sm font-semibold text-[var(--text)]">
                      <span>Disponibilidade</span>
                      <select
                        className="block w-full rounded-[12px] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)]"
                        value={rule.availability}
                        disabled={!canEdit}
                        onChange={(event) =>
                          updateAvailabilityRule(index, {
                            availability: event.target.value as AvailabilityRule["availability"],
                          })
                        }
                      >
                        {availabilityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <Input
                        label="Observacao opcional"
                        maxLength={120}
                        value={rule.notes ?? ""}
                        disabled={!canEdit}
                        placeholder="Ex: saio do trabalho as 18h"
                        onChange={(event) => updateAvailabilityRule(index, { notes: event.target.value })}
                      />
                    </div>
                    {canEdit && (
                      <Button type="button" variant="ghost" onClick={() => removeAvailabilityRule(index)}>
                        Remover linha
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {canEdit && (
                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="secondary" onClick={addAvailabilityRule}>
                    Adicionar horario
                  </Button>
                  <Button type="button" onClick={handleAvailabilitySave} loading={savingAvailability}>
                    Salvar disponibilidade
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
