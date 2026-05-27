import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const matchEquipmentItemSchema = z.object({
  id: z.string().optional().nullable(),
  equipmentId: z.string().optional().nullable(),
  name: z.string().min(1, "Nome do material é obrigatório"),
  quantitySent: z.coerce.number().int().nonnegative("Quantidade enviada deve ser >= 0"),
  quantityReturned: z.coerce.number().int().nonnegative("Quantidade devolvida deve ser >= 0"),
  returned: z.boolean(),
  notes: z.string().optional().nullable(),
});

const saveMatchEquipmentsSchema = z.object({
  equipments: z.array(matchEquipmentItemSchema),
});

// GET /api/matches/:id/equipments
export async function GET(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  // Verify match belongs to team
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: session.user.teamId },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "MATCH_NOT_FOUND" },
      { status: 404 }
    );
  }

  // Get all master inventory equipments of the team
  const teamEquipments = await prisma.equipment.findMany({
    where: { teamId: session.user.teamId },
    orderBy: { name: "asc" },
  });

  // Get equipments associated with this match
  const matchEquipments = await prisma.matchEquipment.findMany({
    where: { matchId },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    matchId,
    teamEquipments: teamEquipments.map((e) => ({
      id: e.id,
      name: e.name,
      category: e.category,
      availableQty: e.availableQty,
      totalQty: e.totalQty,
    })),
    matchEquipments: matchEquipments.map((me) => ({
      id: me.id,
      equipmentId: me.equipmentId,
      name: me.name,
      quantitySent: me.quantitySent,
      quantityReturned: me.quantityReturned,
      returned: me.returned,
      notes: me.notes,
    })),
  });
}

// POST /api/matches/:id/equipments
export async function POST(request: Request, { params }: RouteParams) {
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

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  // Verify match belongs to team
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: session.user.teamId },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "MATCH_NOT_FOUND" },
      { status: 404 }
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

  const parsed = saveMatchEquipmentsSchema.safeParse(body);
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

  // Delete all existing match equipment entries and save the new list inside a transaction
  await prisma.$transaction(async (tx) => {
    await tx.matchEquipment.deleteMany({
      where: { matchId },
    });

    if (parsed.data.equipments.length > 0) {
      await tx.matchEquipment.createMany({
        data: parsed.data.equipments.map((eq) => ({
          matchId,
          equipmentId: eq.equipmentId || null,
          name: eq.name,
          quantitySent: eq.quantitySent,
          quantityReturned: eq.quantityReturned,
          returned: eq.returned,
          notes: eq.notes || null,
        })),
      });
    }
  });

  // Fetch updated list to return
  const matchEquipments = await prisma.matchEquipment.findMany({
    where: { matchId },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    message: "Materiais salvos com sucesso",
    matchEquipments: matchEquipments.map((me) => ({
      id: me.id,
      equipmentId: me.equipmentId,
      name: me.name,
      quantitySent: me.quantitySent,
      quantityReturned: me.quantityReturned,
      returned: me.returned,
      notes: me.notes,
    })),
  });
}
