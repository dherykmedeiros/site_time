import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireCoachOrAdmin } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

export const GET = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const messages = await prisma.teamMessage.findMany({
    where: {
      teamId: session.user.teamId,
    },
    orderBy: [
      { pinned: "desc" },
      { createdAt: "desc" },
    ],
    take: 50,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      reactions: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ messages });
});

export const POST = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireCoachOrAdmin();
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
  if (!body || typeof body.content !== "string" || !body.content.trim()) {
    return NextResponse.json({ error: "Conteúdo da mensagem é obrigatório" }, { status: 400 });
  }

  const { content, pinned = false } = body;
  const teamId = session.user.teamId;

  // Create the message
  const message = await prisma.teamMessage.create({
    data: {
      teamId,
      authorId: session.user.id,
      content: content.trim(),
      pinned: !!pinned,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      reactions: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // Notify all other members of the team
  const otherUsers = await prisma.user.findMany({
    where: {
      teamId,
      id: { not: session.user.id },
    },
    select: { id: true },
  });

  if (otherUsers.length > 0) {
    await prisma.notification.createMany({
      data: otherUsers.map((u) => ({
        userId: u.id,
        type: pinned ? "MESSAGE_PINNED" : "NOTICE",
        title: pinned ? "📌 Novo aviso fixado" : "📋 Novo aviso do time",
        body: content.trim().substring(0, 100) + (content.trim().length > 100 ? "..." : ""),
        link: "/dashboard/messages",
        read: false,
      })),
    });
  }

  return NextResponse.json({ message }, { status: 201 });
});
