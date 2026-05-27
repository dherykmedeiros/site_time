import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMaterialDirectorOrAdmin } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const updateOrderSchema = z.object({
  name: z.string().min(1, "Nome do material é obrigatório").optional(),
  category: z.enum(["UNIFORM", "SOCKS", "BALL", "OTHER"]).optional(),
  quantity: z.coerce.number().int().positive("Quantidade deve ser positiva").optional(),
  status: z.enum(["PENDING", "ORDERED", "RECEIVED", "CANCELLED"]).optional(),
  notes: z.string().optional().nullable(),
});

// PATCH /api/equipments/orders/:id — Update an equipment request (ADMIN/MATERIAL_DIRECTOR only)
export const PATCH = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireMaterialDirectorOrAdmin();
  if (error) return error;

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  // Check if order belongs to the team
  const order = await prisma.equipmentOrder.findFirst({
    where: {
      id,
      teamId: session.user.teamId,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateOrderSchema.safeParse(body);

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

  const updatedOrder = await prisma.equipmentOrder.update({
    where: { id },
    data: {
      ...parsed.data,
      notes: parsed.data.notes === undefined ? order.notes : parsed.data.notes,
    },
  });

  return NextResponse.json({ order: updatedOrder });
});

// DELETE /api/equipments/orders/:id — Delete an equipment request (ADMIN/MATERIAL_DIRECTOR only)
export const DELETE = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireMaterialDirectorOrAdmin();
  if (error) return error;

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const order = await prisma.equipmentOrder.findFirst({
    where: {
      id,
      teamId: session.user.teamId,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  await prisma.equipmentOrder.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Pedido excluído com sucesso" });
});
