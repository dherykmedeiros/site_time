import { prisma } from "@/lib/prisma";
import { trackOperationalEvent } from "@/lib/telemetry";

export type CastVoteResult =
  | { success: true; voteId: string }
  | { success: false; error: string; code: "MATCH_NOT_COMPLETED" | "VOTER_NOT_CHECKED_IN" | "VOTED_NOT_CHECKED_IN" | "SELF_VOTE_NOT_ALLOWED" | "ALREADY_VOTED" };

export interface VoteResult {
  playerId: string;
  playerName: string;
  photoUrl: string | null;
  shirtNumber: number;
  position: string;
  voteCount: number;
}

/**
 * Casts a vote for the best player of a match.
 * Business rules:
 * 1. Match must have status === 'COMPLETED'
 * 2. Voter must have MatchAttendance with present === true for this match
 * 3. Voted player must also have MatchAttendance with present === true
 * 4. voterId !== votedId (no self-voting)
 * 5. One vote per voter per match
 */
export async function castVote(params: { matchId: string; voterId: string; votedId: string }): Promise<CastVoteResult> {
  const { matchId, voterId, votedId } = params;

  if (voterId === votedId) {
    return { success: false, error: "Auto-voto não é permitido", code: "SELF_VOTE_NOT_ALLOWED" };
  }

  // 1. Check match status is completed
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { status: true },
  });

  if (!match || match.status !== "COMPLETED") {
    return { success: false, error: "A partida deve estar concluída para iniciar a votação", code: "MATCH_NOT_COMPLETED" };
  }

  // 2. Check voter attendance
  const voterAttendance = await prisma.matchAttendance.findUnique({
    where: {
      matchId_playerId: {
        matchId,
        playerId: voterId,
      },
    },
    select: { present: true },
  });

  if (!voterAttendance || !voterAttendance.present) {
    return { success: false, error: "Apenas jogadores presentes na partida podem votar", code: "VOTER_NOT_CHECKED_IN" };
  }

  // 3. Check voted player attendance
  const votedAttendance = await prisma.matchAttendance.findUnique({
    where: {
      matchId_playerId: {
        matchId,
        playerId: votedId,
      },
    },
    select: { present: true },
  });

  if (!votedAttendance || !votedAttendance.present) {
    return { success: false, error: "Apenas jogadores presentes na partida podem ser votados", code: "VOTED_NOT_CHECKED_IN" };
  }

  // 4. Cast the vote
  try {
    const vote = await prisma.matchVote.create({
      data: {
        matchId,
        voterId,
        votedId,
      },
    });

    trackOperationalEvent("match_vote_cast", {
      voteId: vote.id,
      matchId,
      voterId,
      votedId,
    });

    return { success: true, voteId: vote.id };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { success: false, error: "Você já votou nesta partida", code: "ALREADY_VOTED" };
    }
    throw error;
  }
}

/**
 * Gets vote results for a match, returning players ranked by vote count.
 */
export async function getVoteResults(matchId: string): Promise<VoteResult[]> {
  const votes = await prisma.matchVote.groupBy({
    by: ["votedId"],
    where: { matchId },
    _count: {
      votedId: true,
    },
    orderBy: {
      _count: {
        votedId: "desc",
      },
    },
  });

  if (votes.length === 0) {
    return [];
  }

  const playerIds = votes.map((v) => v.votedId);
  const players = await prisma.player.findMany({
    where: { id: { in: playerIds } },
    select: {
      id: true,
      name: true,
      photoUrl: true,
      shirtNumber: true,
      position: true,
    },
  });

  const results: VoteResult[] = votes
    .map((v) => {
      const player = players.find((p) => p.id === v.votedId);
      return {
        playerId: v.votedId,
        playerName: player?.name || "Jogador desconhecido",
        photoUrl: player?.photoUrl || null,
        shirtNumber: player?.shirtNumber || 0,
        position: player?.position || "OUTROS",
        voteCount: v._count.votedId,
      };
    })
    .filter((res) => res.playerId !== null);

  return results;
}
