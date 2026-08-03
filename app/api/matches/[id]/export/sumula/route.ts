import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";
import { createCsvResponse, formatCsvValue } from "@/lib/export";
import { playerPositionLabels } from "@/lib/player-positions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/matches/:id/export/sumula — Exporta súmula e lista de presença da partida em CSV ou JSON
export const GET = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";

  const match = await prisma.match.findFirst({
    where: { id, teamId: session.user.teamId || undefined },
    include: {
      team: { select: { name: true, badgeUrl: true } },
      rsvps: {
        where: { player: { status: "ACTIVE" } },
        include: { player: { select: { id: true, name: true, shirtNumber: true, position: true } } },
        orderBy: { player: { shirtNumber: "asc" } },
      },
      guestPlayers: true,
      lineupSelections: {
        include: {
          player: { select: { id: true, name: true, shirtNumber: true, position: true } },
          guestPlayer: { select: { id: true, name: true } },
        },
        orderBy: { sortOrder: "asc" },
      },
      attendances: {
        include: { player: { select: { id: true, name: true } } },
      },
      matchStats: {
        include: {
          player: { select: { name: true } },
          guestPlayer: { select: { name: true } },
        },
      },
    },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada", code: "NOT_FOUND" }, { status: 404 });
  }

  if (format === "csv") {
    const headers = [
      "Tipo",
      "Número",
      "Nome do Atleta",
      "Posição",
      "Status RSVP",
      "Presença em Campo",
      "Gols",
      "Assistências",
      "Cartão Amarelo",
      "Cartão Vermelho",
    ];

    const rows: (string | number | boolean | null | undefined)[][] = [];

    // Map stats by playerId or guestPlayerId
    const statsMap = new Map<string, { goals: number; assists: number; yellow: number; red: number }>();
    for (const stat of match.matchStats) {
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

    const attendanceMap = new Map<string, boolean>();
    for (const att of match.attendances) {
      attendanceMap.set(att.playerId, att.present);
    }

    // Regular players
    for (const rsvp of match.rsvps) {
      const player = rsvp.player;
      const stat = statsMap.get(player.id) || { goals: 0, assists: 0, yellow: 0, red: 0 };
      const present = attendanceMap.get(player.id) ? "Presente" : "Ausente";
      const posLabel = playerPositionLabels[player.position as keyof typeof playerPositionLabels] || player.position;

      rows.push([
        "Atleta do Clube",
        player.shirtNumber,
        player.name,
        posLabel,
        rsvp.status,
        present,
        stat.goals,
        stat.assists,
        stat.yellow,
        stat.red,
      ]);
    }

    // Guest players
    for (const guest of match.guestPlayers || []) {
      const stat = statsMap.get(guest.id) || { goals: 0, assists: 0, yellow: 0, red: 0 };
      rows.push([
        "Convidado",
        guest.shirtNumber || "-",
        `${guest.name} (Convidado)`,
        guest.position ? (playerPositionLabels[guest.position as keyof typeof playerPositionLabels] || guest.position) : "-",
        "CONFIRMED",
        "Presente",
        stat.goals,
        stat.assists,
        stat.yellow,
        stat.red,
      ]);
    }

    const filename = `sumula_${match.opponent.replace(/[^a-z0-9]/gi, "_")}_${match.date.toISOString().slice(0, 10)}`;
    return createCsvResponse(filename, headers, rows);
  }

  return NextResponse.json({ match });
});
