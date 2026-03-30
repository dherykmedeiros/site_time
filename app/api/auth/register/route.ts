import { NextResponse } from "next/server";
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

    if (!allowPublicAdminRegister && adminCount > 0) {
      const expectedCode = process.env.ADMIN_REGISTRATION_CODE;
      if (!expectedCode || registrationCode !== expectedCode) {
        return NextResponse.json(
          {
            error: "REGISTRATION_LOCKED",
            message: "Cadastro administrativo indisponível no momento",
          },
          { status: 403 }
        );
      }
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
        role: "ADMIN",
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
