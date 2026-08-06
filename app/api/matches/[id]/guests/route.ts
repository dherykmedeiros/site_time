import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { guestPlayerSchema } from "@/lib/validations/match";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/matches/:id/guests — List guest players for the match
export async function GET(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  // Verify match belongs to team
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: session.user.teamId },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "MATCH_NOT_FOUND" },
      { status: 404 }
    );
  }

  const guests = await prisma.guestPlayer.findMany({
    where: { matchId },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    matchId,
    requiresDocumentDetails: match.requiresDocumentDetails ?? false,
    guests: guests.map((g) => ({
      id: g.id,
      name: g.name,
      cpf: g.cpf,
      shirtNumber: g.shirtNumber,
      position: g.position,
    })),
  });
}

// POST /api/matches/:id/guests — Add a guest player (ADMIN only)
export async function POST(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const ip = extractClientIp(request);
  const rl = await rateLimitMutation(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Muitas tentativas. Tente em ${rl.retryAfterMinutes} min.`, code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: session.user.teamId },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "MATCH_NOT_FOUND" },
      { status: 404 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = guestPlayerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Campos inválidos",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { name, cpf, shirtNumber, position } = parsed.data;

  const cleanCpf = cpf ? cpf.replace(/\D/g, "") : "";

  if (match.requiresDocumentDetails) {
    if (!cleanCpf || cleanCpf.length !== 11) {
      return NextResponse.json(
        {
          error: "Esta partida exige que o CPF do convidado seja informado (11 dígitos).",
          code: "CPF_REQUIRED",
        },
        { status: 400 }
      );
    }
  }

  // Check if guest with same name already exists in this match
  const existingGuest = await prisma.guestPlayer.findFirst({
    where: {
      matchId,
      name,
      teamId: match.teamId,
    },
  });

  if (existingGuest) {
    return NextResponse.json(
      { error: "Já existe um jogador convidado com este nome nesta partida", code: "GUEST_ALREADY_EXISTS" },
      { status: 400 }
    );
  }

  // Also check that shirt number doesn't conflict with regular active players if shirtNumber is provided
  if (shirtNumber) {
    const existingPlayerWithShirt = await prisma.player.findFirst({
      where: {
        teamId: session.user.teamId,
        shirtNumber,
        status: "ACTIVE",
      },
    });

    const existingGuestWithShirt = await prisma.guestPlayer.findFirst({
      where: {
        matchId,
        shirtNumber,
      },
    });

    if (existingPlayerWithShirt || existingGuestWithShirt) {
      return NextResponse.json(
        { error: `O número de camisa ${shirtNumber} já está em uso nesta partida`, code: "SHIRT_NUMBER_CONFLICT" },
        { status: 400 }
      );
    }
  }

  const guest = await prisma.guestPlayer.create({
    data: {
      name,
      cpf: cleanCpf || cpf || null,
      shirtNumber,
      position,
      matchId,
      teamId: session.user.teamId,
    },
  });

  return NextResponse.json(
    {
      message: "Jogador convidado adicionado com sucesso",
      guest: {
        id: guest.id,
        name: guest.name,
        cpf: guest.cpf,
        shirtNumber: guest.shirtNumber,
        position: guest.position,
      },
    },
    { status: 201 }
  );
}

// DELETE /api/matches/:id/guests — Remove a guest player (ADMIN only)
export async function DELETE(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const url = new URL(request.url);
  const guestPlayerId = url.searchParams.get("guestPlayerId");

  if (!guestPlayerId) {
    return NextResponse.json(
      { error: "ID do convidado obrigatório", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  // Check if guest belongs to this match and team
  const guest = await prisma.guestPlayer.findFirst({
    where: { id: guestPlayerId, matchId, teamId: session.user.teamId },
  });

  if (!guest) {
    return NextResponse.json(
      { error: "Jogador convidado não encontrado", code: "GUEST_NOT_FOUND" },
      { status: 404 }
    );
  }

  await prisma.guestPlayer.delete({
    where: { id: guestPlayerId },
  });

  return NextResponse.json({
    message: "Jogador convidado removido com sucesso",
    guestPlayerId,
  });
}
