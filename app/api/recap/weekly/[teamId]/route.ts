import { NextResponse } from "next/server";
import { buildPeriodRecap } from "@/lib/period-recap";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteContext {
  params: Promise<{ teamId: string }>;
}

// Public endpoint — rate-limited to prevent enumeration
export async function GET(_request: Request, context: RouteContext) {
  const ip = extractClientIp(_request);
  const { allowed } = await rateLimitMutation(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const { teamId } = await context.params;
  const recap = await buildPeriodRecap(teamId, 7);
  if (!recap) {
    return NextResponse.json({ error: "Sem jogos nos últimos 7 dias" }, { status: 404 });
  }
  return NextResponse.json(recap);
}
