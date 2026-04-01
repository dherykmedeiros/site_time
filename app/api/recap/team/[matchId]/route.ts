import { NextResponse } from "next/server";
import { buildTeamRecap } from "@/lib/team-recap";
import { trackOperationalEvent } from "@/lib/telemetry";

interface RouteParams {
  params: Promise<{ matchId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
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
