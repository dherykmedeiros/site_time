import { vi, describe, it, expect, beforeEach } from "vitest";
import { createTacticalPlay, listTacticalPlays, updateTacticalPlay, deleteTacticalPlay } from "../tactical-plays";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import type { TacticalPlay, Prisma } from "@prisma/client";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tacticalPlay: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/telemetry", () => ({
  trackOperationalEvent: vi.fn(),
}));

describe("Tactical Plays business logic", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const validMovements = {
    formation: "FOUR_FOUR_TWO",
    players: [
      {
        label: "#10 Meio-campo",
        position: "MIDFIELDER",
        startX: 50,
        startY: 50,
        waypoints: [{ x: 55, y: 55 }],
        endX: 60,
        endY: 60,
        role: "runner" as const,
      },
    ],
  };

  describe("createTacticalPlay", () => {
    it("should create a tactical play successfully with valid input", async () => {
      const mockPlay = {
        id: "play-1",
        name: "Escanteio Curto",
        category: "CORNER_KICK",
        movements: validMovements as unknown as Prisma.JsonValue,
        teamId: "team-1",
        createdById: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        description: "Jogada ensaiada pelo lado direito",
      };

      vi.mocked(prisma.tacticalPlay.create).mockResolvedValue(mockPlay as unknown as TacticalPlay);

      const result = await createTacticalPlay({
        name: "Escanteio Curto",
        description: "Jogada ensaiada pelo lado direito",
        category: "CORNER_KICK",
        movements: validMovements,
        teamId: "team-1",
        createdById: "user-1",
      });

      expect(result).toEqual(mockPlay);
      expect(prisma.tacticalPlay.create).toHaveBeenCalledWith({
        data: {
          name: "Escanteio Curto",
          description: "Jogada ensaiada pelo lado direito",
          category: "CORNER_KICK",
          movements: validMovements as unknown as Prisma.InputJsonValue,
          teamId: "team-1",
          createdById: "user-1",
        },
      });
    });

    it("should throw ZodError if coordinate is greater than 100", async () => {
      const invalidMovements = {
        formation: "FOUR_FOUR_TWO",
        players: [
          {
            label: "#10",
            position: "MIDFIELDER",
            startX: 150, // invalid > 100
            startY: 50,
            waypoints: [],
            endX: 60,
            endY: 60,
            role: "runner" as const,
          },
        ],
      };

      await expect(
        createTacticalPlay({
          name: "Escanteio Curto",
          movements: invalidMovements,
          teamId: "team-1",
          createdById: "user-1",
        })
      ).rejects.toThrow(ZodError);
    });

    it("should throw ZodError if players list is empty", async () => {
      const invalidMovements = {
        formation: "FOUR_FOUR_TWO",
        players: [], // empty
      };

      await expect(
        createTacticalPlay({
          name: "Jogada",
          movements: invalidMovements,
          teamId: "team-1",
          createdById: "user-1",
        })
      ).rejects.toThrow(ZodError);
    });
  });

  describe("listTacticalPlays", () => {
    it("should list tactical plays for a team", async () => {
      vi.mocked(prisma.tacticalPlay.findMany).mockResolvedValue([] as unknown as TacticalPlay[]);

      await listTacticalPlays("team-1");

      expect(prisma.tacticalPlay.findMany).toHaveBeenCalledWith({
        where: {
          teamId: "team-1",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("should filter tactical plays by category", async () => {
      vi.mocked(prisma.tacticalPlay.findMany).mockResolvedValue([] as unknown as TacticalPlay[]);

      await listTacticalPlays("team-1", "CORNER_KICK");

      expect(prisma.tacticalPlay.findMany).toHaveBeenCalledWith({
        where: {
          teamId: "team-1",
          category: "CORNER_KICK",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });
  });

  describe("updateTacticalPlay", () => {
    it("should update and return updated play if exists", async () => {
      const existingPlay = { id: "play-1", teamId: "team-1" };
      vi.mocked(prisma.tacticalPlay.findFirst).mockResolvedValue(existingPlay as unknown as TacticalPlay);
      vi.mocked(prisma.tacticalPlay.update).mockResolvedValue({ id: "play-1", name: "Novo Nome" } as unknown as TacticalPlay);

      const result = await updateTacticalPlay("play-1", "team-1", {
        name: "Novo Nome",
      });

      expect(result).toEqual({ id: "play-1", name: "Novo Nome" });
      expect(prisma.tacticalPlay.update).toHaveBeenCalledWith({
        where: { id: "play-1" },
        data: { name: "Novo Nome" },
      });
    });

    it("should return null if play does not exist under that teamId", async () => {
      vi.mocked(prisma.tacticalPlay.findFirst).mockResolvedValue(null);

      const result = await updateTacticalPlay("play-1", "team-1", {
        name: "Novo Nome",
      });

      expect(result).toBeNull();
      expect(prisma.tacticalPlay.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteTacticalPlay", () => {
    it("should delete the play and return deleted: true if count > 0", async () => {
      vi.mocked(prisma.tacticalPlay.deleteMany).mockResolvedValue({ count: 1 } as unknown as Prisma.BatchPayload);

      const result = await deleteTacticalPlay("play-1", "team-1");

      expect(result).toEqual({ deleted: true });
      expect(prisma.tacticalPlay.deleteMany).toHaveBeenCalledWith({
        where: { id: "play-1", teamId: "team-1" },
      });
    });

    it("should return deleted: false if count is 0", async () => {
      vi.mocked(prisma.tacticalPlay.deleteMany).mockResolvedValue({ count: 0 } as unknown as Prisma.BatchPayload);

      const result = await deleteTacticalPlay("play-1", "team-1");

      expect(result).toEqual({ deleted: false });
    });
  });
});
