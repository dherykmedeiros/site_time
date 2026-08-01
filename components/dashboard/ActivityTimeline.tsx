"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  user?: {
    name: string;
    role: string;
  } | null;
}

export function ActivityTimeline() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  async function fetchActivities(p: number) {
    try {
      setLoading(true);
      const res = await fetch(`/api/activities?page=${p}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
        setTotalPages(data.pagination.totalPages || 1);
        setPage(data.pagination.page || 1);
      }
    } catch (err) {
      console.error("Erro ao buscar timeline de atividades:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActivities(page);
  }, [page]);

  const getIconForType = (type: string) => {
    switch (type) {
      case "MATCH_CREATED":
        return "⚽";
      case "PLAYER_ADDED":
        return "👤";
      case "TRANSACTION_LOGGED":
        return "💰";
      case "POLL_CREATED":
        return "🗳️";
      default:
        return "⚡";
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Agora mesmo";
    if (diffMin < 60) return `Há ${diffMin} min`;
    if (diffHr < 24) return `Há ${diffHr} h`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `Há ${diffDays} dias`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const roleLabels: Record<string, string> = {
    ADMIN: "Diretoria",
    COACH: "Treinador",
    PLAYER: "Atleta",
    MATERIAL_DIRECTOR: "Diretor de Material",
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-[#8fa39b] flex items-center gap-2">
          <span>📅</span> Atividades Recentes do Clube
        </h2>
        <p className="text-[11px] text-[#8fa39b] mt-0.5">
          Linha do tempo de todas as ações importantes do time
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[#8fa39b]">
          Carregando atividades...
        </div>
      ) : activities.length === 0 ? (
        <div className="py-12 text-center text-[#8fa39b] space-y-2">
          <p className="text-3xl">📭</p>
          <p className="text-sm font-semibold text-white">Nenhuma atividade registrada</p>
          <p className="text-xs">As ações do time serão listadas aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative border-l border-white/10 pl-5 ml-2.5 space-y-5">
            {activities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Node circle */}
                <span className="absolute -left-[30px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] text-xs shadow-sm group-hover:scale-110 transition-transform">
                  {getIconForType(act.type)}
                </span>

                <div>
                  <p className="text-xs font-semibold text-white leading-relaxed">
                    {act.description}
                  </p>
                  <p className="text-[10px] text-[#8fa39b] mt-0.5">
                    {act.user ? (
                      <>
                        por <span className="font-bold text-white">{act.user.name}</span> ({roleLabels[act.user.role] ?? act.user.role})
                        {" · "}
                      </>
                    ) : null}
                    {getRelativeTime(act.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="text-[10px] uppercase font-bold"
              >
                ◀ Anterior
              </Button>
              <span className="text-[10px] text-[#8fa39b] font-bold">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="text-[10px] uppercase font-bold"
              >
                Próximo ▶
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
