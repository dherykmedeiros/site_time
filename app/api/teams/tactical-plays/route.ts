import { NextResponse } from "next/server";
import { requireAuth, requireCoachOrAdmin } from "@/lib/auth";
import { createTacticalPlay, listTacticalPlays } from "@/lib/tactical-plays";
import { createTacticalPlaySchema } from "@/lib/validations/tactical-play";
import { trackOperationalEvent } from "@/lib/telemetry";

export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Time não configurado na conta" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;

  try {
    const plays = await listTacticalPlays(teamId, category);
    return NextResponse.json(plays, { status: 200 });
  } catch (err) {
    trackOperationalEvent("list_tactical_plays_failed", { teamId, error: String(err) });
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Time não configurado na conta" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parseResult = createTacticalPlaySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Payload inválido", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const play = await createTacticalPlay({
      ...parseResult.data,
      teamId,
      createdById: session.user.id,
    });

    return NextResponse.json(play, { status: 201 });
  } catch (err) {
    trackOperationalEvent("create_tactical_play_failed", { teamId, error: String(err) });
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
