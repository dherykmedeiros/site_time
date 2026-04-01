import { NextResponse } from "next/server";
import { buildPlayerRecap } from "@/lib/player-recap";
import { trackOperationalEvent } from "@/lib/telemetry";

interface RouteParams {
  params: Promise<{ playerId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
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
