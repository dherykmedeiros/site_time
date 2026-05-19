import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, getSession } from "@/lib/auth";
import { equipmentSchema } from "@/lib/validations/equipment";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

// GET /api/equipments — List all team equipments (All logged-in team members)
export const GET = withErrorHandler(async (request: Request) => {
  const session = await getSession();
  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const equipments = await prisma.equipment.findMany({
    where: {
      teamId: session.user.teamId,
    },
    orderBy: [
      { category: "asc" },
      { name: "asc" },
    ],
  });

  return NextResponse.json({ equipments });
});

// POST /api/equipments — Add a new equipment (ADMIN only)
export const POST = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAdmin();
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
  const parsed = equipmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Campos inválidos no inventário",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const {
    name,
    category,
    totalQty,
    availableQty,
    damagedQty,
    lostQty,
    status,
    location,
    notes,
  } = parsed.data;

  const equipment = await prisma.equipment.create({
    data: {
      teamId: session.user.teamId,
      name,
      category,
      totalQty,
      availableQty,
      damagedQty,
      lostQty,
      status,
      location: location || null,
      notes: notes || null,
    },
  });

  return NextResponse.json({ equipment }, { status: 201 });
});
