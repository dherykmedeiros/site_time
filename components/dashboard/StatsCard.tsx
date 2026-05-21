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
      value: "text-[#67e8f9]",
      bubble: "bg-[rgba(6,182,212,0.15)] text-[#67e8f9]",
    },
    green: {
      value: "text-[#6ee7b7]",
      bubble: "bg-[rgba(16,185,129,0.15)] text-[#6ee7b7]",
    },
    red: {
      value: "text-[#fca5a5]",
      bubble: "bg-[rgba(239,68,68,0.15)] text-[#fca5a5]",
    },
    yellow: {
      value: "text-[#fcd34d]",
      bubble: "bg-[rgba(245,158,11,0.15)] text-[#fcd34d]",
    },
    purple: {
      value: "text-[#c4b5fd]",
      bubble: "bg-[rgba(139,92,246,0.15)] text-[#c4b5fd]",
    },
    gray: {
      value: "text-[var(--text-muted)]",
      bubble: "bg-white/[0.07] text-[var(--text-muted)]",
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
