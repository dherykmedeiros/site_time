import { NextResponse } from "next/server";
import { buildSeasonRecap } from "@/lib/season-recap";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteContext {
  params: Promise<{ seasonId: string }>;
}

// Public endpoint — rate-limited to prevent enumeration
export async function GET(_request: Request, context: RouteContext) {
  const ip = extractClientIp(_request);
  const { allowed } = await rateLimitMutation(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const { seasonId } = await context.params;
  const recap = await buildSeasonRecap(seasonId);
  if (!recap) {
    return NextResponse.json({ error: "Recap da temporada não encontrado" }, { status: 404 });
  }
  return NextResponse.json(recap);
}
