import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { castVote, getVoteResults } from "@/lib/match-votes";
import { trackOperationalEvent } from "@/lib/telemetry";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const voteInputSchema = z.object({
  votedId: z.string().min(1),
});

export async function POST(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const voterId = session.user.playerId;
  if (!voterId) {
    return NextResponse.json(
      { error: "Apenas usuários com perfil de atleta associado podem votar", code: "PLAYER_PROFILE_REQUIRED" },
      { status: 403 }
    );
  }

  const { id: matchId } = await params;

  try {
    const body = await request.json();
    const parseResult = voteInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Payload inválido", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { votedId } = parseResult.data;
    const result = await castVote({ matchId, voterId, votedId });

    if (!result.success) {
      const statusMap: Record<string, number> = {
        MATCH_NOT_COMPLETED: 400,
        VOTER_NOT_CHECKED_IN: 403,
        VOTED_NOT_CHECKED_IN: 400,
        SELF_VOTE_NOT_ALLOWED: 400,
        ALREADY_VOTED: 409,
      };
      const status = statusMap[result.code] || 500;
      return NextResponse.json({ error: result.error, code: result.code }, { status });
    }

    return NextResponse.json({ success: true, voteId: result.voteId }, { status: 201 });
  } catch (err) {
    trackOperationalEvent("match_vote_failed", { matchId, voterId, error: String(err) });
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id: matchId } = await params;

  try {
    const results = await getVoteResults(matchId);

    let hasVoted = false;
    let votedForId: string | null = null;

    if (session.user.playerId) {
      const userVote = await prisma.matchVote.findUnique({
        where: {
          matchId_voterId: {
            matchId,
            voterId: session.user.playerId,
          },
        },
        select: { votedId: true },
      });

      if (userVote) {
        hasVoted = true;
        votedForId = userVote.votedId;
      }
    }

    return NextResponse.json({ results, hasVoted, votedForId }, { status: 200 });
  } catch (err) {
    trackOperationalEvent("match_votes_get_failed", { matchId, error: String(err) });
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
