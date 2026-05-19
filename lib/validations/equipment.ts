import { z } from "zod";

export const equipmentSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "O nome do equipamento deve ter no mínimo 2 caracteres")
      .max(100, "O nome do equipamento deve ter no máximo 100 caracteres"),
    category: z.enum(["UNIFORM", "SOCKS", "BALL", "OTHER"], {
      message: "Selecione uma categoria válida",
    }),
    totalQty: z.coerce
      .number()
      .int()
      .min(0, "A quantidade total não pode ser negativa"),
    availableQty: z.coerce
      .number()
      .int()
      .min(0, "A quantidade disponível não pode ser negativa"),
    damagedQty: z.coerce
      .number()
      .int()
      .min(0, "A quantidade de itens danificados não pode ser negativa"),
    lostQty: z.coerce
      .number()
      .int()
      .min(0, "A quantidade de itens perdidos não pode ser negativa"),
    status: z.enum(["NEW", "GOOD", "USED", "POOR"], {
      message: "Selecione um estado de conservação válido",
    }),
    location: z
      .string()
      .trim()
      .max(100, "O local de armazenamento deve ter no máximo 100 caracteres")
      .optional()
      .or(z.literal("")),
    notes: z
      .string()
      .trim()
      .max(500, "As observações devem ter no máximo 500 caracteres")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      return data.availableQty + data.damagedQty + data.lostQty === data.totalQty;
    },
    {
      message: "A soma de itens Disponíveis, Danificados e Perdidos deve ser igual à Quantidade Total.",
      path: ["totalQty"],
    }
  );

export type EquipmentInput = z.infer<typeof equipmentSchema>;
