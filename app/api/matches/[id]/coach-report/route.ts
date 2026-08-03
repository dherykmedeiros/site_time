import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";
import { z } from "zod";
import { trackOperationalEvent } from "@/lib/telemetry";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const coachReportSchema = z.object({
  coachPlayerId: z.string().nullable().optional(),
  summary: z.string().optional().nullable(),
  evaluations: z.array(
    z.object({
      playerId: z.string().optional().nullable(),
      guestPlayerId: z.string().optional().nullable(),
      rating: z.number().min(1).max(10),
      feedback: z.string().optional().nullable(),
    })
  ).optional().default([]),
});

// GET /api/matches/:id/coach-report — Obter relatório do treinador e avaliações dos atletas
export const GET = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { id: matchId } = await params;

  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId },
    include: {
      coachPlayer: {
        select: {
          id: true,
          name: true,
          fullName: true,
          photoUrl: true,
          position: true,
          shirtNumber: true,
        },
      },
      coachReport: {
        include: {
          coachPlayer: {
            select: {
              id: true,
              name: true,
              fullName: true,
              photoUrl: true,
              position: true,
              shirtNumber: true,
            },
          },
          evaluations: {
            include: {
              player: {
                select: {
                  id: true,
                  name: true,
                  fullName: true,
                  photoUrl: true,
                  position: true,
                  shirtNumber: true,
                },
              },
              guestPlayer: {
                select: {
                  id: true,
                  name: true,
                  shirtNumber: true,
                  position: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada", code: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({
    matchId: match.id,
    coachPlayerId: match.coachPlayerId || match.coachReport?.coachPlayerId || null,
    coachPlayer: match.coachPlayer || match.coachReport?.coachPlayer || null,
    summary: match.coachReport?.summary || "",
    evaluations: match.coachReport?.evaluations.map((e) => ({
      id: e.id,
      playerId: e.playerId,
      guestPlayerId: e.guestPlayerId,
      playerName: e.player?.name ?? e.guestPlayer?.name ?? "Atleta",
      playerPhoto: e.player?.photoUrl ?? null,
      shirtNumber: e.player?.shirtNumber ?? e.guestPlayer?.shirtNumber ?? 0,
      position: e.player?.position ?? e.guestPlayer?.position ?? "UNKNOWN",
      rating: e.rating,
      feedback: e.feedback || "",
    })) || [],
    updatedAt: match.coachReport?.updatedAt.toISOString() ?? null,
  });
});

// POST /api/matches/:id/coach-report — Salvar/atualizar relatório do treinador e avaliações
export const POST = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { id: matchId } = await params;

  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId },
    select: { id: true, coachPlayerId: true },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada", code: "NOT_FOUND" }, { status: 404 });
  }

  const isCoachOrAdmin = session.user.role === "ADMIN" || session.user.role === "COACH";
  const isDesignatedCoach = session.user.playerId && match.coachPlayerId === session.user.playerId;

  if (!isCoachOrAdmin && !isDesignatedCoach) {
    return NextResponse.json(
      { error: "Apenas o treinador da partida ou administradores podem emitir o relatório" },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido", code: "VALIDATION_ERROR" }, { status: 400 });
  }

  const parsed = coachReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { coachPlayerId, summary, evaluations } = parsed.data;

  // 1. Update designated coach on Match model if supplied
  if (coachPlayerId !== undefined) {
    await prisma.match.update({
      where: { id: matchId },
      data: { coachPlayerId: coachPlayerId || null },
    });
  }

  // 2. Upsert MatchCoachReport
  const report = await prisma.matchCoachReport.upsert({
    where: { matchId },
    update: {
      coachPlayerId: coachPlayerId !== undefined ? (coachPlayerId || null) : match.coachPlayerId,
      summary: summary ?? "",
    },
    create: {
      matchId,
      coachPlayerId: coachPlayerId || match.coachPlayerId || null,
      summary: summary ?? "",
    },
  });

  // 3. Process individual player evaluations
  for (const ev of evaluations) {
    if (ev.playerId) {
      await prisma.matchCoachEvaluation.upsert({
        where: {
          reportId_playerId: {
            reportId: report.id,
            playerId: ev.playerId,
          },
        },
        update: {
          rating: ev.rating,
          feedback: ev.feedback ?? "",
        },
        create: {
          reportId: report.id,
          playerId: ev.playerId,
          rating: ev.rating,
          feedback: ev.feedback ?? "",
        },
      });
    } else if (ev.guestPlayerId) {
      await prisma.matchCoachEvaluation.upsert({
        where: {
          reportId_guestPlayerId: {
            reportId: report.id,
            guestPlayerId: ev.guestPlayerId,
          },
        },
        update: {
          rating: ev.rating,
          feedback: ev.feedback ?? "",
        },
        create: {
          reportId: report.id,
          guestPlayerId: ev.guestPlayerId,
          rating: ev.rating,
          feedback: ev.feedback ?? "",
        },
      });
    }
  }

  trackOperationalEvent("match_coach_report_saved", {
    matchId,
    reportId: report.id,
    coachPlayerId: coachPlayerId || match.coachPlayerId,
    evaluationsCount: evaluations.length,
    userId: session.user.id,
  });

  return NextResponse.json({
    message: "Relatório do treinador salvo com sucesso",
    reportId: report.id,
  });
});
