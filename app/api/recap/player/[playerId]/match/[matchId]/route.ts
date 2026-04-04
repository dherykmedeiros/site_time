import { NextResponse } from "next/server";
import { buildPlayerMatchRecap } from "@/lib/player-recap";

interface RouteContext {
  params: Promise<{ playerId: string; matchId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { playerId, matchId } = await context.params;

  const recap = await buildPlayerMatchRecap(playerId, matchId);
  if (!recap) {
    return NextResponse.json({ error: "Recap não encontrado" }, { status: 404 });
  }

  return NextResponse.json(recap);
}
