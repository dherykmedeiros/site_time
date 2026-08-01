"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  MapPin,
  Clock,
  ExternalLink,
  X,
  Trophy,
  Vote,
  CreditCard,
  Gavel,
  CheckCircle,
} from "lucide-react";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "MATCH" | "DATE_POLL" | "MEMBERSHIP" | "FINE";
  status?: string;
  badgeColor: string;
  url: string;
  details: Record<string, any>;
}

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const weekDayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function CentralCalendarView() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Load events for the current month range
  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const fromDate = new Date(year, month - 1, 1).toISOString();
        const toDate = new Date(year, month + 2, 0).toISOString();
        const res = await fetch(`/api/calendar/events?from=${fromDate}&to=${toDate}`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error("Erro ao carregar eventos do calendário", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [year, month]);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (filterType === "ALL") return events;
    return events.filter((e) => e.type === filterType);
  }, [events, filterType]);

  // Month grid calculations
  const monthDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDayIndex = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    for (let i = startDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month, -i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      days.push({
        date: new Date(year, month, d),
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill grid 35 or 42
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function goToToday() {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today);
  }

  function isSameDay(d1: Date, d2: Date) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  function getEventsForDay(date: Date) {
    return filteredEvents.filter((e) => isSameDay(new Date(e.date), date));
  }

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return getEventsForDay(selectedDay);
  }, [selectedDay, filteredEvents]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[rgba(16,185,129,0.2)] bg-[rgba(10,24,20,0.5)] p-6 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#34d399]">
            <CalendarIcon className="h-4 w-4" /> Gestão de Eventos & Partidas
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Calendário Central
          </h1>
          <p className="text-xs text-[#8fa39b]">
            Partidas, enquetes, mensalidades e compromissos do clube
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/matches"
            className="flex items-center gap-1.5 rounded-xl bg-[#10b981] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#059669]"
          >
            <Plus className="h-4 w-4" /> Agendar Jogo
          </Link>
          <Link
            href="/dashboard/polls"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-all"
          >
            <Vote className="h-4 w-4 text-[#fbbf24]" /> Criar Enquete
          </Link>
        </div>
      </div>

      {/* Control Bar: Month Navigation, Filters & View Mode */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md md:flex-row md:items-center md:justify-between">
        {/* Month Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white hover:bg-white/10 transition-all"
            title="Mês Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-black text-white min-w-[160px] text-center">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white hover:bg-white/10 transition-all"
            title="Próximo Mês"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={goToToday}
            className="rounded-xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] px-3 py-1.5 text-xs font-bold text-[#34d399] hover:bg-[rgba(16,185,129,0.2)] transition-all"
          >
            Hoje
          </button>
        </div>

        {/* Filters & View Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white">
            <Filter className="h-3.5 w-3.5 text-[#8fa39b]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#0a1814]">Todos os Eventos</option>
              <option value="MATCH" className="bg-[#0a1814]">⚽ Partidas</option>
              <option value="DATE_POLL" className="bg-[#0a1814]">🗳️ Enquetes</option>
              <option value="MEMBERSHIP" className="bg-[#0a1814]">💳 Mensalidades</option>
              <option value="FINE" className="bg-[#0a1814]">⚖️ Multas</option>
            </select>
          </div>

          {/* View Switcher */}
          <div className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
            <button
              onClick={() => setViewMode("month")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                viewMode === "month" ? "bg-[#10b981] text-white" : "text-[#8fa39b] hover:text-white"
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                viewMode === "list" ? "bg-[#10b981] text-white" : "text-[#8fa39b] hover:text-white"
              }`}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="h-96 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-sm text-[#8fa39b]">
          Carregando calendário...
        </div>
      ) : viewMode === "list" ? (
        /* LIST VIEW */
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#8fa39b]">
            Lista de Eventos — {monthNames[month]} {year}
          </h3>
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#8fa39b]">
              Nenhum evento encontrado para este período.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredEvents.map((evt) => {
                const evtDate = new Date(evt.date);
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 px-4 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ background: evt.badgeColor }}
                      />
                      <div>
                        <p className="font-bold text-sm text-white">{evt.title}</p>
                        <p className="text-xs text-[#8fa39b]">
                          {evtDate.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {evt.status && (
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
                          {evt.status}
                        </span>
                      )}
                      <Link
                        href={evt.url}
                        className="text-xs font-bold text-[#34d399] hover:underline flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* MONTH GRID VIEW */
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md overflow-x-auto">
            {/* Weekday Labels Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2 min-w-[600px]">
              {weekDayNames.map((d) => (
                <div key={d} className="py-2 text-[11px] font-black uppercase tracking-widest text-[#8fa39b]">
                  {d}
                </div>
              ))}
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 min-w-[600px]">
              {monthDays.map((dayObj, idx) => {
                const dayEvents = getEventsForDay(dayObj.date);
                const isToday = isSameDay(dayObj.date, new Date());
                const isSelected = selectedDay && isSameDay(dayObj.date, selectedDay);

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDay(dayObj.date)}
                    className={`min-h-[90px] rounded-xl border p-2 flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#34d399] bg-[rgba(16,185,129,0.08)] shadow-lg"
                        : isToday
                        ? "border-amber-400/50 bg-amber-400/5"
                        : dayObj.isCurrentMonth
                        ? "border-white/5 bg-white/[0.015] hover:bg-white/[0.05]"
                        : "border-transparent bg-transparent opacity-30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-black rounded-full h-6 w-6 flex items-center justify-center ${
                          isToday ? "bg-amber-400 text-black" : dayObj.isCurrentMonth ? "text-white" : "text-[#8fa39b]"
                        }`}
                      >
                        {dayObj.date.getDate()}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-bold text-[#34d399]">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Events Badges preview */}
                    <div className="space-y-1 mt-1">
                      {dayEvents.slice(0, 2).map((evt) => (
                        <div
                          key={evt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(evt);
                          }}
                          className="truncate rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-black leading-tight cursor-pointer hover:opacity-80"
                          style={{ background: evt.badgeColor }}
                        >
                          {evt.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="text-[9px] font-bold text-[#8fa39b]">
                          +{dayEvents.length - 2} mais
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Day Agenda Drawer Below Grid */}
          {selectedDay && (
            <div className="rounded-2xl border border border-[rgba(16,185,129,0.2)] bg-[rgba(10,24,20,0.6)] p-6 backdrop-blur-md">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4">
                📅 Agenda do dia {selectedDay.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </h3>

              {selectedDayEvents.length === 0 ? (
                <p className="text-xs text-[#8fa39b]">Nenhum compromisso para esta data.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full shrink-0" style={{ background: evt.badgeColor }} />
                        <div>
                          <p className="font-bold text-sm text-white">{evt.title}</p>
                          <p className="text-xs text-[#8fa39b]">
                            {new Date(evt.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={evt.url}
                        className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-all flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Acessar <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1814] p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: selectedEvent.badgeColor }}
              />
              <span className="text-xs font-black uppercase tracking-widest text-[#8fa39b]">
                {selectedEvent.type}
              </span>
            </div>

            <h3 className="text-xl font-black text-white">{selectedEvent.title}</h3>

            <div className="space-y-2 text-xs text-[#8fa39b] border-y border-white/10 py-3">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#34d399]" />
                {new Date(selectedEvent.date).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {selectedEvent.details.venue && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#34d399]" />
                  {selectedEvent.details.venue}
                </p>
              )}
              {selectedEvent.status && (
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-400" />
                  Status: <span className="font-bold text-white">{selectedEvent.status}</span>
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
              >
                Fechar
              </button>
              <Link
                href={selectedEvent.url}
                className="rounded-xl bg-[#10b981] px-4 py-2 text-xs font-bold text-white hover:bg-[#059669] flex items-center gap-1.5"
              >
                Ver Detalhes <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
