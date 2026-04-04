import { NextResponse } from "next/server";
import { buildSeasonRecap } from "@/lib/season-recap";

interface RouteContext {
  params: Promise<{ seasonId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { seasonId } = await context.params;
  const recap = await buildSeasonRecap(seasonId);
  if (!recap) {
    return NextResponse.json({ error: "Recap da temporada não encontrado" }, { status: 404 });
  }
  return NextResponse.json(recap);
}
