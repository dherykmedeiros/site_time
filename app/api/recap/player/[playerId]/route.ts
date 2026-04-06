import { NextResponse } from "next/server";
import { buildPlayerRecap } from "@/lib/player-recap";
import { trackOperationalEvent } from "@/lib/telemetry";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteParams {
  params: Promise<{ playerId: string }>;
}

// Public endpoint — rate-limited to prevent enumeration
export async function GET(_request: Request, { params }: RouteParams) {
  const ip = extractClientIp(_request);
  const { allowed } = await rateLimitMutation(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const { playerId } = await params;
  const recap = await buildPlayerRecap(playerId);

  if (!recap) {
    return NextResponse.json(
      { error: "Jogador nao encontrado", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  trackOperationalEvent("recap_player_json_viewed", {
    playerId,
    teamId: recap.team.id,
  });

  return NextResponse.json(recap);
}
