import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackOperationalEvent } from "@/lib/telemetry";
import { discoveryQuerySchema } from "@/lib/validations/discovery";

interface DiscoverySlotRow {
  id: string;
  date: Date;
  timeLabel: string | null;
  venueLabel: string | null;
  status: "OPEN" | "BOOKED" | "CLOSED";
}

interface DiscoveryTeamRow {
  id: string;
  name: string;
  slug: string;
  badgeUrl: string | null;
  city: string | null;
  region: string | null;
  fieldType: "GRASS" | "SYNTHETIC" | "FUTSAL" | "SOCIETY" | "OTHER" | null;
  competitiveLevel: "CASUAL" | "INTERMEDIATE" | "COMPETITIVE" | null;
  openMatchSlots: DiscoverySlotRow[];
}

function toNullableString(value: string | null | undefined) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function includesCaseInsensitive(base: string | null, term: string | undefined) {
  if (!term) return true;
  if (!base) return false;
  return base.toLowerCase().includes(term.toLowerCase());
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = discoveryQuerySchema.safeParse({
    q: url.searchParams.get("q") ?? undefined,
    city: url.searchParams.get("city") ?? undefined,
    region: url.searchParams.get("region") ?? undefined,
    fieldType: url.searchParams.get("fieldType") ?? undefined,
    weekday: url.searchParams.get("weekday") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Filtros inválidos",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const filters = parsed.data;
  const weekdayFilter = filters.weekday !== undefined ? Number(filters.weekday) : null;
  const limit = filters.limit ?? 20;

  const teams: DiscoveryTeamRow[] = await prisma.team.findMany({
    where: {
      publicDirectoryOptIn: true,
      slug: { not: "" },
      OR: [{ city: { not: null } }, { region: { not: null } }],
      ...(filters.fieldType ? { fieldType: filters.fieldType } : {}),
      ...(filters.city ? { city: { contains: filters.city, mode: "insensitive" } } : {}),
      ...(filters.region ? { region: { contains: filters.region, mode: "insensitive" } } : {}),
      ...(filters.q
        ? {
            name: {
              contains: filters.q,
              mode: "insensitive",
            },
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      badgeUrl: true,
      city: true,
      region: true,
      fieldType: true,
      competitiveLevel: true,
      openMatchSlots: {
        where: { status: "OPEN" },
        orderBy: { date: "asc" },
        take: 4,
        select: {
          id: true,
          date: true,
          timeLabel: true,
          venueLabel: true,
          status: true,
        },
      },
    },
    take: 100,
    orderBy: { name: "asc" },
  });

  const normalizedTeams = teams
    .map((team) => {
      const openSlots = team.openMatchSlots.filter((slot) => {
        if (weekdayFilter === null) return true;
        return slot.date.getUTCDay() === weekdayFilter;
      });

      return {
        ...team,
        city: toNullableString(team.city),
        region: toNullableString(team.region),
        openMatchSlots: openSlots.map((slot) => ({
          id: slot.id,
          date: slot.date.toISOString(),
          timeLabel: toNullableString(slot.timeLabel),
          venueLabel: toNullableString(slot.venueLabel),
        })),
      };
    })
    .filter((team) => includesCaseInsensitive(team.name, filters.q));

  trackOperationalEvent("discovery_query_executed", {
    q: filters.q ?? null,
    city: filters.city ?? null,
    region: filters.region ?? null,
    fieldType: filters.fieldType ?? null,
    weekday: weekdayFilter,
    rawCount: teams.length,
    resultCount: normalizedTeams.length,
  });

  return NextResponse.json({
    teams: normalizedTeams.slice(0, limit),
    total: normalizedTeams.length,
  });
}
