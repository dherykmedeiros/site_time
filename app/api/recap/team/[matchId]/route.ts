import { NextResponse } from "next/server";
import { buildTeamRecap } from "@/lib/team-recap";
import { trackOperationalEvent } from "@/lib/telemetry";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteParams {
  params: Promise<{ matchId: string }>;
}

// Public endpoint — rate-limited to prevent enumeration
export async function GET(_request: Request, { params }: RouteParams) {
  const ip = extractClientIp(_request);
  const { allowed } = await rateLimitMutation(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const { matchId } = await params;
  const recap = await buildTeamRecap(matchId);

  if (!recap) {
    return NextResponse.json(
      { error: "Recap nao disponivel para esta partida", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  trackOperationalEvent("recap_team_json_viewed", {
    matchId,
    teamId: recap.team.id,
  });

  return NextResponse.json(recap);
}
