import { describe, it, expect } from "vitest";
import { calculateNewScore, processRsvpChange } from "../match-live-service";
import {
  createMatchSchema,
  updateRsvpSchema,
  createMatchLiveEventSchema,
} from "../validations/match-actions";

describe("Módulo de Gestão de Partidas, RSVP e Placar ao Vivo", () => {
  describe("Validação de Zod Schemas", () => {
    it("deve validar a criação de partida com dados corretos", () => {
      const input = {
        teamId: "team-123",
        opponent: "Rival FC",
        venue: "Arena Central",
        date: "2026-08-10T19:00:00.000Z",
        type: "FRIENDLY",
        isHome: true,
      };

      const result = createMatchSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.opponent).toBe("Rival FC");
        expect(result.data.date).toBeInstanceOf(Date);
      }
    });

    it("deve rejeitar criação de partida sem dados obrigatórios", () => {
      const input = {
        opponent: "",
        venue: "",
      };

      const result = createMatchSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("deve validar schema de atualização de RSVP", () => {
      const input = {
        matchId: "match-123",
        playerId: "player-456",
        status: "CONFIRMED",
      };

      const result = updateRsvpSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("deve validar inserção de evento ao vivo de Gol", () => {
      const input = {
        matchId: "match-123",
        matchLiveId: "live-789",
        type: "GOAL",
        minute: 15,
        half: 1,
        playerId: "player-456",
        teamIsScorer: true,
      };

      const result = createMatchLiveEventSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe("Regra de Negócio: Cálculo de Placar ao Vivo (Live Score)", () => {
    it("deve incrementar o placar do mandante quando o nosso time (mandante) faz um gol", () => {
      const initialScore = { homeScore: 0, awayScore: 0 };
      const newScore = calculateNewScore(initialScore, true, true);

      expect(newScore.homeScore).toBe(1);
      expect(newScore.awayScore).toBe(0);
    });

    it("deve incrementar o placar do visitante quando o adversário marca um gol contra nosso time (mandante)", () => {
      const initialScore = { homeScore: 1, awayScore: 0 };
      const newScore = calculateNewScore(initialScore, true, false);

      expect(newScore.homeScore).toBe(1);
      expect(newScore.awayScore).toBe(1);
    });

    it("deve incrementar o placar do visitante quando nosso time é o visitante e marca um gol", () => {
      const initialScore = { homeScore: 2, awayScore: 1 };
      const newScore = calculateNewScore(initialScore, false, true);

      expect(newScore.homeScore).toBe(2);
      expect(newScore.awayScore).toBe(2);
    });
  });

  describe("Regra de Negócio: Alteração de Presença (RSVP)", () => {
    it("deve identificar alteração de status de PENDING para CONFIRMED", () => {
      const result = processRsvpChange("PENDING", "CONFIRMED");
      expect(result.changed).toBe(true);
      expect(result.status).toBe("CONFIRMED");
    });

    it("não deve disparar alteração se o status de RSVP for o mesmo", () => {
      const result = processRsvpChange("CONFIRMED", "CONFIRMED");
      expect(result.changed).toBe(false);
      expect(result.status).toBe("CONFIRMED");
    });
  });
});
