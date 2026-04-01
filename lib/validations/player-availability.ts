import { z } from "zod";

export const availabilityFrequencyValues = ["WEEKLY", "BIWEEKLY", "MONTHLY_OPTIONAL"] as const;
export const availabilityLevelValues = ["AVAILABLE", "PREFERABLE", "UNAVAILABLE"] as const;

const playerAvailabilityRuleSchema = z
  .object({
    dayOfWeek: z.number().int("Dia da semana deve ser inteiro").min(0, "Dia inválido").max(6, "Dia inválido"),
    startMinutes: z.number().int("Horário inicial inválido").min(0, "Horário inicial inválido").max(1439, "Horário inicial inválido"),
    endMinutes: z.number().int("Horário final inválido").min(1, "Horário final inválido").max(1440, "Horário final inválido"),
    frequency: z.enum(availabilityFrequencyValues, {
      message: "Frequência inválida",
    }),
    availability: z.enum(availabilityLevelValues, {
      message: "Disponibilidade inválida",
    }),
    notes: z.string().trim().max(120, "Observação deve ter no máximo 120 caracteres").optional(),
  })
  .strict()
  .refine((value) => value.startMinutes < value.endMinutes, {
    message: "Horário inicial deve ser menor que o final",
    path: ["startMinutes"],
  });

export const updateOwnAvailabilitySchema = z
  .object({
    rules: z.array(playerAvailabilityRuleSchema).max(10, "Máximo de 10 regras"),
  })
  .strict();

export type AvailabilityFrequencyValue = (typeof availabilityFrequencyValues)[number];
export type AvailabilityLevelValue = (typeof availabilityLevelValues)[number];
export type PlayerAvailabilityRuleInput = z.infer<typeof playerAvailabilityRuleSchema>;
export type UpdateOwnAvailabilityInput = z.infer<typeof updateOwnAvailabilitySchema>;