import { NextResponse } from "next/server";
import { buildPlayerMatchRecap } from "@/lib/player-recap";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteContext {
  params: Promise<{ playerId: string; matchId: string }>;
}

// Public endpoint — rate-limited to prevent enumeration
export async function GET(_request: Request, context: RouteContext) {
  const ip = extractClientIp(_request);
  const { allowed } = await rateLimitMutation(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const { playerId, matchId } = await context.params;

  const recap = await buildPlayerMatchRecap(playerId, matchId);
  if (!recap) {
    return NextResponse.json({ error: "Recap não encontrado" }, { status: 404 });
  }

  return NextResponse.json(recap);
}
