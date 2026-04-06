import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { updateSeasonSchema } from "@/lib/validations/season";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/seasons/:id
export const GET = withErrorHandler(async (_request: Request, context: RouteContext) => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { id } = await context.params;

  const season = await prisma.season.findFirst({
    where: { id, teamId: session.user.teamId },
    include: {
      matches: {
        orderBy: { date: "asc" },
        select: {
          id: true,
          date: true,
          opponent: true,
          type: true,
          homeScore: true,
          awayScore: true,
          status: true,
        },
      },
      _count: { select: { matches: true } },
    },
  });

  if (!season) {
    return NextResponse.json({ error: "Temporada não encontrada" }, { status: 404 });
  }

  return NextResponse.json({ season });
});

// PATCH /api/seasons/:id
export const PATCH = withErrorHandler(async (request: Request, context: RouteContext) => {
  const { session, error } = await requireAdmin();
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

  const { id } = await context.params;

  const body = await request.json().catch(() => null);
  const parsed = updateSeasonSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.season.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Temporada não encontrada" }, { status: 404 });
  }

  const { name, type, startDate, endDate, status } = parsed.data;

  const season = await prisma.season.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(type !== undefined && { type }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json({ season });
});

// DELETE /api/seasons/:id
export const DELETE = withErrorHandler(async (request: Request, context: RouteContext) => {
  const { session, error } = await requireAdmin();
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

  const { id } = await context.params;

  const existing = await prisma.season.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Temporada não encontrada" }, { status: 404 });
  }

  // Unlink matches before deleting
  await prisma.$transaction([
    prisma.match.updateMany({ where: { seasonId: id }, data: { seasonId: null } }),
    prisma.season.delete({ where: { id } }),
  ]);

  return new NextResponse(null, { status: 204 });
});
