import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/polls/[id]/vote — Vote or update votes for the logged-in player
export async function POST(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { id: pollId } = await params;

  try {
    // 1. Fetch the poll and check if it exists and belongs to the user's team
    const poll = await prisma.datePoll.findFirst({
      where: { id: pollId, teamId },
      include: {
        options: {
          select: { id: true },
        },
      },
    });

    if (!poll) {
      return NextResponse.json(
        { error: "Votação não encontrada ou não pertence ao seu time" },
        { status: 404 }
      );
    }

    // 2. Check if the poll is closed
    if (poll.closedAt !== null) {
      return NextResponse.json(
        { error: "Esta votação já foi encerrada" },
        { status: 400 }
      );
    }

    // 3. Find the player linked to this user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { playerId: true },
    });

    if (!user?.playerId) {
      return NextResponse.json(
        { error: "Usuário não tem jogador vinculado para votar" },
        { status: 403 }
      );
    }

    const player = await prisma.player.findUnique({
      where: { id: user.playerId },
      select: { id: true, status: true, teamId: true },
    });

    if (!player || player.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Apenas jogadores ativos podem votar" },
        { status: 400 }
      );
    }

    if (player.teamId !== teamId) {
      return NextResponse.json(
        { error: "Jogador não pertence ao mesmo time da sessão" },
        { status: 403 }
      );
    }

    // 4. Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição inválido (JSON esperado)" },
        { status: 400 }
      );
    }

    const { optionIds } = body;

    if (!optionIds || !Array.isArray(optionIds)) {
      return NextResponse.json(
        { error: "optionIds deve ser uma lista de strings contendo IDs de opções" },
        { status: 400 }
      );
    }

    // Validate that all optionIds belong to this poll
    const validOptionIds = new Set(poll.options.map((o) => o.id));
    for (const optId of optionIds) {
      if (typeof optId !== "string" || !validOptionIds.has(optId)) {
        return NextResponse.json(
          { error: `ID de opção inválido para esta votação: ${optId}` },
          { status: 400 }
        );
      }
    }

    // 5. Update votes in a transaction:
    // Deleta os votos antigos para as opções dessa enquete
    // Cria novos votos para as opções selecionadas
    await prisma.$transaction([
      prisma.datePollVote.deleteMany({
        where: {
          playerId: player.id,
          option: {
            pollId,
          },
        },
      }),
      ...(optionIds.length > 0
        ? [
            prisma.datePollVote.createMany({
              data: optionIds.map((optId) => ({
                optionId: optId,
                playerId: player.id,
              })),
            }),
          ]
        : []),
    ]);

    // Return the updated votes for this poll option structure
    const updatedPollOptions = await prisma.datePollOption.findMany({
      where: { pollId },
      include: {
        votes: {
          include: {
            player: {
              select: {
                id: true,
                name: true,
                photoUrl: true,
              },
            },
          },
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({
      success: true,
      options: updatedPollOptions,
    });
  } catch (err) {
    console.error("Erro ao registrar voto:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar seu voto" },
      { status: 500 }
    );
  }
}
