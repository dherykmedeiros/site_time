"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { playerPositionLabels } from "@/lib/player-positions";
import { formatDate } from "@/lib/utils";

interface MatchSumulaData {
  id: string;
  date: string;
  venue: string;
  opponent: string;
  opponentBadgeUrl: string | null;
  type: string;
  isHome: boolean;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  pixKey: string | null;
  team: {
    name: string;
    badgeUrl: string | null;
  };
  rsvps: Array<{
    status: string;
    player: {
      id: string;
      name: string;
      shirtNumber: number;
      position: string;
    };
  }>;
  guestPlayers: Array<{
    id: string;
    name: string;
    shirtNumber: number | null;
    position: string | null;
  }>;
  lineupSelections: Array<{
    role: "STARTER" | "BENCH";
    teamSide?: string | null;
    sortOrder: number;
    player: { id: string; name: string; shirtNumber: number; position: string } | null;
    guestPlayer: { id: string; name: string } | null;
  }>;
  attendances: Array<{
    playerId: string;
    present: boolean;
  }>;
  matchStats: Array<{
    playerId: string | null;
    guestPlayerId: string | null;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  }>;
}

export default function MatchSumulaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<MatchSumulaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/matches/${id}/export/sumula`)
      .then((r) => (r.ok ? r.json() : Promise.reject("Erro ao carregar súmula")))
      .then((res) => {
        setData(res.match);
      })
      .catch((err) => {
        setError(typeof err === "string" ? err : "Erro de conexão ao carregar súmula.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--text-subtle)]">
        Carregando súmula oficial...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-center">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
          <p className="font-bold">{error || "Súmula não encontrada"}</p>
        </div>
        <Link href={`/dashboard/matches/${id}`} className="mt-4 inline-block text-sm text-emerald-400 hover:underline">
          ← Voltar para a Partida
        </Link>
      </div>
    );
  }

  const attendanceMap = new Map<string, boolean>();
  for (const att of data.attendances) {
    attendanceMap.set(att.playerId, att.present);
  }

  const statsMap = new Map<string, { goals: number; assists: number; yellow: number; red: number }>();
  for (const stat of data.matchStats) {
    const key = stat.playerId || stat.guestPlayerId;
    if (key) {
      statsMap.set(key, {
        goals: stat.goals,
        assists: stat.assists,
        yellow: stat.yellowCards,
        red: stat.redCards,
      });
    }
  }

  const starters = data.lineupSelections.filter((l) => l.role === "STARTER");
  const benchSelections = data.lineupSelections.filter((l) => l.role === "BENCH");

  // Fallback if no specific lineup saved: confirmed RSVPs
  const confirmedPlayers = data.rsvps.filter((r) => r.status === "CONFIRMED");

  return (
    <div className="min-h-screen bg-[#0d1117] p-4 print:p-0 print:bg-white print:text-black text-white">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="mx-auto max-w-4xl mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#161b22] p-4 print:hidden shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/matches/${id}`}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
          >
            ← Voltar para a Partida
          </Link>
          <h1 className="text-sm font-bold text-white">Súmula Oficial do Confronto</h1>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/api/matches/${id}/export/sumula?format=csv`}
            download
            className="inline-flex items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            📊 Baixar CSV (Excel)
          </a>
          <Button onClick={() => window.print()} className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs">
            🖨️ Imprimir / Salvar PDF
          </Button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#161b22] p-8 print:border-0 print:p-0 print:bg-white print:shadow-none shadow-2xl">
        {/* Header */}
        <div className="border-b border-white/10 print:border-black/20 pb-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {data.team.badgeUrl ? (
                <img src={data.team.badgeUrl} alt={data.team.name} className="h-16 w-16 object-contain rounded-lg" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-white/20 font-black text-xl text-emerald-400">
                  {data.team.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-black tracking-tight text-white print:text-black">{data.team.name}</h2>
                <p className="text-xs uppercase tracking-widest text-emerald-400 print:text-emerald-700 font-bold">
                  Súmula Oficial de Partida
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block rounded-full bg-white/10 print:bg-black/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white print:text-black">
                {data.type === "FRIENDLY"
                  ? "Amistoso"
                  : data.type === "TRAINING"
                  ? "Amistoso Treino"
                  : "Campeonato"}
              </span>
              <p className="mt-2 text-sm font-semibold text-[#8fa39b] print:text-gray-700">
                {formatDate(data.date)}
              </p>
            </div>
          </div>

          {/* Confrontation Details Box */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-xl bg-white/[0.03] print:bg-gray-100 p-4 border border-white/5 print:border-gray-300">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b] print:text-gray-500">
                Mandante x Visitante
              </p>
              <p className="mt-0.5 text-sm font-bold text-white print:text-black">
                {data.isHome ? `${data.team.name} (Casa)` : `${data.opponent} (Casa)`} vs{" "}
                {data.isHome ? data.opponent : `${data.team.name} (Visitante)`}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b] print:text-gray-500">
                Local / Campo
              </p>
              <p className="mt-0.5 text-sm font-bold text-white print:text-black">{data.venue}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b] print:text-gray-500">
                Placar Final
              </p>
              <p className="mt-0.5 text-sm font-black text-emerald-400 print:text-emerald-800">
                {data.homeScore !== null && data.awayScore !== null
                  ? `${data.homeScore} x ${data.awayScore}`
                  : "Não registrado"}
              </p>
            </div>
          </div>
        </div>

        {/* Titulares (Starting XI) */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between border-b border-white/10 print:border-black/20 pb-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400 print:text-black">
              1. Escalados / Titulares ({starters.length > 0 ? starters.length : confirmedPlayers.length})
            </h3>
            <span className="text-xs text-[#8fa39b] print:text-gray-600 font-semibold">Titulares em campo</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 print:border-black/20 text-[10px] font-bold uppercase text-[#8fa39b] print:text-gray-600">
                <th className="py-2 px-2 w-12 text-center">Nº</th>
                <th className="py-2 px-2">Atleta</th>
                <th className="py-2 px-2">Posição</th>
                <th className="py-2 px-2 text-center w-24">Presença</th>
                <th className="py-2 px-2 text-center w-20">Gols/Cartões</th>
                <th className="py-2 px-2 text-center w-36">Assinatura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 print:divide-gray-200">
              {starters.length > 0 ? (
                starters.map((s, idx) => {
                  const p = s.player;
                  const g = s.guestPlayer;
                  const name = p ? p.name : g ? `${g.name} (Convidado)` : "Atleta";
                  const shirt = p ? p.shirtNumber : "-";
                  const pos = p ? (playerPositionLabels[p.position as keyof typeof playerPositionLabels] || p.position) : "-";
                  const idKey = p?.id || g?.id || "";
                  const stat = statsMap.get(idKey);
                  const isPresent = p ? attendanceMap.get(p.id) : true;

                  return (
                    <tr key={idx} className="hover:bg-white/[0.02] print:hover:bg-transparent">
                      <td className="py-2 px-2 text-center font-bold text-emerald-400 print:text-black">{shirt}</td>
                      <td className="py-2 px-2 font-semibold text-white print:text-black">{name}</td>
                      <td className="py-2 px-2 text-[#8fa39b] print:text-gray-700">{pos}</td>
                      <td className="py-2 px-2 text-center font-bold">
                        <span className={isPresent ? "text-emerald-400 print:text-emerald-800" : "text-red-400 print:text-red-700"}>
                          {isPresent ? "Presente" : "Ausente"}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center font-mono text-xs">
                        {stat?.goals ? `⚽${stat.goals} ` : ""}
                        {stat?.yellow ? `🟨${stat.yellow} ` : ""}
                        {stat?.red ? `🟥${stat.red}` : "-"}
                      </td>
                      <td className="py-2 px-2 text-center border-b border-white/20 print:border-gray-400"></td>
                    </tr>
                  );
                })
              ) : (
                confirmedPlayers.map((r, idx) => {
                  const p = r.player;
                  const pos = playerPositionLabels[p.position as keyof typeof playerPositionLabels] || p.position;
                  const stat = statsMap.get(p.id);
                  const isPresent = attendanceMap.get(p.id);

                  return (
                    <tr key={idx} className="hover:bg-white/[0.02] print:hover:bg-transparent">
                      <td className="py-2 px-2 text-center font-bold text-emerald-400 print:text-black">{p.shirtNumber}</td>
                      <td className="py-2 px-2 font-semibold text-white print:text-black">{p.name}</td>
                      <td className="py-2 px-2 text-[#8fa39b] print:text-gray-700">{pos}</td>
                      <td className="py-2 px-2 text-center font-bold">
                        <span className={isPresent ? "text-emerald-400 print:text-emerald-800" : "text-red-400 print:text-red-700"}>
                          {isPresent ? "Presente" : "Ausente"}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center font-mono text-xs">
                        {stat?.goals ? `⚽${stat.goals} ` : ""}
                        {stat?.yellow ? `🟨${stat.yellow} ` : ""}
                        {stat?.red ? `🟥${stat.red}` : "-"}
                      </td>
                      <td className="py-2 px-2 text-center border-b border-white/20 print:border-gray-400"></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Reservas / Suplentes */}
        {benchSelections.length > 0 && (
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between border-b border-white/10 print:border-black/20 pb-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400 print:text-black">
                2. Suplentes / Banco de Reservas ({benchSelections.length})
              </h3>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 print:border-black/20 text-[10px] font-bold uppercase text-[#8fa39b] print:text-gray-600">
                  <th className="py-2 px-2 w-12 text-center">Nº</th>
                  <th className="py-2 px-2">Atleta</th>
                  <th className="py-2 px-2">Posição</th>
                  <th className="py-2 px-2 text-center w-24">Presença</th>
                  <th className="py-2 px-2 text-center w-36">Assinatura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-gray-200">
                {benchSelections.map((s, idx) => {
                  const p = s.player;
                  const g = s.guestPlayer;
                  const name = p ? p.name : g ? `${g.name} (Convidado)` : "Atleta";
                  const shirt = p ? p.shirtNumber : "-";
                  const pos = p ? (playerPositionLabels[p.position as keyof typeof playerPositionLabels] || p.position) : "-";
                  const isPresent = p ? attendanceMap.get(p.id) : true;

                  return (
                    <tr key={idx}>
                      <td className="py-2 px-2 text-center font-bold text-emerald-400 print:text-black">{shirt}</td>
                      <td className="py-2 px-2 font-semibold text-white print:text-black">{name}</td>
                      <td className="py-2 px-2 text-[#8fa39b] print:text-gray-700">{pos}</td>
                      <td className="py-2 px-2 text-center font-bold">
                        <span className={isPresent ? "text-emerald-400 print:text-emerald-800" : "text-red-400 print:text-red-700"}>
                          {isPresent ? "Presente" : "Ausente"}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center border-b border-white/20 print:border-gray-400"></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Assinaturas e Observações da Partida */}
        <div className="mt-12 pt-6 border-t border-white/10 print:border-black/20 grid grid-cols-2 gap-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b] print:text-gray-600 mb-8">
              Assinatura do Capitão / Representante da Equipe
            </p>
            <div className="border-b border-white/30 print:border-black"></div>
            <p className="mt-1 text-center text-xs text-[#8fa39b] print:text-gray-600">{data.team.name}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa39b] print:text-gray-600 mb-8">
              Assinatura do Árbitro / Responsável da Quadra
            </p>
            <div className="border-b border-white/30 print:border-black"></div>
            <p className="mt-1 text-center text-xs text-[#8fa39b] print:text-gray-600">Arbitragem Oficial</p>
          </div>
        </div>
      </div>
    </div>
  );
}
