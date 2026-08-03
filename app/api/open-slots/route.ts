import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";
import { z } from "zod";

const createOpenSlotSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
  timeLabel: z.string().trim().max(50, "Horário deve ter no máximo 50 caracteres").optional().nullable(),
  venueLabel: z.string().trim().max(200, "Local deve ter no máximo 200 caracteres").optional().nullable(),
  notes: z.string().trim().max(500, "Observações devem ter no máximo 500 caracteres").optional().nullable(),
});

// GET /api/open-slots — Listagem pública de horários vagos disponíveis
export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const fieldType = searchParams.get("fieldType");
  const query = searchParams.get("query");

  const where: Prisma.OpenMatchSlotWhereInput = {
    status: "OPEN",
    date: {
      gte: new Date(new Date().setHours(0, 0, 0, 0)),
    },
  };

  if (city) {
    where.team = {
      ...where.team,
      city: { contains: city, mode: "insensitive" },
    };
  }

  if (fieldType) {
    where.team = {
      ...where.team,
      fieldType: fieldType as any,
    };
  }

  if (query) {
    where.OR = [
      { venueLabel: { contains: query, mode: "insensitive" } },
      { notes: { contains: query, mode: "insensitive" } },
      { team: { name: { contains: query, mode: "insensitive" } } },
      { team: { city: { contains: query, mode: "insensitive" } } },
    ];
  }

  const slots = await prisma.openMatchSlot.findMany({
    where,
    include: {
      team: {
        select: {
          id: true,
          name: true,
          slug: true,
          badgeUrl: true,
          city: true,
          region: true,
          fieldType: true,
          competitiveLevel: true,
        },
      },
    },
    orderBy: { date: "asc" },
    take: 100,
  });

  const formattedSlots = slots.map((s) => ({
    id: s.id,
    date: s.date.toISOString(),
    timeLabel: s.timeLabel,
    venueLabel: s.venueLabel,
    notes: s.notes,
    status: s.status,
    team: s.team,
    createdAt: s.createdAt.toISOString(),
  }));

  return NextResponse.json({ slots: formattedSlots });
});

// POST /api/open-slots — Cadastro de nova vaga/horário (Apenas ADMIN)
export const POST = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido", code: "VALIDATION_ERROR" }, { status: 400 });
  }

  const parsed = createOpenSlotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { date, timeLabel, venueLabel, notes } = parsed.data;

  const newSlot = await prisma.openMatchSlot.create({
    data: {
      teamId,
      date: new Date(date),
      timeLabel: timeLabel || null,
      venueLabel: venueLabel || null,
      notes: notes || null,
      status: "OPEN",
    },
    include: {
      team: {
        select: {
          name: true,
          slug: true,
          badgeUrl: true,
        },
      },
    },
  });

  return NextResponse.json({ slot: newSlot }, { status: 201 });
});
