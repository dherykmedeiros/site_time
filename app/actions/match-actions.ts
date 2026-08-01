"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  createMatchSchema,
  updateRsvpSchema,
  createMatchLiveEventSchema,
} from "@/lib/validations/match-actions";
import { calculateNewScore } from "@/lib/match-live-service";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity-logger";

/**
 * Action para criação de nova partida.
 */
export async function createMatchAction(input: unknown) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Não autorizado");
    if (session.user.role !== "ADMIN") throw new Error("Acesso restrito");

    const parsed = createMatchSchema.parse(input);

    if (session.user.teamId !== parsed.teamId) throw new Error("Acesso negado");

    const match = await prisma.match.create({
      data: {
        teamId: parsed.teamId,
        opponent: parsed.opponent,
        opponentBadgeUrl: parsed.opponentBadgeUrl,
        venue: parsed.venue,
        date: parsed.date,
        type: parsed.type,
        isHome: parsed.isHome,
        hasCharge: parsed.hasCharge,
        chargeAmount: parsed.chargeAmount ? parsed.chargeAmount : null,
        pixKey: parsed.pixKey,
        seasonId: parsed.seasonId,
        matchLive: {
          create: {
            liveStatus: "NOT_STARTED",
            homeScore: 0,
            awayScore: 0,
          },
        },
      },
      include: {
        matchLive: true,
      },
    });

    await logActivity(
      parsed.teamId,
      "MATCH_CREATED",
      `Cadastrou uma nova partida contra ${parsed.opponent} (${parsed.type === "CHAMPIONSHIP" ? "Campeonato" : "Amistoso"})`,
      session.user.id,
      { matchId: match.id }
    );

    revalidatePath(`/dashboard/matches`);
    revalidatePath(`/matches/${match.id}/live`);

    return { success: true, data: match };
  } catch (error: any) {
    console.error("Erro em createMatchAction:", error);
    return {
      success: false,
      error: error.message || "Falha ao criar partida",
    };
  }
}

/**
 * Action para responder ou atualizar presença (RSVP).
 */
export async function updateRSVPAction(input: unknown) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Não autorizado");

    const parsed = updateRsvpSchema.parse(input);

    const isOwnRsvp = session.user.playerId === parsed.playerId;
    const isStaff = session.user.role === "ADMIN" || session.user.role === "COACH";
    if (!isOwnRsvp && !isStaff) {
      throw new Error("Acesso restrito");
    }

    const existingRsvp = await prisma.rSVP.findUnique({
      where: {
        playerId_matchId: {
          playerId: parsed.playerId,
          matchId: parsed.matchId,
        },
      },
    });

    const rsvp = await prisma.rSVP.upsert({
      where: {
        playerId_matchId: {
          playerId: parsed.playerId,
          matchId: parsed.matchId,
        },
      },
      create: {
        matchId: parsed.matchId,
        playerId: parsed.playerId,
        status: parsed.status,
        respondedAt: new Date(),
      },
      update: {
        status: parsed.status,
        respondedAt: new Date(),
      },
    });

    // Registrar Log de auditoria do RSVP
    await prisma.rSVPStatusLog.create({
      data: {
        rsvpId: rsvp.id,
        playerId: parsed.playerId,
        matchId: parsed.matchId,
        oldStatus: existingRsvp?.status || null,
        newStatus: parsed.status,
      },
    });

    revalidatePath(`/matches/${parsed.matchId}/live`);
    revalidatePath(`/dashboard/matches/${parsed.matchId}`);

    return { success: true, data: rsvp };
  } catch (error: any) {
    console.error("Erro em updateRSVPAction:", error);
    return {
      success: false,
      error: error.message || "Falha ao atualizar confirmação de presença (RSVP)",
    };
  }
}

/**
 * Action para registrar novos eventos ao vivo da partida (MatchLiveEvent) e atualizar placar.
 */
export async function createMatchLiveEventAction(input: unknown) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Não autorizado");
    if (session.user.role !== "ADMIN" && session.user.role !== "COACH") {
      throw new Error("Acesso restrito");
    }

    const parsed = createMatchLiveEventSchema.parse(input);

    const matchLive = await prisma.matchLive.findUnique({
      where: { id: parsed.matchLiveId },
      include: { match: true },
    });

    if (!matchLive) {
      throw new Error("Registro de Placar ao Vivo não encontrado");
    }

    if (matchLive.match.teamId !== session.user.teamId) {
      throw new Error("Acesso negado");
    }

    let updatedHomeScore = matchLive.homeScore;
    let updatedAwayScore = matchLive.awayScore;

    // Se for gol, recalcula o placar
    if (parsed.type === "GOAL") {
      const newScores = calculateNewScore(
        { homeScore: matchLive.homeScore, awayScore: matchLive.awayScore },
        matchLive.match.isHome,
        parsed.teamIsScorer
      );
      updatedHomeScore = newScores.homeScore;
      updatedAwayScore = newScores.awayScore;

      // Atualiza a tabela MatchLive e a tabela Match
      await prisma.matchLive.update({
        where: { id: parsed.matchLiveId },
        data: {
          homeScore: updatedHomeScore,
          awayScore: updatedAwayScore,
        },
      });

      await prisma.match.update({
        where: { id: parsed.matchId },
        data: {
          homeScore: updatedHomeScore,
          awayScore: updatedAwayScore,
        },
      });
    }

    // Criar o evento ao vivo
    const liveEvent = await prisma.matchLiveEvent.create({
      data: {
        matchLiveId: parsed.matchLiveId,
        type: parsed.type,
        minute: parsed.minute,
        half: parsed.half,
        playerId: parsed.playerId || null,
        guestPlayerId: parsed.guestPlayerId || null,
        description: parsed.description || null,
      },
      include: {
        player: true,
        guestPlayer: true,
      },
    });

    // Se houver jogador e for estatística válida (Gol, Assistência, Cartão), incrementa no MatchStats
    if (parsed.playerId) {
      const stats = await prisma.matchStats.findFirst({
        where: {
          matchId: parsed.matchId,
          playerId: parsed.playerId,
        },
      });

      if (stats) {
        await prisma.matchStats.update({
          where: { id: stats.id },
          data: {
            goals: parsed.type === "GOAL" && parsed.teamIsScorer ? { increment: 1 } : undefined,
            assists: parsed.type === "ASSIST" ? { increment: 1 } : undefined,
            yellowCards: parsed.type === "YELLOW_CARD" ? { increment: 1 } : undefined,
            redCards: parsed.type === "RED_CARD" ? { increment: 1 } : undefined,
          },
        });
      } else {
        await prisma.matchStats.create({
          data: {
            matchId: parsed.matchId,
            playerId: parsed.playerId,
            goals: parsed.type === "GOAL" && parsed.teamIsScorer ? 1 : 0,
            assists: parsed.type === "ASSIST" ? 1 : 0,
            yellowCards: parsed.type === "YELLOW_CARD" ? 1 : 0,
            redCards: parsed.type === "RED_CARD" ? 1 : 0,
          },
        });
      }
    }

    revalidatePath(`/matches/${parsed.matchId}/live`);

    return {
      success: true,
      data: {
        event: liveEvent,
        homeScore: updatedHomeScore,
        awayScore: updatedAwayScore,
      },
    };
  } catch (error: any) {
    console.error("Erro em createMatchLiveEventAction:", error);
    return {
      success: false,
      error: error.message || "Falha ao registrar evento ao vivo",
    };
  }
}
