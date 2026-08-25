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

  summaryB: z.string().optional().nullable(),
  formationB: z.string().optional().nullable(),
  starterPlayerIdsB: z.array(z.string()).optional().default([]),
  substitutionsB: z.array(
    z.object({
      playerOutId: z.string(),
      playerInId: z.string(),
      minute: z.string().optional().default(""),
      reason: z.string().optional().default(""),
    })
  ).optional().default([]),
  startingStrategyB: z.string().optional().nullable(),
  substitutionsNotesB: z.string().optional().nullable(),
  strengthsB: z.string().optional().nullable(),
  improvementsB: z.string().optional().nullable(),

  status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("PUBLISHED"),
  evaluations: z.array(
    z.object({
      playerId: z.string().optional().nullable(),
      guestPlayerId: z.string().optional().nullable(),
      teamSide: z.enum(["A", "B"]).optional().default("A"),
      rating: z.coerce.number().min(1).max(10).optional().default(5),
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
      coachPlayerB: {
        select: {
          id: true,
          name: true,
          fullName: true,
          photoUrl: true,
          position: true,
          shirtNumber: true,
        },
      },
      lineupSelections: {
        select: {
          playerId: true,
          guestPlayerId: true,
          teamSide: true,
          role: true,
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
          coachPlayerB: {
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
  const isDesignatedCoachA = Boolean(session.user.playerId && match.coachPlayerId === session.user.playerId);
  const isDesignatedCoachB = Boolean(session.user.playerId && match.coachPlayerBId === session.user.playerId);

  if (!isAdminOrCoachRole && !isDesignatedCoachA && !isDesignatedCoachB) {
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
  const canEditA = isAdminOrCoachRole || isDesignatedCoachA;
  const canEditB = isAdminOrCoachRole || isDesignatedCoachB;
  const canEdit = canEditA || canEditB;

  // Map lineup team sides
  const sideMap = new Map<string, string>();
  match.lineupSelections.forEach((sel) => {
    const key = sel.playerId || sel.guestPlayerId;
    if (key && sel.teamSide) sideMap.set(key, sel.teamSide);
  });

  // Build list of ONLY confirmed players and guests with teamSide
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
      teamSide: sideMap.get(r.player.id) || "A",
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
      teamSide: sideMap.get(g.id) || "B",
    })),
  ];

  return NextResponse.json({
    matchId: match.id,
    matchType: match.type,
    coachPlayerId: match.coachPlayerId || match.coachReport?.coachPlayerId || null,
    coachPlayer: match.coachPlayer || match.coachReport?.coachPlayer || null,
    coachPlayerBId: match.coachPlayerBId || match.coachReport?.coachPlayerBId || null,
    coachPlayerB: match.coachPlayerB || match.coachReport?.coachPlayerB || null,
    // Team A data
    summary: match.coachReport?.summary || "",
    formation: match.coachReport?.formation || "4-3-3 (Ofensivo)",
    starterPlayerIds: (match.coachReport?.starterPlayerIds as string[]) || [],
    substitutions: (match.coachReport?.substitutions as any[]) || [],
    startingStrategy: match.coachReport?.startingStrategy || "",
    substitutionsNotes: match.coachReport?.substitutionsNotes || "",
    strengths: match.coachReport?.strengths || "",
    improvements: match.coachReport?.improvements || "",
    // Team B data
    summaryB: match.coachReport?.summaryB || "",
    formationB: match.coachReport?.formationB || "4-3-3 (Ofensivo)",
    starterPlayerIdsB: (match.coachReport?.starterPlayerIdsB as string[]) || [],
    substitutionsB: (match.coachReport?.substitutionsB as any[]) || [],
    startingStrategyB: match.coachReport?.startingStrategyB || "",
    substitutionsNotesB: match.coachReport?.substitutionsNotesB || "",
    strengthsB: match.coachReport?.strengthsB || "",
    improvementsB: match.coachReport?.improvementsB || "",

    status: match.coachReport?.status || "DRAFT",
    confirmedPlayers,
    evaluations: match.coachReport?.evaluations.map((e) => ({
      id: e.id,
      playerId: e.playerId,
      guestPlayerId: e.guestPlayerId,
      teamSide: e.teamSide || sideMap.get(e.playerId || e.guestPlayerId || "") || "A",
      playerName: e.player?.name ?? e.guestPlayer?.name ?? "Atleta",
      playerPhoto: e.player?.photoUrl ?? null,
      shirtNumber: e.player?.shirtNumber ?? e.guestPlayer?.shirtNumber ?? 0,
      position: e.player?.position ?? e.guestPlayer?.position ?? "UNKNOWN",
      rating: e.rating,
      feedback: e.feedback || "",
    })) || [],
    canView: true,
    canEdit,
    canEditA,
    canEditB,
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
    select: { id: true, type: true, coachPlayerId: true, coachPlayerBId: true },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada", code: "NOT_FOUND" }, { status: 404 });
  }

  // Strict Edit Check:
  const isDesignatedCoachA = Boolean(session.user.playerId && match.coachPlayerId === session.user.playerId);
  const isDesignatedCoachB = Boolean(session.user.playerId && match.coachPlayerBId === session.user.playerId);
  const isCoachOrAdminRole = session.user.role === "ADMIN" || session.user.role === "COACH";

  if (!isDesignatedCoachA && !isDesignatedCoachB && !isCoachOrAdminRole) {
    return NextResponse.json(
      { error: "Apenas a comissão técnica, administradores ou os treinadores da partida podem editar este relatório." },
      { status: 403 }
    );
  }

  const canEditA = isCoachOrAdminRole || isDesignatedCoachA;
  const canEditB = isCoachOrAdminRole || isDesignatedCoachB;

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

  const {
    summary,
    formation,
    starterPlayerIds,
    substitutions,
    startingStrategy,
    substitutionsNotes,
    strengths,
    improvements,
    summaryB,
    formationB,
    starterPlayerIdsB,
    substitutionsB,
    startingStrategyB,
    substitutionsNotesB,
    strengthsB,
    improvementsB,
    status,
    evaluations,
  } = parsed.data;

  // Build report fields to update based on user's permissions
  const reportUpdateData: Record<string, any> = {
    status: status ?? "PUBLISHED",
  };

  if (canEditA) {
    reportUpdateData.coachPlayerId = match.coachPlayerId;
    if (summary !== undefined) reportUpdateData.summary = summary ?? "";
    if (formation !== undefined) reportUpdateData.formation = formation ?? "4-3-3 (Ofensivo)";
    if (starterPlayerIds !== undefined) reportUpdateData.starterPlayerIds = starterPlayerIds ?? [];
    if (substitutions !== undefined) reportUpdateData.substitutions = substitutions ?? [];
    if (startingStrategy !== undefined) reportUpdateData.startingStrategy = startingStrategy ?? "";
    if (substitutionsNotes !== undefined) reportUpdateData.substitutionsNotes = substitutionsNotes ?? "";
    if (strengths !== undefined) reportUpdateData.strengths = strengths ?? "";
    if (improvements !== undefined) reportUpdateData.improvements = improvements ?? "";
  }

  if (canEditB && match.type === "TRAINING") {
    reportUpdateData.coachPlayerBId = match.coachPlayerBId;
    if (summaryB !== undefined) reportUpdateData.summaryB = summaryB ?? "";
    if (formationB !== undefined) reportUpdateData.formationB = formationB ?? "4-3-3 (Ofensivo)";
    if (starterPlayerIdsB !== undefined) reportUpdateData.starterPlayerIdsB = starterPlayerIdsB ?? [];
    if (substitutionsB !== undefined) reportUpdateData.substitutionsB = substitutionsB ?? [];
    if (startingStrategyB !== undefined) reportUpdateData.startingStrategyB = startingStrategyB ?? "";
    if (substitutionsNotesB !== undefined) reportUpdateData.substitutionsNotesB = substitutionsNotesB ?? "";
    if (strengthsB !== undefined) reportUpdateData.strengthsB = strengthsB ?? "";
    if (improvementsB !== undefined) reportUpdateData.improvementsB = improvementsB ?? "";
  }

  // Upsert MatchCoachReport
  const report = await prisma.matchCoachReport.upsert({
    where: { matchId },
    update: reportUpdateData,
    create: {
      matchId,
      coachPlayerId: match.coachPlayerId || null,
      coachPlayerBId: match.coachPlayerBId || null,
      summary: summary ?? "",
      formation: formation ?? "4-3-3 (Ofensivo)",
      starterPlayerIds: starterPlayerIds ?? [],
      substitutions: substitutions ?? [],
      startingStrategy: startingStrategy ?? "",
      substitutionsNotes: substitutionsNotes ?? "",
      strengths: strengths ?? "",
      improvements: improvements ?? "",
      summaryB: summaryB ?? "",
      formationB: formationB ?? "4-3-3 (Ofensivo)",
      starterPlayerIdsB: starterPlayerIdsB ?? [],
      substitutionsB: substitutionsB ?? [],
      startingStrategyB: startingStrategyB ?? "",
      substitutionsNotesB: substitutionsNotesB ?? "",
      strengthsB: strengthsB ?? "",
      improvementsB: improvementsB ?? "",
      status: status ?? "PUBLISHED",
    },
  });

  // Filter evaluations user has permission to save
  const allowedEvaluations = evaluations.filter((ev) => {
    if (ev.teamSide === "B") return canEditB;
    return canEditA;
  });

  // Process individual player evaluations
  for (const ev of allowedEvaluations) {
    let validPlayerId: string | null = null;
    let validGuestPlayerId: string | null = null;

    if (ev.playerId) {
      const playerExists = await prisma.player.findFirst({
        where: { id: ev.playerId, teamId },
        select: { id: true },
      });
      if (playerExists) {
        validPlayerId = playerExists.id;
      } else {
        const guestExists = await prisma.guestPlayer.findFirst({
          where: { id: ev.playerId },
          select: { id: true },
        });
        if (guestExists) {
          validGuestPlayerId = guestExists.id;
        }
      }
    }

    if (!validPlayerId && !validGuestPlayerId && ev.guestPlayerId) {
      const guestExists = await prisma.guestPlayer.findFirst({
        where: { id: ev.guestPlayerId },
        select: { id: true },
      });
      if (guestExists) {
        validGuestPlayerId = guestExists.id;
      }
    }

    if (validPlayerId) {
      await prisma.matchCoachEvaluation.upsert({
        where: {
          reportId_playerId: {
            reportId: report.id,
            playerId: validPlayerId,
          },
        },
        update: {
          teamSide: ev.teamSide || "A",
          rating: ev.rating,
          feedback: ev.feedback ?? "",
        },
        create: {
          reportId: report.id,
          playerId: validPlayerId,
          teamSide: ev.teamSide || "A",
          rating: ev.rating,
          feedback: ev.feedback ?? "",
        },
      });
    } else if (validGuestPlayerId) {
      await prisma.matchCoachEvaluation.upsert({
        where: {
          reportId_guestPlayerId: {
            reportId: report.id,
            guestPlayerId: validGuestPlayerId,
          },
        },
        update: {
          teamSide: ev.teamSide || "B",
          rating: ev.rating,
          feedback: ev.feedback ?? "",
        },
        create: {
          reportId: report.id,
          guestPlayerId: validGuestPlayerId,
          teamSide: ev.teamSide || "B",
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
    coachPlayerBId: match.coachPlayerBId,
    evaluationsCount: allowedEvaluations.length,
    userId: session.user.id,
  });

  return NextResponse.json({
    message: "Relatório do treinador salvo com sucesso",
    reportId: report.id,
  });
});
