"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { TeamForm } from "@/components/forms/TeamForm";
import { DefaultLineupCard } from "@/components/dashboard/DefaultLineupCard";

interface TeamData {
  id?: string;
  name: string;
  shortName: string | null;
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

  // Configurações Disciplinares e Acúmulos state
  const [punishmentTypes, setPunishmentTypes] = useState<any[]>([]);
  const [accumulationRules, setAccumulationRules] = useState<any[]>([]);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDesc, setNewTypeDesc] = useState("");
  const [newTypeSeverity, setNewTypeSeverity] = useState<"WARNING" | "SUSPENSION">("WARNING");
  const [typeSaving, setTypeSaving] = useState(false);

  const [ruleSourceTypeId, setRuleSourceTypeId] = useState("");
  const [ruleAccumulateCount, setRuleAccumulateCount] = useState("3");
  const [ruleTargetTypeId, setRuleTargetTypeId] = useState("");
  const [ruleTargetMatches, setRuleTargetMatches] = useState("1");
  const [ruleExpiryDays, setRuleExpiryDays] = useState("30");
  const [ruleSaving, setRuleSaving] = useState(false);

  async function loadDisciplinarySettings() {
    try {
      const [typesRes, rulesRes] = await Promise.all([
        fetch("/api/teams/punishment-types"),
        fetch("/api/teams/accumulation-rules")
      ]);

      if (typesRes.ok) {
        const data = await typesRes.json();
        setPunishmentTypes(data.punishmentTypes || []);
      }
      if (rulesRes.ok) {
        const data = await rulesRes.json();
        setAccumulationRules(data.accumulationRules || []);
      }
    } catch (err) {
      console.error("Erro ao carregar configuracoes disciplinares", err);
    }
  }

  async function handleCreateType() {
    if (!newTypeName.trim()) {
      setFeedback("Informe o nome do tipo de punição.");
      return;
    }
    setTypeSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/teams/punishment-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTypeName,
          description: newTypeDesc || null,
          severity: newTypeSeverity
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar tipo de punição.");
      }
      setFeedback(`Tipo de punição "${newTypeName}" criado com sucesso!`);
      setNewTypeName("");
      setNewTypeDesc("");
      setNewTypeSeverity("WARNING");
      await loadDisciplinarySettings();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Erro ao salvar tipo de punição.");
    } finally {
      setTypeSaving(false);
    }
  }

  async function handleDeleteType(id: string) {
    if (!confirm("Tem certeza que deseja excluir este tipo de punição?")) return;
    setFeedback(null);
    try {
      const res = await fetch(`/api/teams/punishment-types/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao excluir tipo de punição.");
      }
      setFeedback("Tipo de punição excluído com sucesso!");
      await loadDisciplinarySettings();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Erro ao excluir tipo de punição.");
    }
  }

  async function handleSaveRule() {
    if (!ruleSourceTypeId || !ruleTargetTypeId) {
      setFeedback("Selecione os tipos de punição de origem e destino.");
      return;
    }
    setRuleSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/teams/accumulation-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceTypeId: ruleSourceTypeId,
          accumulateCount: parseInt(ruleAccumulateCount, 10),
          targetTypeId: ruleTargetTypeId,
          targetMatches: ruleTargetMatches ? parseInt(ruleTargetMatches, 10) : null,
          expiryDays: ruleExpiryDays ? parseInt(ruleExpiryDays, 10) : null
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar regra de acúmulo.");
      }
      setFeedback("Regra de acúmulo salva com sucesso!");
      setRuleSourceTypeId("");
      setRuleTargetTypeId("");
      setRuleAccumulateCount("3");
      setRuleTargetMatches("1");
      setRuleExpiryDays("30");
      await loadDisciplinarySettings();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Erro ao salvar regra de acúmulo.");
    } finally {
      setRuleSaving(false);
    }
  }

  async function handleDeleteRule(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta regra de acúmulo?")) return;
    setFeedback(null);
    try {
      const res = await fetch(`/api/teams/accumulation-rules/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao excluir regra de acúmulo.");
      }
      setFeedback("Regra de acúmulo excluída!");
      await loadDisciplinarySettings();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Erro ao excluir regra de acúmulo.");
    }
  }

  useEffect(() => {
    if (hasTeam && isAdmin) {
      loadDisciplinarySettings();
    }
  }, [hasTeam, isAdmin]);

  async function loadTeam() {
    try {
      const res = await fetch("/api/teams");
      if (res.status === 404 || res.status === 403) {
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
        <div className="flex flex-col gap-4 rounded-[22px] border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-md">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
            Acesso Restrito
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            Configurações do Time
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
      <div className="flex flex-col gap-4 rounded-[22px] border border-[rgba(16,185,129,0.18)] bg-[rgba(10,24,20,0.4)] p-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Identidade do Clube
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            {hasTeam ? "Configurações do Time" : "Criar Time"}
          </h1>
        </div>
      </div>

      {!hasTeam && (
        <div className="rounded-[14px] border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] p-4 text-sm text-[#6ee7b7]">
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
                    shortName: team.shortName || "",
                    description: team.description || "",
                    primaryColor: team.primaryColor || "#0c6f5d",
                    secondaryColor: team.secondaryColor || "#f6f8f5",
                    defaultVenue: team.defaultVenue || "",
                    badgeUrl: team.badgeUrl || "",
                    foundedYear: team.foundedYear ?? null,
                    kitHomeUrl: team.kitHomeUrl ?? null,
                    kitAwayUrl: team.kitAwayUrl ?? null,
                    kitGkUrl: team.kitGkUrl ?? null,
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

      {hasTeam && (
        <DefaultLineupCard />
      )}

      {hasTeam && (
        <Card className="rounded-[18px]">
          <CardHeader>
            <h2 className="text-lg font-semibold text-[var(--text)]">⚖️ Regulamento e Acúmulo de Punições</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Seção de Tipos de Punições */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#34d399]">
                1. Tipos de Punições / Multas
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Cadastre as punições da equipe. "Advertência" e "Suspensão" são criados por padrão.
              </p>

              {/* Lista de tipos existentes */}
              <div className="grid gap-2">
                {punishmentTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex flex-col gap-2 rounded-[12px] border border-white/5 bg-white/[0.03] p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{type.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            type.severity === "SUSPENSION"
                              ? "bg-red-500/10 border border-red-500/20 text-red-400"
                              : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                          }`}
                        >
                          {type.severity === "SUSPENSION" ? "Suspensão" : "Advertência"}
                        </span>
                      </div>
                      {type.description && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">{type.description}</p>
                      )}
                    </div>
                    {type.name !== "Advertência" && type.name !== "Suspensão" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="self-end sm:self-auto border-red-500/20 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDeleteType(type.id)}
                      >
                        Excluir
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Formulário para novo tipo */}
              <div className="rounded-[14px] border border-white/5 bg-white/[0.02] p-4 space-y-3">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Novo Tipo de Punição</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Nome da Punição"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    placeholder="Ex: Multa de Atraso"
                  />
                  <Select
                    label="Gravidade / Categoria"
                    options={[
                      { value: "WARNING", label: "Advertência" },
                      { value: "SUSPENSION", label: "Suspensão" },
                    ]}
                    value={newTypeSeverity}
                    onChange={(e) => setNewTypeSeverity(e.target.value as "WARNING" | "SUSPENSION")}
                  />
                </div>
                <Input
                  label="Descrição (Opcional)"
                  value={newTypeDesc}
                  onChange={(e) => setNewTypeDesc(e.target.value)}
                  placeholder="Ex: Aplicado a jogadores que se atrasarem para a preleção"
                />
                <Button size="sm" onClick={handleCreateType} loading={typeSaving}>
                  Adicionar Tipo
                </Button>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* Seção de Regras de Acúmulo */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#34d399]">
                2. Regras de Conversão e Acúmulo
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Defina como as punições acumulam para gerar outra de forma automática.
              </p>

              {/* Lista de regras atuais */}
              <div className="grid gap-2">
                {accumulationRules.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] italic">Nenhuma regra de acúmulo configurada.</p>
                ) : (
                  accumulationRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex flex-col gap-2 rounded-[12px] border border-white/5 bg-white/[0.03] p-3 sm:flex-row sm:items-center sm:justify-between text-xs text-white"
                    >
                      <div className="space-y-1">
                        <div>
                          A cada <strong className="text-[#34d399]">{rule.accumulateCount}x</strong> punições do tipo{" "}
                          <strong className="text-amber-400">"{rule.sourceType?.name}"</strong>, o jogador receberá automaticamente 1x{" "}
                          <strong className="text-red-400">"{rule.targetType?.name}"</strong>
                          {rule.targetType?.severity === "SUSPENSION" && rule.targetMatches && (
                            <span> (Suspensão de <strong>{rule.targetMatches} jogo(s)</strong>)</span>
                          )}.
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">
                          {rule.expiryDays ? (
                            <span>O acúmulo expira após <strong>{rule.expiryDays} dias</strong> a partir de cada infração.</span>
                          ) : (
                            <span>O acúmulo nunca expira (histórico vitalício).</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        Remover Regra
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {/* Formulário para nova regra */}
              <div className="rounded-[14px] border border-white/5 bg-white/[0.02] p-4 space-y-3">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Configurar Regra de Acúmulo</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Select
                    label="Quando o jogador acumular..."
                    options={[
                      { value: "", label: "Selecione o tipo de origem" },
                      ...punishmentTypes.map(t => ({ value: t.id, label: t.name })),
                    ]}
                    value={ruleSourceTypeId}
                    onChange={(e) => setRuleSourceTypeId(e.target.value)}
                  />
                  <Input
                    label="Quantidade necessária"
                    type="number"
                    min="1"
                    value={ruleAccumulateCount}
                    onChange={(e) => setRuleAccumulateCount(e.target.value)}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Select
                    label="Converterá automaticamente em..."
                    options={[
                      { value: "", label: "Selecione o tipo de destino" },
                      ...punishmentTypes.map(t => ({ value: t.id, label: t.name })),
                    ]}
                    value={ruleTargetTypeId}
                    onChange={(e) => setRuleTargetTypeId(e.target.value)}
                  />
                  <Input
                    label="Janela de expiração (dias)"
                    type="number"
                    min="1"
                    value={ruleExpiryDays}
                    onChange={(e) => setRuleExpiryDays(e.target.value)}
                    placeholder="Deixe em branco para nunca expirar"
                  />
                </div>

                {/* Se o tipo selecionado for suspensão, permite configurar número de jogos */}
                {punishmentTypes.find(t => t.id === ruleTargetTypeId)?.severity === "SUSPENSION" && (
                  <div className="w-1/2 pr-1.5">
                    <Input
                      label="Jogos de suspensão aplicados"
                      type="number"
                      min="1"
                      value={ruleTargetMatches}
                      onChange={(e) => setRuleTargetMatches(e.target.value)}
                    />
                  </div>
                )}

                <Button size="sm" onClick={handleSaveRule} loading={ruleSaving}>
                  Salvar Regra de Acúmulo
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>
      )}

      {team?.slug && (
        <Card className="rounded-[18px]">
          <CardContent className="py-4">
            <p className="text-sm text-[var(--text-muted)]">
              <strong>Portal Oficial do Time:</strong>{" "}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--brand)] hover:underline"
              >
                / (Página Inicial)
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
                    className="flex flex-col gap-2 rounded-[12px] border border-white/5 bg-white/[0.04] p-3 sm:flex-row sm:items-center sm:justify-between hover:bg-white/[0.07] transition-colors"
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
                      ? "border border-[rgba(16,185,129,0.4)] bg-[rgba(16,185,129,0.1)] text-[#6ee7b7]"
                      : "border border-[rgba(245,158,11,0.4)] bg-[rgba(245,158,11,0.08)] text-[#fcd34d]"
                  }`}
                >
                  {settings.publicDirectoryOptIn ? "Publicado" : "Rascunho"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-subtle)]">
                {settings.city && <span className="rounded-full border border-[var(--border)] bg-white/75 px-2 py-1">Cidade: {settings.city}</span>}
                {settings.region && <span className="rounded-full border border-[var(--border)] bg-white/75 px-2 py-1">Regiao: {settings.region}</span>}
                {settings.fieldType && (
                  <span className="rounded-full border border-[var(--border)] bg-white/[0.05] px-2 py-1">
                    Campo: {fieldTypeLabels[settings.fieldType]}
                  </span>
                )}
                {settings.competitiveLevel && (
                  <span className="rounded-full border border-[var(--border)] bg-white/[0.05] px-2 py-1">
                    Nivel: {levelLabels[settings.competitiveLevel]}
                  </span>
                )}
                {!settings.city && !settings.region && !settings.fieldType && !settings.competitiveLevel && (
                  <span className="rounded-full border border-[var(--border)] bg-white/[0.05] px-2 py-1">
                    Complete os dados para melhorar a descoberta
                  </span>
                )}
              </div>

              <div className="mt-4 rounded-[14px] border border-white/5 bg-white/[0.03] p-3">
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
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--brand)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
              >
                Abrir Portal do Time
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {feedback && (
        <div className="rounded-[14px] border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] p-4 text-sm text-[#6ee7b7] font-semibold">
          {feedback}
        </div>
      )}
    </div>
  );
}
