import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

export async function PATCH(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const ip = extractClientIp(request);
  const rl = await rateLimitMutation(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Muitas tentativas. Tente em ${rl.retryAfterMinutes} min.`, code: "RATE_LIMITED" },
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

  const schema = z.object({
    password: z.string().min(6),
    currentPassword: session.user.mustChangePassword ? z.string().min(1).optional() : z.string().min(1)
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "A nova senha deve ter no mínimo 6 caracteres.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const { password, currentPassword } = parsed.data;

  if (!session.user.mustChangePassword || currentPassword) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !currentPassword || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return NextResponse.json(
        { error: "Senha atual incorreta", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(password, 12);

  // Update user in DB
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      passwordHash,
      mustChangePassword: false,
    },
  });

  return NextResponse.json({ success: true });
}
