import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { trackOperationalEvent } from "@/lib/telemetry";
import {
  createOpenSlotSchema,
  updateOpenSlotSchema,
  updateTeamDiscoverySchema,
} from "@/lib/validations/discovery";

function serializeSlot(slot: {
  id: string;
  teamId: string;
  date: Date;
  timeLabel: string | null;
  venueLabel: string | null;
  notes: string | null;
  status: "OPEN" | "BOOKED" | "CLOSED";
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...slot,
    date: slot.date.toISOString(),
    createdAt: slot.createdAt.toISOString(),
    updatedAt: slot.updatedAt.toISOString(),
  };
}

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const [team, slots] = await Promise.all([
    prisma.team.findUnique({
      where: { id: session.user.teamId },
      select: {
        id: true,
        city: true,
        region: true,
        fieldType: true,
        competitiveLevel: true,
        publicDirectoryOptIn: true,
      },
    }),
    prisma.openMatchSlot.findMany({
      where: { teamId: session.user.teamId },
      orderBy: { date: "asc" },
    }),
  ]);

  return NextResponse.json({
    team,
    slots: slots.map(serializeSlot),
  });
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = createOpenSlotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Campos inválidos",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const slot = await prisma.openMatchSlot.create({
    data: {
      teamId: session.user.teamId,
      date: new Date(parsed.data.date),
      timeLabel: parsed.data.timeLabel ?? null,
      venueLabel: parsed.data.venueLabel ?? null,
      notes: parsed.data.notes ?? null,
      status: "OPEN",
    },
  });

  trackOperationalEvent("open_slot_created", {
    teamId: session.user.teamId,
    slotId: slot.id,
  });

  return NextResponse.json(serializeSlot(slot), { status: 201 });
}

export async function PATCH(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  if (typeof body === "object" && body && "id" in body) {
    const parsedSlot = updateOpenSlotSchema.safeParse(body);

    if (!parsedSlot.success) {
      return NextResponse.json(
        {
          error: "Campos inválidos",
          code: "VALIDATION_ERROR",
          details: parsedSlot.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const current = await prisma.openMatchSlot.findUnique({
      where: { id: parsedSlot.data.id },
      select: { id: true, teamId: true },
    });

    if (!current || current.teamId !== session.user.teamId) {
      return NextResponse.json(
        { error: "Slot não encontrado" },
        { status: 404 }
      );
    }

    const updated = await prisma.openMatchSlot.update({
      where: { id: parsedSlot.data.id },
      data: {
        ...(parsedSlot.data.date ? { date: new Date(parsedSlot.data.date) } : {}),
        ...(parsedSlot.data.timeLabel !== undefined ? { timeLabel: parsedSlot.data.timeLabel } : {}),
        ...(parsedSlot.data.venueLabel !== undefined ? { venueLabel: parsedSlot.data.venueLabel } : {}),
        ...(parsedSlot.data.notes !== undefined ? { notes: parsedSlot.data.notes } : {}),
        ...(parsedSlot.data.status ? { status: parsedSlot.data.status } : {}),
      },
    });

    if (parsedSlot.data.status === "CLOSED") {
      trackOperationalEvent("open_slot_closed", {
        teamId: session.user.teamId,
        slotId: updated.id,
      });
    }

    return NextResponse.json(serializeSlot(updated));
  }

  const parsedTeam = updateTeamDiscoverySchema.safeParse(body);
  if (!parsedTeam.success) {
    return NextResponse.json(
      {
        error: "Campos inválidos",
        code: "VALIDATION_ERROR",
        details: parsedTeam.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const team = await prisma.team.update({
    where: { id: session.user.teamId },
    data: {
      ...(parsedTeam.data.city !== undefined ? { city: parsedTeam.data.city } : {}),
      ...(parsedTeam.data.region !== undefined ? { region: parsedTeam.data.region } : {}),
      ...(parsedTeam.data.fieldType !== undefined ? { fieldType: parsedTeam.data.fieldType } : {}),
      ...(parsedTeam.data.competitiveLevel !== undefined ? { competitiveLevel: parsedTeam.data.competitiveLevel } : {}),
      ...(parsedTeam.data.publicDirectoryOptIn !== undefined
        ? { publicDirectoryOptIn: parsedTeam.data.publicDirectoryOptIn }
        : {}),
    },
    select: {
      id: true,
      city: true,
      region: true,
      fieldType: true,
      competitiveLevel: true,
      publicDirectoryOptIn: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    ...team,
    updatedAt: team.updatedAt.toISOString(),
  });
}
