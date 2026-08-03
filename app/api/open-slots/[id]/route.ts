import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/open-slots/:id — Cancelar/remover vaga aberta (Apenas ADMIN do time)
export const DELETE = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { id } = await params;

  const slot = await prisma.openMatchSlot.findFirst({
    where: { id, teamId },
  });

  if (!slot) {
    return NextResponse.json({ error: "Vaga não encontrada", code: "NOT_FOUND" }, { status: 404 });
  }

  await prisma.openMatchSlot.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Vaga removida com sucesso" });
});
