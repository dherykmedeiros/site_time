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
  summary: z.string().optional().nullable(),
  formation: z.string().optional().nullable(),
  starterPlayerIds: z.array(z.string()).optional().default([]),
  substitutions: z.array(
    z.object({
      playerOutId: z.string(),
      playerInId: z.string(),
      minute: z.string().optional().default(""),
      reason: z.string().optional().default(""),
    })
  ).optional().default([]),
  startingStrategy: z.string().optional().nullable(),
  substitutionsNotes: z.string().optional().nullable(),
  strengths: z.string().optional().nullable(),
  improvements: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("PUBLISHED"),
  evaluations: z.array(
    z.object({
      playerId: z.string().optional().nullable(),
      guestPlayerId: z.string().optional().nullable(),
      rating: z.number().min(1).max(10),
      feedback: z.string().optional().nullable(),
    })
  ).optional().default([]),
});

// GET /api/matches/:id/coach-report — Obter relatório do treinador e atletas confirmados
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
      rsvps: {
        where: {
          status: "CONFIRMED",
          player: { status: "ACTIVE" },
        },
        include: {
          player: {
            select: {
              id: true,
              name: true,
              fullName: true,
              shirtNumber: true,
              position: true,
              photoUrl: true,
            },
          },
        },
        orderBy: {
          player: { shirtNumber: "asc" },
        },
      },
      guestPlayers: true,
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

  // Strict View Permission Check:
  const isAdminOrCoachRole = session.user.role === "ADMIN" || session.user.role === "COACH";
  const isDesignatedCoach = session.user.playerId && match.coachPlayerId === session.user.playerId;

  if (!isAdminOrCoachRole && !isDesignatedCoach) {
    return NextResponse.json(
      {
        error: "Acesso restrito ao relatório do treinador. Apenas a comissão técnica, administradores ou o treinador da partida podem visualizar.",
        code: "COACH_REPORT_RESTRICTED",
        canView: false,
      },
      { status: 403 }
    );
  }

  // Strict Edit Permission Check:
  const canEdit = isDesignatedCoach || (session.user.role === "ADMIN" && !match.coachPlayerId);

  // Build list of ONLY confirmed players and guests for starter selection
  const confirmedPlayers = [
    ...match.rsvps.map((r) => ({
      id: r.player.id,
      playerId: r.player.id,
      guestPlayerId: null,
      name: r.player.name,
      fullName: r.player.fullName,
      shirtNumber: r.player.shirtNumber,
      position: r.player.position,
      photoUrl: r.player.photoUrl,
    })),
    ...match.guestPlayers.map((g) => ({
      id: g.id,
      playerId: null,
      guestPlayerId: g.id,
      name: `${g.name} (Convidado)`,
      fullName: g.name,
      shirtNumber: g.shirtNumber || 0,
      position: g.position || "UNKNOWN",
      photoUrl: null,
    })),
  ];

  return NextResponse.json({
    matchId: match.id,
    coachPlayerId: match.coachPlayerId || match.coachReport?.coachPlayerId || null,
    coachPlayer: match.coachPlayer || match.coachReport?.coachPlayer || null,
    summary: match.coachReport?.summary || "",
    formation: match.coachReport?.formation || "4-3-3 (Ofensivo)",
    starterPlayerIds: (match.coachReport?.starterPlayerIds as string[]) || [],
    substitutions: (match.coachReport?.substitutions as any[]) || [],
    startingStrategy: match.coachReport?.startingStrategy || "",
    substitutionsNotes: match.coachReport?.substitutionsNotes || "",
    strengths: match.coachReport?.strengths || "",
    improvements: match.coachReport?.improvements || "",
    status: match.coachReport?.status || "DRAFT",
    confirmedPlayers,
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
    canView: true,
    canEdit,
    updatedAt: match.coachReport?.updatedAt.toISOString() ?? null,
  });
});

// POST /api/matches/:id/coach-report — Salvar/atualizar relatório tático (Apenas Treinador Designado)
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

  // Strict Edit Check:
  const isDesignatedCoach = session.user.playerId && match.coachPlayerId === session.user.playerId;
  const isAdminWithoutCoach = session.user.role === "ADMIN" && !match.coachPlayerId;

  if (!isDesignatedCoach && !isAdminWithoutCoach) {
    return NextResponse.json(
      { error: "Apenas o atleta definido como treinador desta partida pode editar o relatório." },
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

  const { summary, formation, starterPlayerIds, substitutions, startingStrategy, substitutionsNotes, strengths, improvements, status, evaluations } = parsed.data;

  // Upsert MatchCoachReport
  const report = await prisma.matchCoachReport.upsert({
    where: { matchId },
    update: {
      coachPlayerId: match.coachPlayerId,
      summary: summary ?? "",
      formation: formation ?? "4-3-3 (Ofensivo)",
      starterPlayerIds: starterPlayerIds ?? [],
      substitutions: substitutions ?? [],
      startingStrategy: startingStrategy ?? "",
      substitutionsNotes: substitutionsNotes ?? "",
      strengths: strengths ?? "",
      improvements: improvements ?? "",
      status: status ?? "PUBLISHED",
    },
    create: {
      matchId,
      coachPlayerId: match.coachPlayerId || null,
      summary: summary ?? "",
      formation: formation ?? "4-3-3 (Ofensivo)",
      starterPlayerIds: starterPlayerIds ?? [],
      substitutions: substitutions ?? [],
      startingStrategy: startingStrategy ?? "",
      substitutionsNotes: substitutionsNotes ?? "",
      strengths: strengths ?? "",
      improvements: improvements ?? "",
      status: status ?? "PUBLISHED",
    },
  });

  // Process individual player evaluations
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
    coachPlayerId: match.coachPlayerId,
    evaluationsCount: evaluations.length,
    userId: session.user.id,
  });

  return NextResponse.json({
    message: "Relatório do treinador salvo com sucesso",
    reportId: report.id,
  });
});
