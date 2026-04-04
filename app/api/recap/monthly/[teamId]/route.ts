import { NextResponse } from "next/server";
import { buildPeriodRecap } from "@/lib/period-recap";

interface RouteContext {
  params: Promise<{ teamId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { teamId } = await context.params;
  const recap = await buildPeriodRecap(teamId, 30);
  if (!recap) {
    return NextResponse.json({ error: "Sem jogos nos últimos 30 dias" }, { status: 404 });
  }
  return NextResponse.json(recap);
}
