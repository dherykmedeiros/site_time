"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "next-auth/react";

interface RegisteredTeam {
  id: string;
  name: string;
  slug: string;
  badgeUrl: string | null;
  city: string | null;
  defaultVenue?: string | null;
}

interface FriendlyRequestFormProps {
  teamSlug: string;
  initialSuggestedDates?: string;
  initialSuggestedVenue?: string;
  initialRequestedDate?: string;
}

interface AvailabilityDay {
  date: string;
  available: boolean;
  reason: string | null;
}

interface AvailabilityResponse {
  rules: {
    enabled: boolean;
    minNoticeDays: number;
    maxAdvanceDays: number;
    bufferBeforeDays: number;
    bufferAfterDays: number;
    allowedWeekdays: number[];
  };
  days: AvailabilityDay[];
}

function getSaoPauloDateParts(value: string) {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  };
}

export function FriendlyRequestForm({
  teamSlug,
  initialSuggestedDates = "",
  initialSuggestedVenue = "",
  initialRequestedDate,
}: FriendlyRequestFormProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [registeredTeams, setRegisteredTeams] = useState<RegisteredTeam[]>([]);
  const [myTeam, setMyTeam] = useState<RegisteredTeam | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  const [requesterTeamName, setRequesterTeamName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const initialDateParts = initialRequestedDate ? getSaoPauloDateParts(initialRequestedDate) : null;
  const [selectedDate, setSelectedDate] = useState(initialDateParts?.date ?? "");
  const [selectedTime, setSelectedTime] = useState(initialDateParts?.time ?? "");
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(
    (initialDateParts?.date ?? new Date().toISOString().slice(0, 10)).slice(0, 7)
  );
  const [dateNotes, setDateNotes] = useState("");
  const [suggestedVenue, setSuggestedVenue] = useState(initialSuggestedVenue);
  const [proposedFee, setProposedFee] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadAvailability() {
      setAvailabilityLoading(true);
      setAvailabilityError("");
      try {
        const res = await fetch(
          `/api/friendly-requests/availability?teamSlug=${encodeURIComponent(teamSlug)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Não foi possível carregar a agenda");
        setAvailability(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setAvailabilityError(err instanceof Error ? err.message : "Erro ao carregar agenda");
      } finally {
        if (!controller.signal.aborted) setAvailabilityLoading(false);
      }
    }
    loadAvailability();
    return () => controller.abort();
  }, [teamSlug]);

  const availabilityByDate = useMemo(
    () => new Map(availability?.days.map((day) => [day.date, day]) ?? []),
    [availability]
  );
  const availableMonths = useMemo(
    () => [...new Set(availability?.days.map((day) => day.date.slice(0, 7)) ?? [])],
    [availability]
  );
  const calendarCells = useMemo(() => {
    const [year, month] = calendarMonth.split("-").map(Number);
    const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) =>
        `${year}-${String(month).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`
      ),
    ];
  }, [calendarMonth]);
  const monthIndex = availableMonths.indexOf(calendarMonth);

  // 1. Fetch public registered teams for fallback dropdown
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("/api/teams/discovery?limit=100");
        if (res.ok) {
          const data = await res.json();
          setRegisteredTeams(data.teams || []);
        }
      } catch {
        // Fallback silently if discovery API fails
      }
    }
    fetchTeams();
  }, []);

  // 2. Fetch authenticated user's own team and auto-fill ALL details
  useEffect(() => {
    async function fetchMyTeam() {
      if (!session?.user?.teamId) return;
      try {
        const res = await fetch("/api/teams");
        if (res.ok) {
          const data = await res.json();
          setMyTeam(data);
          setSelectedTeamId(data.id);
          setRequesterTeamName(data.name);
          if (data.defaultVenue && !initialSuggestedVenue) {
            setSuggestedVenue(data.defaultVenue);
          }
        }
      } catch {
        // Silent fallback
      }
    }
    fetchMyTeam();
  }, [session, initialSuggestedVenue]);

  // 3. Pre-fill logged in user's email if available
  useEffect(() => {
    if (session?.user?.email && !contactEmail) {
      setContactEmail(session.user.email);
    }
  }, [session, contactEmail]);

  function handleSelectRegisteredTeam(teamId: string) {
    setSelectedTeamId(teamId);
    if (!teamId) return;
    const team = registeredTeams.find((t) => t.id === teamId);
    if (team) {
      setRequesterTeamName(team.name);
      if (team.defaultVenue && !initialSuggestedVenue) {
        setSuggestedVenue(team.defaultVenue);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const dateFormatted = selectedDate
      ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("pt-BR")
      : "";
    const computedSuggestedDates = selectedDate && selectedTime
      ? `${dateFormatted} às ${selectedTime}${dateNotes.trim() ? ` (${dateNotes.trim()})` : ""}`
      : initialSuggestedDates || dateNotes.trim() || `${selectedDate} ${selectedTime}`.trim();

    if (!computedSuggestedDates) {
      setError("Selecione a data e o horário sugeridos para o jogo.");
      setLoading(false);
      return;
    }

    const selectedAvailability = availabilityByDate.get(selectedDate);
    if (!selectedDate || !selectedTime || !selectedAvailability?.available) {
      setError(selectedAvailability?.reason || "Selecione uma data disponível e o horário da partida.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/friendly-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamSlug,
          requesterTeamName,
          contactEmail,
          contactPhone: contactPhone || undefined,
          suggestedDates: computedSuggestedDates,
          requestedDate: new Date(`${selectedDate}T${selectedTime}:00-03:00`).toISOString(),
          suggestedVenue: suggestedVenue || undefined,
          proposedFee: proposedFee ? parseFloat(proposedFee) : undefined,
          requesterTeamId: selectedTeamId || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar solicitação");
      }

      setSuccess(true);
      if (data.whatsappUrl) {
        window.location.assign(data.whatsappUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-none border-2 border-emerald-800 bg-[#090d0f] p-6 text-center shadow-[4px_4px_0px_0px_#10b981]">
        <p className="text-lg font-mono font-black text-[#10b981] uppercase tracking-tight">
          [SUCESSO] SOLICITAÇÃO ENVIADA!
        </p>
        <p className="mt-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          A comissão técnica analisará a proposta e responderá pelo WhatsApp informado.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4 rounded-none border-2 border-slate-800 bg-[#0f1418] hover:bg-slate-900 text-white font-mono uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          onClick={() => {
            setSuccess(false);
            setRequesterTeamName("");
            setContactEmail("");
            setContactPhone("");
            setSelectedDate("");
            setSelectedTime("");
            setDateNotes("");
            setSuggestedVenue(initialSuggestedVenue);
            setProposedFee("");
          }}
        >
          Enviar nova solicitação
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-mono">
      {error && (
        <div className="rounded-none border-2 border-red-800 bg-[#090d0f] p-3 text-xs text-red-500 font-mono font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_#ef4444]">
          [ERRO] {error}
        </div>
      )}

      {initialSuggestedDates && (
        <div className="rounded-none border-2 border-slate-800 bg-[#090d0f] p-3 text-xs text-[var(--team-primary)] font-mono font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--team-primary)]">
          [HORÁRIO SELECIONADO] AGENDANDO COM BASE NO HORÁRIO ABERTO SELECIONADO. AJUSTE SE NECESSÁRIO.
        </div>
      )}

      {myTeam && selectedTeamId === myTeam.id ? (
        <div className="rounded-none border-2 border-emerald-500 bg-[#090d0f] p-4 space-y-2 shadow-[4px_4px_0px_0px_#10b981]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#10b981]">
              🛡️ IDENTIDADE DO SEU CLUBE VERIFICADA
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedTeamId("");
                setRequesterTeamName("");
                setSuggestedVenue("");
              }}
              className="text-[10px] text-slate-400 underline hover:text-white uppercase font-bold"
            >
              Alterar time
            </button>
          </div>
          <div className="flex items-center gap-3">
            {myTeam.badgeUrl ? (
              <img
                src={myTeam.badgeUrl}
                alt={myTeam.name}
                className="h-10 w-10 rounded-full border border-emerald-500 object-cover bg-black"
              />
            ) : (
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500 text-[#10b981] font-black text-sm">
                {myTeam.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-black text-white uppercase tracking-tight">{myTeam.name}</p>
              <p className="text-xs text-slate-300">
                📍 Mando de campo: <strong className="text-[#10b981]">{myTeam.defaultVenue || "A definir"}</strong> {myTeam.city ? `(${myTeam.city})` : ""}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-[#10b981] font-bold">
            ✓ Seu clube, e-mail ({session?.user?.email}) e mando de campo foram carregados automaticamente.
          </p>
        </div>
      ) : registeredTeams.length > 0 ? (
        <div className="space-y-1.5 p-3 border border-emerald-500/30 bg-emerald-500/5">
          <label className="block text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            🛡️ Seu time já possui cadastro na plataforma VARzea?
          </label>
          <select
            value={selectedTeamId}
            onChange={(e) => handleSelectRegisteredTeam(e.target.value)}
            className="w-full rounded-none border-2 border-slate-800 bg-[#090d0f] p-2 text-xs text-white font-mono font-bold focus:border-[#10b981] outline-none"
          >
            <option value="">-- Não cadastrado / Digitar manualmente --</option>
            {registeredTeams.map((t) => (
              <option key={t.id} value={t.id}>
                ⚽ {t.name} {t.city ? `(${t.city})` : ""} {t.defaultVenue ? `· 📍 ${t.defaultVenue}` : ""}
              </option>
            ))}
          </select>
          {selectedTeamId && (
            <p className="text-[11px] font-mono text-[#10b981] font-bold">
              ✓ Time cadastrado selecionado! O campo e dados do clube foram carregados.
            </p>
          )}
        </div>
      ) : null}

      <Input
        label="Nome da sua equipe *"
        type="text"
        value={requesterTeamName}
        onChange={(e) => setRequesterTeamName(e.target.value)}
        required
        minLength={2}
        maxLength={100}
        placeholder="Ex: FC Amigos"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
      />

      <Input
        label="E-mail de contato (opcional)"
        type="email"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
        placeholder="contato@suaequipe.com"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
      />

      <Input
        label="WhatsApp para contato *"
        type="tel"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
        required
        minLength={10}
        maxLength={20}
        placeholder="(11) 99999-9999"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
      />

      {/* Interactive availability calendar */}
      <div className="space-y-3 rounded-none border-2 border-slate-800 bg-black/30 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-white">Data disponível *</p>
            <p className="mt-1 text-[10px] font-bold uppercase text-slate-500">
              Verde: disponível · Cinza: bloqueado pelas regras ou por outro jogo
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={monthIndex <= 0}
              onClick={() => setCalendarMonth(availableMonths[monthIndex - 1])}
              className="h-8 w-8 border border-slate-700 text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Mês anterior"
            >
              ←
            </button>
            <button
              type="button"
              disabled={monthIndex < 0 || monthIndex >= availableMonths.length - 1}
              onClick={() => setCalendarMonth(availableMonths[monthIndex + 1])}
              className="h-8 w-8 border border-slate-700 text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Próximo mês"
            >
              →
            </button>
          </div>
        </div>

        {availabilityLoading ? (
          <p className="py-6 text-center text-xs font-bold uppercase text-slate-500">Carregando agenda...</p>
        ) : availabilityError ? (
          <p className="border border-red-800 bg-red-950/20 p-3 text-xs font-bold text-red-400">{availabilityError}</p>
        ) : (
          <>
            <p className="text-center text-sm font-black uppercase text-[var(--team-primary)]">
              {new Date(`${calendarMonth}-15T12:00:00Z`).toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </p>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((label, index) => (
                <span key={`${label}-${index}`} className="py-1 text-[10px] font-black text-slate-600">{label}</span>
              ))}
              {calendarCells.map((date, index) => {
                if (!date) return <span key={`empty-${index}`} />;
                const day = availabilityByDate.get(date);
                const isAvailable = Boolean(day?.available);
                const isSelected = selectedDate === date;
                return (
                  <button
                    key={date}
                    type="button"
                    disabled={!isAvailable}
                    title={day?.reason || "Disponível"}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square min-h-9 border text-xs font-black transition-colors ${
                      isSelected
                        ? "border-[var(--team-primary)] bg-[var(--team-primary)] text-black"
                        : isAvailable
                          ? "border-emerald-700 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/25"
                          : "cursor-not-allowed border-slate-900 bg-slate-950/70 text-slate-700 line-through"
                    }`}
                  >
                    {Number(date.slice(-2))}
                  </button>
                );
              })}
            </div>
            {availability && (
              <p className="text-[10px] font-bold uppercase leading-relaxed text-slate-500">
                Antecedência: {availability.rules.minNoticeDays} dia(s) · descanso: {availability.rules.bufferBeforeDays} antes e {availability.rules.bufferAfterDays} depois de jogos confirmados.
              </p>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-none border-2 border-slate-800 bg-black/40 p-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Data selecionada</p>
          <p className="mt-1 text-sm font-black text-white">
            {selectedDate
              ? new Date(`${selectedDate}T12:00:00Z`).toLocaleDateString("pt-BR", { dateStyle: "full", timeZone: "UTC" })
              : "Escolha uma data verde no calendário"}
          </p>
        </div>
        <Input
          label="Horário sugerido (Início) *"
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          required
          className="rounded-none border-2 border-slate-800 bg-black/40 text-white focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
        />
      </div>

      <Input
        label="Observações sobre data/horário (opcional)"
        type="text"
        value={dateNotes}
        onChange={(e) => setDateNotes(e.target.value)}
        maxLength={200}
        placeholder="Ex: Preferência por jogo de 2 tempos de 40min"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
      />

      <Input
        label="Local sugerido"
        type="text"
        value={suggestedVenue}
        onChange={(e) => setSuggestedVenue(e.target.value)}
        maxLength={200}
        placeholder="Ex: Campo do Parque, Rua das Flores"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
      />

      <Input
        label="Valor de cota proposto (R$)"
        type="number"
        value={proposedFee}
        onChange={(e) => setProposedFee(e.target.value)}
        min="0"
        step="0.01"
        placeholder="0.00"
        className="rounded-none border-2 border-slate-800 bg-black/40 text-white placeholder-gray-600 focus:border-[var(--team-primary)] focus:shadow-[3px_3px_0px_0px_var(--team-primary)] shadow-none transition-all focus:ring-0"
      />

      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">
        Campos com * são obrigatórios. Quanto mais detalhes, mais rápida a resposta.
      </p>

      <Button
        type="submit"
        loading={loading}
        className="w-full rounded-none border-2 border-slate-800 bg-[var(--team-primary)] text-black font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.9)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] transition-all"
      >
        {loading ? "Enviando..." : "Enviar Solicitação"}
      </Button>
    </form>
  );
}
