"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/PublicNavbar";
import { Input } from "@/components/ui/Input";
import { ChallengeModal } from "@/components/directory/ChallengeModal";

interface OpenSlot {
  id: string;
  date: string;
  timeLabel: string | null;
  venueLabel: string | null;
  notes: string | null;
  status: string;
  team: {
    id: string;
    name: string;
    slug: string;
    badgeUrl: string | null;
    city: string | null;
    region: string | null;
    fieldType: string | null;
    competitiveLevel: string | null;
  };
}

const fieldTypeLabels: Record<string, string> = {
  GRASS: "Grama Natural",
  SYNTHETIC: "Grama Sintética",
  FUTSAL: "Futsal / Quadra",
  SOCIETY: "Society",
  OTHER: "Outro",
};

const levelLabels: Record<string, string> = {
  CASUAL: "Recreativo / Várzea",
  INTERMEDIATE: "Intermediário",
  COMPETITIVE: "Competitivo / Amador Forte",
};

export default function OpenSlotsDirectoryPage() {
  const [slots, setSlots] = useState<OpenSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fieldTypeFilter, setFieldTypeFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<OpenSlot | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  async function loadSlots() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("query", search);
      if (fieldTypeFilter) params.set("fieldType", fieldTypeFilter);
      if (cityFilter) params.set("city", cityFilter);

      const res = await fetch(`/api/open-slots?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
      }
    } catch (err) {
      console.error("Erro ao carregar diretório de vagas", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldTypeFilter, cityFilter]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <PublicNavbar title="Diretório de Horários & Desafios" />

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Banner Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-[rgba(16,185,129,0.2)] bg-gradient-to-r from-[rgba(16,185,129,0.12)] via-[rgba(10,24,20,0.6)] to-[#0d1117] p-8 md:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400">
              ⚽ Encontre Adversários Amadores
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl text-white">
              Diretório de Vagas & Desafio de Times
            </h1>
            <p className="mt-3 text-sm text-[#8fa39b] leading-relaxed">
              Procure jogos amistosos disponíveis, campos reservados e horários abertos por outros clubes. Desafie o time anfitrião diretamente e marque o jogo!
            </p>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/10 bg-[#161b22] p-4 shadow-md">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nome do time, local ou cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadSlots()}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={fieldTypeFilter}
              onChange={(e) => setFieldTypeFilter(e.target.value)}
              className="h-10 rounded-xl border border-white/10 bg-[#16130f] px-3.5 text-xs font-bold text-white outline-none focus:border-[#36c2a8] transition-colors"
            >
              <option value="">Todos os Pisos / Campos</option>
              <option value="SOCIETY">Society</option>
              <option value="SYNTHETIC">Grama Sintética</option>
              <option value="GRASS">Grama Natural</option>
              <option value="FUTSAL">Futsal</option>
            </select>

            <button
              onClick={() => loadSlots()}
              className="rounded-xl bg-[#10b981] hover:bg-[#34d399] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black transition-all shadow-md"
            >
              🔍 Buscar Vagas
            </button>
          </div>
        </div>

        {/* Toast Feedbacks */}
        {successToast && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-400 flex items-center justify-between">
            <span>⚔️ Desafio enviado com sucesso! O time anfitrião foi notificado e responderá em breve.</span>
            <button onClick={() => setSuccessToast(false)} className="text-emerald-400 font-bold text-lg">×</button>
          </div>
        )}

        {/* Slots Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-[#8fa39b]">
            Carregando vagas disponíveis...
          </div>
        ) : slots.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-12 text-center text-[#8fa39b]">
            <p className="text-4xl mb-3">⚽</p>
            <h3 className="text-lg font-bold text-white">Nenhum horário aberto encontrado</h3>
            <p className="text-xs mt-1">Tente ajustar os filtros ou buscar por outra cidade.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#161b22] p-6 transition-all hover:border-emerald-500/40 hover:shadow-xl"
              >
                <div>
                  {/* Team Badge & Name */}
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                    {slot.team.badgeUrl ? (
                      <img src={slot.team.badgeUrl} alt={slot.team.name} className="h-12 w-12 rounded-xl object-contain" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 font-bold text-emerald-400">
                        {slot.team.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <Link href={`/${slot.team.slug}`} className="font-bold text-white hover:text-emerald-400 transition-colors">
                        {slot.team.name}
                      </Link>
                      <p className="text-xs text-[#8fa39b]">
                        📍 {slot.team.city || "Brasil"} {slot.team.region ? `- ${slot.team.region}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Slot Time & Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3 border border-white/5">
                      <span className="font-bold text-emerald-400">📅 Data & Hora</span>
                      <span className="font-semibold text-white">
                        {new Date(slot.date).toLocaleDateString("pt-BR")} {slot.timeLabel ? `às ${slot.timeLabel}` : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3 border border-white/5">
                      <span className="font-bold text-[#8fa39b]">📍 Local / Campo</span>
                      <span className="font-semibold text-white truncate max-w-[140px]">
                        {slot.venueLabel || "A combinar"}
                      </span>
                    </div>

                    {slot.team.fieldType && (
                      <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3 border border-white/5">
                        <span className="font-bold text-[#8fa39b]">🏟️ Modalidade</span>
                        <span className="font-semibold text-white">
                          {fieldTypeLabels[slot.team.fieldType] || slot.team.fieldType}
                        </span>
                      </div>
                    )}

                    {slot.notes && (
                      <p className="mt-2 text-[11px] text-[#8fa39b] italic leading-relaxed bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                        "{slot.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Challenge Action Button */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setSelectedSlot(slot)}
                    className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-3 text-xs font-black uppercase tracking-wider text-black transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <span>⚔️</span> Desafiar Time / Agendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Challenge Modal */}
      <ChallengeModal
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
        onSuccess={() => {
          setSelectedSlot(null);
          setSuccessToast(true);
        }}
      />
    </div>
  );
}
