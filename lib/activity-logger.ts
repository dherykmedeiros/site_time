import { prisma } from "@/lib/prisma";

/**
 * Registra um evento de atividade na linha do tempo do time.
 * Executa de forma segura capturando quaisquer erros para não impactar o fluxo principal do usuário.
 * 
 * @param teamId ID do time
 * @param type Tipo do evento (ex: MATCH_CREATED, PLAYER_ADDED, etc.)
 * @param description Descrição textual legível do evento
 * @param userId ID do usuário que realizou a ação (opcional)
 * @param metadata Metadados adicionais em formato JSON (opcional)
 */
export async function logActivity(
  teamId: string,
  type: string,
  description: string,
  userId?: string | null,
  metadata?: any
) {
  try {
    await prisma.activityEvent.create({
      data: {
        teamId,
        type,
        description,
        userId: userId || null,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      },
    });
  } catch (err) {
    console.error("Erro ao registrar atividade:", err);
  }
}
