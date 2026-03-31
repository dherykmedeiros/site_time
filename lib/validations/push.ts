import { z } from "zod";

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url("Endpoint inválido"),
  keys: z.object({
    p256dh: z.string().min(8, "Chave p256dh inválida"),
    auth: z.string().min(8, "Chave auth inválida"),
  }),
});

export const pushSendSchema = z.object({
  userId: z.string().min(1, "Usuário obrigatório"),
  title: z.string().min(1, "Título obrigatório").max(80),
  body: z.string().min(1, "Mensagem obrigatória").max(240),
  url: z.string().min(1).max(300).optional(),
  tag: z.string().max(50).optional(),
});

export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>;
export type PushSendInput = z.infer<typeof pushSendSchema>;
