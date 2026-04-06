import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPushToUser } from "@/lib/push";
import { pushSendSchema } from "@/lib/validations/push";
import { withErrorHandler } from "@/lib/api-handler";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

// POST /api/push/send (internal/admin)
export const POST = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const ip = extractClientIp(request);
  const rl = await rateLimitMutation(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Muitas tentativas. Tente em ${rl.retryAfterMinutes} min.`, code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = pushSendSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload inválido", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { userId, title, body: message, url, tag } = parsed.data;

  // Verify target user belongs to the same team (prevent cross-team push)
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { teamId: true },
  });

  if (!targetUser || targetUser.teamId !== session.user.teamId) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  const result = await sendPushToUser(userId, { title, body: message, url, tag });

  return NextResponse.json({ ok: true, ...result });
});
