import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { equipmentSchema } from "@/lib/validations/equipment";
import { withErrorHandler } from "@/lib/api-handler";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/equipments/[id] — Update an existing equipment (ADMIN only)
export const PATCH = withErrorHandler(async (request: Request, context: RouteParams) => {
  const { id } = await context.params;
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  // Find existing equipment belonging to this team
  const existingEquipment = await prisma.equipment.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!existingEquipment) {
    return NextResponse.json({ error: "Equipamento não encontrado" }, { status: 404 });
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

  const equipment = await prisma.equipment.update({
    where: { id },
    data: {
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

  return NextResponse.json({ equipment });
});

// DELETE /api/equipments/[id] — Delete an existing equipment (ADMIN only)
export const DELETE = withErrorHandler(async (request: Request, context: RouteParams) => {
  const { id } = await context.params;
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  // Find existing equipment belonging to this team
  const existingEquipment = await prisma.equipment.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!existingEquipment) {
    return NextResponse.json({ error: "Equipamento não encontrado" }, { status: 404 });
  }

  await prisma.equipment.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
});
