import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCoachOrAdmin } from "@/lib/auth";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

// DELETE /api/teams/punishment-types/[id] — Delete a custom punishment type (ADMIN/COACH)
export const DELETE = withErrorHandler(async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { id } = params;

  const ip = extractClientIp(request);
  const rl = await rateLimitMutation(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Muitas tentativas. Tente em ${rl.retryAfterMinutes} min.`, code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  const type = await prisma.punishmentType.findFirst({
    where: { id, teamId },
  });

  if (!type) {
    return NextResponse.json({ error: "Tipo de punição não encontrado" }, { status: 404 });
  }

  // Prevent deleting system-level default ones by name
  if (type.name === "Advertência" || type.name === "Suspensão") {
    return NextResponse.json(
      { error: "Os tipos de punição padrões ('Advertência' e 'Suspensão') não podem ser removidos." },
      { status: 400 }
    );
  }

  await prisma.punishmentType.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, message: "Tipo de punição excluído com sucesso." });
});
