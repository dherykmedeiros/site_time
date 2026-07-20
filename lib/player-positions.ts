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
