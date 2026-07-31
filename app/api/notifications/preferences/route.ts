import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

// GET /api/notifications/preferences — Lista as preferências configuradas do usuário
export const GET = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const preferences = await prisma.notificationPreference.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ preferences });
});

// PUT /api/notifications/preferences — Salva/atualiza uma preferência de notificação
export const PUT = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await request.json().catch(() => null);
  if (!body || typeof body.category !== "string" || typeof body.enabled !== "boolean") {
    return NextResponse.json({ error: "Campos inválidos" }, { status: 400 });
  }

  const { category, enabled } = body;

  const updated = await prisma.notificationPreference.upsert({
    where: {
      userId_category: {
        userId: session.user.id,
        category,
      },
    },
    update: { enabled },
    create: {
      userId: session.user.id,
      category,
      enabled,
    },
  });

  return NextResponse.json({ preference: updated });
});
