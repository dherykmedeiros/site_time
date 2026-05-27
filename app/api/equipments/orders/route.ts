import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMaterialDirectorOrAdmin, getSession } from "@/lib/auth";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";
import { z } from "zod";

const createOrderSchema = z.object({
  name: z.string().min(1, "Nome do material é obrigatório"),
  category: z.enum(["UNIFORM", "SOCKS", "BALL", "OTHER"]),
  quantity: z.coerce.number().int().positive("Quantidade deve ser positiva"),
  status: z.enum(["PENDING", "ORDERED", "RECEIVED", "CANCELLED"]).default("PENDING"),
  notes: z.string().optional().nullable(),
});

// GET /api/equipments/orders — List all team equipment requests
export const GET = withErrorHandler(async (request: Request) => {
  const session = await getSession();
  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const orders = await prisma.equipmentOrder.findMany({
    where: {
      teamId: session.user.teamId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ orders });
});

// POST /api/equipments/orders — Add a new equipment request (ADMIN/MATERIAL_DIRECTOR only)
export const POST = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireMaterialDirectorOrAdmin();
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
  const parsed = createOrderSchema.safeParse(body);

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

  const { name, category, quantity, status, notes } = parsed.data;

  const order = await prisma.equipmentOrder.create({
    data: {
      teamId: session.user.teamId,
      name,
      category,
      quantity,
      status,
      notes: notes || null,
    },
  });

  return NextResponse.json({ order }, { status: 201 });
});
