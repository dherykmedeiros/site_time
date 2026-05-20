import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCoachOrAdmin } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/polls/[id]/close — Close the date poll (ADMIN or COACH only)
export async function POST(request: Request, { params }: RouteParams) {
  const { session, error } = await requireCoachOrAdmin();
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
    // Check if the poll exists and belongs to the user's team
    const poll = await prisma.datePoll.findFirst({
      where: { id: pollId, teamId },
    });

    if (!poll) {
      return NextResponse.json(
        { error: "Votação não encontrada ou não pertence ao seu time" },
        { status: 404 }
      );
    }

    // Close the poll
    const updatedPoll = await prisma.datePoll.update({
      where: { id: pollId },
      data: { closedAt: new Date() },
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
      },
    });

    return NextResponse.json({
      success: true,
      poll: updatedPoll,
    });
  } catch (err) {
    console.error("Erro ao encerrar enquete:", err);
    return NextResponse.json(
      { error: "Erro interno ao encerrar a enquete" },
      { status: 500 }
    );
  }
}
