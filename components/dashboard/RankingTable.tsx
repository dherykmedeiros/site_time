"use client";

import { useState } from "react";

interface RankingEntry {
  playerId: string;
  playerName: string;
  total?: number;
  yellowCards?: number;
  redCards?: number;
}

interface RankingTableProps {
  title: string;
  data: RankingEntry[];
  type: "goals" | "assists" | "cards";
}

export function RankingTable({ title, data, type }: RankingTableProps) {
  const [sortDesc, setSortDesc] = useState(true);

  const sorted = [...data].sort((a, b) => {
    if (type === "cards") {
      const aVal = (a.yellowCards || 0) + (a.redCards || 0) * 3;
      const bVal = (b.yellowCards || 0) + (b.redCards || 0) * 3;
      return sortDesc ? bVal - aVal : aVal - bVal;
    }
    return sortDesc ? (b.total || 0) - (a.total || 0) : (a.total || 0) - (b.total || 0);
  });

  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <h3 className="font-semibold text-[var(--text)]">{title}</h3>
        <button
          onClick={() => setSortDesc(!sortDesc)}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          {sortDesc ? "↓ Maior" : "↑ Menor"}
        </button>
      </div>
      {sorted.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
          Sem dados disponíveis
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-left text-xs uppercase text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Jogador</th>
              {type === "cards" ? (
                <>
                  <th className="px-4 py-2 text-center">🟨</th>
                  <th className="px-4 py-2 text-center">🟥</th>
                </>
              ) : (
                <th className="px-4 py-2 text-right">Total</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.map((entry, i) => (
              <tr key={entry.playerId} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-4 py-2 font-medium text-[var(--text-muted)]">
                  {i + 1}
                </td>
                <td className="px-4 py-2 font-medium text-[var(--text)]">
                  {entry.playerName}
                </td>
                {type === "cards" ? (
                  <>
                    <td className="px-4 py-2 text-center text-[var(--text)]">
                      {entry.yellowCards || 0}
                    </td>
                    <td className="px-4 py-2 text-center text-[var(--text)]">
                      {entry.redCards || 0}
                    </td>
                  </>
                ) : (
                  <td className="px-4 py-2 text-right font-bold text-[#6ee7b7]">
                    {entry.total || 0}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
