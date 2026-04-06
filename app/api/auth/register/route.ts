import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { rateLimitRegister } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

export async function POST(request: Request) {
  try {
    const ip = extractClientIp(request);
    const { allowed, retryAfterMinutes } = await rateLimitRegister(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "RATE_LIMITED", message: `Muitas tentativas. Tente novamente em ${retryAfterMinutes} minutos.` },
        { status: 429 }
      );
    }

    const body = await request.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, name, registrationCode } = parsed.data;

    const allowPublicAdminRegister =
      process.env.ALLOW_PUBLIC_ADMIN_REGISTER === "true";
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    // Determine target role: only the first user (bootstrap) or users with
    // the correct registration code become ADMIN. Everyone else is PLAYER.
    let targetRole: "ADMIN" | "PLAYER" = "PLAYER";

    if (adminCount === 0) {
      // Bootstrap: first ever user becomes admin automatically.
      targetRole = "ADMIN";
    } else if (allowPublicAdminRegister) {
      const expectedCode = process.env.ADMIN_REGISTRATION_CODE;
      if (
        expectedCode &&
        registrationCode &&
        expectedCode.length === registrationCode.length &&
        crypto.timingSafeEqual(
          Buffer.from(expectedCode, "utf-8"),
          Buffer.from(registrationCode, "utf-8")
        )
      ) {
        targetRole = "ADMIN";
      }
    } else {
      const expectedCode = process.env.ADMIN_REGISTRATION_CODE;
      if (
        !expectedCode ||
        !registrationCode ||
        expectedCode.length !== registrationCode.length ||
        !crypto.timingSafeEqual(
          Buffer.from(expectedCode, "utf-8"),
          Buffer.from(registrationCode, "utf-8")
        )
      ) {
        return NextResponse.json(
          {
            error: "REGISTRATION_LOCKED",
            message: "Cadastro administrativo indisponível no momento",
          },
          { status: 403 }
        );
      }
      targetRole = "ADMIN";
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "EMAIL_EXISTS", message: "E-mail já cadastrado" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: targetRole,
        teamId: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        teamId: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("[/api/auth/register] Internal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
