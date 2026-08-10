import { describe, it, expect } from "vitest";
import { formatPlayerPosition } from "@/lib/player-positions";

describe("Formatacão e Validações de Posição do Jogador", () => {
  it("deve formatar posições em português corretamente sem expor enums brutos", () => {
    expect(formatPlayerPosition("RIGHT_WINGBACK")).toBe("Ala direito");
    expect(formatPlayerPosition("LEFT_WINGBACK")).toBe("Ala esquerdo");
    expect(formatPlayerPosition("RIGHT_BACK")).toBe("Lateral direito");
    expect(formatPlayerPosition("LEFT_BACK")).toBe("Lateral esquerdo");
    expect(formatPlayerPosition("DEFENSIVE_MIDFIELDER")).toBe("Volante");
    expect(formatPlayerPosition("MIDFIELDER")).toBe("Meio-campista");
    expect(formatPlayerPosition("FORWARD")).toBe("Atacante");
    expect(formatPlayerPosition("GOALKEEPER")).toBe("Goleiro");
    expect(formatPlayerPosition("DEFENDER")).toBe("Zagueiro");
    expect(formatPlayerPosition("RIGHT_WINGER")).toBe("Ponta direita");
    expect(formatPlayerPosition("LEFT_WINGER")).toBe("Ponta esquerda");
  });

  it("deve formatar posições abreviadas em português", () => {
    expect(formatPlayerPosition("RIGHT_WINGBACK", true)).toBe("AD");
    expect(formatPlayerPosition("LEFT_WINGBACK", true)).toBe("AE");
    expect(formatPlayerPosition("RIGHT_BACK", true)).toBe("LD");
    expect(formatPlayerPosition("LEFT_BACK", true)).toBe("LE");
    expect(formatPlayerPosition("DEFENSIVE_MIDFIELDER", true)).toBe("VOL");
    expect(formatPlayerPosition("GOALKEEPER", true)).toBe("GOL");
  });

  it("deve avaliar disponibilidade de vaga quando o atleta possui duas posições", () => {
    // Função auxiliar que replica a regra implementada de dupla posição em partidas com limite
    function evaluatePositionAvailability(
      player: { position: string; secondaryPosition?: string | null },
      matchLimits: Array<{ position: string; maxPlayers: number }>,
      confirmedRsvps: Array<{ position: string; secondaryPosition?: string | null }>
    ) {
      const limitsMap = new Map<string, number>();
      for (const l of matchLimits) {
        limitsMap.set(l.position, l.maxPlayers);
      }

      const positionCounts: Record<string, number> = {};

      for (const rsvp of confirmedRsvps) {
        const primary = rsvp.position;
        const secondary = rsvp.secondaryPosition;

        const primaryLimit = limitsMap.get(primary);
        const currentPrimaryCount = positionCounts[primary] || 0;

        if (primaryLimit === undefined || currentPrimaryCount < primaryLimit) {
          positionCounts[primary] = currentPrimaryCount + 1;
        } else if (secondary) {
          const secondaryLimit = limitsMap.get(secondary);
          const currentSecondaryCount = positionCounts[secondary] || 0;
          if (secondaryLimit === undefined || currentSecondaryCount < secondaryLimit) {
            positionCounts[secondary] = currentSecondaryCount + 1;
          } else {
            positionCounts[primary] = currentPrimaryCount + 1;
          }
        } else {
          positionCounts[primary] = currentPrimaryCount + 1;
        }
      }

      const primaryPos = player.position;
      const secondaryPos = player.secondaryPosition;

      const primaryLimit = limitsMap.get(primaryPos);
      const primaryAvailable = primaryLimit === undefined || (positionCounts[primaryPos] || 0) < primaryLimit;

      let secondaryAvailable = false;
      if (secondaryPos && secondaryPos !== primaryPos) {
        const secondaryLimit = limitsMap.get(secondaryPos);
        secondaryAvailable = secondaryLimit === undefined || (positionCounts[secondaryPos] || 0) < secondaryLimit;
      }

      return {
        allowed: primaryAvailable || secondaryAvailable,
        primaryAvailable,
        secondaryAvailable,
      };
    }

    const limits = [
      { position: "RIGHT_WINGBACK", maxPlayers: 2 },
      { position: "DEFENSIVE_MIDFIELDER", maxPlayers: 3 },
    ];

    const confirmed = [
      { position: "RIGHT_WINGBACK" },
      { position: "RIGHT_WINGBACK" },
    ];

    // Jogador com 2 posições: RIGHT_WINGBACK (lotada) e DEFENSIVE_MIDFIELDER (com vaga)
    const result = evaluatePositionAvailability(
      { position: "RIGHT_WINGBACK", secondaryPosition: "DEFENSIVE_MIDFIELDER" },
      limits,
      confirmed
    );

    expect(result.allowed).toBe(true);
    expect(result.primaryAvailable).toBe(false);
    expect(result.secondaryAvailable).toBe(true);

    // Quando ambas estão lotadas
    const confirmedBothFull = [
      { position: "RIGHT_WINGBACK" },
      { position: "RIGHT_WINGBACK" },
      { position: "DEFENSIVE_MIDFIELDER" },
      { position: "DEFENSIVE_MIDFIELDER" },
      { position: "DEFENSIVE_MIDFIELDER" },
    ];

    const resultBothFull = evaluatePositionAvailability(
      { position: "RIGHT_WINGBACK", secondaryPosition: "DEFENSIVE_MIDFIELDER" },
      limits,
      confirmedBothFull
    );

    expect(resultBothFull.allowed).toBe(false);
  });
});
