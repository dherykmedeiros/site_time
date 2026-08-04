import { describe, it, expect, vi, beforeEach } from "vitest";
import { syncMissingRSVPsForTeam } from "../match-rsvp-sync";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    player: {
      findMany: vi.fn(),
    },
    match: {
      findMany: vi.fn(),
    },
    rSVP: {
      findMany: vi.fn(),
      createMany: vi.fn(),
    },
  },
}));

describe("Sincronização de RSVPs Ausentes (syncMissingRSVPsForTeam)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar 0 se teamId for inválido", async () => {
    const count = await syncMissingRSVPsForTeam("");
    expect(count).toBe(0);
  });

  it("deve retornar 0 se não houver jogadores ativos ou partidas agendadas", async () => {
    vi.mocked(prisma.player.findMany).mockResolvedValue([]);
    vi.mocked(prisma.match.findMany).mockResolvedValue([]);

    const count = await syncMissingRSVPsForTeam("team-1");
    expect(count).toBe(0);
    expect(prisma.rSVP.createMany).not.toHaveBeenCalled();
  });

  it("deve criar RSVPs pendentes para atletas ativos que não possuem RSVP na partida", async () => {
    vi.mocked(prisma.player.findMany).mockResolvedValue([
      { id: "player-1" },
      { id: "player-2" },
    ] as any);

    vi.mocked(prisma.match.findMany).mockResolvedValue([
      { id: "match-1", type: "FRIENDLY" },
      { id: "match-2", type: "CHAMPIONSHIP" },
    ] as any);

    // player-1 já tem RSVP para match-1
    vi.mocked(prisma.rSVP.findMany).mockResolvedValue([
      { matchId: "match-1", playerId: "player-1" },
    ] as any);

    vi.mocked(prisma.rSVP.createMany).mockResolvedValue({ count: 3 });

    const count = await syncMissingRSVPsForTeam("team-1");

    expect(count).toBe(3);
    expect(prisma.rSVP.createMany).toHaveBeenCalledWith({
      data: [
        {
          matchId: "match-1",
          playerId: "player-2",
          status: "PENDING",
          summoned: true,
        },
        {
          matchId: "match-2",
          playerId: "player-1",
          status: "PENDING",
          summoned: false,
        },
        {
          matchId: "match-2",
          playerId: "player-2",
          status: "PENDING",
          summoned: false,
        },
      ],
      skipDuplicates: true,
    });
  });

  it("não deve tentar criar RSVPs se todos os atletas já possuem registros", async () => {
    vi.mocked(prisma.player.findMany).mockResolvedValue([
      { id: "player-1" },
    ] as any);

    vi.mocked(prisma.match.findMany).mockResolvedValue([
      { id: "match-1", type: "FRIENDLY" },
    ] as any);

    vi.mocked(prisma.rSVP.findMany).mockResolvedValue([
      { matchId: "match-1", playerId: "player-1" },
    ] as any);

    const count = await syncMissingRSVPsForTeam("team-1");

    expect(count).toBe(0);
    expect(prisma.rSVP.createMany).not.toHaveBeenCalled();
  });
});
