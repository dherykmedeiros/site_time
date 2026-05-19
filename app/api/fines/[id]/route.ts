import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { fineSchema } from "@/lib/validations/fine";
import { withErrorHandler } from "@/lib/api-handler";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/fines/[id] — update an existing fine (ADMIN only)
export const PATCH = withErrorHandler(async (request: Request, context: RouteParams) => {
  const { id } = await context.params;
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  // Find existing fine
  const existingFine = await prisma.fine.findFirst({
    where: { id, teamId: session.user.teamId },
    include: {
      player: { select: { name: true } },
    },
  });

  if (!existingFine) {
    return NextResponse.json({ error: "Multa não encontrada" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = fineSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { playerId, ruleId, description, amount, date, isPaid = false } = parsed.data;

  // Verify the player belongs to this team
  const playerExists = await prisma.player.findFirst({
    where: { id: playerId, teamId: session.user.teamId },
  });

  if (!playerExists) {
    return NextResponse.json({ error: "Jogador não encontrado no time" }, { status: 404 });
  }

  // If ruleId is provided, verify it belongs to this team
  if (ruleId) {
    const ruleExists = await prisma.rule.findFirst({
      where: { id: ruleId, teamId: session.user.teamId },
    });
    if (!ruleExists) {
      return NextResponse.json({ error: "Regra não encontrada no time" }, { status: 404 });
    }
  }

  const teamId = session.user.teamId;

  const updatedFine = await prisma.$transaction(async (tx) => {
    let nextTransactionId = existingFine.transactionId;

    if (!existingFine.isPaid && isPaid) {
      // Transition from unpaid to paid: Create a financial transaction
      const financeTransaction = await tx.transaction.create({
        data: {
          teamId,
          type: "INCOME",
          amount,
          description: `Multa Paga: ${playerExists.name} - ${description}`,
          date: new Date(),
          category: "OTHER",
        },
      });
      nextTransactionId = financeTransaction.id;
    } else if (existingFine.isPaid && !isPaid) {
      // Transition from paid to unpaid: Delete the financial transaction
      if (existingFine.transactionId) {
        await tx.transaction.delete({
          where: { id: existingFine.transactionId },
        });
      }
      nextTransactionId = null;
    } else if (existingFine.isPaid && isPaid) {
      // Was paid and stays paid: Update existing financial transaction if details changed
      if (existingFine.transactionId) {
        await tx.transaction.update({
          where: { id: existingFine.transactionId },
          data: {
            amount,
            description: `Multa Paga: ${playerExists.name} - ${description}`,
          },
        });
      }
    }

    const fine = await tx.fine.update({
      where: { id },
      data: {
        playerId,
        ruleId: ruleId || null,
        description,
        amount,
        date: new Date(date),
        isPaid,
        paidAt: isPaid ? (existingFine.paidAt || new Date()) : null,
        transactionId: nextTransactionId,
      },
      include: {
        player: {
          select: {
            id: true,
            name: true,
            shirtNumber: true,
          },
        },
        rule: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return fine;
  });

  return NextResponse.json({ fine: updatedFine });
});

// DELETE /api/fines/[id] — delete an existing fine (ADMIN only)
export const DELETE = withErrorHandler(async (request: Request, context: RouteParams) => {
  const { id } = await context.params;
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  // Find existing fine
  const existingFine = await prisma.fine.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!existingFine) {
    return NextResponse.json({ error: "Multa não encontrada" }, { status: 404 });
  }

  // Use a transaction to clean up corresponding transaction if paid
  await prisma.$transaction(async (tx) => {
    if (existingFine.transactionId) {
      await tx.transaction.delete({
        where: { id: existingFine.transactionId },
      });
    }
    await tx.fine.delete({
      where: { id },
    });
  });

  return NextResponse.json({ success: true });
});
