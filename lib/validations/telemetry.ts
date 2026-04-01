import { z } from "zod";

export const recapCtaTelemetrySchema = z.object({
  event: z.literal("recap_cta_clicked"),
  context: z.enum(["public_match", "public_player", "dashboard_match_postgame"]),
  ctaType: z.enum(["open_card", "copy_link", "whatsapp_share"]),
  entityType: z.enum(["match", "player"]),
  entityId: z.string().min(1).max(64),
}).strict();

export type RecapCtaTelemetryInput = z.infer<typeof recapCtaTelemetrySchema>;

export const matchShareLinkTelemetrySchema = z.object({
  event: z.literal("match_share_link_copied"),
  context: z.literal("dashboard_match_general"),
  entityType: z.literal("match"),
  entityId: z.string().min(1).max(64),
}).strict();

export type MatchShareLinkTelemetryInput = z.infer<typeof matchShareLinkTelemetrySchema>;

export const telemetryEventSchema = z.union([
  recapCtaTelemetrySchema,
  matchShareLinkTelemetrySchema,
]);

export type TelemetryEventInput = z.infer<typeof telemetryEventSchema>;
