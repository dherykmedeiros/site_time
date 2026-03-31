"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type SeasonType = "LEAGUE" | "CUP" | "TOURNAMENT";
type SeasonStatus = "ACTIVE" | "FINISHED";

interface Season {
  id: string;
  name: string;
  type: SeasonType;
  status: SeasonStatus;
  startDate: string;
  endDate: string | null;
  _count: { matches: number };
}

const typeLabels: Record<SeasonType, string> = {
  LEAGUE: "Liga",
  CUP: "Copa",
  TOURNAMENT: "Torneio",
};

const statusLabels: Record<SeasonStatus, { label: string; cls: string }> = {
  ACTIVE: { label: "Ativa", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  FINISHED: { label: "Encerrada", cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
};

export default function SeasonsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState<SeasonType>("LEAGUE");
  const [startDate, setStartDate] = useState(
    () => new Date().toISOString().substring(0, 10)
  );
  const [endDate, setEndDate] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/seasons");
      if (res.ok) {
        const data = await res.json();
        setSeasons(data.seasons);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const res = await fetch("/api/seasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, startDate, endDate: endDate || null }),
      });
      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || "Erro ao criar temporada");
        return;
      }
      setShowForm(false);
      setName("");
      setType("LEAGUE");
      setStartDate(new Date().toISOString().substring(0, 10));
      setEndDate("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleFinish(id: string) {
    if (!confirm("Encerrar esta temporada?")) return;
    await fetch(`/api/seasons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "FINISHED" }),
    });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta temporada? As partidas serão desvinculadas.")) return;
    await fetch(`/api/seasons/${id}`, { method: "DELETE" });
    await load();
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-[var(--surface-soft)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Temporadas</h1>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            Gerencie ligas, copas e torneios do seu time
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            + Nova temporada
          </button>
        )}
      </div>

      {/* Create form */}
      {isAdmin && showForm && (
        <form
          onSubmit={handleCreate}
          className="app-surface rounded-2xl border border-[var(--border)] p-6 shadow-[var(--shadow-md)]"
        >
          <h2 className="mb-5 text-lg font-bold text-[var(--text)]">Nova temporada</h2>

          {formError && (
            <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {formError}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="col-span-full">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                Nome *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Copa de Inverno 2025"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                Tipo *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SeasonType)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              >
                <option value="LEAGUE">Liga</option>
                <option value="CUP">Copa</option>
                <option value="TOURNAMENT">Torneio</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                Início *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                Término (opcional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[var(--brand)] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Criando..." : "Criar temporada"}
            </button>
          </div>
        </form>
      )}

      {/* Season list */}
      {seasons.length === 0 ? (
        <div className="app-surface rounded-2xl border border-dashed border-[var(--border-strong)] p-14 text-center text-[var(--text-muted)]">
          <p className="text-4xl">🏆</p>
          <p className="mt-3 text-base font-semibold">Nenhuma temporada cadastrada</p>
          <p className="mt-1 text-sm">Crie sua primeira temporada para organizar as partidas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {seasons.map((s) => {
            const st = statusLabels[s.status];
            const startFmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
              new Date(s.startDate)
            );
            const endFmt = s.endDate
              ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
                  new Date(s.endDate)
                )
              : null;

            return (
              <div
                key={s.id}
                className="app-surface flex flex-col gap-3 rounded-2xl border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-2xl">
                    🏆
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-[var(--text)]">{s.name}</p>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide ${st.cls}`}
                      >
                        {st.label}
                      </span>
                      <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-0.5 text-[0.68rem] font-semibold text-[var(--text-subtle)] uppercase tracking-wide">
                        {typeLabels[s.type]}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                      {startFmt}{endFmt ? ` → ${endFmt}` : ""} · {s._count.matches} partida{s._count.matches !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link
                    href={`/seasons/${s.id}`}
                    className="rounded-full border border-[var(--border)] px-4 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
                  >
                    Ver detalhes
                  </Link>
                  {isAdmin && s.status === "ACTIVE" && (
                    <button
                      onClick={() => handleFinish(s.id)}
                      className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 transition hover:bg-amber-500/20"
                    >
                      Encerrar
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                      aria-label="Excluir temporada"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
