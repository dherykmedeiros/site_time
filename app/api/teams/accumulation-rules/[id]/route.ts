import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCoachOrAdmin } from "@/lib/auth";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

// DELETE /api/teams/accumulation-rules/[id] — Delete an accumulation rule (ADMIN/COACH)
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

  const rule = await prisma.punishmentAccumulationRule.findFirst({
    where: { id, teamId },
  });

  if (!rule) {
    return NextResponse.json({ error: "Regra de acúmulo não encontrada" }, { status: 404 });
  }

  await prisma.punishmentAccumulationRule.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, message: "Regra de acúmulo excluída com sucesso." });
});
