import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { registerFromInviteSchema } from "@/lib/validations/auth";
import { rateLimitRegister } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

// POST /api/auth/register-from-invite — Create account from invite token
export async function POST(request: Request) {
  const ip = extractClientIp(request);
  const { allowed, retryAfterMinutes } = await rateLimitRegister(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente em " + retryAfterMinutes + " minutos.", code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = registerFromInviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Campos inválidos",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { token, email, password, name } = parsed.data;

  // Find the invite token
  const inviteToken = await prisma.inviteToken.findUnique({
    where: { token },
    include: {
      player: { select: { id: true, name: true } },
    },
  });

  if (!inviteToken) {
    return NextResponse.json(
      { error: "Token inválido", code: "TOKEN_NOT_FOUND" },
      { status: 404 }
    );
  }

  // Check if token is already used
  if (inviteToken.usedAt) {
    return NextResponse.json(
      { error: "Token já utilizado", code: "TOKEN_USED" },
      { status: 400 }
    );
  }

  // Check if token is expired
  if (inviteToken.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Token expirado", code: "TOKEN_EXPIRED" },
      { status: 400 }
    );
  }

  // Check if email is already registered
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (existingUser.playerId && existingUser.playerId !== inviteToken.playerId) {
      return NextResponse.json(
        { error: "Conta ja vinculada a outro jogador", code: "USER_ALREADY_LINKED" },
        { status: 409 }
      );
    }

    if (existingUser.teamId && existingUser.teamId !== inviteToken.teamId) {
      return NextResponse.json(
        { error: "Conta vinculada a outro time", code: "TEAM_MISMATCH" },
        { status: 409 }
      );
    }

    const passwordMatches = await bcrypt.compare(password, existingUser.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Credenciais invalidas para conta existente", code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    let linkedUser;
    try {
      linkedUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Re-check token inside transaction to prevent race condition
        const freshToken = await tx.inviteToken.findUnique({ where: { id: inviteToken.id } });
        if (freshToken?.usedAt) {
          throw new Error("TOKEN_ALREADY_USED");
        }

        const updatedUser = await tx.user.update({
          where: { id: existingUser.id },
          data: {
            playerId: existingUser.playerId ?? inviteToken.playerId,
            teamId: existingUser.teamId ?? inviteToken.teamId,
          },
        });

        await tx.inviteToken.update({
          where: { id: inviteToken.id },
          data: { usedAt: new Date() },
        });

        return updatedUser;
      });
    } catch (err) {
      if (err instanceof Error && err.message === "TOKEN_ALREADY_USED") {
        return NextResponse.json(
          { error: "Token já utilizado", code: "TOKEN_USED" },
          { status: 400 }
        );
      }
      throw err;
    }

    return NextResponse.json(
      {
        id: linkedUser.id,
        email: linkedUser.email,
        name: linkedUser.name,
        role: linkedUser.role,
        teamId: linkedUser.teamId,
        playerId: linkedUser.playerId,
      },
      { status: 200 }
    );
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user, link to player, and mark token as used — all in a transaction
  try {
    const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Re-check token inside transaction to prevent race condition
      const freshToken = await tx.inviteToken.findUnique({ where: { id: inviteToken.id } });
      if (freshToken?.usedAt) {
        throw new Error("TOKEN_ALREADY_USED");
      }

      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: "PLAYER",
          teamId: inviteToken.teamId,
          playerId: inviteToken.playerId,
        },
      });

      // Mark token as used
      await tx.inviteToken.update({
        where: { id: inviteToken.id },
        data: { usedAt: new Date() },
      });

      return newUser;
    });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teamId: user.teamId,
        playerId: user.playerId,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error && err.message === "TOKEN_ALREADY_USED") {
      return NextResponse.json(
        { error: "Token já utilizado", code: "TOKEN_USED" },
        { status: 400 }
      );
    }
    throw err;
  }
}
