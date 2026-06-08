import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const checkInSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// Haversine formula to calculate distance in meters between two coordinates
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const POST = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const playerId = session.user.playerId;
  if (!playerId) {
    return NextResponse.json(
      { error: "Apenas atletas vinculados podem realizar check-in", code: "NOT_AN_ATHLETE" },
      { status: 403 }
    );
  }

  const { id } = await params;

  // Verify match exists, belongs to team, is SCHEDULED, and has coordinates
  const match = await prisma.match.findFirst({
    where: {
      id,
      teamId: session.user.teamId || undefined,
    },
    select: {
      id: true,
      status: true,
      latitude: true,
      longitude: true,
      date: true,
    },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  if (match.status !== "SCHEDULED") {
    return NextResponse.json(
      { error: "Check-in só é permitido para partidas agendadas", code: "INVALID_MATCH_STATUS" },
      { status: 409 }
    );
  }

  if (match.latitude === null || match.longitude === null) {
    return NextResponse.json(
      { error: "Local da partida não possui coordenadas geográficas cadastradas", code: "NO_COORDINATES" },
      { status: 400 }
    );
  }

  // Parse player location coordinates
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = checkInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Coordenadas inválidas",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { latitude: playerLat, longitude: playerLon } = parsed.data;

  // Calculate distance
  const distance = getDistanceInMeters(playerLat, playerLon, match.latitude, match.longitude);

  if (distance > 500) {
    return NextResponse.json(
      {
        error: `Você está muito longe do local da partida. Distância aproximada: ${Math.round(distance)} metros. É necessário estar a menos de 500 metros do campo.`,
        code: "TOO_FAR",
        distance,
      },
      { status: 400 }
    );
  }

  // Upsert attendance
  const now = new Date();
  const attendance = await prisma.matchAttendance.upsert({
    where: {
      matchId_playerId: {
        matchId: id,
        playerId,
      },
    },
    create: {
      matchId: id,
      playerId,
      present: true,
      checkedInAt: now,
    },
    update: {
      present: true,
      checkedInAt: now,
    },
  });

  return NextResponse.json({
    message: "Check-in realizado com sucesso! Presença confirmada.",
    attendance: {
      present: attendance.present,
      checkedInAt: attendance.checkedInAt?.toISOString() ?? null,
    },
  });
});
