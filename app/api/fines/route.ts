import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireCoachOrAdmin, requireAuth } from "@/lib/auth";
import { fineSchema } from "@/lib/validations/fine";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";
import { trackOperationalEvent } from "@/lib/telemetry";
import { parseLocalDate } from "@/lib/utils";

// GET /api/fines — list all punishments (fines) for the team (Anyone authenticated can see)
export const GET = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get("playerId") || undefined;
  const status = searchParams.get("status") || undefined; // ACTIVE, SERVED, CANCELLED

  const fines = await prisma.fine.findMany({
    where: {
      teamId: session.user.teamId,
      ...(playerId && { playerId }),
      ...(status && { status }),
    },
    orderBy: { date: "desc" },
    include: {
      player: {
        select: {
          id: true,
          name: true,
          shirtNumber: true,
        },
      },
      rule: {
        select: {
          id: true,
          title: true,
        },
      },
      punishmentType: true,
      suspendedMatch: true,
    },
  });

  return NextResponse.json({ fines });
});

// POST /api/fines — apply a new punishment (fine) for a player (ADMIN/COACH only)
export const POST = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const ip = extractClientIp(request);
  const rl = await rateLimitMutation(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Muitas tentativas. Tente em ${rl.retryAfterMinutes} min.`, code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = fineSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { playerId, ruleId, punishmentTypeId, description, severity, matchesSuspended, status = "ACTIVE", date, suspendedMatchId } = parsed.data;

  // Verify the player belongs to this team
  const playerExists = await prisma.player.findFirst({
    where: { id: playerId, teamId: session.user.teamId },
  });

  if (!playerExists) {
    return NextResponse.json({ error: "Jogador não encontrado no time" }, { status: 404 });
  }

  // If ruleId is provided, verify it belongs to this team
  if (ruleId) {
    const ruleExists = await prisma.rule.findFirst({
      where: { id: ruleId, teamId: session.user.teamId },
    });
    if (!ruleExists) {
      return NextResponse.json({ error: "Regra não encontrada no time" }, { status: 404 });
    }
  }

  // If suspendedMatchId is provided, verify it belongs to this team
  if (suspendedMatchId) {
    const matchExists = await prisma.match.findFirst({
      where: { id: suspendedMatchId, teamId: session.user.teamId },
    });
    if (!matchExists) {
      return NextResponse.json({ error: "Partida não encontrada no time" }, { status: 404 });
    }
  }

  const teamId = session.user.teamId;

  // 1. Resolve punishmentTypeId
  let resolvedTypeId = punishmentTypeId || null;
  if (!resolvedTypeId) {
    const targetName = severity === "WARNING" ? "Advertência" : "Suspensão";
    let pType = await prisma.punishmentType.findFirst({
      where: {
        teamId,
        name: { equals: targetName, mode: "insensitive" }
      }
    });

    if (!pType) {
      pType = await prisma.punishmentType.findFirst({
        where: { teamId, severity }
      });
    }

    if (!pType) {
      pType = await prisma.punishmentType.create({
        data: {
          teamId,
          name: targetName,
          severity,
          description: `${targetName} padrão`
        }
      });
    }
    resolvedTypeId = pType.id;
  } else {
    const typeExists = await prisma.punishmentType.findFirst({
      where: { id: resolvedTypeId, teamId }
    });
    if (!typeExists) {
      return NextResponse.json({ error: "Tipo de punição não encontrado no time" }, { status: 404 });
    }
  }

  // 2. Create the initial fine
  const fine = await prisma.fine.create({
    data: {
      teamId,
      playerId,
      ruleId: ruleId || null,
      punishmentTypeId: resolvedTypeId,
      description,
      severity,
      matchesSuspended: severity === "SUSPENSION" ? matchesSuspended : null,
      status,
      suspendedMatchId: suspendedMatchId || null,
      date: parseLocalDate(date) || new Date(date),
    },
    include: {
      player: {
        select: {
          id: true,
          name: true,
          shirtNumber: true,
        },
      },
      rule: {
        select: {
          id: true,
          title: true,
        },
      },
      punishmentType: true,
      suspendedMatch: true,
    },
  });

  // 2.1 Auto RSVP Decline if suspended for a specific match
  if (severity === "SUSPENSION" && status === "ACTIVE" && suspendedMatchId) {
    const existingRsvp = await prisma.rSVP.findUnique({
      where: {
        playerId_matchId: {
          playerId,
          matchId: suspendedMatchId,
        },
      },
      select: { id: true, status: true },
    });

    const rsvp = await prisma.rSVP.upsert({
      where: {
        playerId_matchId: {
          playerId,
          matchId: suspendedMatchId,
        },
      },
      update: {
        status: "DECLINED",
        respondedAt: new Date(),
      },
      create: {
        playerId,
        matchId: suspendedMatchId,
        status: "DECLINED",
        respondedAt: new Date(),
      },
    });

    if (!existingRsvp || existingRsvp.status !== "DECLINED") {
      await prisma.rSVPStatusLog.create({
        data: {
          rsvpId: rsvp.id,
          playerId,
          matchId: suspendedMatchId,
          oldStatus: existingRsvp?.status ?? null,
          newStatus: "DECLINED",
        },
      });

      trackOperationalEvent("player_rsvp_status_changed", {
        rsvpId: rsvp.id,
        playerId,
        playerName: playerExists.name,
        matchId: suspendedMatchId,
        oldStatus: existingRsvp?.status ?? null,
        newStatus: "DECLINED",
        reason: "SUSPENSION",
      });
    }
  }

  // 3. Accumulation / Escalation logic
  let escalatedFine = null;
  if (status === "ACTIVE") {
    const rule = await prisma.punishmentAccumulationRule.findFirst({
      where: { teamId, sourceTypeId: resolvedTypeId }
    });

    if (rule) {
      // Find all active fines of this player for this source punishment type
      const activeFines = await prisma.fine.findMany({
        where: {
          teamId,
          playerId,
          punishmentTypeId: resolvedTypeId,
          status: "ACTIVE",
          ...(rule.expiryDays ? {
            date: {
              gte: new Date(new Date(date).getTime() - rule.expiryDays * 24 * 60 * 60 * 1000)
            }
          } : {})
        },
        orderBy: { date: "asc" }
      });

      if (activeFines.length >= rule.accumulateCount) {
        // Mark the oldest accumulateCount active fines as accumulated/served
        const idsToUpdate = activeFines.slice(0, rule.accumulateCount).map(f => f.id);
        
        await prisma.fine.updateMany({
          where: { id: { in: idsToUpdate } },
          data: { status: "SERVED" }
        });

        // Find target type to create escalated fine
        const targetType = await prisma.punishmentType.findUnique({
          where: { id: rule.targetTypeId }
        });

        if (targetType) {
          const sourceType = await prisma.punishmentType.findUnique({
            where: { id: resolvedTypeId }
          });
          const sourceName = sourceType?.name || "Advertência";
          const escalatedDescription = `Acúmulo de ${rule.accumulateCount}x ${sourceName} dentro da janela de acúmulo.`;

          escalatedFine = await prisma.fine.create({
            data: {
              teamId,
              playerId,
              ruleId: null,
              punishmentTypeId: targetType.id,
              description: escalatedDescription,
              severity: targetType.severity,
              matchesSuspended: targetType.severity === "SUSPENSION" ? (rule.targetMatches || 1) : null,
              status: "ACTIVE",
              date: parseLocalDate(date) || new Date(date),
            },
            include: {
              player: {
                select: {
                  id: true,
                  name: true,
                  shirtNumber: true,
                },
              },
              punishmentType: true,
            }
          });
        }
      }
    }
  }

  return NextResponse.json({ fine, escalatedFine, escalated: !!escalatedFine }, { status: 201 });
});
