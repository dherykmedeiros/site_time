"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const ScheduleHeatmap = dynamic(() => import("./ScheduleHeatmap"), { ssr: false });
const HomeAwayReport = dynamic(() => import("./HomeAwayReport"), { ssr: false });
const TeamPerformance = dynamic(() => import("./TeamPerformance"), { ssr: false });
const TopScorersReport = dynamic(() => import("./TopScorersReport"), { ssr: false });
const AttendanceReport = dynamic(() => import("./AttendanceReport"), { ssr: false });
const DisciplineReport = dynamic(() => import("./DisciplineReport"), { ssr: false });
const FinancialReport = dynamic(() => import("./FinancialReport"), { ssr: false });
const RatingsReport = dynamic(() => import("./RatingsReport"), { ssr: false });
const LineupReport = dynamic(() => import("./LineupReport"), { ssr: false });
const AchievementsReport = dynamic(() => import("./AchievementsReport"), { ssr: false });
const VenueReport = dynamic(() => import("./VenueReport"), { ssr: false });
const PlayerComparisonReport = dynamic(() => import("./PlayerComparisonReport"), { ssr: false });

interface Season {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface TabConfig {
  key: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

const allTabs: TabConfig[] = [
  { key: "performance", label: "Desempenho", icon: "⚽" },
  { key: "compare", label: "Comparar Atletas", icon: "⚔️" },
  { key: "scorers", label: "Artilharia", icon: "🎯" },
  { key: "attendance", label: "Presença", icon: "📋" },
  { key: "ratings", label: "Avaliações", icon: "⭐" },
  { key: "discipline", label: "Disciplina", icon: "💛" },
  { key: "schedule", label: "Horários & Dias", icon: "📅" },
  { key: "venue", label: "Locais & Campos", icon: "📍" },
  { key: "homeaway", label: "Casa vs Fora", icon: "🏠" },
  { key: "lineup", label: "Escalação", icon: "🔄" },
  { key: "achievements", label: "Conquistas", icon: "🏆" },
  { key: "financial", label: "Financeiro", icon: "💰", adminOnly: true },
];

type TabKey = string;

export default function ReportsHub({ userRole }: { userRole?: string }) {
  const visibleTabs = allTabs.filter((t) => !t.adminOnly || userRole === "ADMIN");

  const [activeTab, setActiveTab] = useState<TabKey>("performance");
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [seasonId, setSeasonId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("ALL");

  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/seasons")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.seasons) setSeasons(d.seasons);
      })
      .catch(() => {});
  }, []);

  const apiMap: Partial<Record<TabKey, string>> = {
    schedule: "/api/reports/schedule-heatmap",
    venue: "/api/reports/venue",
    homeaway: "/api/reports/home-away",
    performance: "/api/reports/team-performance",
    scorers: "/api/reports/top-scorers",
    attendance: "/api/reports/attendance",
    discipline: "/api/reports/discipline",
    financial: "/api/reports/financial",
    ratings: "/api/reports/ratings",
    lineup: "/api/reports/lineup",
    achievements: "/api/reports/achievements",
  };

  const fetchReport = useCallback(
    async (tab: TabKey, customVenue?: string) => {
      const endpoint = apiMap[tab];
      if (!endpoint) return;

      setLoading((prev) => ({ ...prev, [tab]: true }));
      setErrors((prev) => ({ ...prev, [tab]: "" }));

      const params = new URLSearchParams();
      if (seasonId) params.set("seasonId", seasonId);
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (tab === "venue") {
        const vToFetch = customVenue !== undefined ? customVenue : selectedVenue;
        if (vToFetch && vToFetch !== "ALL") params.set("venue", vToFetch);
      }

      try {
        const res = await fetch(`${endpoint}?${params.toString()}`);
        const json = await res.json();

        if (!res.ok) {
          setErrors((prev) => ({ ...prev, [tab]: json.error || "Erro ao carregar relatório" }));
          setData((prev) => ({ ...prev, [tab]: null }));
        } else {
          setData((prev) => ({ ...prev, [tab]: json }));
        }
      } catch {
        setErrors((prev) => ({ ...prev, [tab]: "Erro de conexão" }));
      } finally {
        setLoading((prev) => ({ ...prev, [tab]: false }));
      }
    },
    [seasonId, from, to, selectedVenue]
  );

  useEffect(() => {
    if (activeTab !== "compare") {
      fetchReport(activeTab);
    }
  }, [activeTab, fetchReport]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Central de Relatórios & Estatísticas
        </h1>
        <p className="mt-1 text-sm text-[#8fa39b]">
          Análise de desempenho, comparações entre atletas e estatísticas completas
        </p>
      </div>

      {/* Filters */}
      {activeTab !== "compare" && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">
              Temporada
            </label>
            <select
              value={seasonId}
              onChange={(e) => setSeasonId(e.target.value)}
              className="h-9 rounded-lg border border-white/10 bg-[#16130f] px-3 text-sm text-white outline-none focus:border-[#36c2a8] transition-colors"
            >
              <option value="">Todas</option>
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">
              De
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-9 rounded-lg border border-white/10 bg-[#16130f] px-3 text-sm text-white outline-none focus:border-[#36c2a8] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">
              Até
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-9 rounded-lg border border-white/10 bg-[#16130f] px-3 text-sm text-white outline-none focus:border-[#36c2a8] transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setSeasonId("");
              setFrom("");
              setTo("");
              setSelectedVenue("ALL");
            }}
            className="h-9 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-semibold text-[#8fa39b] hover:text-white hover:bg-white/[0.06] transition-all"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="relative">
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? "bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.25)] text-[#34d399] shadow-sm"
                  : "border border-white/[0.06] text-[#8fa39b] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-[var(--bg,#0d0b09)] to-transparent" />
      </div>

      {/* Active Report Content */}
      <div className="min-h-[400px]">
        {activeTab === "compare" && <PlayerComparisonReport />}
        {activeTab === "schedule" && (
          <ScheduleHeatmap
            data={data.schedule}
            loading={loading.schedule}
            error={errors.schedule}
          />
        )}
        {activeTab === "venue" && (
          <VenueReport
            data={data.venue}
            loading={loading.venue}
            error={errors.venue}
            selectedVenue={selectedVenue}
            onSelectVenue={(v) => {
              setSelectedVenue(v);
              fetchReport("venue", v);
            }}
          />
        )}
        {activeTab === "homeaway" && (
          <HomeAwayReport
            data={data.homeaway}
            loading={loading.homeaway}
            error={errors.homeaway}
          />
        )}
        {activeTab === "performance" && (
          <TeamPerformance
            data={data.performance}
            loading={loading.performance}
            error={errors.performance}
          />
        )}
        {activeTab === "scorers" && (
          <TopScorersReport
            data={data.scorers}
            loading={loading.scorers}
            error={errors.scorers}
          />
        )}
        {activeTab === "attendance" && (
          <AttendanceReport
            data={data.attendance}
            loading={loading.attendance}
            error={errors.attendance}
          />
        )}
        {activeTab === "discipline" && (
          <DisciplineReport
            data={data.discipline}
            loading={loading.discipline}
            error={errors.discipline}
          />
        )}
        {activeTab === "financial" && (
          <FinancialReport
            data={data.financial}
            loading={loading.financial}
            error={errors.financial}
          />
        )}
        {activeTab === "ratings" && (
          <RatingsReport
            data={data.ratings}
            loading={loading.ratings}
            error={errors.ratings}
          />
        )}
        {activeTab === "lineup" && (
          <LineupReport
            data={data.lineup}
            loading={loading.lineup}
            error={errors.lineup}
          />
        )}
        {activeTab === "achievements" && (
          <AchievementsReport
            data={data.achievements}
            loading={loading.achievements}
            error={errors.achievements}
          />
        )}
      </div>
    </div>
  );
}
