import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/players/:id/promote — Promote player to ADMIN
export async function PATCH(request: Request, context: RouteContext) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 400 }
    );
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  // Validate that role is "ADMIN"
  if (!body || typeof body !== "object" || (body as { role?: string }).role !== "ADMIN") {
    return NextResponse.json(
      { error: "Valor de role inválido. Apenas 'ADMIN' é aceito.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  // Find player in the team
  const player = await prisma.player.findFirst({
    where: { id, teamId: session.user.teamId },
    include: { user: { select: { id: true, name: true } } },
  });

  if (!player) {
    return NextResponse.json(
      { error: "Jogador não encontrado", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  // Check if player has a linked User account
  if (!player.user) {
    return NextResponse.json(
      { error: "Jogador não possui conta vinculada", code: "NO_ACCOUNT" },
      { status: 400 }
    );
  }

  // Update the user's role to ADMIN
  const updatedUser = await prisma.user.update({
    where: { id: player.user.id },
    data: { role: "ADMIN" },
  });

  return NextResponse.json({
    id: updatedUser.id,
    name: updatedUser.name,
    role: updatedUser.role,
    teamId: updatedUser.teamId,
  });
}
