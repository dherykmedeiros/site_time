import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";
import { createCsvResponse } from "@/lib/export";
import { playerPositionLabels } from "@/lib/player-positions";
import { formatDateOnly } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const rsvpStatusLabels: Record<string, string> = {
  CONFIRMED: "Confirmado",
  DECLINED: "Recusado",
  PENDING: "Pendente",
};

// GET /api/matches/:id/export/documents — Exporta lista oficial de atletas com Nome Completo e CPF em CSV (Excel)
export const GET = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { id: matchId } = await params;

  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId },
    include: {
      rsvps: {
        where: {
          player: { status: "ACTIVE" },
        },
        include: {
          player: {
            select: {
              shirtNumber: true,
              name: true,
              fullName: true,
              cpf: true,
              position: true,
              phone: true,
            },
          },
        },
        orderBy: {
          player: { shirtNumber: "asc" },
        },
      },
    },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada", code: "NOT_FOUND" }, { status: 404 });
  }

  const headers = [
    "Camisa",
    "Nome Completo",
    "Nome no Time",
    "CPF",
    "Posição",
    "Status da Presença",
    "Telefone",
  ];

  const rows = match.rsvps.map((r) => {
    const posLabel = playerPositionLabels[r.player.position as keyof typeof playerPositionLabels] || r.player.position;

    return [
      r.player.shirtNumber,
      r.player.fullName || r.player.name,
      r.player.name,
      r.player.cpf || "Não informado",
      posLabel,
      rsvpStatusLabels[r.status] || r.status,
      r.player.phone || "-",
    ];
  });

  const filename = `lista_documentos_vs_${match.opponent.replace(/\s+/g, "_")}_${formatDateOnly(match.date).replace(/\//g, "-")}`;
  return createCsvResponse(filename, headers, rows);
});
