import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres"),
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("E-mail inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória"),
});

export const registerFromInviteSchema = z.object({
  token: z.string().uuid("Token inválido"),
  email: z
    .string()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres"),
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterFromInviteInput = z.infer<typeof registerFromInviteSchema>;
