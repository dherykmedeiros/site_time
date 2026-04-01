export const defaultBordereauChecklist = [
  "Uniforme confirmado",
  "Bola disponivel",
  "Coletes disponiveis",
  "Campo confirmado",
  "Arbitragem confirmada",
  "Adversario confirmado",
] as const;

export function buildSuggestedSharePerPresent(totalExpense: number, presentCount: number) {
  if (presentCount <= 0) {
    return null;
  }

  return Number((totalExpense / presentCount).toFixed(2));
}