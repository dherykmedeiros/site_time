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
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button
          onClick={() => setSortDesc(!sortDesc)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {sortDesc ? "↓ Maior" : "↑ Menor"}
        </button>
      </div>
      {sorted.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-gray-500">
          Sem dados disponíveis
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
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
          <tbody className="divide-y divide-gray-100">
            {sorted.map((entry, i) => (
              <tr key={entry.playerId} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-500">
                  {i + 1}
                </td>
                <td className="px-4 py-2 font-medium text-gray-900">
                  {entry.playerName}
                </td>
                {type === "cards" ? (
                  <>
                    <td className="px-4 py-2 text-center">
                      {entry.yellowCards || 0}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {entry.redCards || 0}
                    </td>
                  </>
                ) : (
                  <td className="px-4 py-2 text-right font-bold text-gray-900">
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
