import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const ip = extractClientIp(request);
  const rl = await rateLimitMutation(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Muitas tentativas. Tente em ${rl.retryAfterMinutes} min.`, code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  // Find player in the team
  const player = await prisma.player.findFirst({
    where: { id, teamId: session.user.teamId },
    include: { user: { select: { id: true } } },
  });

  if (!player) {
    return NextResponse.json(
      { error: "Jogador não encontrado", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  // Check if player has a linked User account
  if (!player.user) {
    return NextResponse.json(
      { error: "Jogador não possui conta vinculada", code: "NO_ACCOUNT" },
      { status: 400 }
    );
  }

  // Hash password "123456"
  const passwordHash = await bcrypt.hash("123456", 12);

  // Update the user's password and set mustChangePassword to true
  await prisma.user.update({
    where: { id: player.user.id },
    data: {
      passwordHash,
      mustChangePassword: true,
    },
  });

  return NextResponse.json({ success: true });
}
