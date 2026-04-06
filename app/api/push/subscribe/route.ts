import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pushSubscriptionSchema } from "@/lib/validations/push";
import { extractClientIp } from "@/lib/request-ip";
import { rateLimitPush } from "@/lib/rate-limit";
import { isPushConfigured } from "@/lib/push";
import { withErrorHandler } from "@/lib/api-handler";

// POST /api/push/subscribe
export const POST = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const ip = extractClientIp(request);
  const rate = await rateLimitPush(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Muitas tentativas. Tente novamente em ${rate.retryAfterMinutes} minutos.` },
      { status: 429 }
    );
  }

  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: "Push não configurado no servidor" },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = pushSubscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload inválido", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { endpoint, keys } = parsed.data;

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: {
      userId: session.user.id,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
    create: {
      userId: session.user.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
  });

  return NextResponse.json({ ok: true });
});

// DELETE /api/push/subscribe
export const DELETE = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await request.json().catch(() => null);
  const parsed = pushSubscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload inválido", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  await prisma.pushSubscription.deleteMany({
    where: {
      endpoint: parsed.data.endpoint,
      userId: session.user.id,
    },
  });

  return new NextResponse(null, { status: 204 });
});
