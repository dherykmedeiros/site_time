import { prisma } from "@/lib/prisma";

export const NOTIFICATION_CATEGORIES = {
  MATCHES: "MATCHES",
  FINANCES: "FINANCES",
  DISCIPLINARY: "DISCIPLINARY",
  COMMUNICATION: "COMMUNICATION",
};

const typeToCategoryMap: Record<string, string> = {
  MATCH_CREATED: "MATCHES",
  RSVP_REMINDER: "MATCHES",
  PAYMENT_DUE: "FINANCES",
  PAYMENT: "FINANCES",
  FINE_APPLIED: "DISCIPLINARY",
  MESSAGE_PINNED: "COMMUNICATION",
  NOTICE: "COMMUNICATION",
  RECAP_READY: "MATCHES",
};

export interface CreateNotificationParams {
  userId: string;
  teamId?: string | null;
  type: string;
  title: string;
  body: string;
  link?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: any;
}

/**
 * Envia uma notificação para um único usuário, verificando antes as suas preferências
 * de notificação para a categoria correspondente.
 */
export async function sendNotification({
  userId,
  teamId,
  type,
  title,
  body,
  link,
  entityType,
  entityId,
  metadata,
}: CreateNotificationParams) {
  try {
    const category = typeToCategoryMap[type] || "COMMUNICATION";

    // Verifica se o usuário desabilitou esta categoria de notificação
    const preference = await prisma.notificationPreference.findUnique({
      where: {
        userId_category: {
          userId,
          category,
        },
      },
    });

    if (preference && !preference.enabled) {
      // Usuário optou por silenciar notificações desta categoria
      return null;
    }

    return await prisma.notification.create({
      data: {
        userId,
        teamId: teamId || null,
        type,
        title,
        body,
        link: link || null,
        category,
        entityType: entityType || null,
        entityId: entityId || null,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      },
    });
  } catch (err) {
    console.error(`Erro ao enviar notificação para usuário ${userId}:`, err);
    return null;
  }
}

/**
 * Envia notificações para um lote de usuários, validando individualmente as preferências de cada um.
 */
export async function sendNotificationToUsers(
  userIds: string[],
  params: Omit<CreateNotificationParams, "userId">
) {
  try {
    const promises = userIds.map((userId) =>
      sendNotification({
        userId,
        ...params,
      })
    );
    return await Promise.all(promises);
  } catch (err) {
    console.error("Erro no lote de envio de notificações:", err);
    return [];
  }
}
