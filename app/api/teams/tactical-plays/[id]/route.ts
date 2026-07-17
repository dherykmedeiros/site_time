import { NextResponse } from "next/server";
import { requireCoachOrAdmin } from "@/lib/auth";
import { updateTacticalPlay, deleteTacticalPlay } from "@/lib/tactical-plays";
import { updateTacticalPlaySchema } from "@/lib/validations/tactical-play";
import { trackOperationalEvent } from "@/lib/telemetry";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Time não configurado na conta" }, { status: 400 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parseResult = updateTacticalPlaySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Payload inválido", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const updatedPlay = await updateTacticalPlay(id, teamId, parseResult.data);
    if (!updatedPlay) {
      return NextResponse.json({ error: "Jogada ensaiada não encontrada ou sem permissão" }, { status: 404 });
    }

    return NextResponse.json(updatedPlay, { status: 200 });
  } catch (err) {
    trackOperationalEvent("update_tactical_play_failed", { id, teamId, error: String(err) });
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Time não configurado na conta" }, { status: 400 });
  }

  const { id } = await params;

  try {
    const result = await deleteTacticalPlay(id, teamId);
    if (!result.deleted) {
      return NextResponse.json({ error: "Jogada ensaiada não encontrada ou sem permissão" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: true }, { status: 200 });
  } catch (err) {
    trackOperationalEvent("delete_tactical_play_failed", { id, teamId, error: String(err) });
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
