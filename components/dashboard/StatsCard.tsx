"use client";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
  sublabel?: string;
}

export function StatsCard({ label, value, icon, color = "blue", sublabel }: StatsCardProps) {
  const colorClasses: Record<string, { value: string; bubble: string }> = {
    blue: {
      value: "text-cyan-700",
      bubble: "bg-cyan-100 text-cyan-800",
    },
    green: {
      value: "text-emerald-700",
      bubble: "bg-emerald-100 text-emerald-800",
    },
    red: {
      value: "text-rose-700",
      bubble: "bg-rose-100 text-rose-800",
    },
    yellow: {
      value: "text-amber-700",
      bubble: "bg-amber-100 text-amber-800",
    },
    purple: {
      value: "text-indigo-700",
      bubble: "bg-indigo-100 text-indigo-800",
    },
    gray: {
      value: "text-slate-700",
      bubble: "bg-slate-100 text-slate-800",
    },
  };

  const cardColors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--text-muted)]">{label}</p>
        {icon && (
          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-base ${cardColors.bubble}`}>
            {icon}
          </span>
        )}
      </div>
      <p className={`mt-3 text-3xl font-bold leading-tight ${cardColors.value}`}>
        {value}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs font-medium text-[var(--text-muted)]">{sublabel}</p>
      )}
    </div>
  );
}
