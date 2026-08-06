import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "USER_ROLE_CHANGED"
  | "USER_PROMOTED"
  | "USER_DEMOTED"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED"
  | "FINE_CREATED"
  | "FINE_CANCELLED"
  | "FINE_PAID"
  | "MATCH_CREATED"
  | "MATCH_UPDATED"
  | "MATCH_DELETED"
  | "FRIENDLY_APPROVED"
  | "FRIENDLY_REJECTED"
  | "TEAM_SETTINGS_UPDATED"
  | "PASSWORD_CHANGED";

export interface LogAuditOptions {
  teamId?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  action: AuditAction | string;
  targetEntity: string;
  targetId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
}

export type ActivityVisibility = "ALL" | "ADMIN_ONLY" | "STAFF_ONLY";

export interface LogActivityOptions {
  teamId: string;
  userId?: string | null;
  type: string;
  description: string;
  metadata?: Record<string, unknown> | null;
  visibility?: ActivityVisibility;
}

/**
 * Registra uma entrada na tabela de auditoria (AuditLog) para ações administrativas sensíveis.
 */
export async function logAuditEvent(options: LogAuditOptions): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        teamId: options.teamId || null,
        userId: options.userId || null,
        userEmail: options.userEmail || null,
        action: options.action,
        targetEntity: options.targetEntity,
        targetId: options.targetId || null,
        details: options.details ? (options.details as any) : undefined,
        ipAddress: options.ipAddress || null,
      },
    });
  } catch (err) {
    console.error("Falha ao registrar log de auditoria:", err);
  }
}

/**
 * Registra um evento na timeline de atividades do time (ActivityEvent).
 */
export async function logActivityEvent(options: LogActivityOptions): Promise<void> {
  try {
    await prisma.activityEvent.create({
      data: {
        teamId: options.teamId,
        userId: options.userId || null,
        type: options.type,
        description: options.description,
        metadata: options.metadata ? (options.metadata as any) : undefined,
        visibility: options.visibility || "ALL",
      },
    });
  } catch (err) {
    console.error("Falha ao registrar evento de atividade:", err);
  }
}
