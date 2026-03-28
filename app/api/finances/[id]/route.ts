import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { updateTransactionSchema } from "@/lib/validations/finance";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/finances/:id — Update transaction (ADMIN)
export async function PATCH(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const transaction = await prisma.transaction.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!transaction) {
    return NextResponse.json(
      { error: "Transação não encontrada", code: "NOT_FOUND" },
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

  const parsed = updateTransactionSchema.safeParse(body);
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

  const data: Record<string, unknown> = {};
  if (parsed.data.type) data.type = parsed.data.type;
  if (parsed.data.amount) data.amount = parsed.data.amount;
  if (parsed.data.description) data.description = parsed.data.description;
  if (parsed.data.category) data.category = parsed.data.category;
  if (parsed.data.date) data.date = new Date(parsed.data.date);

  const updated = await prisma.transaction.update({
    where: { id },
    data,
  });

  return NextResponse.json({
    id: updated.id,
    type: updated.type,
    amount: Number(updated.amount),
    description: updated.description,
    category: updated.category,
    date: updated.date.toISOString(),
    createdAt: updated.createdAt.toISOString(),
  });
}

// DELETE /api/finances/:id — Delete transaction (ADMIN)
export async function DELETE(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const transaction = await prisma.transaction.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!transaction) {
    return NextResponse.json(
      { error: "Transação não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  await prisma.transaction.delete({ where: { id } });

  return NextResponse.json({ message: "Transaction deleted" });
}
