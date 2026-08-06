import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const DELETE = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  // Find the message
  const message = await prisma.teamMessage.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!message) {
    return NextResponse.json({ error: "Mensagem não encontrada" }, { status: 404 });
  }

  // Authorization check: must be author of the message or ADMIN
  const isAuthor = message.authorId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isAuthor && !isAdmin) {
    return NextResponse.json(
      { error: "Você não tem permissão para deletar esta mensagem" },
      { status: 403 }
    );
  }

  await prisma.teamMessage.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
});
