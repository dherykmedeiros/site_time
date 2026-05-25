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
      value: "text-[var(--badge-info-text)]",
      bubble: "bg-[var(--badge-info-bg)] text-[var(--badge-info-text)] border border-[var(--badge-info-border)]",
    },
    green: {
      value: "text-[var(--badge-success-text)]",
      bubble: "bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border border-[var(--badge-success-border)]",
    },
    red: {
      value: "text-[var(--badge-danger-text)]",
      bubble: "bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)] border border-[var(--badge-danger-border)]",
    },
    yellow: {
      value: "text-[var(--badge-warning-text)]",
      bubble: "bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border border-[var(--badge-warning-border)]",
    },
    purple: {
      value: "text-[var(--brand)]",
      bubble: "bg-[var(--brand-soft)] text-[var(--brand)] border border-[var(--brand)]/15",
    },
    gray: {
      value: "text-[var(--text-muted)]",
      bubble: "bg-[var(--badge-default-bg)] text-[var(--badge-default-text)] border border-[var(--badge-default-border)]",
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
