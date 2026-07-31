import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireCoachOrAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity-logger";

// GET /api/polls — List active and closed polls for the logged-in user's team
export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 400 }
    );
  }

  try {
    const polls = await prisma.datePoll.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
      include: {
        options: {
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
        },
        match: {
          select: {
            id: true,
            opponent: true,
            venue: true,
          },
        },
      },
    });

    return NextResponse.json(polls);
  } catch (err) {
    console.error("Erro ao buscar enquetes:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST /api/polls — Create a new date poll (ADMIN or COACH only)
export async function POST(request: Request) {
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 400 }
    );
  }

  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição inválido (JSON esperado)" },
        { status: 400 }
      );
    }

    const { title, options, matchId } = body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        { error: "Título inválido (mínimo 3 caracteres)" },
        { status: 400 }
      );
    }

    if (!options || !Array.isArray(options) || options.length === 0) {
      return NextResponse.json(
        { error: "A enquete deve ter pelo menos uma opção de data" },
        { status: 400 }
      );
    }

    // Validate dates
    const parsedOptions = options.map((opt: any) => {
      const d = new Date(opt);
      if (isNaN(d.getTime())) {
        throw new Error(`Data inválida: ${opt}`);
      }
      return d;
    });

    if (matchId) {
      const matchExists = await prisma.match.findFirst({
        where: { id: matchId, teamId },
      });
      if (!matchExists) {
        return NextResponse.json(
          { error: "A partida informada não pertence ao seu time." },
          { status: 400 }
        );
      }
    }

    // Create the poll and its options in a transaction
    const newPoll = await prisma.datePoll.create({
      data: {
        title: title.trim(),
        teamId,
        matchId: matchId || null,
        options: {
          create: parsedOptions.map((date) => ({
            date,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    await logActivity(
      teamId,
      "POLL_CREATED",
      `Criou uma nova enquete de data: "${title.trim()}"`,
      session.user.id,
      { pollId: newPoll.id }
    );

    return NextResponse.json(newPoll, { status: 201 });
  } catch (err: any) {
    console.error("Erro ao criar enquete:", err);
    return NextResponse.json(
      { error: err.message || "Erro interno do servidor ao criar enquete" },
      { status: 500 }
    );
  }
}
