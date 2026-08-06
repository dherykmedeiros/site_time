import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return NextResponse.json({ notifications });
});

export const PUT = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await request.json().catch(() => null);
  if (!body || typeof body.read !== "boolean") {
    return NextResponse.json({ error: "Campos inválidos" }, { status: 400 });
  }

  const { id, read } = body;

  if (id) {
    // Validate notification ownership
    const notification = await prisma.notification.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!notification || notification.userId !== session.user.id) {
      return NextResponse.json({ error: "Notificação não encontrada" }, { status: 404 });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json({ notification: updated });
  } else {
    // Mark all as read/unread
    await prisma.notification.updateMany({
      where: { userId: session.user.id },
      data: { read },
    });

    return NextResponse.json({ success: true });
  }
});
