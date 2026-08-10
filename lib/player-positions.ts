export const playerPositions = [
  "GOALKEEPER",
  "DEFENDER",
  "LEFT_BACK",
  "RIGHT_BACK",
  "LEFT_WINGBACK",
  "RIGHT_WINGBACK",
  "MIDFIELDER",
  "DEFENSIVE_MIDFIELDER",
  "FORWARD",
  "LEFT_WINGER",
  "RIGHT_WINGER",
] as const;

export const playerPositionLabels: Record<(typeof playerPositions)[number], string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  LEFT_BACK: "Lateral esquerdo",
  RIGHT_BACK: "Lateral direito",
  LEFT_WINGBACK: "Ala esquerdo",
  RIGHT_WINGBACK: "Ala direito",
  MIDFIELDER: "Meio-campista",
  DEFENSIVE_MIDFIELDER: "Volante",
  FORWARD: "Atacante",
  LEFT_WINGER: "Ponta esquerda",
  RIGHT_WINGER: "Ponta direita",
};

export const playerPositionShortLabels: Record<(typeof playerPositions)[number], string> = {
  GOALKEEPER: "GOL",
  DEFENDER: "ZAG",
  LEFT_BACK: "LE",
  RIGHT_BACK: "LD",
  LEFT_WINGBACK: "AE",
  RIGHT_WINGBACK: "AD",
  MIDFIELDER: "MEI",
  DEFENSIVE_MIDFIELDER: "VOL",
  FORWARD: "ATA",
  LEFT_WINGER: "PE",
  RIGHT_WINGER: "PD",
};

export function formatPlayerPosition(pos?: string | null, short = false): string {
  if (!pos) return "";
  if (short) {
    if (pos in playerPositionShortLabels) {
      return playerPositionShortLabels[pos as keyof typeof playerPositionShortLabels];
    }
  } else {
    if (pos in playerPositionLabels) {
      return playerPositionLabels[pos as keyof typeof playerPositionLabels];
    }
  }

  const fallbackMap: Record<string, string> = {
    LEFT_WINGBACK: short ? "AE" : "Ala esquerdo",
    RIGHT_WINGBACK: short ? "AD" : "Ala direito",
    LEFT_BACK: short ? "LE" : "Lateral esquerdo",
    RIGHT_BACK: short ? "LD" : "Lateral direito",
    DEFENSIVE_MIDFIELDER: short ? "VOL" : "Volante",
    LEFT_WINGER: short ? "PE" : "Ponta esquerda",
    RIGHT_WINGER: short ? "PD" : "Ponta direita",
  };

  if (fallbackMap[pos]) return fallbackMap[pos];

  return pos
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
