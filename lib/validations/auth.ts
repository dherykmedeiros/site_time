import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(128, "Senha deve ter no máximo 128 caracteres"),
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  registrationCode: z
    .string()
    .min(6, "Código deve ter no mínimo 6 caracteres")
    .max(100, "Código deve ter no máximo 100 caracteres")
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("E-mail inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .max(128, "Senha deve ter no máximo 128 caracteres"),
});

export const registerFromInviteSchema = z.object({
  token: z.string().uuid("Token inválido"),
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(128, "Senha deve ter no máximo 128 caracteres"),
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterFromInviteInput = z.infer<typeof registerFromInviteSchema>;
