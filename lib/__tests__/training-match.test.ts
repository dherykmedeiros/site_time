import { describe, it, expect } from "vitest";
import { createMatchSchema, updateMatchSchema, patchMatchLineupSchema, matchListQuerySchema } from "../validations/match";
import { autoBalanceTrainingTeams, TrainingPlayerCandidate, buildMatchLineupSnapshot } from "../match-lineup";

describe("Amistoso Treino (Training Match) Validations and Squad Division", () => {
  describe("Zod Schemas", () => {
    it("allows creating a match with type TRAINING without specifying opponent (defaults to Time B)", () => {
      const parsed = createMatchSchema.safeParse({
        date: new Date().toISOString(),
        venue: "Arena do Clube",
        type: "TRAINING",
      });

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.type).toBe("TRAINING");
        expect(parsed.data.opponent).toBe("Time B");
      }
    });

    it("requires opponent name when creating a FRIENDLY match", () => {
      const parsed = createMatchSchema.safeParse({
        date: new Date().toISOString(),
        venue: "Arena do Clube",
        type: "FRIENDLY",
        opponent: "",
      });

      expect(parsed.success).toBe(false);
    });

    it("allows updating a match with type TRAINING", () => {
      const parsed = updateMatchSchema.safeParse({
        type: "TRAINING",
      });

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.type).toBe("TRAINING");
      }
    });

    it("supports filtering matches by type TRAINING", () => {
      const parsed = matchListQuerySchema.safeParse({
        type: "TRAINING",
      });

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.type).toBe("TRAINING");
      }
    });

    it("validates patchMatchLineupSchema with teamSide for Time A and Time B", () => {
      const payload = {
        starters: [
          { playerId: "ckz1111111111111111111111", teamSide: "A" as const, fieldX: 50, fieldY: 15 },
          { playerId: "ckz2222222222222222222222", teamSide: "B" as const, fieldX: 50, fieldY: 15 },
        ],
        bench: [
          { playerId: "ckz3333333333333333333333", teamSide: "A" as const },
          { playerId: "ckz4444444444444444444444", teamSide: "B" as const },
        ],
      };

      const parsed = patchMatchLineupSchema.safeParse(payload);
      expect(parsed.success).toBe(true);
    });

    it("rejects duplicate players across starters and bench in patchMatchLineupSchema", () => {
      const payload = {
        starters: [
          { playerId: "ckz1111111111111111111111", teamSide: "A" as const },
        ],
        bench: [
          { playerId: "ckz1111111111111111111111", teamSide: "B" as const },
        ],
      };

      const parsed = patchMatchLineupSchema.safeParse(payload);
      expect(parsed.success).toBe(false);
    });
  });

  describe("autoBalanceTrainingTeams", () => {
    it("balances goalkeepers, defenders, midfielders and forwards evenly between Time A and Time B", () => {
      const samplePlayers: TrainingPlayerCandidate[] = [
        { id: "gk1", name: "Goleiro 1", position: "GOALKEEPER", shirtNumber: 1 },
        { id: "gk2", name: "Goleiro 2", position: "GOALKEEPER", shirtNumber: 12 },
        { id: "def1", name: "Zagueiro 1", position: "DEFENDER", shirtNumber: 3 },
        { id: "def2", name: "Zagueiro 2", position: "DEFENDER", shirtNumber: 4 },
        { id: "def3", name: "Lateral 1", position: "LEFT_BACK", shirtNumber: 6 },
        { id: "def4", name: "Lateral 2", position: "RIGHT_BACK", shirtNumber: 2 },
        { id: "mid1", name: "Meia 1", position: "MIDFIELDER", shirtNumber: 8 },
        { id: "mid2", name: "Meia 2", position: "DEFENSIVE_MIDFIELDER", shirtNumber: 5 },
        { id: "mid3", name: "Meia 3", position: "MIDFIELDER", shirtNumber: 10 },
        { id: "mid4", name: "Meia 4", position: "MIDFIELDER", shirtNumber: 16 },
        { id: "atk1", name: "Atacante 1", position: "FORWARD", shirtNumber: 9 },
        { id: "atk2", name: "Atacante 2", position: "LEFT_WINGER", shirtNumber: 7 },
        { id: "atk3", name: "Atacante 3", position: "RIGHT_WINGER", shirtNumber: 11 },
        { id: "atk4", name: "Convidado 1", position: "FORWARD", shirtNumber: 19, isGuest: true },
      ];

      const result = autoBalanceTrainingTeams(samplePlayers);

      const totalA = result.teamA.starters.length + result.teamA.bench.length;
      const totalB = result.teamB.starters.length + result.teamB.bench.length;

      expect(totalA).toBe(7);
      expect(totalB).toBe(7);

      // Check Goalkeepers balance
      const gkA = [...result.teamA.starters, ...result.teamA.bench].filter((p) => p.position === "GOALKEEPER");
      const gkB = [...result.teamB.starters, ...result.teamB.bench].filter((p) => p.position === "GOALKEEPER");
      expect(gkA.length).toBe(1);
      expect(gkB.length).toBe(1);

      // Check Defenders balance
      const defA = [...result.teamA.starters, ...result.teamA.bench].filter((p) => ["DEFENDER", "LEFT_BACK", "RIGHT_BACK"].includes(p.position));
      const defB = [...result.teamB.starters, ...result.teamB.bench].filter((p) => ["DEFENDER", "LEFT_BACK", "RIGHT_BACK"].includes(p.position));
      expect(defA.length).toBe(2);
      expect(defB.length).toBe(2);

      // Check Midfielders balance
      const midA = [...result.teamA.starters, ...result.teamA.bench].filter((p) => ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"].includes(p.position));
      const midB = [...result.teamB.starters, ...result.teamB.bench].filter((p) => ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"].includes(p.position));
      expect(midA.length).toBe(2);
      expect(midB.length).toBe(2);

      // Check Forwards balance
      const atkA = [...result.teamA.starters, ...result.teamA.bench].filter((p) => ["FORWARD", "LEFT_WINGER", "RIGHT_WINGER"].includes(p.position));
      const atkB = [...result.teamB.starters, ...result.teamB.bench].filter((p) => ["FORWARD", "LEFT_WINGER", "RIGHT_WINGER"].includes(p.position));
      expect(atkA.length).toBe(2);
      expect(atkB.length).toBe(2);
    });
  });

  describe("buildMatchLineupSnapshot with teamSide", () => {
    it("preserves teamSide on saved selections for training lineups", () => {
      const snapshot = buildMatchLineupSnapshot({
        matchId: "match-training-1",
        confirmedPlayers: [
          {
            playerId: "p1",
            playerName: "Carlos Silva",
            position: "GOALKEEPER",
            shirtNumber: 1,
            createdAt: new Date(),
            status: "ACTIVE",
            rsvpStatus: "CONFIRMED",
          },
          {
            playerId: "p2",
            playerName: "Eduardo Santos",
            position: "FORWARD",
            shirtNumber: 9,
            createdAt: new Date(),
            status: "ACTIVE",
            rsvpStatus: "CONFIRMED",
          },
        ],
        positionLimits: [],
        savedSelections: [
          {
            role: "STARTER",
            teamSide: "A",
            sortOrder: 0,
            fieldX: 50,
            fieldY: 15,
            updatedAt: new Date(),
            player: { id: "p1", name: "Carlos Silva", position: "GOALKEEPER" },
          },
          {
            role: "STARTER",
            teamSide: "B",
            sortOrder: 1,
            fieldX: 50,
            fieldY: 85,
            updatedAt: new Date(),
            player: { id: "p2", name: "Eduardo Santos", position: "FORWARD" },
          },
        ],
      });

      expect(snapshot.lineup.starters.length).toBe(2);
      expect((snapshot.lineup.starters[0] as any).teamSide).toBe("A");
      expect((snapshot.lineup.starters[1] as any).teamSide).toBe("B");
    });
  });
});
