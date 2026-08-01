import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET /api/matches/venues — Retorna lista de locais/campos em que o time já jogou ou agendou
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const matches = await prisma.match.findMany({
    where: { teamId },
    select: {
      venue: true,
      latitude: true,
      longitude: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const venueMap = new Map<string, { venue: string; latitude: number | null; longitude: number | null; mapsUrl: string | null; matchCount: number }>();

  for (const m of matches) {
    const vName = m.venue?.trim();
    if (!vName) continue;

    const mapsUrl = m.latitude && m.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${m.latitude},${m.longitude}`
      : null;

    if (!venueMap.has(vName)) {
      venueMap.set(vName, {
        venue: vName,
        latitude: m.latitude,
        longitude: m.longitude,
        mapsUrl,
        matchCount: 1,
      });
    } else {
      const existing = venueMap.get(vName)!;
      existing.matchCount++;
      if (!existing.mapsUrl && mapsUrl) {
        existing.mapsUrl = mapsUrl;
        existing.latitude = m.latitude;
        existing.longitude = m.longitude;
      }
    }
  }

  const venues = Array.from(venueMap.values()).sort((a, b) => b.matchCount - a.matchCount);

  return NextResponse.json({ venues });
}
