import { vi, describe, it, expect, beforeEach } from "vitest";
import { castVote, getVoteResults } from "../match-votes";
import { prisma } from "@/lib/prisma";
import type { Match, MatchAttendance, MatchVote, Player } from "@prisma/client";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    match: { findUnique: vi.fn() },
    matchAttendance: { findUnique: vi.fn() },
    matchVote: { create: vi.fn(), groupBy: vi.fn() },
    player: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/telemetry", () => ({
  trackOperationalEvent: vi.fn(),
}));

describe("Match Votes business logic", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("castVote", () => {
    it("should cast a vote successfully if match is completed and players checked in", async () => {
      vi.mocked(prisma.match.findUnique).mockResolvedValue({ status: "COMPLETED" } as unknown as Match);
      vi.mocked(prisma.matchAttendance.findUnique)
        .mockResolvedValueOnce({ present: true } as unknown as MatchAttendance) // voter
        .mockResolvedValueOnce({ present: true } as unknown as MatchAttendance); // voted

      vi.mocked(prisma.matchVote.create).mockResolvedValue({ id: "vote-1" } as unknown as MatchVote);

      const result = await castVote({
        matchId: "match-1",
        voterId: "voter-1",
        votedId: "voted-1",
      });

      expect(result).toEqual({ success: true, voteId: "vote-1" });
      expect(prisma.matchVote.create).toHaveBeenCalledWith({
        data: {
          matchId: "match-1",
          voterId: "voter-1",
          votedId: "voted-1",
        },
      });
    });

    it("should return SELF_VOTE_NOT_ALLOWED if voter tries to vote for themselves", async () => {
      const result = await castVote({
        matchId: "match-1",
        voterId: "player-1",
        votedId: "player-1",
      });

      expect(result).toEqual({
        success: false,
        error: "Auto-voto não é permitido",
        code: "SELF_VOTE_NOT_ALLOWED",
      });
    });

    it("should return MATCH_NOT_COMPLETED if match is not completed", async () => {
      vi.mocked(prisma.match.findUnique).mockResolvedValue({ status: "SCHEDULED" } as unknown as Match);

      const result = await castVote({
        matchId: "match-1",
        voterId: "voter-1",
        votedId: "voted-2",
      });

      expect(result).toEqual({
        success: false,
        error: "A partida deve estar concluída para iniciar a votação",
        code: "MATCH_NOT_COMPLETED",
      });
    });

    it("should return VOTER_NOT_CHECKED_IN if voter was not present", async () => {
      vi.mocked(prisma.match.findUnique).mockResolvedValue({ status: "COMPLETED" } as unknown as Match);
      vi.mocked(prisma.matchAttendance.findUnique)
        .mockResolvedValueOnce(null) // voter not present/no record
        .mockResolvedValueOnce({ present: true } as unknown as MatchAttendance);

      const result = await castVote({
        matchId: "match-1",
        voterId: "voter-1",
        votedId: "voted-1",
      });

      expect(result).toEqual({
        success: false,
        error: "Apenas jogadores presentes na partida podem votar",
        code: "VOTER_NOT_CHECKED_IN",
      });
    });

    it("should return VOTED_NOT_CHECKED_IN if voted player was not present", async () => {
      vi.mocked(prisma.match.findUnique).mockResolvedValue({ status: "COMPLETED" } as unknown as Match);
      vi.mocked(prisma.matchAttendance.findUnique)
        .mockResolvedValueOnce({ present: true } as unknown as MatchAttendance) // voter present
        .mockResolvedValueOnce({ present: false } as unknown as MatchAttendance); // voted not present

      const result = await castVote({
        matchId: "match-1",
        voterId: "voter-1",
        votedId: "voted-1",
      });

      expect(result).toEqual({
        success: false,
        error: "Apenas jogadores presentes na partida podem ser votados",
        code: "VOTED_NOT_CHECKED_IN",
      });
    });

    it("should return ALREADY_VOTED if unique constraint fails", async () => {
      vi.mocked(prisma.match.findUnique).mockResolvedValue({ status: "COMPLETED" } as unknown as Match);
      vi.mocked(prisma.matchAttendance.findUnique)
        .mockResolvedValueOnce({ present: true } as unknown as MatchAttendance)
        .mockResolvedValueOnce({ present: true } as unknown as MatchAttendance);

      const duplicateError = Object.assign(new Error("Unique constraint"), { code: "P2002" });
      vi.mocked(prisma.matchVote.create).mockRejectedValue(duplicateError);

      const result = await castVote({
        matchId: "match-1",
        voterId: "voter-1",
        votedId: "voted-1",
      });

      expect(result).toEqual({
        success: false,
        error: "Você já votou nesta partida",
        code: "ALREADY_VOTED",
      });
    });
  });

  describe("getVoteResults", () => {
    it("should return ranked players based on vote counts", async () => {
      const mockVotesGroup = [
        { votedId: "player-1", _count: { votedId: 5 } },
        { votedId: "player-2", _count: { votedId: 3 } },
      ];
      vi.mocked(prisma.matchVote.groupBy).mockResolvedValue(mockVotesGroup as unknown as never);

      const mockPlayers = [
        { id: "player-1", name: "Player One", photoUrl: "/p1.jpg", shirtNumber: 10, position: "FORWARD" },
        { id: "player-2", name: "Player Two", photoUrl: null, shirtNumber: 8, position: "MIDFIELDER" },
      ];
      vi.mocked(prisma.player.findMany).mockResolvedValue(mockPlayers as unknown as Player[]);

      const result = await getVoteResults("match-1");

      expect(result).toEqual([
        {
          playerId: "player-1",
          playerName: "Player One",
          photoUrl: "/p1.jpg",
          shirtNumber: 10,
          position: "FORWARD",
          voteCount: 5,
        },
        {
          playerId: "player-2",
          playerName: "Player Two",
          photoUrl: null,
          shirtNumber: 8,
          position: "MIDFIELDER",
          voteCount: 3,
        },
      ]);
    });

    it("should return empty array if no votes cast", async () => {
      vi.mocked(prisma.matchVote.groupBy).mockResolvedValue([]);

      const result = await getVoteResults("match-1");

      expect(result).toEqual([]);
    });
  });
});
