import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

// GET /api/players/active — Lista todos os atletas ativos do time para seleção (ex: Treinador do jogo)
export const GET = withErrorHandler(async () => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const players = await prisma.player.findMany({
    where: {
      teamId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      fullName: true,
      shirtNumber: true,
      position: true,
      photoUrl: true,
    },
    orderBy: [
      { shirtNumber: "asc" },
      { name: "asc" },
    ],
  });

  return NextResponse.json(players);
});
