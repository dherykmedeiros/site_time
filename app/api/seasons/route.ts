import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createSeasonSchema } from "@/lib/validations/season";

// GET /api/seasons — list all seasons for the team
export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const seasons = await prisma.season.findMany({
    where: { teamId: session.user.teamId! },
    orderBy: { startDate: "desc" },
    include: {
      _count: { select: { matches: true } },
    },
  });

  return NextResponse.json({ seasons });
}

// POST /api/seasons — create a new season
export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const body = await request.json().catch(() => null);
  const parsed = createSeasonSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, type, startDate, endDate } = parsed.data;

  const season = await prisma.season.create({
    data: {
      teamId: session.user.teamId!,
      name,
      type,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      status: "ACTIVE",
    },
  });

  return NextResponse.json({ season }, { status: 201 });
}
