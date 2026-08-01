import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function getLocalSlot(dateInput: Date | string, timeZone = "America/Sao_Paulo") {
  const d = new Date(dateInput);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hour12: false,
  });

  const partsMap: Record<string, string> = {};
  for (const part of formatter.formatToParts(d)) {
    partsMap[part.type] = part.value;
  }

  let hour = parseInt(partsMap.hour || "0", 10);
  if (hour === 24) hour = 0;

  const year = parseInt(partsMap.year, 10);
  const month = parseInt(partsMap.month, 10) - 1;
  const day = parseInt(partsMap.day, 10);
  const localDate = new Date(year, month, day, hour);

  return {
    dayOfWeek: localDate.getDay(),
    hour,
  };
}

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const teamId = session.user.teamId;
  if (!teamId) return NextResponse.json({ error: "Sem time vinculado" }, { status: 403 });
  
  const { searchParams } = new URL(request.url);
  const seasonId = searchParams.get("seasonId") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const dateFilter: any = {};
  if (from) dateFilter.gte = new Date(from);
  if (to) dateFilter.lte = new Date(to);

  const matches = await prisma.match.findMany({
    where: {
      teamId,
      status: "COMPLETED",
      ...(seasonId && { seasonId }),
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
    },
    include: {
      attendances: true,
    },
  });

  const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const heatmapMap: Record<string, { totalPresent: number; totalMatches: number }> = {};
  const dayOfWeekMap: Record<number, { totalPresent: number; totalMatches: number }> = {};
  const hourMap: Record<number, { totalPresent: number; totalMatches: number }> = {};

  for (let i = 0; i < 7; i++) {
    dayOfWeekMap[i] = { totalPresent: 0, totalMatches: 0 };
  }
  for (let i = 0; i < 24; i++) {
    hourMap[i] = { totalPresent: 0, totalMatches: 0 };
  }

  for (const match of matches) {
    if (!match.date) continue;
    const { dayOfWeek, hour } = getLocalSlot(match.date, "America/Sao_Paulo");

    const presentCount = match.attendances.filter((a) => a.present).length;

    const heatmapKey = `${dayOfWeek}-${hour}`;
    if (!heatmapMap[heatmapKey]) {
      heatmapMap[heatmapKey] = { totalPresent: 0, totalMatches: 0 };
    }

    heatmapMap[heatmapKey].totalPresent += presentCount;
    heatmapMap[heatmapKey].totalMatches += 1;

    dayOfWeekMap[dayOfWeek].totalPresent += presentCount;
    dayOfWeekMap[dayOfWeek].totalMatches += 1;

    hourMap[hour].totalPresent += presentCount;
    hourMap[hour].totalMatches += 1;
  }

  const heatmap = Object.entries(heatmapMap).map(([key, data]) => {
    const [dayOfWeekStr, hourStr] = key.split("-");
    return {
      dayOfWeek: parseInt(dayOfWeekStr, 10),
      hour: parseInt(hourStr, 10),
      avgAttendance: data.totalMatches > 0 ? data.totalPresent / data.totalMatches : 0,
      matchCount: data.totalMatches,
    };
  });

  const dayOfWeekSummary = Object.entries(dayOfWeekMap).map(([dayOfWeekStr, data]) => {
    const dayOfWeek = parseInt(dayOfWeekStr, 10);
    return {
      dayOfWeek,
      dayLabel: dayLabels[dayOfWeek],
      avgPresent: data.totalMatches > 0 ? data.totalPresent / data.totalMatches : 0,
      totalMatches: data.totalMatches,
    };
  });

  const hourSummary = Object.entries(hourMap).map(([hourStr, data]) => {
    const hour = parseInt(hourStr, 10);
    return {
      hour,
      avgPresent: data.totalMatches > 0 ? data.totalPresent / data.totalMatches : 0,
      totalMatches: data.totalMatches,
    };
  });

  return NextResponse.json({
    heatmap,
    dayOfWeekSummary,
    hourSummary,
  });
}
