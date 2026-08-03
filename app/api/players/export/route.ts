import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";
import { createCsvResponse } from "@/lib/export";
import { playerPositionLabels } from "@/lib/player-positions";

// GET /api/players/export — Exporta dados e estatísticas do elenco em CSV (Excel)
export const GET = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const players = await prisma.player.findMany({
    where: { teamId },
    include: {
      matchStats: {
        select: {
          goals: true,
          assists: true,
          yellowCards: true,
          redCards: true,
        },
      },
      attendances: {
        where: { present: true },
        select: { id: true },
      },
    },
    orderBy: { shirtNumber: "asc" },
  });

  const headers = [
    "Número",
    "Nome Completo",
    "Posição Principal",
    "Posição Secundária",
    "Status",
    "Telefone",
    "Jogos Disputados",
    "Gols Marca dos",
    "Assistências",
    "Cartões Amarelos",
    "Cartões Vermelhos",
  ];

  const rows = players.map((p) => {
    const goals = p.matchStats.reduce((sum, s) => sum + s.goals, 0);
    const assists = p.matchStats.reduce((sum, s) => sum + s.assists, 0);
    const yellow = p.matchStats.reduce((sum, s) => sum + s.yellowCards, 0);
    const red = p.matchStats.reduce((sum, s) => sum + s.redCards, 0);
    const matchesCount = p.attendances.length;

    const posLabel = playerPositionLabels[p.position as keyof typeof playerPositionLabels] || p.position;
    const secPosLabel = p.secondaryPosition
      ? (playerPositionLabels[p.secondaryPosition as keyof typeof playerPositionLabels] || p.secondaryPosition)
      : "-";

    return [
      p.shirtNumber,
      p.fullName || p.name,
      posLabel,
      secPosLabel,
      p.status === "ACTIVE" ? "Ativo" : "Inativo",
      p.phone || "-",
      matchesCount,
      goals,
      assists,
      yellow,
      red,
    ];
  });

  const filename = `elenco_estatisticas_${new Date().toISOString().slice(0, 10)}`;
  return createCsvResponse(filename, headers, rows);
});
