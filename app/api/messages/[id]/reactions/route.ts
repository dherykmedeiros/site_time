import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const POST = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  // Verify message exists
  const message = await prisma.teamMessage.findUnique({
    where: { id },
  });

  if (!message) {
    return NextResponse.json({ error: "Mensagem não encontrada" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.emoji !== "string" || !body.emoji.trim()) {
    return NextResponse.json({ error: "Emoji é obrigatório" }, { status: 400 });
  }

  const emoji = body.emoji.trim();

  // Try to find an existing reaction by this user with this emoji on this message
  const existingReaction = await prisma.teamMessageReaction.findUnique({
    where: {
      messageId_userId_emoji: {
        messageId: id,
        userId: session.user.id,
        emoji,
      },
    },
  });

  if (existingReaction) {
    // Toggle off: remove the reaction
    await prisma.teamMessageReaction.delete({
      where: {
        id: existingReaction.id,
      },
    });
    return NextResponse.json({ success: true, reacted: false });
  } else {
    // Toggle on: add the reaction
    const newReaction = await prisma.teamMessageReaction.create({
      data: {
        messageId: id,
        userId: session.user.id,
        emoji,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, reacted: true, reaction: newReaction });
  }
});
