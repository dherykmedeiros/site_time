import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createSeasonSchema } from "@/lib/validations/season";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

// GET /api/seasons — list all seasons for the team
export const GET = withErrorHandler(async () => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const seasons = await prisma.season.findMany({
    where: { teamId: session.user.teamId },
    orderBy: { startDate: "desc" },
    include: {
      _count: { select: { matches: true } },
    },
  });

  return NextResponse.json({ seasons });
});

// POST /api/seasons — create a new season
export const POST = withErrorHandler(async (request: Request) => {
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

  const body = await request.json().catch(() => null);
  const parsed = createSeasonSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, type, startDate, endDate } = parsed.data;

  const season = await prisma.season.create({
    data: {
      teamId: session.user.teamId,
      name,
      type,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      status: "ACTIVE",
    },
  });

  return NextResponse.json({ season }, { status: 201 });
});
