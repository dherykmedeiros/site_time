"use client";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
  sublabel?: string;
}

export function StatsCard({ label, value, icon, color = "blue", sublabel }: StatsCardProps) {
  const colorClasses: Record<string, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    gray: "text-gray-600",
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
      {icon && <span className="text-2xl">{icon}</span>}
      <p className={`mt-1 text-3xl font-bold ${colorClasses[color] || colorClasses.blue}`}>
        {value}
      </p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
      {sublabel && (
        <p className="text-xs text-gray-400">{sublabel}</p>
      )}
    </div>
  );
}
